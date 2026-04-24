"use client";

import React from "react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import Image from "next/image";
import { Award, ShieldCheck, Truck, Zap, Gamepad2, Users, Rocket, Target, Heart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <TopBar />
            <MainBar />
            <Head />

            {/* Hero Section */}
            <section className="relative h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[#020617]/60 z-10"></div>
                    <Image
                        src="/slider/banner.jfif"
                        alt="PlayStation Hero"
                        fill
                        className="object-cover scale-110 animate-pulse-slow"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/20 to-slate-950 z-20"></div>
                </div>

                <div className="relative z-30 text-center px-4 max-w-5xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-4 py-2 rounded-full backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Zap size={14} className="text-blue-400" fill="currentColor" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Oyunun Geleceği</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                        BİZ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-600">PIXEON'UZ</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                        Türkiye'nin en seçkin PlayStation topluluğunu ve alışveriş deneyimini inşa ediyoruz.
                    </p>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-40">
                
                {/* Brand Story */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10 order-2 lg:order-1">
                        <div className="space-y-4">
                            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Hikayemiz</h2>
                            <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
                        </div>
                        <p className="text-xl text-slate-400 leading-relaxed font-medium">
                            PIXEON, 2024 yılında oyun tutkunları tarafından oyun tutkunları için kuruldu. 
                            Sadece bir mağaza değil, PlayStation ekosisteminin kalbinde yer alan bir teknoloji ve eğlence merkeziyiz.
                        </p>
                        <p className="text-lg text-slate-500 leading-relaxed">
                            En yeni konsolları, en heyecan verici oyunları ve özel aksesuarları en hızlı şekilde sizlere ulaştırmayı görev edindik. 
                            Her paketimizde, bir oyuncunun heyecanını taşıyoruz.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-10 pt-6">
                            <div className="space-y-2">
                                <span className="text-5xl font-black text-white tracking-tighter">10K+</span>
                                <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Mutlu Oyuncu</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-5xl font-black text-white tracking-tighter">5K+</span>
                                <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Ürün Çeşidi</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative aspect-square rounded-[60px] overflow-hidden border border-white/5 shadow-2xl group order-1 lg:order-2">
                        <Image
                            src="/logo-nobg.png"
                            alt="PIXEON Office"
                            fill
                            className="object-contain p-20 bg-[#020617] group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-transparent"></div>
                    </div>
                </section>

                {/* Values / Why Us */}
                <section className="space-y-20">
                    <div className="text-center space-y-6">
                        <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Neden PIXEON?</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
                            PlayStation deneyiminizi kusursuz hale getirmek için odaklandığımız temel değerlerimiz.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Award, title: "Yetkili Satış", desc: "Tüm ürünlerimiz %100 orijinal ve resmi distribütör garantilidir.", color: "text-blue-400" },
                            { icon: Truck, title: "Hızlı Teslimat", desc: "Aynı gün kargo ve İstanbul içi hızlı teslimat seçenekleri.", color: "text-sky-400" },
                            { icon: ShieldCheck, title: "Güvenli Alışveriş", desc: "En üst düzey güvenlik protokolleri ile huzurlu bir alışveriş deneyimi.", color: "text-emerald-400" },
                            { icon: Zap, title: "En Yeni Ürünler", desc: "PS5 Pro ve özel sürümler her zaman ilk olarak bizim mağazamızda.", color: "text-amber-400" },
                            { icon: Users, title: "Uzman Destek", desc: "Oyun dünyasına hakim uzman ekibimizle her zaman yanınızdayız.", color: "text-purple-400" },
                            { icon: Gamepad2, title: "Oyuncu Dostu", desc: "Topluluk etkinlikleri ve sadece oyunculara özel fırsatlar.", color: "text-red-400" },
                        ].map((item, i) => (
                            <div key={i} className="group p-10 bg-white/[0.02] border border-white/5 rounded-[40px] hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-500">
                                <div className={cn("mb-8 p-5 bg-slate-950 rounded-[24px] w-fit border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500", item.color)}>
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="relative p-12 lg:p-24 bg-[#020617] rounded-[60px] border border-white/5 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full -mr-64 -mt-64"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-600/5 blur-[150px] rounded-full -ml-64 -mb-64"></div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Misyonumuz</h2>
                            <p className="text-xl text-slate-400 leading-relaxed font-medium">
                                Türkiye'deki PlayStation ekosistemini güçlendirmek ve her seviyeden oyuncuya kusursuz bir deneyim sunmak. Teknolojinin sınırlarını zorlayan ürünleri, samimi bir hizmet anlayışıyla birleştiriyoruz.
                            </p>
                            <button className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-10 py-5 rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-blue-600/20 active:scale-95 group">
                                MAĞAZAYI KEŞFET
                                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-10 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[40px] space-y-4">
                                <div className="p-4 bg-blue-600/10 text-blue-400 rounded-2xl w-fit"><Target size={24} /></div>
                                <h4 className="text-xl font-bold text-white">Vizyonumuz</h4>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">Bölgenin en güvenilir ve yenilikçi oyun perakendecisi olarak sektöre yön vermek.</p>
                            </div>
                            <div className="p-10 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[40px] space-y-4">
                                <div className="p-4 bg-emerald-600/10 text-emerald-400 rounded-2xl w-fit"><Heart size={24} /></div>
                                <h4 className="text-xl font-bold text-white">Değerlerimiz</h4>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">Dürüstlük, tutku, mükemmeliyetçilik ve topluluk odaklı yaklaşım.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <style jsx>{`
                .animate-pulse-slow {
                    animation: pulse 12s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.6;
                        transform: scale(1.1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.15);
                    }
                }
            `}</style>
        </div>
    );
}
