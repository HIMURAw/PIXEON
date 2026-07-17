"use server";

import { db } from "@/lib/db";
import { orders, orderItems, transactions, products, users } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createLog } from "./admin-actions";

export async function getAdminOrders() {
  try {
    const rows = await db
      .select({
        order: orders,
        user: users,
        orderItem: orderItems,
        product: products,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .leftJoin(products, eq(orderItems.productId, products.id))
      .orderBy(desc(orders.createdAt));

    const ordersMap = new Map<string, any>();

    for (const row of rows) {
      const orderId = row.order.id;
      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          ...row.order,
          user: row.user || null,
          items: [],
        });
      }

      if (row.orderItem) {
        ordersMap.get(orderId).items.push({
          ...row.orderItem,
          product: row.product || null,
        });
      }
    }

    const data = Array.from(ordersMap.values());
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return [];
  }
}

export async function updateOrderStatus(
  orderId: string, 
  status: "PENDING" | "PREPARING" | "SHIPPED" | "COMPLETED" | "CANCELLED",
  shippingProvider?: string | null,
  trackingNumber?: string | null
) {
  try {
    const orderData = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    const order = orderData[0];
    const orderNum = order?.orderNumber || orderId;

    const updateData: any = { status, updatedAt: new Date() };
    if (status === "SHIPPED") {
      updateData.shippingProvider = shippingProvider || null;
      updateData.trackingNumber = trackingNumber || null;
    }

    // Cancelling an order that reserved stock at checkout must give that stock back,
    // otherwise cancelled/failed orders permanently shrink inventory.
    const isNewlyCancelled = status === "CANCELLED" && order?.status !== "CANCELLED";

    if (isNewlyCancelled) {
      await db.transaction(async (tx) => {
        const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, orderId));
        for (const item of items) {
          await tx.update(products)
            .set({
              stock: sql`${products.stock} + ${item.quantity}`,
              salesCount: sql`GREATEST(${products.salesCount} - ${item.quantity}, 0)`,
            })
            .where(eq(products.id, item.productId));
        }
        await tx.update(orders).set(updateData).where(eq(orders.id, orderId));
      });
    } else {
      await db.update(orders).set(updateData).where(eq(orders.id, orderId));
    }

    await createLog("Sipariş Durumu Güncellendi", `${orderNum} numaralı siparişin durumu "${status}" olarak güncellendi.${isNewlyCancelled ? " İptal edilen ürünlerin stoğu iade edildi." : ""}`);

    revalidatePath("/admin/orders");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message || "Durum güncellenemedi." };
  }
}

export async function updateOrderPaymentStatus(orderId: string, paymentStatus: "PENDING" | "PAID" | "FAILED") {
  try {
    const orderData = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    const orderNum = orderData[0]?.orderNumber || orderId;

    await db.update(orders).set({ paymentStatus, updatedAt: new Date() }).where(eq(orders.id, orderId));
    
    // Also sync transaction status if a transaction exists for this order
    const txs = await db.select().from(transactions).where(eq(transactions.orderId, orderId)).limit(1);
    if (txs.length > 0) {
      let txStatus: "COMPLETED" | "PENDING" | "FAILED" | "REFUNDED" = "PENDING";
      if (paymentStatus === "PAID") txStatus = "COMPLETED";
      if (paymentStatus === "FAILED") txStatus = "FAILED";
      await db.update(transactions).set({ status: txStatus }).where(eq(transactions.orderId, orderId));
    }

    await createLog("Sipariş Ödeme Durumu Güncellendi", `${orderNum} numaralı siparişin ödeme durumu "${paymentStatus}" olarak güncellendi.`);
    
    revalidatePath("/admin/orders");
    revalidatePath("/admin/payments");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating payment status:", error);
    return { success: false, error: error.message || "Ödeme durumu güncellenemedi." };
  }
}

export async function getAdminTransactions() {
  try {
    const rows = await db
      .select({
        transaction: transactions,
        user: users,
        order: orders,
      })
      .from(transactions)
      .leftJoin(users, eq(transactions.userId, users.id))
      .leftJoin(orders, eq(transactions.orderId, orders.id))
      .orderBy(desc(transactions.createdAt));

    const data = rows.map((row) => ({
      ...row.transaction,
      user: row.user || null,
      order: row.order || null,
    }));

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching admin transactions:", error);
    return [];
  }
}
