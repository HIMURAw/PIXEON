"use server";

import { db } from "@/lib/db";
import { reviews, users, products } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
export async function getApprovedReviews() {
  try {
    const data = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      user: {
        name: users.name,
        image: users.image,
      }
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.status, "APPROVED"))
    .orderBy(desc(reviews.createdAt))
    .limit(10);

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching approved reviews:", error);
    return [];
  }
}
export async function createReview(data: {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
}) {
  try {
    const id = crypto.randomUUID();
    await db.insert(reviews).values({
      id,
      ...data,
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
