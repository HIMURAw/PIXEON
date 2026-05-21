"use server";

import { db } from "@/lib/db";
import { orders, orderItems, transactions, products, cartItems, userAddresses } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

interface CreateOrderData {
  userId: string;
  addressId: string;
  paymentMethod: "Credit Card" | "Bank Transfer";
}

export async function createOrder(data: CreateOrderData) {
  try {
    const { userId, addressId, paymentMethod } = data;

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
    const totalAmount = subtotal + shippingFee;

    // 4. Generate order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `PX-${dateStr}-${randDigits}`;

    // 5. Database transaction for atomic consistency
    const result = await db.transaction(async (tx) => {
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
