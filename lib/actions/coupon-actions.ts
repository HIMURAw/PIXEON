"use server";

import { db } from "@/lib/db";
import { coupons } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCoupons() {
  try {
    const data = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }
}

export async function createCoupon(data: {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minPurchase?: number;
  expiryDate?: Date | null;
  usageLimit?: number | null;
}) {
  try {
    const id = crypto.randomUUID();
    await db.insert(coupons).values({
      id,
      ...data,
      usageCount: 0,
    });
    revalidatePath("/admin/coupons");
    return { success: true, id };
  } catch (error) {
    console.error("Error creating coupon:", error);
    return { success: false, error: "Kupon oluşturulamadı." };
  }
}

export async function updateCoupon(id: string, data: Partial<{
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minPurchase?: number;
  expiryDate?: Date | null;
  usageLimit?: number | null;
}>) {
  try {
    await db.update(coupons).set(data).where(eq(coupons.id, id));
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    console.error("Error updating coupon:", error);
    return { success: false, error: "Kupon güncellenemedi." };
  }
}

export async function deleteCoupon(id: string) {
  try {
    await db.delete(coupons).where(eq(coupons.id, id));
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return { success: false, error: "Kupon silinemedi." };
  }
}
