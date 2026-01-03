export default function PromoVertical() {
    return (
        <div className="relative h-[320px] rounded-xl overflow-hidden text-white">

            {/* BACKGROUND IMAGE */}
            <img
                src="/ads/birgith-roosipuu-nka_sIQpKEU-unsplash.jpg"
                alt="Promo"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/50" />

            {/* CONTENT */}
            <div className="relative z-10 p-6 flex flex-col h-full">
                <span className="text-xs uppercase opacity-80">
                    Bacola Natural Foods
                </span>

                <h3 className="text-lg font-semibold mt-2 leading-snug">
                    Special Organic <br />
                    <span className="font-bold">Roots Burger</span>
                </h3>

                <p className="text-sm mt-2 opacity-90">only-from</p>

                <span className="text-2xl font-bold text-red-500 mt-1">
                    $14.99
                </span>

                {/* boşluk */}
                <div className="flex-1" />

                <button className="self-start bg-blue-500 hover:bg-blue-600 transition px-4 py-1.5 rounded-full text-sm">
                    Shop Now
                </button>
            </div>
        </div>
    );
}
