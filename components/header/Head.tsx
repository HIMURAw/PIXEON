"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Search,
    ShoppingCart,
    X,
    Loader2,
    ArrowRight,
    Tag
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCartAnimation } from "@/context/CartAnimationContext";
import { motion } from "framer-motion";

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
    const router = useRouter();
    const { totalItems } = useCart();
    const { isJiggling } = useCartAnimation();
    const [navLinks, setNavLinks] = useState(DEFAULT_LINKS);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    // Load nav links
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

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Debounced search
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (query.trim().length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setLoading(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
                const data = await res.json();
                setResults(data.results || []);
                setIsOpen(true);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);
    }, [query]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleSelect = (slug: string) => {
        setIsOpen(false);
        setQuery("");
        router.push(`/urun/${slug}`);
    };

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(price);

    return (
        <header className="w-full bg-[#0c1022] border-b border-slate-800">
            <div className="w-full px-4 sm:px-6 lg:px-8">

                {/* MOBILE */}
                <div className="flex md:hidden items-center justify-between py-3 text-slate-200">
                    {/* Left: Burger + Logo */}
                    <div className="flex items-center gap-3">
                        <BurgerMenu />
                        <Link href="/" className="shrink-0">
                            <Image src="/logo-nobg.png" alt="Logo" width={40} height={40} />
                        </Link>
                    </div>

                    {/* Right: Icons + Search */}
                    <div className="flex items-center gap-3">
                        <NotificationBell />
                        <motion.div
                            id="header-cart-icon-mobile"
                            variants={{
                                jiggle: {
                                    rotate: [0, -15, 15, -10, 10, -5, 5, 0],
                                    scale: [1, 1.25, 1.25, 1.15, 1.15, 1, 1, 1],
                                    transition: {
                                        duration: 0.6,
                                        ease: "easeInOut"
                                    }
                                },
                                idle: {
                                    rotate: 0,
                                    scale: 1
                                }
                            }}
                            animate={isJiggling ? "jiggle" : "idle"}
                        >
                            <Link href="/sepet" className="relative p-1 block text-slate-200 hover:text-sky-400 transition-colors">
                                <ShoppingCart size={20} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-[#0c1022] animate-in zoom-in duration-300">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        </motion.div>
                        <UserMenu mobile />
                        <button 
                            onClick={() => setShowMobileSearch(prev => !prev)}
                            className="p-1 text-slate-200 hover:text-sky-400 transition-colors"
                            aria-label="Ara"
                        >
                            <Search size={20} />
                        </button>
                    </div>
                </div>

                {/* MOBILE SEARCH BAR */}
                {showMobileSearch && (
                    <div className="md:hidden py-3 border-t border-slate-800" ref={wrapperRef}>
                        <form onSubmit={handleSubmit} className="relative">
                            <input
                                type="text"
                                placeholder="Oyun, Konsol veya Aksesuar ara..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onFocus={() => results.length > 0 && setIsOpen(true)}
                                className="w-full bg-[#020617] text-slate-200 rounded-xl px-4 py-2.5 pr-12 outline-none border border-slate-700 focus:border-sky-500 text-xs"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                {loading && <Loader2 size={12} className="animate-spin text-slate-500" />}
                                {query && !loading && (
                                    <button type="button" onClick={() => { setQuery(""); setResults([]); setIsOpen(false); }} className="text-slate-600 hover:text-white transition-colors">
                                        <X size={12} />
                                    </button>
                                )}
                                <button type="submit" className="text-slate-500 hover:text-sky-400 transition-colors">
                                    <Search size={14} />
                                </button>
                            </div>

                            {/* MOBILE DROPDOWN RESULTS */}
                            {isOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c1022] border border-white/10 rounded-2xl shadow-2xl z-[200] overflow-hidden">
                                    {results.length > 0 ? (
                                        <>
                                            <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{results.length} sonuç bulundu</span>
                                                <button
                                                    type="submit"
                                                    className="text-[10px] font-black text-sky-500 hover:text-sky-400 uppercase tracking-widest flex items-center gap-1 transition-colors"
                                                >
                                                    Tümünü Gör <ArrowRight size={10} />
                                                </button>
                                            </div>
                                            <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                                                {results.map((product) => (
                                                    <button
                                                        key={product.id}
                                                        type="button"
                                                        onClick={() => handleSelect(product.slug)}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors group text-left"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/5 bg-slate-900 shrink-0">
                                                            {product.image ? (
                                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                                    <Tag size={14} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors truncate">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                                                {product.category?.name || "Ürün"}
                                                            </p>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="text-xs font-black text-sky-400">{formatPrice(product.price)}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="px-4 py-6 text-center">
                                            <p className="text-xs text-slate-600 font-bold">"{query}" için sonuç bulunamadı.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </form>
                    </div>
                )}

                {/* DESKTOP */}
                <div className="hidden md:flex items-center justify-between py-6 text-slate-200">
                    <div className="flex items-center gap-8 flex-1">
                        <Link href="/" className="flex flex-col items-center gap-1 shrink-0 group">
                            <Image className="object-contain transition-transform group-hover:scale-105" src="/logo-nobg.png" alt="Logo" width={96} height={96} />
                            <span className="text-xs text-slate-400 text-center group-hover:text-sky-400 transition-colors">Yetkili PlayStation Satış Merkezi</span>
                        </Link>
                        <LocationButton />

                        {/* SEARCH BOX */}
                        <div className="flex-1 mx-6" ref={wrapperRef}>
                            <form onSubmit={handleSubmit} className="relative">
                                {/* Input */}
                                <input
                                    type="text"
                                    placeholder="Oyun, Konsol veya Aksesuar ara..."
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    onFocus={() => results.length > 0 && setIsOpen(true)}
                                    className="w-full bg-[#020617] text-slate-200 rounded-xl px-5 py-3 pr-12 outline-none border border-slate-700 focus:border-sky-500 transition-all text-sm"
                                />

                                {/* Loading / Clear / Search icons */}
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    {loading && <Loader2 size={16} className="animate-spin text-slate-500" />}
                                    {query && !loading && (
                                        <button type="button" onClick={() => { setQuery(""); setResults([]); setIsOpen(false); }} className="text-slate-600 hover:text-white transition-colors">
                                            <X size={14} />
                                        </button>
                                    )}
                                    <button type="submit" className="text-slate-500 hover:text-sky-400 transition-colors">
                                        <Search size={18} />
                                    </button>
                                </div>

                                {/* DROPDOWN RESULTS */}
                                {isOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c1022] border border-white/10 rounded-2xl shadow-2xl z-[200] overflow-hidden">
                                        {results.length > 0 ? (
                                            <>
                                                <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{results.length} sonuç bulundu</span>
                                                    <button
                                                        type="submit"
                                                        className="text-[10px] font-black text-sky-500 hover:text-sky-400 uppercase tracking-widest flex items-center gap-1 transition-colors"
                                                    >
                                                        Tümünü Gör <ArrowRight size={10} />
                                                    </button>
                                                </div>
                                                <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
                                                    {results.map((product) => (
                                                        <button
                                                            key={product.id}
                                                            type="button"
                                                            onClick={() => handleSelect(product.slug)}
                                                            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors group text-left"
                                                        >
                                                            {/* Product image */}
                                                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/5 bg-slate-900 shrink-0">
                                                                {product.image ? (
                                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                                        <Tag size={16} />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Product info */}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors truncate">
                                                                    {product.name}
                                                                </p>
                                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                                                    {product.category?.name || "Ürün"}
                                                                </p>
                                                            </div>

                                                            {/* Price */}
                                                            <div className="text-right shrink-0">
                                                                {product.oldPrice && (
                                                                    <p className="text-[10px] text-slate-600 line-through">{formatPrice(product.oldPrice)}</p>
                                                                )}
                                                                <p className="text-sm font-black text-sky-400">{formatPrice(product.price)}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="px-4 py-8 text-center">
                                                <Search size={24} className="text-slate-700 mx-auto mb-2" />
                                                <p className="text-sm text-slate-600 font-bold">"{query}" için sonuç bulunamadı.</p>
                                                <p className="text-[10px] text-slate-700 mt-1">Farklı bir kelime deneyin.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <UserMenu />
                        <Link href="/sepet" className="flex items-center gap-2 group">
                            <motion.div 
                                id="header-cart-icon"
                                variants={{
                                    jiggle: {
                                        rotate: [0, -15, 15, -10, 10, -5, 5, 0],
                                        scale: [1, 1.25, 1.25, 1.15, 1.15, 1, 1, 1],
                                        transition: {
                                            duration: 0.6,
                                            ease: "easeInOut"
                                        }
                                    },
                                    idle: {
                                        rotate: 0,
                                        scale: 1
                                    }
                                }}
                                animate={isJiggling ? "jiggle" : "idle"}
                                className="w-10 h-10 bg-slate-900 flex items-center justify-center border border-slate-700 rounded-full group-hover:border-sky-500/50 group-hover:bg-slate-800 transition-all relative"
                            >
                                <ShoppingCart color="#E5E7EB" size={16} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-[#0c1022] animate-in zoom-in duration-300">
                                        {totalItems}
                                    </span>
                                )}
                            </motion.div>
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
