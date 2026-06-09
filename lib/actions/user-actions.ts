"use server";

import { db } from "@/lib/db";
import { users, userAddresses } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export async function uploadProfilePicture(userId: string, formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "Dosya bulunamadı." };
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { success: false, error: "Geçersiz dosya tipi. Sadece resim dosyaları yüklenebilir." };
    }

    // Validate extension
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return { success: false, error: "Geçersiz dosya uzantısı. Sadece resim dosyaları yüklenebilir." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${userId}-${Date.now()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "profile");
    
    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const imageUrl = `/profile/${fileName}`;

    // Get current user to check for old image
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (currentUser?.image) {
      const oldFilePath = path.join(process.cwd(), "public", currentUser.image);
      try {
        await fs.unlink(oldFilePath);
      } catch (e) {
        console.error("Old file could not be deleted:", e);
      }
    }

    // Update user in DB
    await db.update(users).set({ image: imageUrl }).where(eq(users.id, userId));

    revalidatePath("/");
    revalidatePath("/admin/customers");

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

export async function updateUserProfile(userId: string, data: { name?: string; phone?: string }) {
    try {
        await db.update(users).set(data).where(eq(users.id, userId));
        revalidatePath("/hesabim");
        return { success: true };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: "Profil güncellenemedi." };
    }
}

export async function getUserAddresses(userId: string) {
    try {
        const addresses = await db.select().from(userAddresses).where(eq(userAddresses.userId, userId));
        return JSON.parse(JSON.stringify(addresses));
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return [];
    }
}

export async function addAddress(userId: string, data: any) {
    try {
        const id = randomUUID();
        
        // If it's the first address, make it default
        const existing = await db.select().from(userAddresses).where(eq(userAddresses.userId, userId));
        const isDefault = existing.length === 0 || data.isDefault;

        if (isDefault) {
            // Remove default from others
            await db.update(userAddresses).set({ isDefault: false }).where(eq(userAddresses.userId, userId));
        }

        await db.insert(userAddresses).values({
            id,
            userId,
            title: data.title,
            name: data.name,
            phone: data.phone,
            city: data.city,
            district: data.district,
            addressDetail: data.addressDetail,
            isDefault
        });

        if (isDefault) {
            await db.update(users).set({ address: id }).where(eq(users.id, userId));
        }

        revalidatePath("/hesabim");
        return { success: true };
    } catch (error) {
        console.error("Error adding address:", error);
        return { success: false, error: "Adres eklenemedi." };
    }
}

export async function deleteAddress(userId: string, addressId: string) {
    try {
        await db.delete(userAddresses).where(and(eq(userAddresses.id, addressId), eq(userAddresses.userId, userId)));
        
        // If the deleted address was the default one, clear users.address
        const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
        if (user?.address === addressId) {
            await db.update(users).set({ address: null }).where(eq(users.id, userId));
        }

        revalidatePath("/hesabim");
        return { success: true };
    } catch (error) {
        console.error("Error deleting address:", error);
        return { success: false, error: "Adres silinemedi." };
    }
}

export async function setDefaultAddress(userId: string, addressId: string) {
    try {
        await db.update(userAddresses).set({ isDefault: false }).where(eq(userAddresses.userId, userId));
        await db.update(userAddresses).set({ isDefault: true }).where(and(eq(userAddresses.id, addressId), eq(userAddresses.userId, userId)));
        
        // Sync to users table
        await db.update(users).set({ address: addressId }).where(eq(users.id, userId));

        revalidatePath("/hesabim");
        return { success: true };
    } catch (error) {
        console.error("Error setting default address:", error);
        return { success: false, error: "Varsayılan adres ayarlanamadı." };
    }
}
