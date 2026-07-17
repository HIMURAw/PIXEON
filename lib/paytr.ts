import { createHmac, timingSafeEqual } from "crypto";

// PayTR iFrame API wrapper, built against PayTR's publicly documented iFrame
// API contract (merchant_id/merchant_key/merchant_salt, HMAC-SHA256 token,
// base64 user_basket, server-to-server callback with its own hash).
//
// IMPORTANT: this has NOT been tested against a real PayTR merchant account —
// there was no sandbox credential available while building it. Before relying
// on this in production:
//   1. Get PAYTR_MERCHANT_ID / PAYTR_MERCHANT_KEY / PAYTR_MERCHANT_SALT from
//      the PayTR merchant panel (start in test mode).
//   2. Re-verify every field name/order against PayTR's current docs — payment
//      gateway APIs change, and this was written from documentation, not a
//      live integration test.
//   3. Wire callInitPaytrPayment() into the checkout flow (see the comment
//      near the bottom of this file) and test a full payment in PAYTR_TEST_MODE.
//   4. Point the merchant panel's bildirim/notification URL at
//      /api/payment/paytr/callback.

export function isPaytrConfigured(): boolean {
  return !!(process.env.PAYTR_MERCHANT_ID && process.env.PAYTR_MERCHANT_KEY && process.env.PAYTR_MERCHANT_SALT);
}

interface PaytrBasketItem {
  name: string;
  price: number; // TL, not kuruş
  quantity: number;
}

interface GetPaytrTokenParams {
  merchantOid: string; // must be unique, alphanumeric only per PayTR's rules
  email: string;
  amountTl: number; // total order amount in TL
  userIp: string;
  userName: string;
  userAddress: string;
  userPhone: string;
  basket: PaytrBasketItem[];
  okUrl: string;
  failUrl: string;
}

export async function getPaytrIframeToken(params: GetPaytrTokenParams): Promise<{ success: true; token: string } | { success: false; error: string }> {
  const merchantId = process.env.PAYTR_MERCHANT_ID!;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY!;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT!;
  const testMode = process.env.PAYTR_TEST_MODE === "true" ? "1" : "0";

  const paymentAmountKurus = Math.round(params.amountTl * 100);
  const userBasketJson = JSON.stringify(params.basket.map((item) => [item.name, item.price.toFixed(2), item.quantity]));
  const userBasketBase64 = Buffer.from(userBasketJson).toString("base64");

  const noInstallment = "0";
  const maxInstallment = "0";
  const currency = "TL";

  const hashStr =
    merchantId + params.userIp + params.merchantOid + params.email + paymentAmountKurus +
    userBasketBase64 + noInstallment + maxInstallment + currency + testMode;

  const paytrToken = createHmac("sha256", merchantKey)
    .update(hashStr + merchantSalt)
    .digest("base64");

  const body = new URLSearchParams({
    merchant_id: merchantId,
    user_ip: params.userIp,
    merchant_oid: params.merchantOid,
    email: params.email,
    payment_amount: String(paymentAmountKurus),
    payment_type: "card",
    installment_count: "0",
    currency,
    test_mode: testMode,
    non_3d: "0",
    merchant_ok_url: params.okUrl,
    merchant_fail_url: params.failUrl,
    user_name: params.userName,
    user_address: params.userAddress,
    user_phone: params.userPhone,
    user_basket: userBasketBase64,
    debug_on: process.env.NODE_ENV === "production" ? "0" : "1",
    no_installment: noInstallment,
    max_installment: maxInstallment,
    lang: "tr",
    timeout_limit: "30",
    paytr_token: paytrToken,
  });

  const res = await fetch("https://www.paytr.com/odeme/api/get-token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const data = await res.json();
  if (data.status === "success") {
    return { success: true, token: data.token };
  }
  return { success: false, error: data.reason || "PayTR token alınamadı." };
}

// Verifies the server-to-server callback PayTR sends after a payment attempt.
// PayTR expects the literal text "OK" as the response body — anything else
// causes it to retry the callback repeatedly.
export function verifyPaytrCallback(params: { merchantOid: string; status: string; totalAmount: string; hash: string }): boolean {
  const merchantKey = process.env.PAYTR_MERCHANT_KEY!;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT!;

  const hashStr = params.merchantOid + merchantSalt + params.status + params.totalAmount;
  const expectedHash = createHmac("sha256", merchantKey).update(hashStr).digest("base64");

  const expected = Buffer.from(expectedHash);
  const received = Buffer.from(params.hash);
  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}

/*
 * How to finish wiring this into checkout (app/(public)/odeme/page.tsx):
 *
 * 1. Create the order first with a new "PayTR" paymentMethod branch in
 *    order-actions.ts createOrder — insert it with status PENDING /
 *    paymentStatus PENDING (do NOT mark it paid yet, unlike the current
 *    Credit Card mock).
 * 2. Call a new POST /api/payment/paytr/init route with the created
 *    order's id; it should call getPaytrIframeToken() with that order's
 *    real total/items and return the token.
 * 3. Render `<iframe src={`https://www.paytr.com/odeme/guvenli/${token}`} />`
 *    instead of (or alongside, behind isPaytrConfigured()) the current mock
 *    card form.
 * 4. On successful payment, PayTR calls merchant_ok_url (the return page you
 *    build) AND independently POSTs to merchant's notification URL — build
 *    that as app/api/payment/paytr/callback/route.ts: parse the
 *    x-www-form-urlencoded body, call verifyPaytrCallback(), update the
 *    order's paymentStatus/status/transactions accordingly, and respond with
 *    the literal text "OK".
 */
