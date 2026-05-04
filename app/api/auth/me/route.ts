import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Oturum bulunamadı" },
      { status: 401 }
    );
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!dbUser) {
    return NextResponse.json(
      { success: false, message: "Kullanıcı bulunamadı" },
      { status: 404 }
    );
  }

  // Don't send password
  const { password, ...userWithoutPassword } = dbUser;

  return NextResponse.json({ success: true, user: userWithoutPassword });
}
