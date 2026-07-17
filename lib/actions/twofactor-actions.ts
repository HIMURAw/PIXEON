"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  generateTwoFactorSecret,
  getTwoFactorKeyUri,
  getTwoFactorQrDataUrl,
  verifyTwoFactorCode,
} from "@/lib/twofactor";
import { createLog } from "./admin-actions";

export async function getTwoFactorStatus(userId: string) {
  const [user] = await db
    .select({ twoFactorEnabled: users.twoFactorEnabled })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return { enabled: !!user?.twoFactorEnabled };
}

export async function beginTwoFactorSetup(userId: string) {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return { success: false, error: "Kullanıcı bulunamadı." };

    const secret = generateTwoFactorSecret();
    // Stored but not yet "enabled" until confirmed with a valid code below.
    await db.update(users).set({ twoFactorSecret: secret, twoFactorEnabled: false }).where(eq(users.id, userId));

    const otpauthUrl = getTwoFactorKeyUri(user.email, secret);
    const qrDataUrl = await getTwoFactorQrDataUrl(otpauthUrl);

    return { success: true, secret, qrDataUrl };
  } catch (error) {
    console.error("Error beginning 2FA setup:", error);
    return { success: false, error: "Kurulum başlatılamadı." };
  }
}

export async function confirmTwoFactorSetup(userId: string, code: string) {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user?.twoFactorSecret) {
      return { success: false, error: "Önce kurulumu başlatmalısınız." };
    }
    if (!verifyTwoFactorCode(code, user.twoFactorSecret)) {
      return { success: false, error: "Kod geçersiz veya süresi dolmuş." };
    }

    await db.update(users).set({ twoFactorEnabled: true }).where(eq(users.id, userId));
    await createLog("İki Faktörlü Doğrulama Etkinleştirildi", `${user.name} kendi hesabı için iki faktörlü doğrulamayı etkinleştirdi.`);
    return { success: true };
  } catch (error) {
    console.error("Error confirming 2FA setup:", error);
    return { success: false, error: "Doğrulama başarısız oldu." };
  }
}

export async function disableTwoFactor(userId: string, code: string) {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user?.twoFactorSecret || !user.twoFactorEnabled) {
      return { success: false, error: "İki faktörlü doğrulama zaten etkin değil." };
    }
    if (!verifyTwoFactorCode(code, user.twoFactorSecret)) {
      return { success: false, error: "Kod geçersiz veya süresi dolmuş." };
    }

    await db.update(users).set({ twoFactorEnabled: false, twoFactorSecret: null }).where(eq(users.id, userId));
    await createLog("İki Faktörlü Doğrulama Devre Dışı Bırakıldı", `${user.name} kendi hesabı için iki faktörlü doğrulamayı kapattı.`);
    return { success: true };
  } catch (error) {
    console.error("Error disabling 2FA:", error);
    return { success: false, error: "İşlem başarısız oldu." };
  }
}
