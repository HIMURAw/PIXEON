"use server";

import { db } from "@/lib/db";
import { orders, orderItems, transactions, products, cartItems, userAddresses, coupons, users, siteSettings, walletTransactions } from "@/lib/db/schema";
import { eq, sql, inArray, and, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { sendOrderConfirmationEmail } from "@/lib/email";

interface CreateOrderData {
  userId: string;
  addressId: string;
  paymentMethod: "Credit Card" | "Bank Transfer" | "Wallet";
  couponCode?: string;
}

export async function createOrder(data: CreateOrderData) {
  try {
    const { userId, addressId, paymentMethod, couponCode } = data;

    // 1. Fetch user's cart items
    const userCart = await db.select({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      price: products.price,
      stock: products.stock,
      name: products.name,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));

    if (userCart.length === 0) {
      return { success: false, error: "Sepetiniz boş." };
    }

    // 2. Fetch shipping address
    const address = await db.query.userAddresses.findFirst({
      where: eq(userAddresses.id, addressId)
    });

    if (!address) {
      return { success: false, error: "Teslimat adresi bulunamadı." };
    }

    const shippingAddressText = `${address.title}: ${address.name || ""} - ${address.phone || ""}\n${address.addressDetail}\n${address.district} / ${address.city}`;

    // 3. Calculate total (shipping fee/threshold come from admin-configured site settings)
    const subtotal = userCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, "global")).limit(1);
    const shippingFeeSetting = settings?.shippingFee ?? 99;
    const freeShippingLimit = settings?.freeShippingLimit ?? 5000;
    const shippingFee = freeShippingLimit > 0 && subtotal >= freeShippingLimit ? 0 : shippingFeeSetting;
    let totalAmount = subtotal + shippingFee;

    // 4. Generate order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `PX-${dateStr}-${randDigits}`;

    // 5. Database transaction for atomic consistency
    const result = await db.transaction(async (tx) => {
      let couponDiscount = 0;
      if (couponCode) {
        const [coupon] = await tx.select().from(coupons).where(eq(coupons.code, couponCode.trim().toUpperCase())).limit(1);
        if (!coupon) {
          throw new Error("Geçersiz kupon kodu.");
        }
        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
          throw new Error("Kuponun kullanım süresi dolmuş.");
        }
        if (coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usageCount >= coupon.usageLimit) {
          throw new Error("Bu kupon maksimum kullanım limitine ulaşmış.");
        }
        if (coupon.minPurchase !== null && coupon.minPurchase !== undefined && subtotal < coupon.minPurchase) {
          throw new Error(`Bu kupon için minimum sepet tutarı ₺${coupon.minPurchase.toLocaleString("tr-TR")} olmalıdır.`);
        }
        
        if (coupon.discountType === "PERCENTAGE") {
          couponDiscount = (subtotal * coupon.discountValue) / 100;
        } else {
          couponDiscount = coupon.discountValue;
        }
        couponDiscount = Math.min(couponDiscount, subtotal);
        totalAmount = Math.max(0, subtotal - couponDiscount) + shippingFee;
        
        // Increment coupon usage
        await tx.update(coupons)
          .set({ usageCount: coupon.usageCount + 1 })
          .where(eq(coupons.id, coupon.id));
      }

      // a. Atomically decrement stock, guarded by the current stock in the same statement
      // so two concurrent checkouts can't both succeed against the same last unit
      // (the in-memory `item.stock` read before the transaction started is not trustworthy).
      for (const item of userCart) {
        const [result] = await tx.update(products)
          .set({
            stock: sql`${products.stock} - ${item.quantity}`,
            salesCount: sql`${products.salesCount} + ${item.quantity}`
          })
          .where(and(eq(products.id, item.productId), gte(products.stock, item.quantity)));

        if (result.affectedRows === 0) {
          throw new Error(`Yetersiz stok: ${item.name} ürünü için yeterli stok kalmadı.`);
        }
      }

      // b. Wallet payments debit immediately (real internal balance movement),
      // unlike Credit Card which is currently a UI mock (see checkout page notice)
      // that never actually charges anything.
      if (paymentMethod === "Wallet") {
        const [walletUpdate] = await tx
          .update(users)
          .set({ walletBalance: sql`${users.walletBalance} - ${totalAmount}` })
          .where(and(eq(users.id, userId), gte(users.walletBalance, totalAmount)));

        if ((walletUpdate as any).affectedRows === 0) {
          throw new Error("Cüzdan bakiyeniz bu siparişi karşılamaya yetmiyor.");
        }
      }

      const orderId = randomUUID();
      const transactionId = randomUUID();

      const isImmediatelyPaid = paymentMethod === "Credit Card" || paymentMethod === "Wallet";
      const orderStatus = isImmediatelyPaid ? "PREPARING" as const : "PENDING" as const;
      const paymentStatus = isImmediatelyPaid ? "PAID" as const : "PENDING" as const;
      const transactionStatus = isImmediatelyPaid ? "COMPLETED" as const : "PENDING" as const;
      const paymentMethodLabel = paymentMethod === "Credit Card" ? "Kredi Kartı (PayTR)" : paymentMethod === "Wallet" ? "Cüzdan" : "Havale/EFT";

      // c. Insert Order
      await tx.insert(orders).values({
        id: orderId,
        userId,
        orderNumber,
        totalAmount,
        status: orderStatus,
        paymentStatus,
        paymentMethod: paymentMethodLabel,
        shippingAddress: shippingAddressText,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // d. Insert Order Items
      for (const item of userCart) {
        await tx.insert(orderItems).values({
          id: randomUUID(),
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
      }

      // e. Insert Transaction
      await tx.insert(transactions).values({
        id: transactionId,
        userId,
        orderId,
        amount: totalAmount,
        method: paymentMethodLabel,
        status: transactionStatus,
        createdAt: new Date()
      });

      if (paymentMethod === "Wallet") {
        await tx.insert(walletTransactions).values({
          id: randomUUID(),
          userId,
          amount: -totalAmount,
          type: "ORDER_PAYMENT",
          description: `${orderNumber} numaralı sipariş ödemesi`,
          orderId,
          createdAt: new Date(),
        });
      }

      // f. Clear Cart
      await tx.delete(cartItems).where(eq(cartItems.userId, userId));

      return { orderNumber };
    });

    revalidatePath("/sepet");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/reports");

    // Best-effort order confirmation email — never blocks or fails the order itself.
    db.select({ email: users.email }).from(users).where(eq(users.id, userId)).limit(1)
      .then(([u]) => {
        if (!u?.email) return;
        sendOrderConfirmationEmail(u.email, {
          orderNumber: result.orderNumber,
          totalAmount,
          items: userCart.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price })),
        }).catch((err) => console.error("Order confirmation email failed:", err));
      })
      .catch((err) => console.error("Order confirmation email lookup failed:", err));

    return { success: true, orderNumber: result.orderNumber };

  } catch (error: any) {
    console.error("Order creation failed:", error);
    return { success: false, error: error.message || "Sipariş oluşturulamadı." };
  }
}

