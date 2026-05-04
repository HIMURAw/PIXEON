"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

export async function uploadProfilePicture(userId: string, formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "Dosya bulunamadı." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExtension}`;
    const uploadDir = path.join(process.cwd(), "public", "profile");
    
    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const imageUrl = `/profile/${fileName}`;

    // Update user in DB
    await db.update(users).set({ image: imageUrl }).where(eq(users.id, userId));

    revalidatePath("/");
    revalidatePath("/admin/customers"); // If there is a customers page

    return { success: true, imageUrl };
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return { success: false, error: "Profil fotoğrafı yüklenemedi." };
  }
}

export async function getUserProfile(userId: string) {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}
