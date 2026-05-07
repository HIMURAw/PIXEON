import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await db.query.settings.findFirst({
            where: eq(settings.key, "live_support_enabled"),
        });

        const isEnabled = result?.value === "true";

        return NextResponse.json({ isEnabled });
    } catch (error) {
        console.error("Support status error:", error);
        return NextResponse.json({ isEnabled: false });
    }
}
