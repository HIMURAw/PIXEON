"use client";

import React from "react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import { Headset } from "lucide-react";
import FilteredProductsSection from "@/components/products/FilteredProductsSection";

export default function AksesuarlarPage() {

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

                {/* Dynamic Products with Filtering */}
                <FilteredProductsSection 
                    initialCategory="37808224-0d28-4608-b8a3-d015f3822556" 
                    hideCategoryFilter={true} 
                    hideHeader={true} 
                />
            </main>

            <Footer />
        </div>
    );
}
