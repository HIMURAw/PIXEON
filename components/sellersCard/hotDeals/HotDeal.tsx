export default function HotDeal() {
    return (
        <div className="border border-red-400 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                    Haftanın <span className="text-red-500">Fırsat Ürünü</span>
                </h3>

                <button className="cursor-pointer hover:text-black text-sm border px-4 py-1 rounded-full">
                    Tümünü Gör →
                </button>
            </div>

            <div className="flex gap-6 items-center">
                <div className="relative">
                    <span className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                        %10 FIRSAT
                    </span>
                    <img src="/products/ps5-digital.png" className="w-28 h-28 object-contain" />
                </div>

                <div className="flex-1 space-y-2">
                    <h4 className="font-bold text-white">
                        PlayStation 5 Slim Dijital Sürüm + 2. Kollu Paket
                    </h4>

                    <div>
                        <span className="line-through text-gray-400 mr-2 text-sm">
                            21.999 ₺
                        </span>
                        <span className="text-blue-400 font-extrabold text-xl">
                            19.799 ₺
                        </span>
                    </div>

                    <div className="h-2 bg-slate-800 rounded overflow-hidden">
                        <div className="h-full w-[85%] bg-blue-500 rounded" />
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                            Sınırlı Stok: 12 Adet Kaldı
                        </span>
                        <span className="text-[10px] text-blue-400 font-bold">
                            SON 2 GÜN
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
