"use server";

import { db } from "@/lib/db";
import { users, orders, products, categories, orderItems } from "@/lib/db/schema";
import { eq, sql, desc, count, sum, gte, and } from "drizzle-orm";

export async function getReportStats() {
  try {
    // 1. Total Sales (Revenue)
    const totalRevenueResult = await db.select({ value: sum(orders.totalAmount) }).from(orders).where(eq(orders.paymentStatus, "PAID"));
    const totalRevenue = Number(totalRevenueResult[0]?.value || 0);

    // 2. Order Count
    const totalOrdersResult = await db.select({ value: count(orders.id) }).from(orders);
    const totalOrders = Number(totalOrdersResult[0]?.value || 0);

    const pendingOrdersResult = await db.select({ value: count(orders.id) }).from(orders).where(eq(orders.status, "PENDING"));
    const pendingOrdersCount = Number(pendingOrdersResult[0]?.value || 0);

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
    .groupBy(categories.id, categories.name);

    // 6. Monthly Growth
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const newCustomersLastMonth = await db.select({ value: count(users.id) })
        .from(users)
        .where(and(eq(users.role, "USER"), gte(users.createdAt, lastMonth)));

    // 7. Last 7 Days Revenue
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentSales = await db.select({
      date: sql<string>`DATE(${orders.createdAt})`,
      revenue: sum(orders.totalAmount)
    })
    .from(orders)
    .where(and(eq(orders.paymentStatus, "PAID"), gte(orders.createdAt, sevenDaysAgo)))
    .groupBy(sql`DATE(${orders.createdAt})`);

    const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
    const last7DaysSales = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const dayName = dayNames[d.getDay()];
      last7DaysSales.push({
        date: dateString,
        day: dayName,
        revenue: 0,
      });
    }

    for (const sale of recentSales) {
      if (sale.date) {
        const saleDateStr = typeof sale.date === 'string'
          ? sale.date.split(' ')[0]
          : new Date(sale.date).toISOString().split('T')[0];

        const match = last7DaysSales.find(item => item.date === saleDateStr);
        if (match) {
          match.revenue = Number(sale.revenue || 0);
        }
      }
    }
    
    return JSON.parse(JSON.stringify({
      totalRevenue,
      totalOrders,
      totalCustomers,
      topProducts,
      categoryStats,
      newCustomersLastMonth: Number(newCustomersLastMonth[0]?.value || 0),
      last7DaysSales,
      pendingOrdersCount
    }));
  } catch (error) {
    console.error("Error fetching report stats:", error);
    return null;
  }
}

