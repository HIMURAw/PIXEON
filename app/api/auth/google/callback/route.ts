import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomUUID, randomBytes } from "crypto";
import { exchangeCodeForIdToken, verifyGoogleIdToken } from "@/lib/google-oauth";
import { issueSessionRedirect } from "@/lib/session";
import { getClientIp } from "@/lib/rate-limiter";

const STATE_COOKIE = "google_oauth_state";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const cookieState = request.cookies.get(STATE_COOKIE)?.value;

  const failRedirect = new URL("/login?error=google_auth_failed", request.url);

  // CSRF guard: the state we handed out in /api/auth/google must round-trip unchanged.
  if (!code || !state || !cookieState || state !== cookieState) {
    const res = NextResponse.redirect(failRedirect);
    res.cookies.delete(STATE_COOKIE);
    return res;
  }

  try {
    const redirectUri = new URL("/api/auth/google/callback", request.url).toString();
    const idToken = await exchangeCodeForIdToken(code, redirectUri);
    const profile = await verifyGoogleIdToken(idToken);

    // Only trust Google-verified emails to auto-link/create an account.
    if (!profile.emailVerified) {
      const res = NextResponse.redirect(failRedirect);
      res.cookies.delete(STATE_COOKIE);
      return res;
    }

    let [user] = await db.select().from(users).where(eq(users.email, profile.email)).limit(1);

    if (!user) {
      // No password login is possible for this account — store an unusable
      // random hash rather than leaving the NOT NULL column empty.
      const unusablePassword = await bcrypt.hash(randomBytes(32).toString("hex"), 10);
      const newUserId = randomUUID();
      await db.insert(users).values({
        id: newUserId,
        name: profile.name,
        email: profile.email,
        password: unusablePassword,
        role: "USER",
        image: profile.picture || null,
      });
      [user] = await db.select().from(users).where(eq(users.id, newUserId)).limit(1);
    }

    const ip = getClientIp(request);
    const destination = new URL(user.role === "ADMIN" ? "/admin/dashboard" : "/", request.url);
    const response = await issueSessionRedirect(user, ip, destination);
    response.cookies.delete(STATE_COOKIE);
    return response;
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    const res = NextResponse.redirect(failRedirect);
    res.cookies.delete(STATE_COOKIE);
    return res;
  }
}
