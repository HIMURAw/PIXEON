export default function PromoVerticalSmall() {
    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4">
                <span className="text-xs text-blue-400 font-bold">
                    PlayStation Plus
                </span>

                <h3 className="text-base font-semibold mt-1 text-white">
                    Sınırsız Eğlenceyi <br />
                    <span className="font-bold">Keşfet</span>
                </h3>

                <p className="text-[10px] mt-2 text-gray-400 uppercase tracking-tighter">
                    Aylık Oyunlar ve Çok Oyunculu Mod
                </p>

                <span className="text-xl font-bold text-white">
                    270 ₺'den başlayan fiyatlarla
                </span>
            </div>

            <div className="relative">
                <img
                    src="/products/psplus-card.png"
                    alt="PS Plus"
                    className="w-full h-40 object-contain bg-slate-900"
                />

                <button className="cursor-pointer absolute bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1.5 rounded-full hover:bg-blue-700 transition font-bold">
                    Üye Ol
                </button>
            </div>
        </div>
    );
}
