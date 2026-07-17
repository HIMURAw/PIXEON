"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

// This replaces the entire root layout when an error escapes every other
// error boundary, so it must render its own <html>/<body> and avoid
// depending on context providers that may themselves have crashed.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          textAlign: "center",
          padding: "24px",
          background: "#020617",
          color: "#e2e8f0",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: 0 }}>
          Beklenmeyen bir hata oluştu
        </h1>
        <p style={{ color: "#94a3b8", maxWidth: 420, margin: 0 }}>
          Uygulama kritik bir hatayla karşılaştı. Bu hata otomatik olarak
          kaydedildi.
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: "10px 24px",
            borderRadius: 999,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Tekrar Dene
        </button>
      </body>
    </html>
  );
}
