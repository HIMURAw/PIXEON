"use server";

import { db } from "@/lib/db";
import { wishlist, products, categories } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(userId: string, productId: string) {
    try {
        // Check if already in wishlist
        const results = await db.select()
            .from(wishlist)
            .where(and(
                eq(wishlist.userId, userId),
                eq(wishlist.productId, productId)
            ))
            .limit(1);

        const existing = results[0];

        if (existing) {
            // Remove from wishlist
            await db.delete(wishlist).where(eq(wishlist.id, existing.id));
            revalidatePath("/product/[slug]", "layout");
            revalidatePath("/hesabim");
            return { success: true, action: "removed" };
        } else {
            // Add to wishlist
            await db.insert(wishlist).values({
                id: `wish_${Date.now()}`,
                userId,
                productId,
                createdAt: new Date()
            });
            revalidatePath("/product/[slug]", "layout");
            revalidatePath("/hesabim");
            return { success: true, action: "added" };
        }
    } catch (error) {
        console.error("Wishlist toggle error:", error);
        return { success: false, error: "İşlem başarısız oldu." };
    }
}

export async function getWishlist(userId: string) {
    try {
        const data = await db.select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            price: products.price,
            oldPrice: products.oldPrice,
            image: products.image,
            category: {
                name: categories.name,
                slug: categories.slug
            }
        })
        .from(wishlist)
        .innerJoin(products, eq(wishlist.productId, products.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(eq(wishlist.userId, userId))
        .orderBy(desc(wishlist.createdAt));

        return data;
    } catch (error) {
        console.error("Get wishlist error:", error);
        return [];
    }
}
