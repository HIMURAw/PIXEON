"use client";
import Link from "next/link";
import {
    ChevronRight,
    Gamepad2,
    Disc,
    Gamepad,
    Headset,
    CreditCard,
    Zap
} from "lucide-react";

interface CategoriesMenuProps {
    isOpen: boolean;
}

const categories = [
    { icon: <Gamepad2 size={18} />, text: "PlayStation Konsollar", href: "/konsollar", arrow: true },
    { icon: <Disc size={18} />, text: "PS5 Oyunları", href: "/oyunlar/ps5", arrow: false },
    { icon: <Disc size={18} />, text: "PS4 Oyunları", href: "/oyunlar/ps4", arrow: false },
    { icon: <Gamepad size={18} />, text: "DualSense & Kontrolcüler", href: "/aksesuarlar", arrow: true },
    { icon: <Headset size={18} />, text: "Kulaklık & Ses", href: "/aksesuarlar", arrow: false },
    { icon: <CreditCard size={18} />, text: "PS Plus & Hediye Kartları", href: "/dijital-kodlar", arrow: false },
    { icon: <Zap size={18} />, text: "Aksesuarlar", href: "/aksesuarlar", arrow: false },
];

const extras = [
    { name: "Günün Fırsatı", href: "/dijital-kodlar" },
    { name: "En Çok Satanlar", href: "/oyunlar" },
    { name: "Yeni Gelenler", href: "/yeni-urunler" },
];

export default function CategoriesMenu({ isOpen }: CategoriesMenuProps) {
    return (
        <div
            className={`absolute top-[85px] w-79 border rounded-b-xl bg-slate-900 border-slate-700 shadow-xl z-50 overflow-hidden
            transition-all duration-300 ease-in-out origin-top ${isOpen
                    ? 'opacity-100 scale-y-100 translate-y-0'
                    : 'opacity-0 scale-y-0 -translate-y-4 pointer-events-none'
                }`}
        >
            {/* Categories */}
            <div className="py-2">
                {categories.map((cat) => (
                    <Link
                        key={cat.text}
                        href={cat.href}
                        className="flex items-center justify-between px-4 py-4
                                hover:bg-slate-800 hover:text-sky-400 cursor-pointer transition-colors group"
                    >
                        <div className="flex items-center gap-3 text-slate-200 group-hover:text-sky-400">
                            <span className="transition-transform group-hover:scale-110 text-sky-400">
                                {cat.icon}
                            </span>
                            <span>{cat.text}</span>
                        </div>
                        {cat.arrow && (
                            <ChevronRight
                                size={14}
                                className="text-slate-400 group-hover:text-sky-400 transition-transform group-hover:translate-x-1"
                            />
                        )}
                    </Link>
                ))}
            </div>

            {/* Extras */}
            <div className="border-t border-slate-700 mt-2">
                {extras.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-4 text-slate-200 hover:bg-slate-800 hover:text-sky-400 cursor-pointer transition-colors"
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}
