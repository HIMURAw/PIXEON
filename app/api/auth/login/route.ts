import { NextRequest, NextResponse } from "next/server";
import { encrypt, SESSION_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Kullanıcıyı bul
    const foundUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = foundUsers[0];

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Geçersiz e-posta veya şifre" },
        { status: 401 }
      );
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
