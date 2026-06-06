"use server";

import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, desc, asc, and, gte, lte, like, or, count, inArray, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { createLog } from "./admin-actions";
import { meiliClient, MEILI_PRODUCTS_INDEX } from "@/lib/meilisearch";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/products");
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

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

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      console.error("Invalid MIME type:", file.type);
      return null;
    }

    // Validate extension
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      console.error("Invalid extension:", ext);
      return null;
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${randomUUID()}${ext}`;
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
      .limit(16);

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

    let data = await db.select()
      .from(products)
      .where(and(
        eq(products.status, "ACTIVE"),
        gte(products.createdAt, thirtyDaysAgo)
      ))
      .orderBy(desc(products.createdAt))
      .limit(limit);

    // Eğer son 30 günde eklenmiş yeni ürün yoksa, veritabanındaki en yeni aktif ürünleri getir
    if (data.length === 0) {
      data = await db.select()
        .from(products)
        .where(eq(products.status, "ACTIVE"))
        .orderBy(desc(products.createdAt))
        .limit(limit);
    }

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

    try {
      const cat = await db.query.categories.findFirst({ where: eq(categories.id, data.categoryId) });
      await meiliClient.index(MEILI_PRODUCTS_INDEX).addDocuments([{
        id: id,
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        description: "",
        price: data.price,
        oldPrice: data.oldPrice,
        image: data.image || "",
        status: "ACTIVE",
        categoryName: cat?.name || "Genel"
      }]);
    } catch (e) {
      console.warn("Meilisearch sync failed on create:", e);
    }

    await createLog("Ürün Eklendi", `Yeni ürün eklendi: ${data.name} (SKU: ${data.sku}, Fiyat: ₺${data.price})`);

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

    try {
      const cat = await db.query.categories.findFirst({ where: eq(categories.id, data.categoryId) });
      await meiliClient.index(MEILI_PRODUCTS_INDEX).addDocuments([{
        id: id,
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        description: "",
        price: data.price,
        oldPrice: data.oldPrice,
        image: data.image || "",
        status: "ACTIVE",
        categoryName: cat?.name || "Genel"
      }]);
    } catch (e) {
      console.warn("Meilisearch sync failed on update:", e);
    }

    await createLog("Ürün Güncellendi", `Ürün güncellendi: ${data.name} (SKU: ${data.sku}, Fiyat: ₺${data.price})`);

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

    const productName = existing?.name || id;

    await db.delete(products).where(eq(products.id, id));
    
    try {
      await meiliClient.index(MEILI_PRODUCTS_INDEX).deleteDocument(id);
    } catch (e) {
      console.warn("Meilisearch sync failed on delete:", e);
    }
    
    await createLog("Ürün Silindi", `Ürün silindi: ${productName} (ID: ${id})`);

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

interface RecommendedProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  salesCount: number;
  image: string | null;
  status: "ACTIVE" | "OUT_OF_STOCK" | "DRAFT";
  categoryId: string | null;
  category: {
    name: string;
    slug: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getRecommendedProducts(categorySlugs: string[], visitedProductIds: string[] = []) {
  try {
    let data: RecommendedProduct[] = [];
    const activeSlugs = categorySlugs.filter(Boolean);
    const activeProductIds = visitedProductIds.filter(Boolean);

    // 1. If we have recently visited products, find their category IDs and query similar products
    if (activeProductIds.length > 0) {
      // First, fetch the category IDs of the visited products
      const visitedProductsData = await db.select({ categoryId: products.categoryId })
        .from(products)
        .where(inArray(products.id, activeProductIds));
      
      const visitedCategoryIds = visitedProductsData
        .map(p => p.categoryId)
        .filter(Boolean) as string[];

      if (visitedCategoryIds.length > 0) {
        // Query products in these categories, excluding the visited products themselves
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
              inArray(products.categoryId, visitedCategoryIds),
              not(inArray(products.id, activeProductIds)) // Exclude already viewed products
            )
          )
          .orderBy(desc(products.salesCount))
          .limit(8);
      }
    }

    // 2. If we still need more products, fallback to querying by category slugs (from category history)
    if (data.length < 8 && activeSlugs.length > 0) {
      const remainingLimit = 8 - data.length;
      const excludedIds = [...activeProductIds, ...data.map(p => p.id)];
      const conditions = [
        eq(products.status, "ACTIVE"),
        inArray(categories.slug, activeSlugs)
      ];
      
      if (excludedIds.length > 0) {
        conditions.push(not(inArray(products.id, excludedIds)));
      }

      const catFallbackData = await db.select({
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
        .where(and(...conditions))
        .orderBy(desc(products.salesCount))
        .limit(remainingLimit);

      data = [...data, ...catFallbackData];
    }

    // 3. General popular products as a final fallback
    if (data.length < 8) {
      const remainingLimit = 8 - data.length;
      const excludedIds = [...activeProductIds, ...data.map(p => p.id)];
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
