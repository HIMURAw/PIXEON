import { NextRequest, NextResponse } from "next/server";
import { encrypt, SESSION_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, adminLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { randomUUID } from "crypto";

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
          message: validationResult.error.errors[0]?.message || "Geçersiz giriş bilgileri",
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

    // 3. Oturum oluştur
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    
    // Log successful admin login
    if (user.role === "ADMIN") {
      const ip = getClientIp(request);
      try {
        await db.insert(adminLogs).values({
          id: randomUUID(),
          adminId: user.id,
          adminName: user.name || "Bilinmeyen",
          action: "Giriş Yapıldı",
          details: "Yönetici başarılı bir şekilde sisteme giriş yaptı.",
          ipAddress: ip,
          createdAt: new Date(),
        });
      } catch (err) {
        console.error("Error creating login admin log:", err);
      }
    }
    
    const session = await encrypt({ user: sessionUser, expires });

    const response = NextResponse.json({ success: true, user: sessionUser });
    response.cookies.set(SESSION_COOKIE_NAME, session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
