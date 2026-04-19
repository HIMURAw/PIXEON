import { NextRequest, NextResponse } from "next/server";
import { encrypt, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: Implement real database validation here
    // For now, using a mock user
    if (email === "admin@TUGER.com" && password === "admin123") {
      const user = { id: "1", email: "admin@TUGER.com", name: "Admin User", role: "admin" };
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const session = await encrypt({ user, expires });

      const response = NextResponse.json({ success: true, user });
      response.cookies.set(SESSION_COOKIE_NAME, session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Geçersiz e-posta veya şifre" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
