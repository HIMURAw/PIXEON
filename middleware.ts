import { NextRequest, NextResponse } from "next/server";
import { decrypt, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Rotaları belirle
  const isAdminRoute = path.startsWith("/dashboard") || path.startsWith("/products");
  const isProtectedUserRoute = path.startsWith("/hesabim");
  const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");

  // 2. Session kontrolü yap
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  let session: any = null;

  if (cookie) {
    try {
      session = await decrypt(cookie);
    } catch (e) {
      // Geçersiz token
    }
  }

  // 3. Admin rotası koruması
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Eğer rolü ADMIN değilse ana sayfaya at
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 4. Korumalı kullanıcı rotası (Hesabım vb.)
  if (isProtectedUserRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 5. Giriş yapmış kullanıcıyı login/register'dan uzaklaştır
  if (isAuthRoute && session) {
    // Admin ise dashboard'a, kullanıcı ise ana sayfaya
    if (session.user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
