"use server";

import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createLog } from "./admin-actions";

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
    
    await createLog("Kategori Eklendi", `Yeni kategori oluşturuldu: ${data.name} (Slug: ${data.slug})`);

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
    
    await createLog("Kategori Güncellendi", `Kategori güncellendi: ${data.name} (Slug: ${data.slug})`);
    
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Kategori güncellenemedi." };
  }
}

export async function deleteCategory(id: string) {
  try {
    const category = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    const categoryName = category[0]?.name || id;

    await db.delete(categories).where(eq(categories.id, id));
    
    await createLog("Kategori Silindi", `Kategori silindi: ${categoryName} (ID: ${id})`);

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Kategori silinemedi. Bu kategoriye bağlı ürünler olabilir." };
  }
}
