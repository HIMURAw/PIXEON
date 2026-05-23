"use client";

import React from "react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import { Gamepad2 } from "lucide-react";
import FilteredProductsSection from "@/components/products/FilteredProductsSection";
import SidebarLayout from "@/components/categories/SidebarLayout";
import NewProductsSidebar from "@/components/products/newProducts/NewProductsSidebar";

export default function PS5OyunlarPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-12 pb-24">
                <SidebarLayout>
                    <div className="space-y-12">
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

                        {/* Products Grid with Sidebar */}
                        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-16">
                            <aside className="order-2 lg:order-1">
                                <NewProductsSidebar />
                            </aside>
                            <div className="order-1 lg:order-2 min-w-0">
                                <FilteredProductsSection 
                                    initialCategory="46ea5f63-0f4a-4366-bbc9-cd37a6fcd174" 
                                    hideCategoryFilter={true} 
                                    hideHeader={true} 
                                    keywordFilter="PS5"
                                />
                            </div>
                        </div>
                    </div>
                </SidebarLayout>
            </div>
            <Footer />
        </div>
    );
}