export async function getDashboardStats() {
  try {
    // Dates for comparisons
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setDate(1);
    lastMonthStart.setHours(0, 0, 0, 0);

    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);

    // 1. Total Sales (Revenue)
    const totalRevenueResult = await db.select({ value: sum(orders.totalAmount) })
      .from(orders)
      .where(eq(orders.paymentStatus, "PAID"));
    const totalRevenue = Number(totalRevenueResult[0]?.value || 0);

    // This month sales
    const thisMonthSalesRes = await db.select({ value: sum(orders.totalAmount) })
      .from(orders)
      .where(and(eq(orders.paymentStatus, "PAID"), gte(orders.createdAt, thisMonthStart)));
    const thisMonthSales = Number(thisMonthSalesRes[0]?.value || 0);

    // Last month sales
    const lastMonthSalesRes = await db.select({ value: sum(orders.totalAmount) })
      .from(orders)
      .where(and(
        eq(orders.paymentStatus, "PAID"),
        gte(orders.createdAt, lastMonthStart),
        sql`${orders.createdAt} < ${thisMonthStart}`
      ));
    const lastMonthSales = Number(lastMonthSalesRes[0]?.value || 0);

    let revenueChange = "+0.0%";
    if (lastMonthSales > 0) {
      const pct = ((thisMonthSales - lastMonthSales) / lastMonthSales) * 100;
      revenueChange = (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
    } else if (thisMonthSales > 0) {
      revenueChange = "+100%";
    }

    // 2. Order Count
    const totalOrdersResult = await db.select({ value: count(orders.id) }).from(orders);
    const totalOrders = Number(totalOrdersResult[0]?.value || 0);

    // This month orders
    const thisMonthOrdersRes = await db.select({ value: count(orders.id) })
      .from(orders)
      .where(gte(orders.createdAt, thisMonthStart));
    const thisMonthOrders = Number(thisMonthOrdersRes[0]?.value || 0);

    // Last month orders
    const lastMonthOrdersRes = await db.select({ value: count(orders.id) })
      .from(orders)
      .where(and(
        gte(orders.createdAt, lastMonthStart),
        sql`${orders.createdAt} < ${thisMonthStart}`
      ));
    const lastMonthOrders = Number(lastMonthOrdersRes[0]?.value || 0);

    let ordersChange = "+0.0%";
    if (lastMonthOrders > 0) {
      const pct = ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100;
      ordersChange = (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
    } else if (thisMonthOrders > 0) {
      ordersChange = "+100%";
    }

    // 3. New Customers (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newCustomersRes = await db.select({ value: count(users.id) })
      .from(users)
      .where(and(eq(users.role, "USER"), gte(users.createdAt, thirtyDaysAgo)));
    const newCustomers = Number(newCustomersRes[0]?.value || 0);

    // This month vs Last month customers for change rate
    const thisMonthCustomersRes = await db.select({ value: count(users.id) })
      .from(users)
      .where(and(eq(users.role, "USER"), gte(users.createdAt, thisMonthStart)));
    const thisMonthCustomers = Number(thisMonthCustomersRes[0]?.value || 0);

    const lastMonthCustomersRes = await db.select({ value: count(users.id) })
      .from(users)
      .where(and(
        eq(users.role, "USER"),
        gte(users.createdAt, lastMonthStart),
        sql`${users.createdAt} < ${thisMonthStart}`
      ));
    const lastMonthCustomers = Number(lastMonthCustomersRes[0]?.value || 0);

    let customersChange = "+0.0%";
    if (lastMonthCustomers > 0) {
      const pct = ((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100;
      customersChange = (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
    } else if (thisMonthCustomers > 0) {
      customersChange = "+100%";
    }

    // 4. Registered Users
    const totalUsersRes = await db.select({ value: count(users.id) }).from(users);
    const totalUsers = Number(totalUsersRes[0]?.value || 0);

    const lastMonthUsersRes = await db.select({ value: count(users.id) })
      .from(users)
      .where(sql`${users.createdAt} < ${thisMonthStart}`);
    const lastMonthUsers = Number(lastMonthUsersRes[0]?.value || 0);

    let usersChange = "+0.0%";
    if (lastMonthUsers > 0) {
      const pct = ((totalUsers - lastMonthUsers) / lastMonthUsers) * 100;
      usersChange = (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
    }

    // 5. Monthly Sales Chart
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);

    const monthlySalesResult = await db.select({
      month: sql<number>`MONTH(${orders.createdAt})`,
      revenue: sum(orders.totalAmount)
    })
    .from(orders)
    .where(and(eq(orders.paymentStatus, "PAID"), gte(orders.createdAt, startOfYear)))
    .groupBy(sql`MONTH(${orders.createdAt})`);

    const monthlySales = Array(12).fill(0);
    for (const row of monthlySalesResult) {
      const monthIndex = row.month - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlySales[monthIndex] = Number(row.revenue || 0);
      }
    }

    // 6. Categories breakdown
    const categorySalesResult = await db.select({
      name: categories.name,
      sales: sum(products.salesCount),
      productCount: count(products.id),
    })
    .from(categories)
    .leftJoin(products, eq(categories.id, products.categoryId))
    .groupBy(categories.id, categories.name);

    const totalSalesResult = await db.select({ value: sum(products.salesCount) }).from(products);
    const totalSales = Number(totalSalesResult[0]?.value || 0);

    const categorySales = categorySalesResult.map((c) => {
      const salesCount = Number(c.sales || 0);
      const percent = totalSales > 0 ? Math.round((salesCount / totalSales) * 100) : (c.productCount > 0 ? 20 : 0);
      return {
        name: c.name,
        percent: percent || 5,
        count: `${salesCount} Satış`
      };
    }).sort((a, b) => b.percent - a.percent);

    // 7. Recent Orders
    const recentOrdersList = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        totalAmount: orders.totalAmount,
        status: orders.status,
        createdAt: orders.createdAt,
        userName: users.name,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt))
      .limit(5);

    const recentOrders = [];
    for (const order of recentOrdersList) {
      const items = await db.select({
        productName: products.name,
        quantity: orderItems.quantity
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id));

      let productSummary = "Bilinmeyen Ürün";
      if (items.length > 0) {
        const firstItem = items[0].productName || "Bilinmeyen Ürün";
        if (items.length > 1) {
          const extraCount = items.length - 1;
          productSummary = `${firstItem} + ${extraCount} ürün`;
        } else {
          productSummary = firstItem;
        }
      }

      const diffMs = new Date().getTime() - new Date(order.createdAt).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let relativeTime = "";
      if (diffMins < 1) {
        relativeTime = "Şimdi";
      } else if (diffMins < 60) {
        relativeTime = `${diffMins} dk önce`;
      } else if (diffHours < 24) {
        relativeTime = `${diffHours} sa önce`;
      } else {
        relativeTime = `${diffDays} gün önce`;
      }

      const names = (order.userName || "Misafir Kullanıcı").split(" ");
      const initials = names.map(n => n[0]).join("").toUpperCase().substring(0, 2);

      recentOrders.push({
        id: order.id,
        orderNumber: order.orderNumber,
        userName: order.userName || "Misafir",
        initials,
        productSummary,
        amount: order.totalAmount,
        status: order.status,
        relativeTime,
      });
    }

    return JSON.parse(JSON.stringify({
      stats: {
        totalRevenue,
        revenueChange,
        totalOrders,
        ordersChange,
        newCustomers,
        customersChange,
        totalUsers,
        usersChange
      },
      monthlySales,
      categorySales,
      recentOrders
    }));
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
}

