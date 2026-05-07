import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, or, isNull, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        
        // Fetch global notifications (userId is null) 
        // and user-specific notifications if logged in
        const userNotifications = await db.select()
            .from(notifications)
            .where(
                session?.user?.id 
                ? or(isNull(notifications.userId), eq(notifications.userId, session.user.id))
                : isNull(notifications.userId)
            )
            .orderBy(desc(notifications.createdAt))
            .limit(10);

        return NextResponse.json({ notifications: userNotifications });
    } catch (error) {
        console.error("Fetch notifications error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// Mark as read API
export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        await db.update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
