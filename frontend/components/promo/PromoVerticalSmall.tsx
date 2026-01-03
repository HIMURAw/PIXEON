export default function PromoVerticalSmall() {
    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4">
                <span className="text-xs text-gray-500">
                    Best Bakery Products
                </span>

                <h3 className="text-base font-semibold mt-1">
                    Freshest Products <br />
                    <span className="font-bold">every hour.</span>
                </h3>

                <p className="text-sm mt-2">
                    only-from
                </p>

                <span className="text-xl font-bold text-red-500">
                    $24.99
                </span>
            </div>

            <div className="relative">
                <img
                    src="/products/pngtree-luxurious-blue-perfume-bottle-against-a-transparent-background-png-image_16492004.png"
                    alt="Bakery"
                    className="w-full h-40 object-cover"
                />

                <button className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-sm px-4 py-1.5 rounded-full hover:bg-blue-600 transition">
                    Shop Now
                </button>
            </div>
        </div>
    );
}
