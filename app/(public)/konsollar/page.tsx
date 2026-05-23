"use client";

import React from "react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import { Cpu } from "lucide-react";
import FilteredProductsSection from "@/components/products/FilteredProductsSection";
import SidebarLayout from "@/components/categories/SidebarLayout";
import NewProductsSidebar from "@/components/products/newProducts/NewProductsSidebar";

export default function KonsollarPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-12 pb-24">
                <SidebarLayout>
                    <div className="space-y-16">
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
                                    Güç, performans and eşsiz oyun deneyimi. En yeni PS5 modellerini ve efsaneleşmiş PS4 versiyonlarını en iyi fiyatlarla keşfedin.
                                </p>
                            </div>

                            <div className="relative z-10 hidden lg:flex items-center justify-center">
                                <div className="w-80 h-80 bg-gradient-to-tr from-blue-600 to-sky-400 rounded-full blur-[100px] opacity-20 absolute animate-pulse"></div>
                                <Cpu size={280} className="text-white/5 -rotate-6" />
                            </div>
                        </div>

                        {/* Products Grid with Sidebar */}
                        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-16">
                            <aside className="order-2 lg:order-1">
                                <NewProductsSidebar />
                            </aside>
                            <div className="order-1 lg:order-2 min-w-0">
                                <FilteredProductsSection 
                                    initialCategory="12492fc3-da7f-49cf-94ba-58d96acfae3f" 
                                    hideCategoryFilter={true} 
                                    hideHeader={true} 
                                />
                            </div>
                        </div>

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
                    </div>
                </SidebarLayout>
            </div>

            <Footer />
        </div>
    );
}

