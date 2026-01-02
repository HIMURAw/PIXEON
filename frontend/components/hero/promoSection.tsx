export default function PromoSection() {
  return (
    <div className="w-85 h-115 px-2 py-1 mt-3 rounded-md overflow-hidden shadow cursor-pointer hover:shadow-md transition-shadow relative">
      <img
        src="/ads/ads.png"
        alt="Reklam Banner"
        className="w-full h-full object-cover rounded-md"
      />

      <div className="absolute inset-0 bg-black/45 flex flex-col justify-end p-3 rounded-md">
        <span className="text-xs uppercase tracking-wide text-white/80">
          Special Offer
        </span>

        <span className="text-white font-bold text-lg leading-tight">
          Only $9.99
        </span>

        <p className="text-white/90 text-xs">
          Limited time deal. Don’t miss it.
        </p>
      </div>
    </div>
  );
}
