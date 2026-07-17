import { authenticator } from "otplib";
import QRCode from "qrcode";

// Allow 1 time-step (±30s) of clock drift between server and authenticator app.
authenticator.options = { window: 1 };

export function generateTwoFactorSecret(): string {
  return authenticator.generateSecret();
}

export function getTwoFactorKeyUri(email: string, secret: string): string {
  return authenticator.keyuri(email, "PIXEON", secret);
}

export function getTwoFactorQrDataUrl(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl);
}

export function verifyTwoFactorCode(code: string, secret: string): boolean {
  try {
    return authenticator.check(code.trim(), secret);
  } catch {
    return false;
  }
}
