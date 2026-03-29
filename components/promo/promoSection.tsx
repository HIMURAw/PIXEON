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
          Limited Offer
        </span>

        <span className="text-white font-bold text-lg leading-tight">
          Grab it for $9.99
        </span>

        <p className="text-white/90 text-xs leading-snug">
          Fresh picks at an unbeatable price.
          While stocks last.
        </p>
      </div>
    </div>
  );
}
