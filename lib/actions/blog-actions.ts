"use server";

import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function getBlogPosts() {
    try {
        const posts = await db.query.blogPosts.findMany({
            orderBy: [desc(blogPosts.createdAt)]
        });
        return { success: true, posts };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getBlogPostBySlug(slug: string) {
    try {
        const post = await db.query.blogPosts.findFirst({
            where: eq(blogPosts.slug, slug)
        });
        return { success: true, post };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function saveBlogPost(data: any) {
    try {
        const session = await getSession();
        if (!session?.user?.id) return { success: false, error: "Oturum açmanız gerekiyor." };

        const id = data.id || crypto.randomUUID();
        const postData = {
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            image: data.image,
            status: data.status || "DRAFT",
            authorId: session.user.id
        };

        if (data.id) {
            await db.update(blogPosts).set(postData).where(eq(blogPosts.id, id));
        } else {
            await db.insert(blogPosts).values({ id, ...postData });
        }

        revalidatePath("/admin/content/blog");
        revalidatePath("/blog");
        revalidatePath(`/blog/${data.slug}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteBlogPost(id: string) {
    try {
        await db.delete(blogPosts).where(eq(blogPosts.id, id));
        revalidatePath("/admin/content/blog");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
