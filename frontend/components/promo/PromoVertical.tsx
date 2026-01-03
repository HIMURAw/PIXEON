export default function PromoVertical() {
    return (
        <div className="bg-yellow-400 rounded-xl p-6 text-black relative overflow-hidden">
            <span className="text-xs uppercase opacity-70">
                Bacola Natural Foods
            </span>

            <h3 className="text-lg font-semibold mt-2">
                Special Organic <br />
                <span className="font-bold">Roots Burger</span>
            </h3>

            <p className="text-sm mt-2">only-from</p>

            <span className="text-2xl font-bold text-red-600">
                $14.99
            </span>

            <img
                src="/ads/burger.png"
                className="absolute bottom-0 right-0 w-40"
            />
        </div>
    );
}
