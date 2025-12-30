import Link from "next/link";
import Image from "next/image";
import {
    Hand,
    ChevronDown,
    Search,
    ShoppingCart,
    User
} from "lucide-react";

export default function Head() {
    return (
        <header className="w-full border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between py-4">
                    <div className="flex flex-col items-center gap-1">
                        <Image
                            className="object-contain"
                            src="/logo.png"
                            alt="Logo"
                            width={96}
                            height={96}
                        />
                        <span className="text-xs text-gray-500 text-center">
                            Online Grocery Shopping Center
                        </span>
                    </div>

                    <button className="hidden h-15 md:flex items-center border border-gray-600 rounded-lg pl-6 pr-4 py-2 gap-4 ml-9">
                        {/* TEXT */}
                        <div className="flex flex-col items-start leading-tight">
                            <span className="text-gray-400 text-xs">Your Location</span>
                            <span className="font-medium text-[#7dd7fb]">Select a Location</span>
                        </div>

                        {/* ICON */}
                        <ChevronDown size={16} className="ml-auto" />
                    </button>

                    <div className="flex-1 mx-6 hidden md:block ml-10">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                className="w-full h-15 bg-[#f3f4f7] text-black rounded-lg px-4 py-3 pr-10 outline-none"
                            />
                            <Search
                                size={18}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-white w-10 h-10 flex items-center justify-center border border-gray-600 rounded-full">
                                <User color="black" size={16} />
                            </div>
                            <span className="font-medium">$0.00</span>
                        </div>


                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-orange-100 flex items-center justify-center border border-gray-600 rounded-full">
                                <ShoppingCart color="black" size={16} />
                            </div>
                            <span className="font-medium">0</span>
                        </div>

                    </div>
                </div>

                <nav className="flex items-center gap-6 py-3 text-sm font-medium">
                    <button className="flex items-center gap-2 bg-sky-400 text-white px-5 py-3 rounded-full">
                        ALL CATEGORIES
                        <ChevronDown size={16} />
                    </button>

                    <div className="ml-50 flex gap-6">
                        <Link href="#" className="px-3 py-2 rounded hover:bg-gray-800 transition rounded-xl">
                            HOME
                        </Link>
                        <Link href="#" className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-800 transition rounded-xl">
                            SHOP <ChevronDown size={14} />
                        </Link>
                        <Link href="#" className="px-3 py-2 rounded hover:bg-gray-800 transition rounded-xl">
                            MEATS & SEAFOOD
                        </Link> 
                        <Link href="#" className="px-3 py-2 rounded hover:bg-gray-800 transition rounded-xl">
                            BAKERY
                        </Link>
                        <Link href="#" className="px-3 py-2 rounded hover:bg-gray-800 transition rounded-xl">
                            BEVERAGES
                        </Link>
                        <Link href="#" className="px-3 py-2 rounded hover:bg-gray-800 transition rounded-xl">
                            BLOG
                        </Link>
                        <Link href="#" className="px-3 py-2 rounded hover:bg-gray-800 transition rounded-xl">
                            CONTACT
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
