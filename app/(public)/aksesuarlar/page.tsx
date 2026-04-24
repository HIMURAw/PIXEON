"use client";

import React, { useState } from "react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import { Star, ShoppingCart, Filter, Search, ChevronDown, Headset, Gamepad2, Camera, Remote, Zap, Square } from "lucide-react";
import { cn } from "@/lib/utils";

type Accessory = {
    id: number;
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    discount?: string | null;
    cat: string;
    rating: number;
};

const accessories: Accessory[] = [
    { id: 1,  name: "DualSense Kablosuz Kontrolcü - Beyaz",          image: "/products/dualsense.png",           price: "2.899", discount: null,  cat: "Kontrolcü", rating: 5 },
    { id: 2,  name: "DualSense Edge™ Kontrolcü",                     image: "/products/dualsense_edge_hero.png", price: "6.999", oldPrice: "7.499", discount: "7%", cat: "Kontrolcü", rating: 5 },
    { id: 3,  name: "DualSense - Volcanic Red",                      image: "/products/dualsense.png",           price: "3.699", discount: null,  cat: "Kontrolcü", rating: 4 },
    { id: 4,  name: "DualSense - Cobalt Blue",                       image: "/products/dualsense.png",           price: "3.699", discount: null,  cat: "Kontrolcü", rating: 4 },
    { id: 5,  name: "DualSense - Midnight Black",                    image: "/products/dualsense.png",           price: "3.499", oldPrice: "3.899", discount: "10%", cat: "Kontrolcü", rating: 5 },
    { id: 6,  name: "PS5 Pulse 3D Kablosuz Kulaklık",               image: "/products/dual-sense.jpg",          price: "3.499", oldPrice: "3.999", discount: "12%", cat: "Kulaklık", rating: 4 },
    { id: 7,  name: "Sony Pulse Explore Kulaklık",                   image: "/products/dual-sense.jpg",          price: "5.999", oldPrice: "7.199", discount: "17%", cat: "Kulaklık", rating: 5 },
    { id: 8,  name: "Sony Pulse Elite Kulaklık",                     image: "/products/dual-sense.jpg",          price: "4.499", discount: null,  cat: "Kulaklık", rating: 5 },
    { id: 9,  name: "PS5 HD Kamera",                                 image: "/products/dual-sense.jpg",          price: "1.899", discount: null,  cat: "Kamera",    rating: 4 },
    { id: 10, name: "PlayStation Media Remote",                      image: "/products/dual-sense.jpg",          price: "899",   oldPrice: "1.099", discount: "18%", cat: "Remote",   rating: 4 },
    { id: 11, name: "DualSense Şarj İstasyonu",                     image: "/products/dual-sense.jpg",          price: "999",   discount: null,  cat: "Şarj",      rating: 5 },
    { id: 12, name: "PS5 Slim Dikey Stand",                         image: "/products/dual-sense.jpg",          price: "799",   discount: null,  cat: "Stand",     rating: 4 },
];

const catGroups = [
    { key: "Tümü",      title: "Tüm Aksesuarlar",        icon: Zap },
    { key: "Kontrolcü", title: "Kontrolcüler",           icon: Gamepad2 },
    { key: "Kulaklık",  title: "Kulaklıklar & Ses",      icon: Headset },
    { key: "Kamera",    title: "Kamera",                  icon: Camera },
    { key: "Remote",    title: "Media Remote",            icon: Remote },
    { key: "Şarj",      title: "Şarj İstasyonları",      icon: Zap },
    { key: "Stand",     title: "Stand & Tutucu",          icon: Square },
];

function Card({ a }: { a: Accessory }) {
    return (
        <div className="group bg-[#0b1220]/50 backdrop-blur-sm border border-white/5 rounded-3xl p-5 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                {a.discount ? (
                    <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full shadow-lg shadow-blue-600/20 uppercase tracking-widest">
                        %{a.discount.replace('%','')} İndirim
                    </span>
                ) : <div />}
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    {a.cat}
                </span>
            </div>

            <div className="h-44 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700 relative z-10">
                <img src={a.image} alt={a.name} className="max-h-full object-contain drop-shadow-2xl shadow-blue-500/20" />
            </div>

            <div className="space-y-1 mb-4 relative z-10">
                <h3 className="text-base font-bold text-white leading-tight group-hover:text-blue-400 transition-colors line-clamp-2 h-10">{a.name}</h3>
                <span className="text-xs text-emerald-400 font-bold">✓ Stokta Var</span>
            </div>

            <div className="flex items-center gap-0.5 mb-4 relative z-10">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={cn(i < a.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600")} />
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex flex-col">
                    {a.oldPrice && <span className="text-xs text-slate-500 line-through font-medium">₺{a.oldPrice}</span>}
                    <span className="text-xl font-black text-white tracking-tight">₺{a.price}</span>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                    <ShoppingCart size={18} />
                </button>
            </div>
        </div>
    );
}

export default function AksesuarlarPage() {
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
                                Ekipmanlar
                            </span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight">
                            PlayStation <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-600">Aksesuar Serisi</span>
                        </h1>
                        <p className="text-lg text-slate-400 font-medium">
                            DualSense kontrolcülerden Pulse 3D kulaklıklara kadar, oyun deneyiminizi zirveye taşıyacak tüm aksesuarlar.
                        </p>
                    </div>

                    <div className="relative z-10 hidden lg:flex items-center justify-center">
                        <div className="w-64 h-64 bg-gradient-to-tr from-blue-600 to-sky-400 rounded-full blur-[80px] opacity-20 absolute animate-pulse"></div>
                        <Headset size={200} className="text-white/10 rotate-12" />
                    </div>
                </div>

                {/* Categories Tabs */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white/5 border border-white/5 p-4 rounded-[32px] backdrop-blur-md overflow-hidden">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
                        {catGroups.map(cg => (
                            <button 
                                key={cg.key} 
                                onClick={() => setActiveTab(cg.key)}
                                className={cn(
                                    "flex items-center gap-2 whitespace-nowrap px-6 py-2.5 rounded-2xl text-xs font-bold transition-all border",
                                    activeTab === cg.key 
                                        ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20" 
                                        : "bg-white/5 text-slate-400 border-white/5 hover:border-white/20 hover:text-white"
                                )}
                            >
                                <cg.icon size={14} />
                                {cg.title}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                                type="text" 
                                placeholder="Aksesuar ara..." 
                                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs outline-none focus:border-blue-500/50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Accessories Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {accessories
                        .filter(a => activeTab === "Tümü" || a.cat === activeTab)
                        .map(a => <Card key={a.id} a={a} />)
                    }
                </section>

                {/* Footer Info */}
                <div className="text-center pt-12 border-t border-white/5">
                    <p className="text-slate-500 text-sm font-medium italic">Toplam {accessories.length} premium aksesuar listeleniyor.</p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
