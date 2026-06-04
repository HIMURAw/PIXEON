import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "scratch", "requests.json");

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { method, url, ip, userAgent } = body;

        // Ensure scratch directory exists
        const scratchDir = path.dirname(LOG_FILE);
        if (!fs.existsSync(scratchDir)) {
            await fs.promises.mkdir(scratchDir, { recursive: true });
        }

        let logs = [];
        if (fs.existsSync(LOG_FILE)) {
            try {
                const content = await fs.promises.readFile(LOG_FILE, "utf-8");
                logs = JSON.parse(content);
            } catch (e) {
                // ignore invalid JSON
            }
        }

        const newLog = {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: new Date().toISOString(),
            method: method || "GET",
            url: url || "/",
            ip: ip || "127.0.0.1",
            userAgent: userAgent || "Bilinmeyen",
        };

        logs.unshift(newLog);
        if (logs.length > 50) {
            logs = logs.slice(0, 50);
        }

        await fs.promises.writeFile(LOG_FILE, JSON.stringify(logs, null, 2), "utf-8");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Monitor log error:", error);
        return NextResponse.json({ error: "Failed to log request" }, { status: 500 });
    }
}
