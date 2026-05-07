import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// In a real app, you should verify admin session here
export async function POST(req: NextRequest) {
    try {
        const { enabled } = await req.json();

        await db.insert(settings)
            .values({
                key: "live_support_enabled",
                value: enabled ? "true" : "false",
            })
            .onDuplicateKeyUpdate({
                set: { value: enabled ? "true" : "false" },
            });

        return NextResponse.json({ success: true, enabled });
    } catch (error) {
        console.error("Admin support status update error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function GET() {
    try {
        const result = await db.query.settings.findFirst({
            where: eq(settings.key, "live_support_enabled"),
        });

        const isEnabled = result?.value === "true";

        return NextResponse.json({ isEnabled });
    } catch (error) {
        return NextResponse.json({ isEnabled: false });
    }
}
