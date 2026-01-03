export default function InfoBanner() {
    return (
        <div className="flex items-center justify-between bg-gradient-to-br from-slate-900 to-slate-800  rounded-xl p-6">
            <div>
                <span className="text-sm text-gray-500">
                    Always Taking Care
                </span>
                <h3 className="text-lg font-semibold">
                    In store or online your health & safety is our top priority.
                </h3>
            </div>

            <img
                src="/slider/banner-box2.jpg"
                className="h-24 object-contain"
            />
        </div>
    );
}
