"use server";

import { db } from "@/lib/db";
import { shippingMethods } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createLog } from "./admin-actions";

export async function getShippingMethods() {
  try {
    const data = await db.select().from(shippingMethods).orderBy(desc(shippingMethods.createdAt));
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching shipping methods:", error);
    return [];
  }
}

export async function createShippingMethod(data: {
  name: string;
  type: string;
  rate: number;
  minOrderLimit: number;
  status: "ACTIVE" | "INACTIVE";
  estimatedDelivery: string;
}) {
  try {
    const id = crypto.randomUUID();
    await db.insert(shippingMethods).values({
      id,
      name: data.name,
      type: data.type,
      rate: data.rate,
      minOrderLimit: data.minOrderLimit,
      status: data.status,
      estimatedDelivery: data.estimatedDelivery,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await createLog("Kargo Yöntemi Eklendi", `Yeni kargo yöntemi eklendi: ${data.name}`);
    
    revalidatePath("/admin/shipping");
    return { success: true, id };
  } catch (error: any) {
    console.error("Error creating shipping method:", error);
    return { success: false, error: error.message || "Kargo yöntemi oluşturulamadı." };
  }
}

export async function updateShippingMethod(id: string, data: Partial<{
  name: string;
  type: string;
  rate: number;
  minOrderLimit: number;
  status: "ACTIVE" | "INACTIVE";
  estimatedDelivery: string;
}>) {
  try {
    await db.update(shippingMethods).set({
      ...data,
      updatedAt: new Date()
    }).where(eq(shippingMethods.id, id));
    
    await createLog("Kargo Yöntemi Güncellendi", `Kargo yöntemi güncellendi: ${data.name || id}`);
    
    revalidatePath("/admin/shipping");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating shipping method:", error);
    return { success: false, error: error.message || "Kargo yöntemi güncellenemedi." };
  }
}

export async function deleteShippingMethod(id: string) {
  try {
    // Get method name before deleting for logging
    const method = await db.select().from(shippingMethods).where(eq(shippingMethods.id, id)).limit(1);
    const methodName = method[0]?.name || id;

    await db.delete(shippingMethods).where(eq(shippingMethods.id, id));
    
    await createLog("Kargo Yöntemi Silindi", `Kargo yöntemi silindi: ${methodName}`);
    
    revalidatePath("/admin/shipping");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting shipping method:", error);
    return { success: false, error: error.message || "Kargo yöntemi silinemedi." };
  }
}
