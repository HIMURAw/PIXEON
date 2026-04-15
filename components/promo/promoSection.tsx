export default function PromoSection() {
  return (
    <div className="w-full h-[680px] px-2 py-1 mt-3 rounded-md overflow-hidden shadow cursor-pointer hover:shadow-md transition-shadow relative">
      <img
        src="/products/ps-vr2.png"
        alt="PS VR2"
        className="w-full h-full object-cover rounded-md"
      />

      <div className="absolute inset-0 bg-black/45 flex flex-col justify-end p-3 rounded-md">
        <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">
          YENİ DÜNYALARI KEŞFET
        </span>

        <span className="text-white font-bold text-lg leading-tight">
          PlayStation VR2 Deneyimi
        </span>

        <p className="text-white/90 text-[10px] leading-snug">
          4K HDR görseller ve duyusal özelliklerle yeni nesil VR oyunlarını keşfedin.
        </p>
      </div>
    </div>
  );
}
