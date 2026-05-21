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

export async function validateCoupon(code: string, subtotal: number) {
  try {
    if (!code) {
      return { success: false, error: "Lütfen bir kupon kodu girin." };
    }
    const codeClean = code.trim().toUpperCase();
    const data = await db.select().from(coupons).where(eq(coupons.code, codeClean)).limit(1);
    
    if (data.length === 0) {
      return { success: false, error: "Geçersiz kupon kodu." };
    }
    
    const coupon = data[0];
    
    // Check expiry
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { success: false, error: "Kuponun kullanım süresi dolmuş." };
    }
    
    // Check usage limits
    if (coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usageCount >= coupon.usageLimit) {
      return { success: false, error: "Bu kupon maksimum kullanım limitine ulaşmış." };
    }
    
    // Check minimum purchase amount
    if (coupon.minPurchase !== null && coupon.minPurchase !== undefined && subtotal < coupon.minPurchase) {
      return { success: false, error: `Bu kuponu kullanabilmek için minimum sepet tutarı ₺${coupon.minPurchase.toLocaleString("tr-TR")} olmalıdır.` };
    }
    
    return {
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minPurchase: coupon.minPurchase,
      }
    };
  } catch (error) {
    console.error("Error validating coupon:", error);
    return { success: false, error: "Kupon doğrulanırken bir hata oluştu." };
  }
}

