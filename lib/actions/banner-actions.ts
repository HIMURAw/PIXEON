"use server";

import { db } from "@/lib/db";
import { banners } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function getBanners() {
    try {
        const allBanners = await db.query.banners.findMany({
            orderBy: [desc(banners.createdAt)]
        });
        return { success: true, banners: allBanners };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getActiveBannersByPosition(position: string) {
    try {
        const activeBanners = await db.query.banners.findMany({
            where: (banners, { and, eq }) => and(
                eq(banners.status, "ACTIVE"),
                eq(banners.position, position)
            ),
            orderBy: [desc(banners.createdAt)]
        });
        return { success: true, banners: activeBanners };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function saveBanner(data: any) {
    try {
        const id = data.id || uuidv4();
        const bannerData = {
            title: data.title,
            subtitle: data.subtitle,
            image: data.image,
            link: data.link,
            position: data.position,
            status: data.status || "ACTIVE",
        };

        if (data.id) {
            await db.update(banners).set(bannerData).where(eq(banners.id, id));
        } else {
            await db.insert(banners).values({ id, ...bannerData });
        }

        revalidatePath("/");
        revalidatePath("/admin/content/banners");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteBanner(id: string) {
    try {
        await db.delete(banners).where(eq(banners.id, id));
        revalidatePath("/");
        revalidatePath("/admin/content/banners");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
