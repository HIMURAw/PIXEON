import { db } from "@/lib/db";
import { supportTickets, supportMessages, users } from "@/lib/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
    try {
        const ticketId = req.nextUrl.searchParams.get("ticketId");

        if (ticketId) {
            const messages = await db.select({
                id: supportMessages.id,
                message: supportMessages.message,
                imageUrl: supportMessages.imageUrl,
                senderId: supportMessages.senderId,
                senderName: users.name,
                role: users.role,
                createdAt: supportMessages.createdAt,
            })
            .from(supportMessages)
            .leftJoin(users, eq(supportMessages.senderId, users.id))
            .where(eq(supportMessages.ticketId, ticketId))
            .orderBy(asc(supportMessages.createdAt));

            return NextResponse.json({ messages });
        } else {
            const tickets = await db.select({
                id: supportTickets.id,
                subject: supportTickets.subject,
                category: supportTickets.category,
                priority: supportTickets.priority,
                status: supportTickets.status,
                userName: users.name,
                createdAt: supportTickets.createdAt,
            })
            .from(supportTickets)
            .leftJoin(users, eq(supportTickets.userId, users.id))
            .orderBy(desc(supportTickets.createdAt));

            return NextResponse.json({ tickets });
        }
    } catch (error) {
        console.error("Admin tickets error:", error);
        return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { ticketId, message } = await req.json();
        const session = await getSession();

        if (!ticketId || !message || !session?.user) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newMessageId = `msg_admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        await db.insert(supportMessages).values({
            id: newMessageId,
            ticketId,
            senderId: session.user.id,
            message,
            createdAt: new Date(),
        });

        await db.update(supportTickets)
            .set({ status: "IN_PROGRESS", updatedAt: new Date() })
            .where(eq(supportTickets.id, ticketId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin ticket response error:", error);
        return NextResponse.json({ error: "Failed to send response" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { ticketId, status } = await req.json();
        
        if (!ticketId || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await db.update(supportTickets)
            .set({ status, updatedAt: new Date() })
            .where(eq(supportTickets.id, ticketId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin ticket update error:", error);
        return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const ticketId = req.nextUrl.searchParams.get("ticketId");
        if (!ticketId) return NextResponse.json({ error: "Missing ticketId" }, { status: 400 });

        // 1. Get all messages to delete files
        const messages = await db.select({ imageUrl: supportMessages.imageUrl })
            .from(supportMessages)
            .where(eq(supportMessages.ticketId, ticketId));

        for (const msg of messages) {
            if (msg.imageUrl && msg.imageUrl.startsWith("/uploads/")) {
                try {
                    const filePath = path.join(process.cwd(), "public", msg.imageUrl);
                    await fs.unlink(filePath);
                } catch (err) {
                    console.error("File deletion error:", err);
                }
            }
        }

        // 2. Delete from DB
        await db.delete(supportMessages).where(eq(supportMessages.ticketId, ticketId));
        await db.delete(supportTickets).where(eq(supportTickets.id, ticketId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin ticket delete error:", error);
        return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 });
    }
}
