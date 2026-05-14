"use server";

import { db } from "@/lib/db";
import { users, orders, products, categories, orderItems } from "@/lib/db/schema";
import { eq, sql, desc, count, sum, gte } from "drizzle-orm";

export async function getReportStats() {
  try {
    // 1. Total Sales (Revenue)
    const totalRevenueResult = await db.select({ value: sum(orders.totalAmount) }).from(orders).where(eq(orders.paymentStatus, "PAID"));
    const totalRevenue = Number(totalRevenueResult[0]?.value || 0);

    // 2. Order Count
    const totalOrdersResult = await db.select({ value: count(orders.id) }).from(orders);
    const totalOrders = Number(totalOrdersResult[0]?.value || 0);

    // 3. Customer Count
    const totalCustomersResult = await db.select({ value: count(users.id) }).from(users).where(eq(users.role, "USER"));
    const totalCustomers = Number(totalCustomersResult[0]?.value || 0);

    // 4. Best Selling Products (Top 5)
    const topProducts = await db.select({
      id: products.id,
      name: products.name,
      category: categories.name,
      sales: products.salesCount,
      stock: products.stock,
      price: products.price,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.salesCount))
    .limit(5);

    // 5. Category Breakdown
    const categoryStats = await db.select({
      name: categories.name,
      count: count(products.id),
    })
    .from(categories)
    .leftJoin(products, eq(categories.id, products.categoryId))
    .groupBy(categories.name);

    // 6. Monthly Growth (Simplified Mock for now, but we can calculate from created_at)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const newCustomersLastMonth = await db.select({ value: count(users.id) })
        .from(users)
        .where(and(eq(users.role, "USER"), gte(users.createdAt, lastMonth)));
    
    return JSON.parse(JSON.stringify({
      totalRevenue,
      totalOrders,
      totalCustomers,
      topProducts,
      categoryStats,
      newCustomersLastMonth: Number(newCustomersLastMonth[0]?.value || 0)
    }));
  } catch (error) {
    console.error("Error fetching report stats:", error);
    return null;
  }
}

// Helper for 'and' since it might not be imported correctly in my thought block
import { and } from "drizzle-orm";
