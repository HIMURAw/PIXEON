import { NextRequest, NextResponse } from "next/server";
import { verifyTwoFactorPendingToken } from "@/lib/auth";
import { issueSession } from "@/lib/session";
import { verifyTwoFactorCode } from "@/lib/twofactor";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/rate-limiter";

const verifySchema = z.object({
  tempToken: z.string().min(1),
  code: z.string().min(6).max(6),
});

export async function POST(request: NextRequest) {
  try {
    // Brute-force guard on the 6-digit code, independent of the admin_login limiter.
    const limitResult = await rateLimit(request, "2fa_verify", {
      limit: 8,
      windowMs: 15 * 60 * 1000,
    });
    if (!limitResult.success) {
      return NextResponse.json(
        { success: false, message: `Çok fazla deneme yaptınız. Lütfen ${limitResult.resetSeconds} saniye sonra tekrar deneyin.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Geçersiz istek." }, { status: 400 });
    }

    const userId = await verifyTwoFactorPendingToken(parsed.data.tempToken);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Oturum süresi doldu, lütfen tekrar giriş yapın." },
        { status: 401 }
      );
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json({ success: false, message: "Geçersiz istek." }, { status: 400 });
    }

    if (!verifyTwoFactorCode(parsed.data.code, user.twoFactorSecret)) {
      return NextResponse.json({ success: false, message: "Doğrulama kodu hatalı veya süresi dolmuş." }, { status: 401 });
    }

    const ip = getClientIp(request);
    return await issueSession(user, ip);
  } catch (error) {
    console.error("2FA verification error:", error);
    return NextResponse.json({ success: false, message: "Bir hata oluştu" }, { status: 500 });
  }
}
