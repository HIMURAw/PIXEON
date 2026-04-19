export default function InfoBanner() {
    return (
        <div className="flex items-center justify-between bg-gradient-to-br from-slate-900 to-slate-800  rounded-xl p-6">
            <div>
                <span className="text-sm text-blue-400 font-bold">
                    PlayStation Plus Deluxe
                </span>
                <h3 className="text-lg font-semibold text-white">
                    700'den fazla oyun, klasik katalog ve oyun deneme sürümlerine hemen erişin.
                </h3>
            </div>

            <img
                src="/products/ps-plus-logo-nobg.png"
                className="h-20 object-contain"
            />
        </div>
    );
}
