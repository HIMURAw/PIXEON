"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

export default function PublicError({
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
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold text-white">Bir şeyler ters gitti</h1>
      <p className="text-slate-400 max-w-md">
        Sayfa yüklenirken beklenmeyen bir hata oluştu. Sorun devam ederse lütfen
        destek ekibimizle iletişime geçin.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
        >
          Tekrar Dene
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-semibold transition"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
