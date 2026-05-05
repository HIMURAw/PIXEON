"use server";

import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  try {
    return await db.query.categories.findMany();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function createCategory(data: { name: string; slug: string; description?: string; image?: string }) {
  try {
    const id = crypto.randomUUID();
    await db.insert(categories).values({
      id,
      ...data,
    });
    revalidatePath("/admin/categories");
    return { success: true, id };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Kategori oluşturulamadı." };
  }
}

export async function updateCategory(id: string, data: { name: string; slug: string; description?: string; image?: string }) {
  try {
    await db.update(categories).set({
      ...data,
      updatedAt: new Date(),
    }).where(eq(categories.id, id));
    
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Kategori güncellenemedi." };
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Kategori silinemedi. Bu kategoriye bağlı ürünler olabilir." };
  }
}
