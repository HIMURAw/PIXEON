export default function MainBar() {
    return (
        <div className="bg-black text-gray-300 text-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

                <div className="flex gap-4">
                    <a href="#" className="hover:text-white">About Us</a>
                    <a href="#" className="hover:text-white">My Account</a>
                    <a href="#" className="hover:text-white">Wishlist</a>
                    <a href="#" className="hover:text-white">Order Tracking</a>
                </div>

                <div className="hidden md:flex items-center gap-2 text-gray-400">
                    <span>🔒</span>
                    <span>100% Secure delivery without contacting the courier</span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-cyan-400 font-semibold">
                        Need help? Call Us: +0020 500
                    </span>

                    <select className="bg-black border border-gray-600 text-white text-sm px-2 py-1">
                        <option>English</option>
                        <option>Türkçe</option>
                    </select>

                    <select className="bg-black border border-gray-600 text-white text-sm px-2 py-1">
                        <option>USD</option>
                        <option>TRY</option>
                    </select>
                </div>

            </div>
        </div>
    );
}
