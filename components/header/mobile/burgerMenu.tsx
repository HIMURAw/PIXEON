"use client";
import { useState } from "react";
import Link from "next/link";
import { X, ChevronDown, Gamepad2, Disc, Headset, CreditCard, Home, Phone, Info } from "lucide-react";
import Image from "next/image";

const navItems = [
    {
        name: "Ana Sayfa",
        href: "/",
        icon: <Home size={18} />,
        children: [],
    },
    {
        name: "Konsollar",
        href: "/konsollar",
        icon: <Gamepad2 size={18} />,
        children: [
            { name: "PlayStation 5", href: "/konsollar" },
            { name: "PlayStation 4", href: "/konsollar" },
        ],
    },
    {
        name: "Oyunlar",
        href: "/oyunlar",
        icon: <Disc size={18} />,
        children: [
            { name: "PS5 Oyunları", href: "/oyunlar" },
            { name: "PS4 Oyunları", href: "/oyunlar" },
        ],
    },
    {
        name: "Aksesuarlar",
        href: "/aksesuarlar",
        icon: <Headset size={18} />,
        children: [
            { name: "Kontrolcüler", href: "/aksesuarlar" },
            { name: "Kulaklıklar", href: "/aksesuarlar" },
            { name: "Stand & Şarj", href: "/aksesuarlar" },
        ],
    },
    {
        name: "Dijital Kodlar",
        href: "/dijital-kodlar",
        icon: <CreditCard size={18} />,
        children: [
            { name: "PS Plus Abonelikleri", href: "/dijital-kodlar" },
            { name: "PSN Hediye Kartları", href: "/dijital-kodlar" },
            { name: "Dijital Oyunlar", href: "/dijital-kodlar" },
        ],
    },
    {
        name: "Hakkımızda",
        href: "/hakkimizda",
        icon: <Info size={18} />,
        children: [],
    },
    {
        name: "İletişim",
        href: "/iletisim",
        icon: <Phone size={18} />,
        children: [],
    },
];

export default function BurgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);

    const toggle = (name: string) =>
        setExpanded(prev => (prev === name ? null : name));

    return (
        <>
            <button
                className="text-2xl text-white hover:cursor-pointer md:hidden"
                onClick={() => setIsOpen(true)}
                aria-label="Menüyü Aç"
            >
                ☰
            </button>

            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <div
                className={`fixed top-0 left-0 h-full w-80 bg-[#0c1022] z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto shadow-2xl border-r border-slate-800 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#0e1a3a] to-[#0c1022] border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <Image src="/logo-nobg.png" alt="PIXEON Logo" width={44} height={44} />
                        <div>
                            <p className="text-white font-bold text-sm">PIXEON</p>
                            <p className="text-slate-400 text-[10px]">Yetkili PlayStation Satış</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center transition-colors"
                        aria-label="Menüyü Kapat"
                    >
                        <X className="w-5 h-5 text-slate-300" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-2 pb-2">
                        Gezinme
                    </p>

                    {navItems.map(item => (
                        <div key={item.name}>
                            {item.children.length > 0 ? (
                                <>
                                    <button
                                        onClick={() => toggle(item.name)}
                                        className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-sky-400 transition-colors group"
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className="text-sky-400">{item.icon}</span>
                                            <span className="font-medium text-sm">{item.name}</span>
                                        </span>
                                        <ChevronDown
                                            size={14}
                                            className={`text-slate-500 transition-transform duration-200 ${
                                                expanded === item.name ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${
                                            expanded === item.name
                                                ? "max-h-48 opacity-100"
                                                : "max-h-0 opacity-0"
                                        }`}
                                    >
                                        <div className="pl-10 pb-2 space-y-1">
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                                            >
                                                Tümünü Gör →
                                            </Link>
                                            {item.children.map(child => (
                                                <Link
                                                    key={child.name}
                                                    href={child.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-sky-400 transition-colors"
                                >
                                    <span className="text-sky-400">{item.icon}</span>
                                    <span className="font-medium text-sm">{item.name}</span>
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Divider */}
                <div className="mx-4 border-t border-slate-800" />

                {/* Quick Links */}
                <div className="p-4 space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-2 pb-2">
                        Hızlı Erişim
                    </p>
                    {[
                        { name: "Hesabım", href: "/hesabim" },
                        { name: "Sepetim", href: "/sepet" },
                        { name: "İstek Listesi", href: "/istek-listesi" },
                        { name: "Sipariş Takibi", href: "/siparis-takibi" },
                    ].map(link => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 mt-auto">
                    <a
                        href="tel:+905528330883"
                        className="flex items-center gap-2 justify-center bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm py-3 rounded-xl transition-colors"
                    >
                        <Phone size={16} />
                        +90 552 833 08 83
                    </a>
                    <p className="text-center text-[10px] text-slate-600 mt-3">
                        © 2025 PIXEON · Yetkili PlayStation Satış Merkezi
                    </p>
                </div>
            </div>
        </>
    );
}