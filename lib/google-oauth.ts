import { jwtVerify, createRemoteJWKSet } from "jose";

// Standard Google OAuth 2.0 Authorization Code flow + ID token verification
// via Google's published JWKS, per Google's own documented approach
// (https://developers.google.com/identity/openid-connect/openid-connect).

const GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

export function isGoogleOAuthConfigured(): boolean {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function getGoogleAuthUrl(state: string, redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForIdToken(code: string, redirectUri: string): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }).toString(),
  });

  if (!res.ok) {
    throw new Error(`Google token exchange failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  if (!data.id_token) throw new Error("Google token response missing id_token");
  return data.id_token;
}

export interface GoogleProfile {
  email: string;
  emailVerified: boolean;
  name: string;
  picture?: string;
  sub: string;
}

export async function verifyGoogleIdToken(idToken: string): Promise<GoogleProfile> {
  const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  if (typeof payload.email !== "string" || typeof payload.sub !== "string") {
    throw new Error("Invalid Google ID token payload");
  }

  return {
    email: payload.email,
    emailVerified: payload.email_verified === true,
    name: typeof payload.name === "string" ? payload.name : payload.email.split("@")[0],
    picture: typeof payload.picture === "string" ? payload.picture : undefined,
    sub: payload.sub,
  };
}
