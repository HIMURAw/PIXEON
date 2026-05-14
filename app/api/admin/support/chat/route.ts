import { db } from "@/lib/db";
import { liveChatMessages } from "@/lib/db/schema";
import { eq, asc, desc, sql, and, isNotNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { unlink } from "fs/promises";
import path from "path";

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
            // Get all unique sessions with latest message and status
            // Using a more robust SQL approach to avoid ONLY_FULL_GROUP_BY issues
            const sessions = await db.execute(sql`
                SELECT 
                    m1.session_id as sessionId, 
                    m1.sender_name as senderName, 
                    m1.message as lastMessage, 
                    m1.created_at as createdAt, 
                    m1.status as status,
                    (SELECT COUNT(*) FROM live_chat_messages m2 
                     WHERE m2.session_id = m1.session_id 
                     AND m2.is_read = false 
                     AND m2.sender_role = 'USER') as unreadCount
                FROM live_chat_messages m1
                WHERE m1.id IN (
                    SELECT MAX(id) 
                    FROM live_chat_messages 
                    GROUP BY session_id
                )
                ORDER BY m1.created_at DESC
            `);

            // db.execute returns a raw result, formatting it for the frontend
            return NextResponse.json({ sessions: sessions[0] });
        }
    } catch (error) {
        console.error("Admin chat error:", error);
        return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { sessionId, message, imageUrl } = await req.json();
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
            imageUrl: imageUrl || null,
            status: "ACTIVE" as const,
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

export async function PUT(req: NextRequest) {
    try {
        const { sessionId, status } = await req.json();
        if (!sessionId || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

        await db.update(liveChatMessages)
            .set({ status })
            .where(eq(liveChatMessages.sessionId, sessionId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update session status error:", error);
        return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const sessionId = req.nextUrl.searchParams.get("sessionId");
        if (!sessionId) return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });

        // 1. Find all messages with images in this session
        const messagesWithImages = await db.query.liveChatMessages.findMany({
            where: and(
                eq(liveChatMessages.sessionId, sessionId),
                isNotNull(liveChatMessages.imageUrl)
            )
        });

        // 2. Delete files from disk
        for (const msg of messagesWithImages) {
            if (msg.imageUrl) {
                try {
                    const filePath = path.join(process.cwd(), "public", msg.imageUrl);
                    await unlink(filePath);
                } catch (e) {
                    console.error("Failed to delete file:", msg.imageUrl, e);
                }
            }
        }

        // 3. Delete messages from DB
        await db.delete(liveChatMessages).where(eq(liveChatMessages.sessionId, sessionId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete session error:", error);
        return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
    }
}
