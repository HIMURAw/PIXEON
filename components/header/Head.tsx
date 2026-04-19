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
            <div className="w-full px-4 sm:px-6 lg:px-8">

                {/* MOBILE */}
                <div className="flex md:hidden items-center justify-between py-3 text-slate-200">

                    <BurgerMenu />

                    <Link href="/" className="shrink-0">
                        <Image
                            src="/logo-nobg.png"
                            alt="Logo"
                            width={48}
                            height={48}
                        />
                    </Link>

                    <div className="flex items-center gap-3">
                        <ShoppingCart size={20} />
                        <Link href="/hesabim" className="hover:text-sky-400 transition-colors">
                            <User size={20} />
                        </Link>
                    </div>
                </div>

                {/* DESKTOP */}
                <div className="hidden md:flex items-center justify-between py-6 text-slate-200">
                    <div className="flex items-center gap-8 flex-1">
                        {/* Logo */}
                        <Link href="/" className="flex flex-col items-center gap-1 shrink-0 group">
                            <Image
                                className="object-contain transition-transform group-hover:scale-105"
                                src="/logo-nobg.png"
                                alt="Logo"
                                width={96}
                                height={96}
                            />
                            <span className="text-xs text-slate-400 text-center group-hover:text-sky-400 transition-colors">
                                Yetkili PlayStation Satış Merkezi
                            </span>
                        </Link>

                        <LocationButton />

                        {/* Search */}
                        <div className="flex-1 mx-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Oyun, Konsol veya Aksesuar ara..."
                                    className="w-full bg-[#020617] text-slate-200 rounded-lg px-4 py-3 pr-10 outline-none border border-slate-700 focus:border-sky-500 transition"
                                />
                                <Search
                                    size={18}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* User & Cart */}
                    <div className="flex items-center gap-4">
                        <Link href="/hesabim" className="flex items-center gap-2 group">
                            <div className="bg-slate-900 w-10 h-10 flex items-center justify-center border border-slate-700 rounded-full group-hover:border-sky-500/50 group-hover:bg-slate-800 transition-all">
                                <User color="#E5E7EB" size={16} />
                            </div>
                            <span className="font-medium text-slate-200 group-hover:text-sky-400 transition-colors">$0.00</span>
                        </Link>

                        <Link href="/sepet" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-slate-900 flex items-center justify-center border border-slate-700 rounded-full group-hover:border-sky-500/50 group-hover:bg-slate-800 transition-all">
                                <ShoppingCart color="#E5E7EB" size={16} />
                            </div>
                            <span className="font-medium text-slate-200 group-hover:text-sky-400 transition-colors">0</span>
                        </Link>
                    </div>
                </div>

                {/* NAVBAR */}
                <nav className="hidden md:flex items-center gap-6 py-3 text-sm font-extrabold text-slate-200">

                    <CategoriesSection />

                    <div className="flex-1 flex justify-end gap-2">
                        {[
                            { name: "ANA SAYFA", href: "/" },
                            { name: "KONSOLLAR", href: "#" },
                            { name: "OYUNLAR", href: "#" },
                            { name: "AKSESUARLAR", href: "#" },
                            { name: "DİJİTAL KODLAR", href: "#" },
                            { name: "İLETİŞİM", href: "#" }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="px-4 h-[44px] flex items-center justify-center rounded-xl
                                hover:bg-slate-800 hover:text-sky-400 transition"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </nav>

            </div>
        </header>
    );
}

