import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "scratch", "requests.json");

export async function GET() {
    try {
        let logs = [];
        if (fs.existsSync(LOG_FILE)) {
            try {
                const content = await fs.promises.readFile(LOG_FILE, "utf-8");
                logs = JSON.parse(content);
            } catch {
                // ignore
            }
        }
        return NextResponse.json({ success: true, logs });
    } catch (error) {
        console.error("Monitor read error:", error);
        return NextResponse.json({ error: "Failed to read request logs" }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        if (fs.existsSync(LOG_FILE)) {
            await fs.promises.unlink(LOG_FILE);
        }
        return NextResponse.json({ success: true, logs: [] });
    } catch (error) {
        console.error("Monitor delete error:", error);
        return NextResponse.json({ error: "Failed to clear request logs" }, { status: 500 });
    }
}
