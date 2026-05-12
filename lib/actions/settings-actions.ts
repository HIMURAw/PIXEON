"use server";

import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createLog } from "./admin-actions";

export async function getSettings() {
  try {
    const settings = await db.select().from(siteSettings).where(eq(siteSettings.id, "global")).limit(1);
    return JSON.parse(JSON.stringify(settings[0] || {}));
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {};
  }
}

export async function updateSettings(data: any) {
  try {
    await db.update(siteSettings).set(data).where(eq(siteSettings.id, "global"));
    
    await createLog("Sistem Ayarları Güncellendi", "Genel sistem ayarlarında değişiklik yapıldı.");
    
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Ayarlar güncellenemedi." };
  }
}
