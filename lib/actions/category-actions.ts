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
    revalidatePath("/admin/products");
    return { success: true, id };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Category could not be created." };
  }
}
