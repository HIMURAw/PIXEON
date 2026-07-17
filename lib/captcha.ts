import { create } from "svg-captcha";
import { SignJWT, jwtVerify } from "jose";
import { getAuthKey } from "./auth";

const key = getAuthKey();

export async function generateCaptcha() {
  const captcha = create({
    size: 5,
    noise: 2,
    color: true,
    background: "#090d16", // matches the dark theme card bg
  });

  // Encrypt the code with a 5-minute expiration
  const token = await new SignJWT({ code: captcha.text.toLowerCase() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(key);

  return {
    svg: captcha.data,
    token,
  };
}

export async function verifyCaptcha(token: string, answer: string): Promise<boolean> {
  if (!token || !answer) return false;
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    if (!payload || typeof payload !== "object" || !payload.code) {
      return false;
    }

    return payload.code === answer.trim().toLowerCase();
  } catch (error) {
    // Verification failed (e.g. signature mismatch or expired token)
    return false;
  }
}
