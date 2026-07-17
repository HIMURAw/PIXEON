"use server";

import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createLog } from "./admin-actions";

const ABOUT_US_KEY = "about_us_content";

export async function getAboutUsContent() {
    try {
        const res = await db.query.settings.findFirst({
            where: eq(settings.key, ABOUT_US_KEY)
        });
        
        if (res && res.value) {
            return { success: true, data: JSON.parse(res.value) };
        }
        
        // Varsayılan veriler (Eğer veritabanında yoksa)
        return { 
            success: true, 
            data: {
                hero: {
                    title: "BİZ PIXEON'UZ",
                    subtitle: "Türkiye'nin en seçkin PlayStation topluluğunu ve alışveriş deneyimini inşa ediyoruz.",
                    image: "/slider/banner.jfif"
                },
                story: {
                    title: "Hikayemiz",
                    content1: "PIXEON, 2024 yılında oyun tutkunları tarafından oyun tutkunları için kuruldu.",
                    content2: "Sadece bir mağaza değil, PlayStation ekosisteminin kalbinde yer alan bir teknoloji ve eğlence merkeziyiz.",
                    stat1: "10K+",
                    stat1Label: "Mutlu Oyuncu",
                    stat2: "5K+",
                    stat2Label: "Ürün Çeşidi"
                },
                mission: {
                    title: "Misyonumuz",
                    content: "Türkiye'deki PlayStation ekosistemini güçlendirmek ve her seviyeden oyuncuya kusursuz bir deneyim sunmak.",
                    vision: "Bölgenin en güvenilir ve yenilikçi oyun perakendecisi olarak sektöre yön vermek.",
                    values: "Dürüstlük, tutku, mükemmeliyetçilik ve topluluk odaklı yaklaşım."
                }
            }
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function saveAboutUsContent(data: any) {
    try {
        const jsonValue = JSON.stringify(data);
        
        const existing = await db.query.settings.findFirst({
            where: eq(settings.key, ABOUT_US_KEY)
        });

        if (existing) {
            await db.update(settings).set({ value: jsonValue }).where(eq(settings.key, ABOUT_US_KEY));
        } else {
            await db.insert(settings).values({ key: ABOUT_US_KEY, value: jsonValue });
        }

        await createLog("Hakkımızda Sayfası Güncellendi", "\"Hakkımızda\" içeriği düzenlendi.");

        revalidatePath("/hakkimizda");
        revalidatePath("/admin/content/about");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
