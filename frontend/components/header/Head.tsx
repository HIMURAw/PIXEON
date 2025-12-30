import Link from "next/link";
import Image from "next/image";
import {
    ChevronDown,
    Search,
    ShoppingCart,
    User
} from "lucide-react";

import BurgerMenu from "./mobile/burgerMenu";
import LocationButton from "./locationButton/locationButton";
import CategoriesButton from "./categoriesButton/categoriesButton";

export default function Head() {
    return (
        <header className="w-full border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex md:hidden items-center justify-between py-3">

                    <BurgerMenu />

                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={48}
                        height={48}
                    />

                    <div className="flex items-center gap-3">
                        <ShoppingCart size={20} />
                        <User size={20} />
                    </div>
                </div>

                <div className="hidden md:flex items-center justify-between py-4">
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


                    <LocationButton />

                    <div className="flex-1 mx-6 ml-10">
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

                <nav className="hidden md:flex items-center gap-6 py-3 text-sm font-extrabold">
                    <CategoriesButton />

                    <div className="ml-60 flex gap-4">
                        <Link
                            href="#"
                            className="px-4 h-[44px] flex items-center justify-center rounded-xl hover:bg-gray-800 transition"
                        >
                            HOME
                        </Link>

                        <Link
                            href="#"
                            className="px-4 h-[44px] flex items-center justify-center gap-1 rounded-xl hover:bg-gray-800 transition"
                        >
                            SHOP <ChevronDown size={14} />
                        </Link>

                        <Link
                            href="#"
                            className="px-4 h-[44px] flex items-center justify-center rounded-xl hover:bg-gray-800 transition"
                        >
                            BAKERY
                        </Link>

                        <Link
                            href="#"
                            className="px-4 h-[44px] flex items-center justify-center rounded-xl hover:bg-gray-800 transition"
                        >
                            BEVERAGES
                        </Link>

                        <Link
                            href="#"
                            className="px-4 h-[44px] flex items-center justify-center rounded-xl hover:bg-gray-800 transition"
                        >
                            BLOG
                        </Link>

                        <Link
                            href="#"
                            className="px-4 h-[44px] flex items-center justify-center rounded-xl hover:bg-gray-800 transition"
                        >
                            CONTACT
                        </Link>
                    </div>
                </nav>


            </div>
        </header>
    );
}
