"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

export default function AuthError({
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
    <div className="flex flex-col items-center gap-4 text-center">
      <h1 className="text-2xl font-bold text-white">Bir şeyler ters gitti</h1>
      <p className="text-slate-400 text-sm max-w-sm">
        Giriş ekranı yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
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
          Ana Sayfa
        </Link>
      </div>
    </div>
  );
}
