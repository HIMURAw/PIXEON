"use client";

import React, { useState } from "react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import { Star, ShoppingCart, Filter, Search, ChevronDown, Monitor, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

type Product = {
    id: number;
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    discount?: string | null;
    category: string;
    rating: number;
    stock: boolean;
};

const consoles: Product[] = [
    { id: 1, name: "PlayStation 5 Slim Standart Edition", image: "/products/ps5.png", price: "19.999", discount: null, category: "PS5", rating: 5, stock: true },
    { id: 2, name: "PlayStation 5 Pro", image: "/products/ps5_pro_hero.png", price: "28.499", discount: null, category: "PS5", rating: 5, stock: true },
    { id: 3, name: "PlayStation 5 Dijital Edition Slim", image: "/products/ps5.png", price: "17.499", oldPrice: "18.999", discount: "8%", category: "PS5", rating: 5, stock: true },
    { id: 4, name: "PS5 Bundle – God of War Ragnarök", image: "/products/ps5.png", price: "21.499", discount: null, category: "PS5", rating: 5, stock: true },
    { id: 5, name: "PS5 Bundle – Spider-Man 2", image: "/products/ps5.png", price: "22.499", oldPrice: "24.999", discount: "10%", category: "PS5", rating: 5, stock: true },
    { id: 6, name: "PS5 Bundle – FC 25 Edition", image: "/products/ps5.png", price: "20.999", discount: null, category: "PS5", rating: 4, stock: true },
    { id: 7, name: "PlayStation 4 Pro 1TB", image: "/products/ps5.png", price: "12.499", discount: null, category: "PS4", rating: 4, stock: true },
    { id: 8, name: "PlayStation 4 Slim 500GB", image: "/products/ps5.png", price: "9.999", oldPrice: "11.500", discount: "13%", category: "PS4", rating: 4, stock: true },
];

function ProductCard({ p }: { p: Product }) {
    return (
        <div className="group bg-[#0b1220]/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                {p.discount ? (
                    <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full shadow-lg shadow-blue-600/20 uppercase tracking-widest">
                        %{p.discount.replace('%','')} İndirim
                    </span>
                ) : <div />}
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    {p.category}
                </span>
            </div>

            <div className="h-52 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-700 relative z-10">
                <img src={p.image} alt={p.name} className="max-h-full object-contain drop-shadow-2xl shadow-blue-500/20" />
            </div>

            <div className="space-y-1 mb-4 relative z-10">
                <h3 className="text-lg font-bold text-white leading-tight group-hover:text-blue-400 transition-colors line-clamp-2 h-14">{p.name}</h3>
                <span className={cn("text-xs font-bold", p.stock ? "text-emerald-400" : "text-red-400")}>
                    {p.stock ? "✓ Stokta Var" : "✕ Stokta Yok"}
                </span>
            </div>

            <div className="flex items-center gap-0.5 mb-6 relative z-10">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={cn(i < p.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600")} />
                ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex flex-col">
                    {p.oldPrice && <span className="text-xs text-slate-500 line-through font-medium">₺{p.oldPrice}</span>}
                    <span className="text-2xl font-black text-white tracking-tight">₺{p.price}</span>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                    <ShoppingCart size={20} />
                </button>
            </div>
        </div>
    );
}

export default function KonsollarPage() {
    const ps5 = consoles.filter(p => p.category === "PS5");
    const ps4 = consoles.filter(p => p.category === "PS4");
    const [activeTab, setActiveTab] = useState("PS5");

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <TopBar />
            <MainBar />
            <Head />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-16">
                {/* Hero / Header Section */}
                <div className="relative rounded-[40px] overflow-hidden bg-[#020617] border border-white/5 p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -ml-32 -mb-32"></div>
                    
                    <div className="relative z-10 max-w-2xl space-y-8 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                            <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/20">
                                Yeni Nesil
                            </span>
                        </div>
                        <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tight">
                            PlayStation <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-600">Konsol Dünyası</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed">
                            Güç, performans ve eşsiz oyun deneyimi. En yeni PS5 modellerini ve efsaneleşmiş PS4 versiyonlarını en iyi fiyatlarla keşfedin.
                        </p>
                    </div>

                    <div className="relative z-10 hidden lg:flex items-center justify-center">
                        <div className="w-80 h-80 bg-gradient-to-tr from-blue-600 to-sky-400 rounded-full blur-[100px] opacity-20 absolute animate-pulse"></div>
                        <Cpu size={280} className="text-white/5 -rotate-6" />
                    </div>
                </div>

                {/* Section Selector Tabs */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex bg-white/5 border border-white/5 p-1.5 rounded-[24px] backdrop-blur-md">
                        {["PS5", "PS4"].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-10 py-3 rounded-[18px] text-sm font-black transition-all",
                                    activeTab === tab 
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                                        : "text-slate-500 hover:text-white"
                                )}
                            >
                                {tab} Modelleri
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <Monitor size={18} className="text-blue-400" />
                        Toplam {consoles.length} Farklı Versiyon
                    </div>
                </div>

                {/* Products Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {consoles
                        .filter(p => p.category === activeTab)
                        .map(p => <ProductCard key={p.id} p={p} />)
                    }
                </section>

                {/* Specs Section Placeholder */}
                <div className="bg-gradient-to-br from-blue-600/5 to-transparent border border-white/5 rounded-[40px] p-12 lg:p-20 text-center space-y-8">
                    <h2 className="text-3xl font-black text-white">Neden PIXEON'u Tercih Etmelisiniz?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: "Resmi Garanti", desc: "Tüm konsollar 2 yıl resmi ithalatçı garantisi altındadır." },
                            { title: "Hızlı Teslimat", desc: "Saat 16:00'ya kadar olan siparişleriniz aynı gün kargoda." },
                            { title: "Uygun Fiyat", desc: "Piyasadaki en rekabetçi fiyatlar ve taksit imkanları." },
                        ].map((item, i) => (
                            <div key={i} className="space-y-3">
                                <div className="text-blue-400 font-black text-xl">{i + 1}.</div>
                                <h3 className="text-white font-bold text-lg">{item.title}</h3>
                                <p className="text-slate-500 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
