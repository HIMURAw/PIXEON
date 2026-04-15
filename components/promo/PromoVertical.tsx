export default function PromoVertical() {
    return (
        <div className="relative h-[320px] rounded-xl overflow-hidden text-white">

            {/* BACKGROUND IMAGE */}
            <img
                src="/products/dualsense.png"
                alt="DualSense"
                className="absolute inset-0 w-full h-full object-contain bg-slate-900"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/20" />

            {/* CONTENT */}
            <div className="relative z-10 p-6 flex flex-col h-full">
                <span className="text-xs uppercase font-bold text-blue-400">
                    KONTROLÜ ELİNE AL
                </span>

                <h3 className="text-lg font-semibold mt-2 leading-snug text-white">
                    DualSense™ <br />
                    <span className="font-bold text-white">Kablosuz Kontrolcü</span>
                </h3>

                <p className="text-[10px] mt-2 text-gray-300">Haptik Geri Bildirim ve Uyarlanabilir Tetikler.</p>

                <span className="text-2xl font-bold text-white mt-1">
                    2.999 ₺
                </span>

                {/* boşluk */}
                <div className="flex-1" />

                <button className="cursor-pointer self-start bg-blue-600 hover:bg-blue-700 transition px-4 py-1.5 rounded-full text-sm font-bold text-white">
                    Şimdi Al
                </button>
            </div>
        </div>
    );
}
