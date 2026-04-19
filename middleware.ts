import { NextRequest, NextResponse } from "next/server";
import { decrypt, SESSION_COOKIE_NAME } from "@/lib/auth";

// Add paths that require authentication
const protectedRoutes = ["/dashboard", "/products", "/hesabim"];
// Add paths that are only accessible to unauthenticated users
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  let session = null;

  if (cookie) {
    try {
      session = await decrypt(cookie);
    } catch (e) {
      // Invalid token
    }
  }

  // Redirect to /login if the user is not authenticated and tries to access a protected route
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Redirect to /dashboard if the user is authenticated and tries to access an auth route
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
