import { db } from "@/lib/db";
import { liveChatMessages } from "@/lib/db/schema";
import { eq, asc, desc, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get("sessionId");

    try {
        if (sessionId) {
            // Get messages for a specific session
            const messages = await db.query.liveChatMessages.findMany({
                where: eq(liveChatMessages.sessionId, sessionId),
                orderBy: [asc(liveChatMessages.createdAt)],
            });
            return NextResponse.json({ messages });
        } else {
            // Get all unique sessions with latest message
            const sessions = await db.select({
                sessionId: liveChatMessages.sessionId,
                senderName: liveChatMessages.senderName,
                lastMessage: liveChatMessages.message,
                createdAt: liveChatMessages.createdAt,
                unreadCount: sql<number>`count(case when ${liveChatMessages.isRead} = false and ${liveChatMessages.senderRole} = 'USER' then 1 end)`,
            })
            .from(liveChatMessages)
            .groupBy(liveChatMessages.sessionId)
            .orderBy(desc(liveChatMessages.createdAt));

            return NextResponse.json({ sessions });
        }
    } catch (error) {
        console.error("Admin chat error:", error);
        return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { sessionId, message } = await req.json();
        const session = await getSession();

        if (!sessionId || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newMessage = {
            id: `msg_admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            sessionId,
            senderName: session?.user?.name || "Destek Ekibi",
            senderImage: session?.user?.image || null,
            senderRole: "ADMIN" as const,
            message,
            createdAt: new Date(),
        };

        await db.insert(liveChatMessages).values(newMessage);

        // Mark messages as read
        await db.update(liveChatMessages)
            .set({ isRead: true })
            .where(eq(liveChatMessages.sessionId, sessionId));

        return NextResponse.json({ success: true, message: newMessage });
    } catch (error) {
        console.error("Admin response error:", error);
        return NextResponse.json({ error: "Failed to send admin response" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const sessionId = req.nextUrl.searchParams.get("sessionId");
        if (!sessionId) return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });

        await db.delete(liveChatMessages).where(eq(liveChatMessages.sessionId, sessionId));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
    }
}
