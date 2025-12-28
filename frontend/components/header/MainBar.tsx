import {
    Hand
} from "lucide-react";

export default function MainBar() {
    return (
        <div className="bg-black text-gray-300 text-sm border-b border-gray-600">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

                <div className="flex gap-4">
                    <a href="#" className="hover:text-[#7dd7fb] text-[#696e7f]">About Us</a>
                    <a href="#" className="hover:text-[#7dd7fb] text-[#696e7f]">My Account</a>
                    <a href="#" className="hover:text-[#7dd7fb] text-[#696e7f]">Wishlist</a>
                    <a href="#" className="hover:text-[#7dd7fb] text-[#696e7f]">Order Tracking</a>
                </div>

                <div className="hidden md:flex items-center gap-2 text-gray-400 border-r border-gray-600 pr-4">
                    <Hand />
                    <span>Kuryeyle iletişime geçmeden %100 güvenli teslimat.</span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-[#696e7f] font-semibold border-r border-gray-600 pr-4">
                        <a className="hover:text-[#7dd7fb]" href="#">Need help?</a> Call Us: <span className="text-cyan-400"> +90 552 833 08 83</span>
                    </span>

                    <select className="bg-black border-none font-bold text-white text-sm px-2 py-1">
                        <option>English</option>
                        <option>Türkçe</option>
                    </select>

                    <select className="bg-black  border border-none font-bold text-white text-sm px-2 py-1">
                        <option>USD</option>
                        <option>TRY</option>
                    </select>
                </div>

            </div>
        </div>
    );
}
