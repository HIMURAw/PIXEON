"use server";

import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  try {
    return await db.query.products.findMany({
      with: {
        category: true,
      },
      orderBy: [desc(products.createdAt)],
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getBestSellers() {
  try {
    return await db.query.products.findMany({
      where: eq(products.status, "ACTIVE"),
      orderBy: [desc(products.salesCount)],
      limit: 8,
    });
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    return [];
  }
}

export async function createProduct(data: any) {
  try {
    const id = crypto.randomUUID();
    await db.insert(products).values({
      id,
      ...data,
      price: parseFloat(data.price),
      oldPrice: data.oldPrice ? parseFloat(data.oldPrice) : null,
      stock: parseInt(data.stock),
    });
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, id };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Product could not be created." };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    await db.update(products)
      .set({
        ...data,
        price: parseFloat(data.price),
        oldPrice: data.oldPrice ? parseFloat(data.oldPrice) : null,
        stock: parseInt(data.stock),
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));
    
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Product could not be updated." };
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Product could not be deleted." };
  }
}
