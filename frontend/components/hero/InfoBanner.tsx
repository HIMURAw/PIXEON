export default function InfoBanner() {
    return (
        <div className="flex items-center justify-between bg-orange-50 rounded-xl p-6">
            <div>
                <span className="text-sm text-gray-500">
                    Always Taking Care
                </span>
                <h3 className="text-lg font-semibold">
                    In store or online your health & safety is our top priority.
                </h3>
            </div>

            <img
                src="/ads/safety.png"
                className="h-24"
            />
        </div>
    );
}
