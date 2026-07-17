"use server";

import { db } from "@/lib/db";
import { cmsPages } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createLog } from "./admin-actions";

export async function getPages() {
    try {
        const pages = await db.query.cmsPages.findMany({
            orderBy: [desc(cmsPages.createdAt)]
        });
        return { success: true, pages };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getPageBySlug(slug: string) {
    try {
        const page = await db.query.cmsPages.findFirst({
            where: eq(cmsPages.slug, slug)
        });
        return { success: true, page };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function savePage(data: any) {
    try {
        const id = data.id || crypto.randomUUID();
        const pageData = {
            title: data.title,
            slug: data.slug,
            content: data.content,
            status: data.status || "DRAFT",
        };

        if (data.id) {
            await db.update(cmsPages).set(pageData).where(eq(cmsPages.id, id));
            await createLog("CMS Sayfası Güncellendi", `Sayfa güncellendi: ${pageData.title} (/p/${pageData.slug})`);
        } else {
            await db.insert(cmsPages).values({ id, ...pageData });
            await createLog("CMS Sayfası Eklendi", `Yeni sayfa eklendi: ${pageData.title} (/p/${pageData.slug})`);
        }

        revalidatePath("/admin/content/pages");
        revalidatePath(`/p/${data.slug}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deletePage(id: string) {
    try {
        await db.delete(cmsPages).where(eq(cmsPages.id, id));
        await createLog("CMS Sayfası Silindi", `Sayfa silindi (ID: ${id})`);
        revalidatePath("/admin/content/pages");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
