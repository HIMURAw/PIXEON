import { NextRequest, NextResponse } from "next/server";
import { decrypt, SESSION_COOKIE_NAME } from "@/lib/auth";

const BANNED_USER_AGENTS = [
  "curl", "wget", "python", "scrapyd", "headless", "puppeteer", 
  "selenium", "postman", "cyberchef", "dirbuster", "sqlmap", 
  "nmap", "nikto", "gobuster", "zgrab", "masscan"
];

const WAF_SUSPICIOUS_PATTERNS = [
  /\.\.\//i,                    // Directory traversal
  /etc\/passwd/i,               // Unix password file access
  /<script/i,                   // Basic XSS
  /union\s+select/i,            // SQL Injection
  /insert\s+into/i,             // SQL Injection
  /delete\s+from/i,             // SQL Injection
  /drop\s+table/i,              // SQL Injection
  /select\s+.*\s+from/i,        // SQL Injection
  /['"`;]\s*or\s*['"`;]?\d+/i   // SQL Injection 'or 1=1'
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const userAgent = request.headers.get("user-agent") || "Bilinmeyen";
  const urlWithSearch = path + request.nextUrl.search;
  const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0] || (request as NextRequest & { ip?: string }).ip || "127.0.0.1";

  // WAF and Bot Detection Checks
  let isBlocked = false;
  let blockReason = "";

  // 1. Bot check
  const uaLower = userAgent.toLowerCase();
  for (const botUA of BANNED_USER_AGENTS) {
    if (uaLower.includes(botUA)) {
      isBlocked = true;
      blockReason = `Bot Koruması (${botUA})`;
      break;
    }
  }

  // 2. WAF check (URL and parameters)
  if (!isBlocked) {
    try {
      const decodedUrl = decodeURIComponent(urlWithSearch);
      for (const pattern of WAF_SUSPICIOUS_PATTERNS) {
        if (pattern.test(decodedUrl)) {
          isBlocked = true;
          blockReason = `WAF: Şüpheli İstek (${pattern.source})`;
          break;
        }
      }
    } catch {
      // Handle URL decode errors
      isBlocked = true;
      blockReason = "WAF: Geçersiz URL Kodlaması";
    }
  }

  if (isBlocked) {
    // Log blocked request
    const logUrl = new URL("/api/admin/monitor/log", request.url);
    fetch(logUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "BLOCKED",
        url: `${urlWithSearch} [Engel Nedeni: ${blockReason}]`,
        ip: ipAddress,
        userAgent: userAgent,
      }),
    }).catch(() => {});

    return new NextResponse(
      JSON.stringify({ error: `Erişim Engellendi: Güvenlik Politikası İhlali (${blockReason})` }),
      { 
        status: 403,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // Log incoming successful requests asynchronously to the live request monitor
  const logUrl = new URL("/api/admin/monitor/log", request.url);
  fetch(logUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      method: request.method,
      url: urlWithSearch,
      ip: ipAddress,
      userAgent: userAgent,
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

  const response = NextResponse.next();

  // Apply Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Apply CDN Cache Control policy
  const isPublicRoute = 
    path === "/" || 
    path.startsWith("/products") || 
    path.startsWith("/api/products") || 
    path.startsWith("/api/categories");

  if (isPublicRoute && request.method === "GET") {
    response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=59");
  } else {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/admin/monitor|.*\\.[\\w]+$).*)",
  ],
};
