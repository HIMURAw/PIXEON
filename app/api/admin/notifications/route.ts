import { db } from "@/lib/db";
import { notifications, users, pushSubscriptions } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import webpush from "web-push";

webpush.setVapidDetails(
    'mailto:support@pixeon.com',
    'BPDYMAjKVDJeG5yrcEb2GzPs5DJL2707rQPIVWidrCUvGO_Y7kcarwB6Spd_dVtUj9h8y2JYjgBvESP6Fi1EGMQ',
    'R7DgeQk_9yMs2uT30HOiK4NYU8sMZyD6cTXuzBYMKeU'
);

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const allNotifications = await db.select()
            .from(notifications)
            .where(eq(notifications.isRead, false)) // Only unread for the bell
            .orderBy(desc(notifications.createdAt));

        return NextResponse.json({ notifications: allNotifications });
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { title, message, type, link, targetUserId } = await req.json();

        if (!title || !message) {
            return NextResponse.json({ error: "Missing title or message" }, { status: 400 });
        }

        const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        await db.insert(notifications).values({
            id: notificationId,
            userId: targetUserId || null,
            title,
            message,
            type: type || "INFO",
            link: link || null,
            isRead: false,
            createdAt: new Date(),
        });

        // --- WEB PUSH LOGIC ---
        try {
            const subs = await db.select().from(pushSubscriptions);
            const payload = JSON.stringify({ title, body: message, url: link || '/' });
            const pushPromises = subs.map(async (row) => {
                try {
                    const sub = JSON.parse(row.subscription);
                    await webpush.sendNotification(sub, payload);
                } catch (err: any) {
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, row.id));
                    }
                }
            });
            await Promise.all(pushPromises);
        } catch (e) {
            console.error("Push error:", e);
        }

        return NextResponse.json({ success: true, id: notificationId });
    } catch (error) {
        console.error("Send notification error:", error);
        return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getSession();
        if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id, link } = await req.json();
        
        if (id) {
            await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
        } else if (link) {
            // Mark all notifications for a specific link as read (e.g. when visiting a ticket)
            await db.update(notifications).set({ isRead: true }).where(eq(notifications.link, link));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getSession();
        if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const id = req.nextUrl.searchParams.get("id");
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        await db.delete(notifications).where(eq(notifications.id, id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
