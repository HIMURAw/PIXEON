"use client";

import React, { useState, useEffect } from "react";
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
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

const DEFAULT_LINKS = [
    { title: "ANA SAYFA", url: "/" },
    { title: "KONSOLLAR", url: "/konsollar" },
    { title: "PS5 OYUNLARI", url: "/oyunlar/ps5" },
    { title: "PS4 OYUNLARI", url: "/oyunlar/ps4" },
    { title: "AKSESUARLAR", url: "/aksesuarlar" },
    { title: "DİJİTAL KODLAR", url: "/dijital-kodlar" },
    { title: "İLETİŞİM", url: "/iletisim" }
];

export default function Head() {
    const [navLinks, setNavLinks] = useState(DEFAULT_LINKS);

    useEffect(() => {
        fetch("/api/menus/header-main")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.menu?.items?.length > 0) {
                    setNavLinks(data.menu.items);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <header className="w-full bg-[#0c1022] border-b border-slate-800">
            <div className="w-full px-4 sm:px-6 lg:px-8">

                {/* MOBILE */}
                <div className="flex md:hidden items-center justify-between py-3 text-slate-200">
                    <BurgerMenu />
                    <Link href="/" className="shrink-0">
                        <Image src="/logo-nobg.png" alt="Logo" width={48} height={48} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <NotificationBell />
                        <ShoppingCart size={20} />
                        <UserMenu mobile />
                    </div>
                </div>

                {/* DESKTOP */}
                <div className="hidden md:flex items-center justify-between py-6 text-slate-200">
                    <div className="flex items-center gap-8 flex-1">
                        <Link href="/" className="flex flex-col items-center gap-1 shrink-0 group">
                            <Image className="object-contain transition-transform group-hover:scale-105" src="/logo-nobg.png" alt="Logo" width={96} height={96} />
                            <span className="text-xs text-slate-400 text-center group-hover:text-sky-400 transition-colors">Yetkili PlayStation Satış Merkezi</span>
                        </Link>
                        <LocationButton />
                        <div className="flex-1 mx-6">
                            <div className="relative">
                                <input type="text" placeholder="Oyun, Konsol veya Aksesuar ara..." className="w-full bg-[#020617] text-slate-200 rounded-lg px-4 py-3 pr-10 outline-none border border-slate-700 focus:border-sky-500 transition" />
                                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <UserMenu />
                        <Link href="/sepet" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-slate-900 flex items-center justify-center border border-slate-700 rounded-full group-hover:border-sky-500/50 group-hover:bg-slate-800 transition-all">
                                <ShoppingCart color="#E5E7EB" size={16} />
                            </div>
                            <span className="font-medium text-slate-200 group-hover:text-sky-400 transition-colors">Sepetim</span>
                        </Link>
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-6 py-3 text-sm font-extrabold text-slate-200">
                    <CategoriesSection />
                    <div className="flex-1 flex justify-end gap-2">
                        {navLinks.map((item: any) => (
                            <Link 
                                key={item.id || item.title} 
                                href={item.url} 
                                target={item.target || "_self"}
                                className="px-4 h-[44px] flex items-center justify-center rounded-xl hover:bg-slate-800 hover:text-sky-400 transition uppercase tracking-wider"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </nav>
            </div>
        </header>
    );
}

