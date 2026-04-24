"use client";

import React, { useState } from "react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import { Star, ShoppingCart, Filter, Search, ChevronDown, CreditCard, Zap, ShieldCheck, Mail, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

type DigitalProduct = {
    id: number;
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    discount?: string | null;
    cat: string;
    rating: number;
    tag?: string;
};

const digitalProducts: DigitalProduct[] = [
    { id: 1,  name: "PS Plus Essential – 1 Aylık",      image: "/products/ps5.png", price: "399",   discount: null,  cat: "PS Plus Essential", rating: 5, tag: "Anında Teslimat" },
    { id: 2,  name: "PS Plus Essential – 3 Aylık",      image: "/products/ps5.png", price: "999",   oldPrice: "1.197", discount: "16%", cat: "PS Plus Essential", rating: 5, tag: "Anında Teslimat" },
    { id: 3,  name: "PS Plus Extra – 1 Aylık",          image: "/products/ps5.png", price: "699",   discount: null,  cat: "PS Plus Extra", rating: 5, tag: "Anında Teslimat" },
    { id: 4,  name: "PS Plus Extra – 3 Aylık",          image: "/products/ps5.png", price: "1.799", oldPrice: "2.097", discount: "14%", cat: "PS Plus Extra", rating: 5, tag: "Anında Teslimat" },
    { id: 5,  name: "PS Plus Premium – 1 Aylık",        image: "/products/ps5.png", price: "899",   discount: null,  cat: "PS Plus Premium", rating: 5, tag: "Anında Teslimat" },
    { id: 6,  name: "PS Plus Premium – 12 Aylık",       image: "/products/ps5.png", price: "3.499", oldPrice: "4.788", discount: "27%", cat: "PS Plus Premium", rating: 5, tag: "Anında Teslimat" },
    { id: 7,  name: "PSN Hediye Kartı – ₺100",          image: "/products/ps5.png", price: "110",   discount: null,  cat: "Hediye Kartı", rating: 4, tag: "Anında Teslimat" },
    { id: 8,  name: "PSN Hediye Kartı – ₺250",          image: "/products/ps5.png", price: "270",   discount: null,  cat: "Hediye Kartı", rating: 4, tag: "Anında Teslimat" },
    { id: 9,  name: "PSN Hediye Kartı – ₺500",          image: "/products/ps5.png", price: "540",   discount: null,  cat: "Hediye Kartı", rating: 5, tag: "Anında Teslimat" },
    { id: 10, name: "PSN Hediye Kartı – ₺1000",         image: "/products/ps5.png", price: "1.080", discount: null,  cat: "Hediye Kartı", rating: 5, tag: "Anında Teslimat" },
    { id: 11, name: "EA FC 25 Ultimate Edition",         image: "/products/spiderman.jpg", price: "2.199", oldPrice: "2.699", discount: "19%", cat: "Dijital Oyun", rating: 4 },
    { id: 12, name: "NBA 2K25 MyTeam Paketi",            image: "/products/spiderman.jpg", price: "699",   oldPrice: "899",   discount: "22%", cat: "Dijital Oyun", rating: 4 },
    { id: 13, name: "Minecraft Legends – PS5 Kod",       image: "/products/spiderman.jpg", price: "899",   discount: null,  cat: "Dijital Oyun", rating: 4 },
    { id: 14, name: "PlayStation Stars Üyeliği",         image: "/products/ps5.png", price: "199",   discount: null,  cat: "Üyelik", rating: 4, tag: "Anında Teslimat" },
];

