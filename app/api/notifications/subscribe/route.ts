import { db } from "@/lib/db";
import { pushSubscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        const { subscription } = await req.json();

        if (!subscription) {
            return NextResponse.json({ error: "Missing subscription" }, { status: 400 });
        }

        const subString = JSON.stringify(subscription);
        const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Check if subscription already exists to avoid duplicates
        // (In a real app, you might want to match by endpoint)
        
        await db.insert(pushSubscriptions).values({
            id,
            userId: session?.user?.id || null,
            subscription: subString,
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Subscription error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
