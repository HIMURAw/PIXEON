"use server";

import { db } from "@/lib/db";
import { orders, orderItems, transactions, products, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
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
    const orderNum = orderData[0]?.orderNumber || orderId;

    const updateData: any = { status, updatedAt: new Date() };
    if (status === "SHIPPED") {
      updateData.shippingProvider = shippingProvider || null;
      updateData.trackingNumber = trackingNumber || null;
    }

    await db.update(orders).set(updateData).where(eq(orders.id, orderId));
    
    await createLog("Sipariş Durumu Güncellendi", `${orderNum} numaralı siparişin durumu "${status}" olarak güncellendi.`);
    
    revalidatePath("/admin/orders");
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
