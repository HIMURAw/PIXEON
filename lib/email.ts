import nodemailer from "nodemailer";

// Every function here is best-effort: if SMTP isn't configured (the default
// until real credentials are set), calls no-op with a console warning instead
// of throwing, so nothing in the checkout/support flow ever breaks because an
// email couldn't be sent.

function isEmailConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!isEmailConfigured()) return null;
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return cachedTransporter;
}

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<{ success: boolean; skipped?: boolean; error?: string }> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(`[email] SMTP not configured — skipping email to ${to} ("${subject}"). Set SMTP_* env vars to enable.`);
    return { success: false, skipped: true };
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

const EMAIL_WRAPPER = (title: string, bodyHtml: string) => `
  <div style="font-family:system-ui,-apple-system,sans-serif;background:#020617;padding:32px 16px;">
    <div style="max-width:520px;margin:0 auto;background:#0b1220;border-radius:24px;padding:32px;color:#e2e8f0;">
      <h1 style="color:#fff;font-size:20px;margin:0 0 24px;">${title}</h1>
      ${bodyHtml}
      <p style="margin-top:32px;color:#64748b;font-size:11px;">PIXEON — bu e-posta otomatik olarak gönderilmiştir.</p>
    </div>
  </div>
`;

interface OrderConfirmationData {
  orderNumber: string;
  totalAmount: number;
  items: { name: string; quantity: number; price: number }[];
}

export async function sendOrderConfirmationEmail(to: string, data: OrderConfirmationData) {
  const itemsHtml = data.items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;color:#cbd5e1;">${item.name}</td><td style="padding:8px 0;color:#64748b;text-align:center;">x${item.quantity}</td><td style="padding:8px 0;color:#fff;text-align:right;">₺${item.price.toLocaleString("tr-TR")}</td></tr>`
    )
    .join("");

  const html = EMAIL_WRAPPER(
    "Siparişiniz Alındı 🎉",
    `
      <p style="color:#94a3b8;">Sipariş numaranız: <strong style="color:#fff;">${data.orderNumber}</strong></p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;border-top:1px solid rgba(255,255,255,0.08);">
        ${itemsHtml}
      </table>
      <div style="border-top:1px solid rgba(255,255,255,0.08);margin-top:12px;padding-top:12px;display:flex;justify-content:space-between;">
        <strong style="color:#fff;">Toplam</strong>
        <strong style="color:#fff;">₺${data.totalAmount.toLocaleString("tr-TR")}</strong>
      </div>
    `
  );

  return sendEmail({ to, subject: `Siparişiniz Alındı - ${data.orderNumber}`, html });
}

export async function sendSupportTicketUpdateEmail(to: string, data: { subject: string; message: string }) {
  const html = EMAIL_WRAPPER(
    "Destek Talebinize Yanıt Geldi",
    `<p style="color:#94a3b8;">Konu: <strong style="color:#fff;">${data.subject}</strong></p>
     <p style="color:#cbd5e1;margin-top:12px;">${data.message}</p>`
  );
  return sendEmail({ to, subject: `Destek Talebiniz Güncellendi: ${data.subject}`, html });
}
