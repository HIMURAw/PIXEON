import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create directory if not exists
        const uploadDir = path.join(process.cwd(), "public", "uploads", "support");
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {}

        // Unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);

        return NextResponse.json({ 
            success: true, 
            url: `/uploads/support/${filename}` 
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Yükleme başarısız" }, { status: 500 });
    }
}
