"use client";

import React from "react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import { Zap, ShieldCheck, Mail, Ticket } from "lucide-react";
import FilteredProductsSection from "@/components/products/FilteredProductsSection";

export default function DijitalKodlarPage() {

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

                {/* Dynamic Products with Filtering */}
                <FilteredProductsSection 
                    initialCategory="a5855599-55ee-4a9a-b544-0f3adcdcd7f1" 
                    hideCategoryFilter={true} 
                    hideHeader={true} 
                />

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
