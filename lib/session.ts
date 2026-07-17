import { NextResponse } from "next/server";
import { encrypt, SESSION_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminLogs } from "@/lib/db/schema";
import { randomUUID } from "crypto";

// Not imported by middleware.ts (which runs on the Edge runtime), so it's
// safe to pull in the mysql2-backed db client here.
interface SessionSourceUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

// Shared by issueSession (JSON response, used by password + 2FA login) and
// the Google OAuth callback (redirect response) so both log the admin login
// and sign the session cookie the same way without duplicating that logic.
async function buildSession(user: SessionSourceUser, ip: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const sessionUser = { id: user.id, email: user.email, name: user.name, role: user.role };

  if (user.role === "ADMIN") {
    try {
      await db.insert(adminLogs).values({
        id: randomUUID(),
        adminId: user.id,
        adminName: user.name || "Bilinmeyen",
        action: "Giriş Yapıldı",
        details: "Yönetici başarılı bir şekilde sisteme giriş yaptı.",
        ipAddress: ip,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error("Error creating login admin log:", err);
    }
  }

  const session = await encrypt({ user: sessionUser, expires });
  return { sessionUser, session, expires };
}

function setSessionCookie(response: NextResponse, session: string, expires: Date) {
  response.cookies.set(SESSION_COOKIE_NAME, session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return response;
}

export async function issueSession(user: SessionSourceUser, ip: string) {
  const { sessionUser, session, expires } = await buildSession(user, ip);
  const response = NextResponse.json({ success: true, user: sessionUser });
  return setSessionCookie(response, session, expires);
}

// For flows that need to redirect (e.g. OAuth callbacks) instead of
// returning JSON.
export async function issueSessionRedirect(user: SessionSourceUser, ip: string, redirectUrl: string | URL) {
  const { session, expires } = await buildSession(user, ip);
  const response = NextResponse.redirect(redirectUrl);
  return setSessionCookie(response, session, expires);
}
