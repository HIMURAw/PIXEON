import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// This module is imported by middleware.ts, which runs in the Edge runtime —
// it must not import Node-only modules like "crypto". Web Crypto
// (globalThis.crypto) is available in both the Edge runtime and Node.js.
function randomHex(byteLength: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function resolveSecretKey(): string {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "JWT_SECRET environment variable is required in production. Set it before starting the app."
    );
  }

  // Dev-only fallback: random per-process secret, never usable across restarts or deployments.
  console.warn(
    "[auth] JWT_SECRET is not set — using an ephemeral dev-only secret. Sessions will be invalidated on restart. Set JWT_SECRET in .env for persistent sessions."
  );
  return randomHex(32);
}

const secretKey = resolveSecretKey();
const key = new TextEncoder().encode(secretKey);

// Reused by lib/captcha.ts so both share one secret-resolution policy.
export function getAuthKey() {
  return key;
}

export const SESSION_COOKIE_NAME = "TUGER_session";

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", { expires: new Date(0) });
}

// Short-lived token identifying a login that has passed the password check
// but is waiting on a 2FA code, so the real session cookie isn't issued yet.
export async function createTwoFactorPendingToken(userId: string): Promise<string> {
  return await new SignJWT({ userId, purpose: "2fa-pending" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(key);
}

export async function verifyTwoFactorPendingToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    if (payload.purpose !== "2fa-pending" || typeof payload.userId !== "string") return null;
    return payload.userId;
  } catch {
    return null;
  }
}
