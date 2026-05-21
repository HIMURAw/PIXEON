"use server";

import { db } from "@/lib/db";
import { orders, orderItems, transactions, products, cartItems, userAddresses, coupons, users } from "@/lib/db/schema";
import { eq, sql, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

interface CreateOrderData {
  userId: string;
  addressId: string;
  paymentMethod: "Credit Card" | "Bank Transfer";
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

    // 3. Calculate total
    const subtotal = userCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal > 5000 ? 0 : 99;
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

      // a. Check and update product stocks
      for (const item of userCart) {
        if (item.stock < item.quantity) {
          throw new Error(`Yetersiz stok: ${item.name} ürününde sadece ${item.stock} adet kaldı.`);
        }
        await tx.update(products)
          .set({ 
            stock: item.stock - item.quantity,
            salesCount: sql`${products.salesCount} + ${item.quantity}`
          })
          .where(eq(products.id, item.productId));
      }

      // To handle salesCount increment properly across Drizzle, let's query the salesCount or use simple update:
      // Wait, let's update salesCount using normal select-update or raw SQL to avoid type issues. Let's do raw SQL.
      // Drizzle has sql helper:
      // `set({ stock: item.stock - item.quantity, salesCount: sql`${products.salesCount} + ${item.quantity}` })`
      // Wait, let's use a simpler approach: we already have product object, so we can just set:
      // But wait! Multiple checkouts could happen. Standard SQL increment is best:
      // `import { sql } from "drizzle-orm"` but since we don't import sql, let's write it with sql template:
      // Wait, let's just use `sql` from drizzle-orm. Let's import it.
      
      const orderId = randomUUID();
      const transactionId = randomUUID();

      const isCreditCard = paymentMethod === "Credit Card";
      const orderStatus = isCreditCard ? "PREPARING" as const : "PENDING" as const;
      const paymentStatus = isCreditCard ? "PAID" as const : "PENDING" as const;
      const transactionStatus = isCreditCard ? "COMPLETED" as const : "PENDING" as const;

      // b. Insert Order
      await tx.insert(orders).values({
        id: orderId,
        userId,
        orderNumber,
        totalAmount,
        status: orderStatus,
        paymentStatus,
        paymentMethod: paymentMethod === "Credit Card" ? "Kredi Kartı (PayTR)" : "Havale/EFT",
        shippingAddress: shippingAddressText,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // c. Insert Order Items
      for (const item of userCart) {
        await tx.insert(orderItems).values({
          id: randomUUID(),
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
      }

      // d. Insert Transaction
      await tx.insert(transactions).values({
        id: transactionId,
        userId,
        orderId,
        amount: totalAmount,
        method: paymentMethod === "Credit Card" ? "Kredi Kartı" : "Havale/EFT",
        status: transactionStatus,
        createdAt: new Date()
      });

      // e. Clear Cart
      await tx.delete(cartItems).where(eq(cartItems.userId, userId));

      return { orderNumber };
    });

    revalidatePath("/sepet");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/reports");

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
