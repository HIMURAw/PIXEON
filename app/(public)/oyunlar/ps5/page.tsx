"use client";

import React, { useState } from "react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import { Star, ShoppingCart, Filter, Search, ChevronDown, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Game = {
    id: number;
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    discount?: string | null;
    genre: string;
    category: string;
    rating: number;
};

const games: Game[] = [
    { id: 1,  name: "Marvel's Spider-Man 2", image: "/products/spiderman_2_hero.png", price: "1.699", oldPrice: "2.199", discount: "23%", genre: "Aksiyon", category: "PS5", rating: 5 },
    { id: 2,  name: "God of War: Ragnarök", image: "/products/spiderman.jpg", price: "1.499", oldPrice: "1.899", discount: "21%", genre: "Aksiyon-RPG", category: "PS5", rating: 5 },
    { id: 3,  name: "Elden Ring: Shadow of the Erdtree", image: "/products/spiderman.jpg", price: "1.200", discount: null, genre: "RPG", category: "PS5", rating: 5 },
    { id: 4,  name: "Hogwarts Legacy", image: "/products/spiderman.jpg", price: "1.699", discount: null, genre: "RPG", category: "PS5", rating: 5 },
    { id: 5,  name: "The Last of Us Part I", image: "/products/spiderman.jpg", price: "1.399", oldPrice: "1.899", discount: "26%", genre: "Aksiyon", category: "PS5", rating: 5 },
    { id: 6,  name: "EA FC 25", image: "/products/spiderman.jpg", price: "1.599", oldPrice: "1.999", discount: "20%", genre: "Spor", category: "PS5", rating: 4 },
    { id: 7,  name: "Ghost of Tsushima Director's Cut", image: "/products/spiderman.jpg", price: "1.299", discount: null, genre: "Aksiyon", category: "PS5", rating: 5 },
    { id: 8,  name: "Horizon Forbidden West", image: "/products/spiderman.jpg", price: "849", oldPrice: "1.299", discount: "35%", genre: "Aksiyon-RPG", category: "PS5", rating: 4 },
    { id: 9,  name: "Returnal", image: "/products/spiderman.jpg", price: "899", discount: null, genre: "Roguelite", category: "PS5", rating: 5 },
    { id: 10, name: "Ratchet & Clank: Rift Apart", image: "/products/spiderman.jpg", price: "999", discount: null, genre: "Platform", category: "PS5", rating: 5 },
];

function GameCard({ g }: { g: Game }) {
    return (
        <div className="group bg-[#0b1220]/50 backdrop-blur-sm border border-white/5 rounded-3xl p-5 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                {g.discount ? (
                    <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full shadow-lg shadow-blue-600/20 uppercase tracking-widest">
                        %{g.discount.replace('%','')} İndirim
                    </span>
                ) : <div />}
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    {g.category}
                </span>
            </div>

            <div className="h-48 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-700 relative z-10">
                <img src={g.image} alt={g.name} className="max-h-full object-contain drop-shadow-2xl shadow-blue-500/20" />
            </div>

            <div className="space-y-1 mb-4 relative z-10">
                <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{g.genre}</span>
                <h3 className="text-base font-bold text-white leading-tight group-hover:text-blue-400 transition-colors line-clamp-2 h-10">{g.name}</h3>
            </div>

            <div className="flex items-center gap-0.5 mb-4 relative z-10">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={cn(i < g.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600")} />
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex flex-col">
                    {g.oldPrice && <span className="text-xs text-slate-500 line-through font-medium">₺{g.oldPrice}</span>}
                    <span className="text-xl font-black text-white tracking-tight">₺{g.price}</span>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                    <ShoppingCart size={18} />
                </button>
            </div>
        </div>
    );
}

export default function PS5OyunlarPage() {
    const genres = ["Tümü", ...new Set(games.map(g => g.genre))];
    const [activeGenre, setActiveGenre] = useState("Tümü");

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <TopBar />
            <MainBar />
            <Head />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-12">
                {/* Hero / Header Section */}
                <div className="relative rounded-[40px] overflow-hidden bg-[#020617] border border-white/5 p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -ml-32 -mb-32"></div>
                    
                    <div className="relative z-10 max-w-2xl space-y-6 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                            <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/20">
                                Koleksiyon
                            </span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight">
                            PlayStation 5 <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-600">Oyun Dünyası</span>
                        </h1>
                        <p className="text-lg text-slate-400 font-medium">
                            En yeni nesil teknolojilerle donatılmış, büyüleyici hikayelere sahip PS5 oyunlarını keşfedin.
                        </p>
                    </div>

                    <div className="relative z-10 hidden lg:flex items-center justify-center">
                        <div className="w-64 h-64 bg-gradient-to-tr from-blue-600 to-sky-400 rounded-full blur-[80px] opacity-20 absolute animate-pulse"></div>
                        <Gamepad2 size={240} className="text-white/10 rotate-12" />
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white/5 border border-white/5 p-4 rounded-[32px] backdrop-blur-md">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
                        {genres.map(f => (
                            <button 
                                key={f} 
                                onClick={() => setActiveGenre(f)}
                                className={cn(
                                    "whitespace-nowrap px-6 py-2.5 rounded-2xl text-xs font-bold transition-all border",
                                    activeGenre === f 
                                        ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20" 
                                        : "bg-white/5 text-slate-400 border-white/5 hover:border-white/20 hover:text-white"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-72">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                                type="text" 
                                placeholder="Oyun ara..." 
                                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs outline-none focus:border-blue-500/50 transition-all"
                            />
                        </div>
                        <button className="bg-slate-900 border border-white/5 p-3 rounded-2xl text-slate-400 hover:text-white transition-all">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {/* Games Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {games
                        .filter(g => activeGenre === "Tümü" || g.genre === activeGenre)
                        .map(g => <GameCard key={g.id} g={g} />)
                    }
                </section>

                {/* Load More / Info */}
                <div className="text-center pt-12">
                    <p className="text-slate-500 text-sm font-medium italic">Toplam {games.length} muazzam deneyim listeleniyor.</p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
