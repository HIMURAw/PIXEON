import { db } from "@/lib/db";
import { supportMessages, supportTickets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { ticketId, message } = await req.json();
        if (!ticketId || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

        const msgId = `msg_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        await db.insert(supportMessages).values({
            id: msgId,
            ticketId,
            senderId: session.user.id,
            message,
            createdAt: new Date(),
        });

        // Set status back to OPEN when user replies (so admin sees it as active)
        await db.update(supportTickets)
            .set({ status: "OPEN", updatedAt: new Date() })
            .where(eq(supportTickets.id, ticketId));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
