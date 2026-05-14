import { db } from "@/lib/db";
import { liveChatMessages, notifications } from "@/lib/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get("sessionId");
    if (!sessionId) return NextResponse.json({ messages: [], status: "ACTIVE" });

    try {
        const messages = await db.query.liveChatMessages.findMany({
            where: eq(liveChatMessages.sessionId, sessionId),
            orderBy: [asc(liveChatMessages.createdAt)],
        });

        // Get the current status from the latest message or any message in the session
        const lastMessage = await db.query.liveChatMessages.findFirst({
            where: eq(liveChatMessages.sessionId, sessionId),
            orderBy: [desc(liveChatMessages.createdAt)],
        });

        return NextResponse.json({ 
            messages, 
            status: lastMessage?.status || "ACTIVE" 
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { sessionId, message, senderName, imageUrl } = await req.json();

        if (!sessionId || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            sessionId,
            senderName: senderName || "Kullanıcı",
            senderRole: "USER" as const,
            message,
            imageUrl: imageUrl || null,
            status: "ACTIVE" as const,
            createdAt: new Date(),
        };

        await db.insert(liveChatMessages).values(newMessage);

        // Create Notification for Admins
        await db.insert(notifications).values({
            id: `notif_chat_${Date.now()}`,
            title: "Yeni Sohbet Mesajı",
            message: `${senderName || "Bir kullanıcı"}: ${message.substring(0, 50)}${message.length > 50 ? "..." : ""}`,
            link: "/admin/support",
            type: "INFO",
            isRead: false,
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, message: newMessage });
    } catch (error) {
        console.error("Chat message error:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
