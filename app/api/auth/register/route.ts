import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";

import { verifyCaptcha } from "@/lib/captcha";

const registerSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  captchaToken: z.string().min(1, "Güvenlik kodu anahtarı eksik"),
  captchaAnswer: z.string().min(1, "Güvenlik kodunu giriniz"),
});

export async function POST(request: NextRequest) {
  try {
    // Check if new registrations are allowed
    const settingsPath = path.join(process.cwd(), "public", "settings", "verification.json");
    try {
      const settingsData = await fs.readFile(settingsPath, "utf-8");
      const settings = JSON.parse(settingsData);
      if (settings && settings.allowNewRegistrations === false) {
        return NextResponse.json(
          { success: false, message: "Yeni kullanıcı kayıtları geçici olarak devre dışı bırakılmıştır." },
          { status: 403 }
        );
      }
    } catch {
      // ignore
    }

    const body = await request.json();

    // Validate request body
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error.errors[0]?.message || "Geçersiz kayıt bilgileri",
        },
        { status: 400 }
      );
    }

    const { name, email, password, captchaToken, captchaAnswer } = validationResult.data;

    // Verify Captcha
    const isCaptchaValid = await verifyCaptcha(captchaToken, captchaAnswer);
    if (!isCaptchaValid) {
      return NextResponse.json(
        { success: false, message: "Güvenlik kodu hatalı veya süresi dolmuş." },
        { status: 400 }
      );
    }

    // 1. Kullanıcı var mı kontrol et
    const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, message: "Bu e-posta adresi zaten kullanımda" },
        { status: 400 }
      );
    }

    // 2. Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Kullanıcıyı oluştur
    await db.insert(users).values({
      id: crypto.randomUUID(), // uuid v4
      name,
      email,
      password: hashedPassword,
      role: "USER",
    });

    return NextResponse.json(
      { success: true, message: "Hesap başarıyla oluşturuldu" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { success: false, message: "Kayıt sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
