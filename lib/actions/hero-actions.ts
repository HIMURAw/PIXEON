"use server";

import { db } from "@/lib/db";
import { heroSlides } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createLog } from "./admin-actions";

export async function getHeroSlides() {
  try {
    const slides = await db.query.heroSlides.findMany({
      orderBy: [asc(heroSlides.order)],
    });
    return { success: true, slides };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getActiveHeroSlides() {
    try {
      const slides = await db.query.heroSlides.findMany({
        where: eq(heroSlides.status, "ACTIVE"),
        orderBy: [asc(heroSlides.order)],
      });
      return { success: true, slides };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

export async function saveHeroSlide(data: any) {
  const session = await getSession();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const { id, ...rest } = data;
  const slideId = id || randomUUID();

  try {
    if (id) {
        await db.update(heroSlides)
            .set({ ...rest, updatedAt: new Date() })
            .where(eq(heroSlides.id, slideId));
        await createLog("Hero Slide Güncellendi", `Slider güncellendi: ${rest.title || slideId}`);
    } else {
        await db.insert(heroSlides).values({
            id: slideId,
            ...rest,
        });
        await createLog("Hero Slide Eklendi", `Yeni slider eklendi: ${rest.title || slideId}`);
    }

    revalidatePath("/");
    return { success: true, slideId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteHeroSlide(id: string) {
    const session = await getSession();
    if (session?.user?.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    try {
        await db.delete(heroSlides).where(eq(heroSlides.id, id));
        await createLog("Hero Slide Silindi", `Slider silindi (ID: ${id})`);
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
