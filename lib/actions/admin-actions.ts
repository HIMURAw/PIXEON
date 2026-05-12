"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

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

    await db.insert(users).values({
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "ADMIN",
      adminRole: data.adminRole,
    });

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
    await db.update(users).set({
      role: "ADMIN",
      adminRole: adminRole
    }).where(eq(users.id, userId));

    revalidatePath("/admin/settings/admins");
    return { success: true };
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    return { success: false, error: "Kullanıcı yönetici yapılamadı." };
  }
}

export async function deleteAdmin(id: string) {
  try {
    // Instead of deleting the user, we just revoke admin privileges
    await db.update(users).set({
      role: "USER",
      adminRole: null
    }).where(eq(users.id, id));

    revalidatePath("/admin/settings/admins");
    return { success: true };
  } catch (error) {
    console.error("Error revoking admin privileges:", error);
    return { success: false, error: "Yönetici yetkisi kaldırılamadı." };
  }
}
