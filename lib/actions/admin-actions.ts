"use server";

import { db } from "@/lib/db";
import { users, adminLogs, userAddresses, orders } from "@/lib/db/schema";
import { eq, and, desc, count, gte, inArray, or, like, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/auth";

export async function createLog(action: string, details: string) {
  try {
    const session = await getSession();
    if (!session) return;

    await db.insert(adminLogs).values({
      id: randomUUID(),
      adminId: session.user.id,
      adminName: session.user.name || "Bilinmeyen",
      action: action,
      details: details,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error creating admin log:", error);
  }
}

export async function getAdminLogs() {
  try {
    const logs = await db.select().from(adminLogs).orderBy(desc(adminLogs.createdAt)).limit(100);
    return JSON.parse(JSON.stringify(logs));
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    return [];
  }
}

export async function getAdmins() {
  try {
    const admins = await db.select().from(users).where(eq(users.role, "ADMIN"));
    return JSON.parse(JSON.stringify(admins));
  } catch (error) {
    console.error("Error fetching admins:", error);
    return [];
  }
}

export async function addAdmin(data: { name: string; email: string; password?: string; adminRole: string }) {
  try {
    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.email, data.email));
    if (existing.length > 0) {
      return { success: false, error: "Bu e-posta adresi zaten kullanımda." };
    }

    const password = data.password || "Pixeon123!"; // Default password if not provided
    const hashedPassword = await bcrypt.hash(password, 10);

    const id = randomUUID();
    await db.insert(users).values({
      id: id,
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "ADMIN",
      adminRole: data.adminRole,
    });

    await createLog("Yönetici Eklendi", `${data.name} (${data.email}) yeni ${data.adminRole} olarak oluşturuldu.`);

    revalidatePath("/admin/settings/admins");
    return { success: true };
  } catch (error) {
    console.error("Error adding admin:", error);
    return { success: false, error: "Yönetici eklenemedi." };
  }
}

export async function updateAdmin(id: string, data: { name?: string; email?: string; adminRole?: string; password?: string }) {
  try {
    const updateData: any = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await db.update(users).set(updateData).where(eq(users.id, id));

    await createLog("Yönetici Güncellendi", `${data.name} bilgilerinde değişiklik yapıldı.`);

    revalidatePath("/admin/settings/admins");
    return { success: true };
  } catch (error) {
    console.error("Error updating admin:", error);
    return { success: false, error: "Yönetici güncellenemedi." };
  }
}

export async function getAllUsers() {
  try {
    console.log("getAllUsers action called");
    const allUsers = await db.select().from(users);
    console.log(`Fetched ${allUsers.length} users`);
    return JSON.parse(JSON.stringify(allUsers));
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
}

export async function promoteToAdmin(userId: string, adminRole: string) {
  try {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const userName = user[0]?.name || "Bilinmeyen";

    await db.update(users).set({
      role: "ADMIN",
      adminRole: adminRole
    }).where(eq(users.id, userId));

    await createLog("Kullanıcı Yetkilendirildi", `${userName} adlı kullanıcı ${adminRole} yetkisi ile admin yapıldı.`);

    revalidatePath("/admin/settings/admins");
    return { success: true };
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    return { success: false, error: "Kullanıcı yönetici yapılamadı." };
  }
}

export async function deleteAdmin(id: string) {
  try {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    const userName = user[0]?.name || "Bilinmeyen";

    // Instead of deleting the user, we just revoke admin privileges
    await db.update(users).set({
      role: "USER",
      adminRole: null
    }).where(eq(users.id, id));

    await createLog("Yönetici Yetkisi Kaldırıldı", `${userName} adlı yöneticinin yetkileri geri alındı.`);

    revalidatePath("/admin/settings/admins");
    return { success: true };
  } catch (error) {
    console.error("Error revoking admin privileges:", error);
    return { success: false, error: "Yönetici yetkisi kaldırılamadı." };
  }
}

export async function getAdminCustomers(params: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;
    const search = params.search || "";

    // 1. Fetch total counts and statistics first
    // Total customers
    const totalUsersResult = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "USER"));
    const totalCustomers = totalUsersResult[0]?.count || 0;

    // New customers this month (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersResult = await db
      .select({ count: count() })
      .from(users)
      .where(
        and(
          eq(users.role, "USER"),
          gte(users.createdAt, thirtyDaysAgo)
        )
      );
    const newCustomersThisMonth = newUsersResult[0]?.count || 0;

    // To calculate Loyal Customers and fetch customers list with spendings, we can query users first
    // Filter conditions for users
    let searchCondition = eq(users.role, "USER");
    if (search) {
      searchCondition = and(
        eq(users.role, "USER"),
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`),
          like(users.phone, `%${search}%`)
        )
      ) as any;
    }

    // Fetch user IDs and details
    const customerList = await db
      .select()
      .from(users)
      .where(searchCondition)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    // Fetch orders for the fetched customers
    const userIds = customerList.map(u => u.id);
    let userOrders: any[] = [];
    let userAddressesList: any[] = [];

    if (userIds.length > 0) {
      userOrders = await db
        .select()
        .from(orders)
        .where(inArray(orders.userId, userIds));

      userAddressesList = await db
        .select()
        .from(userAddresses)
        .where(and(
          inArray(userAddresses.userId, userIds),
          eq(userAddresses.isDefault, true)
        ));
    }

    // Fetch stats for loyal customers (users with >= 3 orders)
    const loyalUsersResult = await db
      .select({ userId: orders.userId })
      .from(orders)
      .groupBy(orders.userId)
      .having(sql`count(${orders.id}) >= 3`);
    
    const loyalCustomers = loyalUsersResult.length;

    // Map customers
    const mappedCustomers = customerList.map(user => {
      const ordersOfUser = userOrders.filter(o => o.userId === user.id);
      const defaultAddress = userAddressesList.find(a => a.userId === user.id);
      
      const ordersCount = ordersOfUser.length;
      const totalSpent = ordersOfUser
        .filter(o => o.paymentStatus === "PAID")
        .reduce((sum, o) => sum + o.totalAmount, 0);

      // Determine initial
      const nameParts = user.name.split(" ");
      const initial = nameParts.length > 1 
        ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
        : user.name.substring(0, 2).toUpperCase();

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "Belirtilmemiş",
        location: defaultAddress ? `${defaultAddress.city}` : "Belirtilmemiş",
        joined: new Date(user.createdAt).toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }),
        orders: ordersCount,
        spent: totalSpent,
        status: "Active",
        initial
      };
    });

    // Count total matching users for pagination
    const totalMatchingResult = await db
      .select({ count: count() })
      .from(users)
      .where(searchCondition);
    const totalMatching = totalMatchingResult[0]?.count || 0;

    return {
      success: true,
      customers: mappedCustomers,
      totalCustomers,
      newCustomersThisMonth,
      loyalCustomers,
      totalMatching,
      totalPages: Math.ceil(totalMatching / limit)
    };
  } catch (error) {
    console.error("Error in getAdminCustomers server action:", error);
    return {
      success: false,
      error: "Müşteriler yüklenirken hata oluştu.",
      customers: [],
      totalCustomers: 0,
      newCustomersThisMonth: 0,
      loyalCustomers: 0,
      totalMatching: 0,
      totalPages: 0
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Yetkisiz işlem." };
    }

    // Check if user has orders
    const userOrdersCount = await db
      .select({ value: count() })
      .from(orders)
      .where(eq(orders.userId, userId));
    
    if (userOrdersCount[0]?.value > 0) {
      return { success: false, error: "Bu müşterinin geçmiş siparişleri bulunmaktadır, bu yüzden silinemez." };
    }

    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (user.length === 0) {
      return { success: false, error: "Kullanıcı bulunamadı." };
    }
    const userName = user[0].name;

    // Delete user addresses first
    await db.delete(userAddresses).where(eq(userAddresses.userId, userId));
    
    // Delete user
    await db.delete(users).where(eq(users.id, userId));

    await createLog("Kullanıcı Silindi", `${userName} adlı müşteri sistemden silindi.`);

    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Kullanıcı silinemedi." };
  }
}

