"use client";

import Link from "next/link";
import {
    ChevronRight,
    Gamepad2,
    Disc,
    Gamepad,
    Headset,
    CreditCard,
    Zap,
    Flame
} from "lucide-react";

const categories = [
    { icon: <Gamepad2 size={18} />, text: "PlayStation Konsollar", href: "/konsollar", arrow: true },
    { icon: <Disc size={18} />, text: "PS5 Oyunları", href: "/oyunlar/ps5", arrow: true },
    { icon: <Disc size={18} />, text: "PS4 Oyunları", href: "/oyunlar/ps4", arrow: true },
    { icon: <Gamepad size={18} />, text: "DualSense Kontrolcüler", href: "/aksesuarlar", arrow: true },
    { icon: <Headset size={18} />, text: "Kulaklık & Ses", href: "/aksesuarlar", arrow: true },
    { icon: <CreditCard size={18} />, text: "PS Plus & Hediye Kartları", href: "/dijital-kodlar", arrow: true },
    { icon: <Zap size={18} />, text: "Tüm Aksesuarlar", href: "/aksesuarlar", arrow: true },
];

export default function StaticCategoriesMenu() {
    return (
        <div className="w-full h-full bg-[#0b1220]/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between py-2 shadow-2xl">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <Flame size={16} className="text-sky-400 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Kategoriler</span>
            </div>

            {/* List */}
            <div className="flex-1 flex flex-col justify-center">
                {categories.map((cat) => (
                    <Link
                        key={cat.text}
                        href={cat.href}
                        className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] hover:text-sky-400 cursor-pointer transition-all duration-300 group"
                    >
                        <div className="flex items-center gap-3 text-slate-300 group-hover:text-sky-400 text-sm font-medium">
                            <span className="transition-transform group-hover:scale-115 text-sky-400">
                                {cat.icon}
                            </span>
                            <span>{cat.text}</span>
                        </div>
                        {cat.arrow && (
                            <ChevronRight
                                size={14}
                                className="text-slate-500 group-hover:text-sky-400 transition-transform group-hover:translate-x-1"
                            />
                        )}
                    </Link>
                ))}
            </div>

            {/* Bottom Accent Line */}
            <div className="px-4 py-2 border-t border-white/5 bg-black/10">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block text-center">
                    PIXEON PLAYSTATION
                </span>
            </div>
        </div>
    );
}
