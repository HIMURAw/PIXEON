import Link from "next/link";

export default function PublicNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-sm font-semibold tracking-widest text-blue-500">404</span>
      <h1 className="text-3xl font-bold text-white">Sayfa bulunamadı</h1>
      <p className="text-slate-400 max-w-md">
        Aradığınız sayfa kaldırılmış, taşınmış ya da hiç var olmamış olabilir.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
