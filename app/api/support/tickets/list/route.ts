import { db } from "@/lib/db";
import { supportTickets } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const tickets = await db.select()
            .from(supportTickets)
            .where(eq(supportTickets.userId, session.user.id))
            .orderBy(desc(supportTickets.createdAt));

        return NextResponse.json({ tickets });
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
