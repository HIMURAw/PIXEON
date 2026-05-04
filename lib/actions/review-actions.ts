"use server";

import { db } from "@/lib/db";
import { reviews, users, products, reviewLikes } from "@/lib/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export async function getReviews(status?: "PENDING" | "APPROVED" | "REJECTED") {
  try {
    const query = db.select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      status: reviews.status,
      likes: reviews.likes,
      createdAt: reviews.createdAt,
      user: {
        name: users.name,
      },
      product: {
        name: products.name,
      }
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .leftJoin(products, eq(reviews.productId, products.id))
    .orderBy(desc(reviews.createdAt));

    if (status) {
      // @ts-ignore
      query.where(eq(reviews.status, status));
    }

    const data = await query;
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function updateReviewStatus(id: string, status: "APPROVED" | "REJECTED") {
  try {
    await db.update(reviews).set({ status }).where(eq(reviews.id, id));
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating review status:", error);
    return { success: false, error: "Yorum durumu güncellenemedi." };
  }
}

export async function deleteReview(id: string) {
  try {
    await db.delete(reviews).where(eq(reviews.id, id));
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, error: "Yorum silinemedi." };
  }
}

export async function getApprovedReviews(currentUserId?: string) {
  try {
    const data = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      likes: reviews.likes,
      productId: reviews.productId,
      createdAt: reviews.createdAt,
      user: {
        name: users.name,
        image: users.image,
      },
      product: {
        name: products.name,
      }
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .leftJoin(products, eq(reviews.productId, products.id))
    .where(eq(reviews.status, "APPROVED"))
    .orderBy(desc(reviews.createdAt))
    .limit(20);

    // If user is logged in, check which reviews they've liked
    if (currentUserId) {
      const likedReviews = await db.select({ reviewId: reviewLikes.reviewId })
        .from(reviewLikes)
        .where(eq(reviewLikes.userId, currentUserId));
      const likedSet = new Set(likedReviews.map(l => l.reviewId));
      return JSON.parse(JSON.stringify(data.map(r => ({ ...r, likedByUser: likedSet.has(r.id) }))));
    }

    return JSON.parse(JSON.stringify(data.map(r => ({ ...r, likedByUser: false }))));
  } catch (error) {
    console.error("Error fetching approved reviews:", error);
    return [];
  }
}

export async function toggleReviewLike(reviewId: string, userId: string) {
  try {
    const existing = await db.select().from(reviewLikes)
      .where(and(eq(reviewLikes.reviewId, reviewId), eq(reviewLikes.userId, userId)))
      .limit(1);

    if (existing.length > 0) {
      // Unlike
      await db.delete(reviewLikes)
        .where(and(eq(reviewLikes.reviewId, reviewId), eq(reviewLikes.userId, userId)));
      await db.update(reviews)
        .set({ likes: sql`likes - 1` })
        .where(eq(reviews.id, reviewId));
      revalidatePath("/");
      return { success: true, liked: false };
    } else {
      // Like
      await db.insert(reviewLikes).values({
        id: randomUUID(),
        reviewId,
        userId,
      });
      await db.update(reviews)
        .set({ likes: sql`likes + 1` })
        .where(eq(reviews.id, reviewId));
      revalidatePath("/");
      return { success: true, liked: true };
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, error: "Beğeni işlemi başarısız." };
  }
}

export async function getProductsForReview() {
  try {
    const data = await db.select({
      id: products.id,
      name: products.name,
    })
    .from(products)
    .where(eq(products.status, "ACTIVE"))
    .orderBy(products.name)
    .limit(100);
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function createReview(data: {
  productId: string | null;
  userId: string;
  rating: number;
  comment: string;
}) {
  try {
    const id = crypto.randomUUID();
    await db.insert(reviews).values({
      id,
      productId: data.productId ?? undefined,
      userId: data.userId,
      rating: data.rating,
      comment: data.comment,
      status: "PENDING",
      likes: 0,
    });
    revalidatePath("/");
    revalidatePath("/admin/reviews");
    return { success: true, id };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, error: "Yorum gönderilemedi." };
  }
}
