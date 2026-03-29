export default function PromoSection() {
  return (
    <div className="w-full h-[680px] px-2 py-1 mt-3 rounded-md overflow-hidden shadow cursor-pointer hover:shadow-md transition-shadow relative">
      <img
        src="/ads/alina-rubo-HjO5vw_PP5c-unsplash.jpg"
        alt="Reklam Banner"
        className="w-full h-full object-cover rounded-md"
      />

      <div className="absolute inset-0 bg-black/45 flex flex-col justify-end p-3 rounded-md">
        <span className="text-xs uppercase tracking-wider text-white/80">
          Sınırlı Teklif
        </span>

        <span className="text-white font-bold text-lg leading-tight">
          9.99 ₺'ye Hemen Al
        </span>

        <p className="text-white/90 text-xs leading-snug">
          Eşsiz fiyatlarla taze ürünler.
          Stoklarla sınırlıdır.
        </p>
      </div>
    </div>
  );
}
