import { db } from "@/lib/db";
import { liveChatMessages } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get("sessionId");
    if (!sessionId) return NextResponse.json({ messages: [] });

    try {
        const messages = await db.query.liveChatMessages.findMany({
            where: eq(liveChatMessages.sessionId, sessionId),
            orderBy: [asc(liveChatMessages.createdAt)],
        });

        return NextResponse.json({ messages });
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
            createdAt: new Date(),
        };

        await db.insert(liveChatMessages).values(newMessage);

        return NextResponse.json({ success: true, message: newMessage });
    } catch (error) {
        console.error("Chat message error:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
