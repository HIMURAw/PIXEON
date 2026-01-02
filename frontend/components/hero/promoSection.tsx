export default function PromoSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-3 mt-4 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300 relative">
      <img
        src="/ads/ads.png"
        alt="Reklam Banner"
        className="w-full h-20 object-cover rounded-md"
      />
      {/* Overlay: fiyat ve açıklama */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center px-4 rounded-md">
        <span className="text-white font-bold text-lg">$9.99</span>
        <p className="text-white text-sm">Limited time offer! Don’t miss out.</p>
      </div>
    </div>
  );
}
