import { db } from "@/lib/db";
import { supportTickets, supportMessages } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { subject, category, priority, message } = await req.json();

        if (!subject || !message || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // 1. Create Ticket
        await db.insert(supportTickets).values({
            id: ticketId,
            userId: session.user.id,
            subject,
            category,
            priority: priority || "LOW",
            status: "OPEN",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // 2. Create Initial Message
        await db.insert(supportMessages).values({
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ticketId: ticketId,
            senderId: session.user.id,
            message: message,
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, ticketId });
    } catch (error) {
        console.error("Create ticket error:", error);
        return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
    }
}
