import { NextRequest, NextResponse } from "next/server";
import { createTwoFactorPendingToken } from "@/lib/auth";
import { issueSession } from "@/lib/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { verifyCaptcha } from "@/lib/captcha";
import { rateLimit, getClientIp } from "@/lib/rate-limiter";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  captchaToken: z.string().min(1, "Güvenlik kodu anahtarı eksik"),
  captchaAnswer: z.string().min(1, "Güvenlik kodunu giriniz"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error.issues[0]?.message || "Geçersiz giriş bilgileri",
        },
        { status: 400 }
      );
    }

    const { email, password, captchaToken, captchaAnswer } = validationResult.data;

    // Verify Captcha
    const isCaptchaValid = await verifyCaptcha(captchaToken, captchaAnswer);
    if (!isCaptchaValid) {
      return NextResponse.json(
        { success: false, message: "Güvenlik kodu hatalı veya süresi dolmuş." },
        { status: 400 }
      );
    }

    // 1. Kullanıcıyı bul
    const foundUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = foundUsers[0];

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Geçersiz e-posta veya şifre" },
        { status: 401 }
      );
    }

    // 1.5. Admin için rate limit kontrolü
    if (user.role === "ADMIN") {
      const limitResult = await rateLimit(request, "admin_login", {
        limit: 5, // 15 dakika içinde en fazla 5 deneme
        windowMs: 15 * 60 * 1000,
      });

      if (!limitResult.success) {
        return NextResponse.json(
          {
            success: false,
            message: `Çok fazla giriş denemesi yaptınız. Lütfen ${limitResult.resetSeconds} saniye sonra tekrar deneyin.`,
          },
          { status: 429 }
        );
      }
    }

    // 2. Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Geçersiz e-posta veya şifre" },
        { status: 401 }
      );
    }

    // 3. İki faktörlü doğrulama etkinse, session açmadan doğrulama adımına yönlendir
    if (user.twoFactorEnabled) {
      const tempToken = await createTwoFactorPendingToken(user.id);
      return NextResponse.json({ success: true, requiresTwoFactor: true, tempToken });
    }

    // 4. Oturum oluştur
    const ip = getClientIp(request);
    return await issueSession(user, ip);
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
