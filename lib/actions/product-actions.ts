"use server";

import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, desc, asc, and, gte, lte, like, or, count, inArray, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/products");

export async function searchProducts(query: string) {
  try {
    if (!query) return [];

    const data = await db.select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      oldPrice: products.oldPrice,
      image: products.image,
      category: {
        name: categories.name
      }
    })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(
        and(
          eq(products.status, "ACTIVE"),
          or(
            like(products.name, `%${query}%`),
            like(products.sku, `%${query}%`)
          )
        )
      )
      .limit(8);

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

export async function uploadImage(file: File, oldImageUrl?: string | null) {
  try {
    if (oldImageUrl && oldImageUrl.startsWith("/uploads/products/")) {
      const oldPath = path.join(process.cwd(), "public", oldImageUrl);
      try {
        await fs.unlink(oldPath);
      } catch (e) {
        console.warn("Could not delete old image:", e);
      }
    }

    if (!file || file.size === 0) return null;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name.replace(/ /g, "-")}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(filePath, buffer);

    return `/uploads/products/${fileName}`;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

export async function getProducts() {
  try {
    const data = await db.select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      sku: products.sku,
      price: products.price,
      oldPrice: products.oldPrice,
      stock: products.stock,
      salesCount: products.salesCount,
      image: products.image,
      status: products.status,
      categoryId: products.categoryId,
      category: {
        name: categories.name,
        slug: categories.slug
      },
      createdAt: products.createdAt,
      updatedAt: products.updatedAt
    })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(products.createdAt));

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getBestSellers() {
  try {
    const data = await db.select()
      .from(products)
      .where(eq(products.status, "ACTIVE"))
      .orderBy(desc(products.salesCount))
      .limit(8);

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    return [];
  }
}

export async function getNewProducts(limit: number = 6) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const data = await db.select()
      .from(products)
      .where(and(
        eq(products.status, "ACTIVE"),
        gte(products.createdAt, thirtyDaysAgo)
      ))
      .orderBy(desc(products.createdAt))
      .limit(limit);

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching new products:", error);
    return [];
  }
}

export async function createProduct(formData: FormData) {
  try {
    const id = crypto.randomUUID();
    const imageFile = formData.get("image") as File;
    const imageUrl = await uploadImage(imageFile);

    const data = {
      id,
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      sku: formData.get("sku") as string,
      price: parseFloat(formData.get("price") as string),
      oldPrice: formData.get("oldPrice") ? parseFloat(formData.get("oldPrice") as string) : null,
      stock: parseInt(formData.get("stock") as string),
      categoryId: formData.get("categoryId") as string,
      image: imageUrl,
      status: "ACTIVE" as const,
    };

    await db.insert(products).values(data);

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, id };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Product could not be created." };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const existing = await db.query.products.findFirst({ where: eq(products.id, id) });
    const imageFile = formData.get("image") as File;

    let imageUrl = existing?.image;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile, existing?.image);
    }

    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      sku: formData.get("sku") as string,
      price: parseFloat(formData.get("price") as string),
      oldPrice: formData.get("oldPrice") ? parseFloat(formData.get("oldPrice") as string) : null,
      stock: parseInt(formData.get("stock") as string),
      categoryId: formData.get("categoryId") as string,
      image: imageUrl,
      updatedAt: new Date(),
    };

    await db.update(products)
      .set(data)
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
    const existing = await db.query.products.findFirst({ where: eq(products.id, id) });

    if (existing?.image && existing.image.startsWith("/uploads/products/")) {
      const imgPath = path.join(process.cwd(), "public", existing.image);
      try {
        await fs.unlink(imgPath);
      } catch (e) {
        console.warn("Could not delete image file during product deletion:", e);
      }
    }

    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Product could not be deleted." };
  }
}

export async function getDatabaseProductCount() {
  try {
    const result = await db.select({ value: count(products.id) }).from(products);
    return Number(result[0]?.value || 0);
  } catch (error) {
    console.error("Error fetching database product count:", error);
    return 0;
  }
}

export async function getFilteredProducts(filters: {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  stockOnly?: boolean;
  sortBy?: string;
}) {
  try {
    const conditions = [eq(products.status, "ACTIVE")];

    if (filters.categoryId && filters.categoryId !== "all") {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }
    if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
      conditions.push(gte(products.price, filters.minPrice));
    }
    if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      conditions.push(lte(products.price, filters.maxPrice));
    }
    if (filters.stockOnly) {
      conditions.push(gte(products.stock, 1));
    }

    let query = db.select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      sku: products.sku,
      price: products.price,
      oldPrice: products.oldPrice,
      stock: products.stock,
      salesCount: products.salesCount,
      image: products.image,
      status: products.status,
      categoryId: products.categoryId,
      category: {
        name: categories.name,
        slug: categories.slug
      },
      createdAt: products.createdAt,
      updatedAt: products.updatedAt
    })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...conditions));

    if (filters.sortBy === "price-asc") {
      query = query.orderBy(asc(products.price));
    } else if (filters.sortBy === "price-desc") {
      query = query.orderBy(desc(products.price));
    } else if (filters.sortBy === "sales-desc") {
      query = query.orderBy(desc(products.salesCount));
    } else {
      // default: newest
      query = query.orderBy(desc(products.createdAt));
    }

    const data = await query;
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    return [];
  }
}

export async function getRecommendedProducts(categorySlugs: string[]) {
  try {
    let data: any[] = [];
    const activeSlugs = categorySlugs.filter(Boolean);

    if (activeSlugs.length > 0) {
      data = await db.select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        sku: products.sku,
        price: products.price,
        oldPrice: products.oldPrice,
        stock: products.stock,
        salesCount: products.salesCount,
        image: products.image,
        status: products.status,
        categoryId: products.categoryId,
        category: {
          name: categories.name,
          slug: categories.slug
        },
        createdAt: products.createdAt,
        updatedAt: products.updatedAt
      })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(
          and(
            eq(products.status, "ACTIVE"),
            inArray(categories.slug, activeSlugs)
          )
        )
        .orderBy(desc(products.salesCount))
        .limit(8);
    }

    if (data.length < 8) {
      const remainingLimit = 8 - data.length;
      const excludedIds = data.map(p => p.id);
      const fallbackConditions = [eq(products.status, "ACTIVE")];

      if (excludedIds.length > 0) {
        fallbackConditions.push(not(inArray(products.id, excludedIds)));
      }

      const fallbackData = await db.select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        sku: products.sku,
        price: products.price,
        oldPrice: products.oldPrice,
        stock: products.stock,
        salesCount: products.salesCount,
        image: products.image,
        status: products.status,
        categoryId: products.categoryId,
        category: {
          name: categories.name,
          slug: categories.slug
        },
        createdAt: products.createdAt,
        updatedAt: products.updatedAt
      })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(and(...fallbackConditions))
        .orderBy(desc(products.salesCount))
        .limit(remainingLimit);

      data = [...data, ...fallbackData];
    }

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    return [];
  }
}
