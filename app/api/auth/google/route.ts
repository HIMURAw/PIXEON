import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { isGoogleOAuthConfigured, getGoogleAuthUrl } from "@/lib/google-oauth";

const STATE_COOKIE = "google_oauth_state";

export async function GET(request: NextRequest) {
  if (!isGoogleOAuthConfigured()) {
    return NextResponse.redirect(new URL("/login?error=google_not_configured", request.url));
  }

  const state = randomBytes(16).toString("hex");
  const redirectUri = new URL("/api/auth/google/callback", request.url).toString();
  const authUrl = getGoogleAuthUrl(state, redirectUri);

  const response = NextResponse.redirect(authUrl);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    maxAge: 600,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}
