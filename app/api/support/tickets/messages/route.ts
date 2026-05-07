import { db } from "@/lib/db";
import { supportMessages, users } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const ticketId = req.nextUrl.searchParams.get("ticketId");
        if (!ticketId) return NextResponse.json({ error: "Missing ticketId" }, { status: 400 });

        // Join messages with users table to get the sender's role
        const messages = await db.select({
            id: supportMessages.id,
            message: supportMessages.message,
            imageUrl: supportMessages.imageUrl,
            senderId: supportMessages.senderId,
            senderRole: users.role, // Get USER or ADMIN role
            createdAt: supportMessages.createdAt,
        })
        .from(supportMessages)
        .leftJoin(users, eq(supportMessages.senderId, users.id))
        .where(eq(supportMessages.ticketId, ticketId))
        .orderBy(asc(supportMessages.createdAt));

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Messages API error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
