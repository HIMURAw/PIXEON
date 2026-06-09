import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
        }

        // Validate MIME type
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json({ error: "Geçersiz dosya tipi. Sadece resim dosyaları yüklenebilir." }, { status: 400 });
        }

        // Validate extension
        const ext = path.extname(file.name).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return NextResponse.json({ error: "Geçersiz dosya uzantısı. Sadece resim dosyaları yüklenebilir." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create directory if not exists
        const uploadDir = path.join(process.cwd(), "public", "uploads", "support");
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch {
            // ignore
        }

        // Generate a completely safe, random filename (UUID)
        const filename = `${randomUUID()}${ext}`;
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
