import { NextResponse } from "next/server";
import { generateCaptcha } from "@/lib/captcha";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { svg, token } = await generateCaptcha();
    return NextResponse.json({
      success: true,
      captchaSvg: svg,
      captchaToken: token,
    });
  } catch (error) {
    console.error("Captcha generation error:", error);
    return NextResponse.json(
      { success: false, message: "Güvenlik kodu oluşturulamadı" },
      { status: 500 }
    );
  }
}