export async function trackOrder(orderNumber: string, email: string) {
  try {
    if (!orderNumber || !email) {
      return { success: false, error: "Lütfen sipariş numarası ve e-posta adresini girin." };
    }

    const rows = await db
      .select({
        order: orders,
        user: users,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .where(eq(orders.orderNumber, orderNumber.trim()))
      .limit(1);

    if (rows.length === 0) {
      return { success: false, error: "Sipariş bulunamadı." };
    }

    const { order, user } = rows[0];

    // Case-insensitive email comparison
    if (user.email.trim().toLowerCase() !== email.trim().toLowerCase()) {
      return { success: false, error: "E-posta adresi eşleşmiyor." };
    }

    return {
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        shippingProvider: order.shippingProvider,
        trackingNumber: order.trackingNumber,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }
    };
  } catch (error: any) {
    console.error("Order tracking query failed:", error);
    return { success: false, error: error.message || "Sipariş bilgileri sorgulanamadı." };
  }
}

export async function getUserOrders(userId: string) {
  try {
    if (!userId) {
      return { success: false, error: "Kullanıcı kimliği geçersiz." };
    }

    // Fetch user orders sorted by newest first
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(sql`${orders.createdAt} DESC`);

    if (userOrders.length === 0) {
      return { success: true, orders: [] };
    }

    const orderIds = userOrders.map((o) => o.id);

    // Fetch all items for these orders, joining with products to get details
    const items = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        productName: products.name,
        productImage: products.image,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(inArray(orderItems.orderId, orderIds));

    // Group items by order ID
    const ordersWithItems = userOrders.map((order) => {
      const orderItemsFiltered = items.filter((item) => item.orderId === order.id);
      return {
        ...order,
        items: orderItemsFiltered,
      };
    });

    // Return JSON-safe objects
    return { success: true, orders: JSON.parse(JSON.stringify(ordersWithItems)) };
  } catch (error: any) {
    console.error("Failed to fetch user orders:", error);
    return { success: false, error: error.message || "Siparişleriniz yüklenemedi." };
  }
}
