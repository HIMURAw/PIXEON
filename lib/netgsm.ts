// NetGSM SMS wrapper, built against NetGSM's long-standing GET-based single-SMS
// API (https://api.netgsm.com.tr/sms/send/get). This is the simplest, most
// stable NetGSM endpoint, but NetGSM also has a newer REST v2 API — re-check
// their current docs before relying on this, since it was written from
// documentation and could not be tested against a real account/credit
// balance/approved sender header (msgheader) here.
//
// Like lib/email.ts, every call gracefully no-ops (with a console warning)
// if NETGSM_* env vars aren't set, so nothing ever breaks because SMS isn't
// configured.

function isNetgsmConfigured(): boolean {
  return !!(process.env.NETGSM_USERCODE && process.env.NETGSM_PASSWORD && process.env.NETGSM_MSGHEADER);
}

// NetGSM's response is plain text, not JSON: a leading numeric code
// (optionally followed by a message id), e.g. "00 1234567890" for success.
// Non-"00"/"01"/"02" codes are documented error codes (20: msgheader
// invalid, 30: auth failed, 40/41: invalid phone, 50/51: message issue,
// 70: invalid parameter, etc.) — re-verify these against current docs too.
const SUCCESS_CODES = ["00", "01", "02"];

function normalizePhone(phone: string): string {
  // NetGSM expects an 11 or 12-digit number without "+", e.g. 90XXXXXXXXXX
  // or 0XXXXXXXXXX. Strip everything but digits and a leading "+".
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("90")) return digits;
  if (digits.startsWith("0")) return `9${digits}`;
  return `90${digits}`;
}

export async function sendSms(phone: string, message: string): Promise<{ success: boolean; skipped?: boolean; error?: string }> {
  if (!isNetgsmConfigured()) {
    console.warn(`[netgsm] SMS provider not configured — skipping SMS to ${phone}. Set NETGSM_* env vars to enable.`);
    return { success: false, skipped: true };
  }

  const params = new URLSearchParams({
    usercode: process.env.NETGSM_USERCODE!,
    password: process.env.NETGSM_PASSWORD!,
    gsmno: normalizePhone(phone),
    message,
    msgheader: process.env.NETGSM_MSGHEADER!,
    dil: "TR",
  });

  try {
    const res = await fetch(`https://api.netgsm.com.tr/sms/send/get?${params.toString()}`);
    const text = (await res.text()).trim();
    const code = text.split(" ")[0];

    if (SUCCESS_CODES.includes(code)) {
      return { success: true };
    }
    return { success: false, error: `NetGSM hata kodu: ${code}` };
  } catch (error) {
    console.error("Error sending SMS via NetGSM:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
