import { NextRequest, NextResponse } from "next/server";
import { decrypt, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Log incoming requests asynchronously to the live request monitor
  const logUrl = new URL("/api/admin/monitor/log", request.url);
  fetch(logUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      method: request.method,
      url: path + request.nextUrl.search,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0] || request.ip || "127.0.0.1",
      userAgent: request.headers.get("user-agent") || "Bilinmeyen",
    }),
  }).catch(() => {});

  // 1. Rotaları belirle
  const isAdminRoute = path.startsWith("/admin");
  const isProtectedUserRoute = path.startsWith("/hesabim");
  const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");

  interface SessionData {
    user: {
      role?: string;
    };
  }

  // 2. Session kontrolü yap
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  let session: SessionData | null = null;

  if (cookie) {
    try {
      session = await decrypt(cookie);
    } catch {
      // Geçersiz token
    }
  }

  // 3. Admin rotası koruması
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Eğer rolü ADMIN değilse ana sayfaya at
    if (session.user.role?.toUpperCase() !== "ADMIN") {
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
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/admin/monitor|.*\\.[\\w]+$).*)",
  ],
};
