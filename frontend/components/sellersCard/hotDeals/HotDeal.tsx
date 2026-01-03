export default function HotDeal() {
    return (
        <div className="border border-red-400 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                    Hot Product for <span className="text-red-500">This Week</span>
                </h3>

                <button className="text-sm border px-4 py-1 rounded-full">
                    View All →
                </button>
            </div>

            <div className="flex gap-6 items-center">
                <div className="relative">
                    <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        19%
                    </span>
                    <img src="/products/yogurt.png" className="w-28" />
                </div>

                <div className="flex-1 space-y-2">
                    <h4 className="font-medium">
                        Chobani Complete Vanilla Greek Yogurt
                    </h4>

                    <div>
                        <span className="line-through text-gray-400 mr-2">
                            $5.49
                        </span>
                        <span className="text-red-500 font-bold">
                            $4.49
                        </span>
                    </div>

                    <div className="h-2 bg-gray-200 rounded">
                        <div className="h-full w-[70%] bg-yellow-400 rounded" />
                    </div>

                    <span className="text-xs text-gray-500">
                        Remaining until the end of the offer
                    </span>
                </div>
            </div>
        </div>
    );
}