function Card({ d }: { d: DigitalProduct }) {
    return (
        <div className="group bg-[#0b1220]/50 backdrop-blur-sm border border-white/5 rounded-3xl p-5 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                {d.discount ? (
                    <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full shadow-lg shadow-blue-600/20 uppercase tracking-widest">
                        %{d.discount.replace('%','')} İndirim
                    </span>
                ) : <div />}
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    {d.cat}
                </span>
            </div>

            <div className="h-44 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-700 relative z-10">
                <img src={d.image} alt={d.name} className="max-h-full object-contain drop-shadow-2xl shadow-blue-500/20" />
            </div>

            <div className="space-y-1 mb-4 relative z-10">
                <h3 className="text-base font-bold text-white leading-tight group-hover:text-blue-400 transition-colors line-clamp-2 h-10">{d.name}</h3>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-black uppercase tracking-tighter">
                    <Zap size={10} fill="currentColor" />
                    {d.tag ?? "Anında Teslimat"}
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex flex-col">
                    {d.oldPrice && <span className="text-xs text-slate-500 line-through font-medium">₺{d.oldPrice}</span>}
                    <span className="text-xl font-black text-white tracking-tight">₺{d.price}</span>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2 px-5">
                    <ShoppingCart size={16} />
                    <span className="text-xs font-black uppercase">Al</span>
                </button>
            </div>
        </div>
    );
}

export default function DijitalKodlarPage() {
    const categories = ["Tümü", "PS Plus Essential", "PS Plus Extra", "PS Plus Premium", "Hediye Kartı", "Dijital Oyun"];
    const [activeTab, setActiveTab] = useState("Tümü");

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <TopBar />
            <MainBar />
            <Head />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-12">
                {/* Hero / Header Section */}
                <div className="relative rounded-[40px] overflow-hidden bg-[#020617] border border-white/5 p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
                    
                    <div className="relative z-10 max-w-2xl space-y-6">
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                            <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/20">
                                Dijital Mağaza
                            </span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight">
                            Dijital Kodlar & <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-600">Abonelik Dünyası</span>
                        </h1>
                        <p className="text-lg text-slate-400 font-medium">
                            Anında teslimat güvencesiyle PS Plus üyelikleri, hediye kartları ve dijital oyun kodlarını keşfedin. Beklemek yok, hemen oyna.
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-2.5 text-xs font-black text-emerald-400">
                                <Zap size={14} fill="currentColor" />
                                ANINDA TESLİMAT
                            </div>
                            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl px-5 py-2.5 text-xs font-black text-blue-400">
                                <ShieldCheck size={14} />
                                GÜVENLİ ÖDEME
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 hidden lg:flex items-center justify-center">
                        <div className="w-64 h-64 bg-gradient-to-tr from-blue-600 to-sky-400 rounded-full blur-[80px] opacity-20 absolute animate-pulse"></div>
                        <Ticket size={220} className="text-white/10 -rotate-12" />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white/5 border border-white/5 p-4 rounded-[32px] backdrop-blur-md">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
                        {categories.map(cat => (
                            <button 
                                key={cat} 
                                onClick={() => setActiveTab(cat)}
                                className={cn(
                                    "whitespace-nowrap px-6 py-2.5 rounded-2xl text-xs font-bold transition-all border",
                                    activeTab === cat 
                                        ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20" 
                                        : "bg-white/5 text-slate-400 border-white/5 hover:border-white/20 hover:text-white"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-slate-900 border border-white/5 rounded-2xl px-5 py-2.5 flex items-center gap-3 text-xs font-bold text-slate-400">
                            <Mail size={14} className="text-blue-400" />
                            E-posta Teslimat
                        </div>
                    </div>
                </div>

                {/* Digital Products Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {digitalProducts
                        .filter(d => activeTab === "Tümü" || d.cat.includes(activeTab) || (activeTab === "Hediye Kartı" && d.cat === activeTab))
                        .map(d => <Card key={d.id} d={d} />)
                    }
                </section>

                {/* Info Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                    {[
                        { icon: Zap, title: "Saniyeler İçinde Teslim", desc: "Ödeme onaylandığı an kodunuz e-posta adresinize gönderilir." },
                        { icon: ShieldCheck, title: "Güvenli Altyapı", desc: "Tüm işlemleriniz en yüksek güvenlik standartları ile korunur." },
                        { icon: Mail, title: "7/24 Destek", desc: "Dijital ürünlerle ilgili her türlü sorunuzda yanınızdayız." },
                    ].map((box, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-4">
                            <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400">
                                <box.icon size={24} />
                            </div>
                            <h3 className="text-white font-bold">{box.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{box.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
