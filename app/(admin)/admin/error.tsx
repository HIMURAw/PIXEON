"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { AlertTriangle } from "lucide-react";

export default function AdminError({
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
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-6 text-center rounded-2xl border border-white/10 bg-slate-900/40">
      <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
        <AlertTriangle size={28} />
      </div>
      <h1 className="text-2xl font-bold text-white">Panel hatası</h1>
      <p className="text-slate-400 max-w-md text-sm">
        Bu bölüm yüklenirken beklenmeyen bir hata oluştu. Hata otomatik olarak
        kaydedildi. Sorun devam ederse teknik ekiple iletişime geçin.
      </p>
      {error.digest && (
        <p className="text-xs text-slate-600 font-mono">Hata kodu: {error.digest}</p>
      )}
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
        >
          Tekrar Dene
        </button>
        <Link
          href="/admin/dashboard"
          className="px-5 py-2.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-semibold transition"
        >
          Panele Dön
        </Link>
      </div>
    </div>
  );
}
