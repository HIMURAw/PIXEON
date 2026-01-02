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
import CategoriesSection from "../categories/CategoriesSection";

export default function Head() {
    return (
        <header className="w-full bg-[#0c1022] border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-6">

                {/* MOBILE */}
                <div className="flex md:hidden items-center justify-between py-3 text-slate-200">

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

                {/* DESKTOP */}
                <div className="hidden md:flex items-center justify-between py-4 text-slate-200">

                    {/* Logo */}
                    <div className="flex flex-col items-center gap-1">
                        <Image
                            className="object-contain"
                            src="/logo.png"
                            alt="Logo"
                            width={96}
                            height={96}
                        />
                        <span className="text-xs text-slate-400 text-center">
                            Online Grocery Shopping Center
                        </span>
                    </div>

                    <LocationButton />

                    {/* Search */}
                    <div className="flex-1 mx-6 ml-10">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                className="w-full bg-[#020617] text-slate-200 rounded-lg px-4 py-3 pr-10 outline-none border border-slate-700 focus:border-sky-500 transition"
                            />
                            <Search
                                size={18}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                            />
                        </div>
                    </div>

                    {/* User & Cart */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-slate-900 w-10 h-10 flex items-center justify-center border border-slate-700 rounded-full">
                                <User color="#E5E7EB" size={16} />
                            </div>
                            <span className="font-medium text-slate-200">$0.00</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-slate-900 flex items-center justify-center border border-slate-700 rounded-full">
                                <ShoppingCart color="#E5E7EB" size={16} />
                            </div>
                            <span className="font-medium text-slate-200">0</span>
                        </div>
                    </div>
                </div>

                {/* NAVBAR */}
                <nav className="hidden md:flex items-center gap-6 py-3 text-sm font-extrabold text-slate-200">

                    <CategoriesSection />

                    <div className="ml-60 flex gap-2">
                        {["HOME", "SHOP", "BAKERY", "BEVERAGES", "BLOG", "CONTACT"].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                className="px-4 h-[44px] flex items-center justify-center rounded-xl
                                hover:bg-slate-800 hover:text-sky-400 transition"
                            >
                                {item}
                                {item === "SHOP" && <ChevronDown size={14} className="ml-1" />}
                            </Link>
                        ))}
                    </div>
                </nav>

            </div>
        </header>
    );
}

