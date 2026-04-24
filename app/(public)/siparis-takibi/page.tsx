"use client";

import React, { useState } from "react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import { Search, Package, Truck, CheckCircle2, AlertCircle, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrderTrackingPage() {
    const [orderId, setOrderId] = useState("");
    const [email, setEmail] = useState("");
    const [showStatus, setShowStatus] = useState(false);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderId && email) {
            setShowStatus(true);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <TopBar />
            <MainBar />
            <Head />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                
                {/* Hero / Header */}
                <div className="relative rounded-[40px] overflow-hidden bg-[#020617] border border-white/5 p-12 lg:p-16 mb-16 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none"></div>
                    
                    <div className="relative z-10 max-w-2xl space-y-6">
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                            <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/20">
                                Lojistik Takip
                            </span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight">
                            Siparişini <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-600">Adım Adım İzle</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium">
                            Satın aldığın efsanevi donanımların ve oyunların nerede olduğunu anlık olarak takip et.
                        </p>
                    </div>

                    <div className="relative z-10 hidden lg:flex items-center justify-center">
                        <div className="w-64 h-64 bg-gradient-to-tr from-blue-600 to-sky-400 rounded-full blur-[80px] opacity-20 absolute animate-pulse"></div>
                        <Truck size={200} className="text-white/10 rotate-6" />
                    </div>
                </div>

                <div className="max-w-3xl mx-auto space-y-12">
                    {/* Tracking Form Card */}
                    <div className="bg-[#0b1220]/50 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none"></div>
                        
                        <form onSubmit={handleTrack} className="space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest ml-1">Sipariş Numarası</label>
                                    <div className="relative group">
                                        <Package size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Örn: PX-12345"
                                            required
                                            value={orderId}
                                            onChange={(e) => setOrderId(e.target.value)}
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-800"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest ml-1">E-Posta Adresi</label>
                                    <div className="relative group">
                                        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="ornek@alanadi.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/30 active:scale-95 group"
                            >
                                SORGULA VE TAKİP ET
                                <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                            </button>
                        </form>
                    </div>

                    {/* Result Card */}
                    {showStatus && (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="bg-[#0b1220]/80 backdrop-blur-2xl border border-blue-500/20 rounded-[48px] p-10 lg:p-14 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none"></div>
                                
                                <div className="flex flex-col md:flex-row items-center justify-between mb-12 border-b border-white/5 pb-10 gap-8">
                                    <div className="text-center md:text-left">
                                        <div className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-2">Güncel Durum</div>
                                        <div className="text-2xl font-black text-emerald-400 flex items-center justify-center md:justify-start gap-3">
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/20"></div>
                                            Kargoya Verildi
                                        </div>
                                    </div>
                                    <div className="text-center md:text-right">
                                        <div className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-2">Tahmini Teslimat</div>
                                        <div className="text-2xl font-black text-white tracking-tighter">21 Nisan 2024</div>
                                    </div>
                                </div>

                                {/* Tracking Timeline */}
                                <div className="relative pl-10 space-y-12">
                                    {/* Vertical Line */}
                                    <div className="absolute left-[11px] top-2 bottom-2 w-1 bg-white/[0.03] rounded-full"></div>
                                    
                                    {[
                                        { title: "Sipariş Hazırlanıyor", date: "18 Nisan 2024, 09:45", active: true, done: true, icon: Package },
                                        { title: "Kargoya Verildi", date: "19 Nisan 2024, 14:20", active: true, done: true, icon: Truck },
                                        { title: "Yolda", date: "Siparişiniz transfer merkezinde.", active: true, done: false, icon: Truck },
                                        { title: "Teslim Edildi", date: "Henüz ulaşmadı.", active: false, done: false, icon: CheckCircle2 },
                                    ].map((step, i) => (
                                        <div key={i} className={cn("relative group transition-all duration-500", step.active ? 'opacity-100' : 'opacity-20')}>
                                            {/* Dot / Icon */}
                                            <div className={cn(
                                                "absolute -left-[10px] top-0 w-6 h-6 rounded-full border-4 flex items-center justify-center transition-all duration-500 z-10 shadow-2xl",
                                                step.done ? "bg-emerald-500 border-slate-950 text-white" : 
                                                step.active ? "bg-slate-950 border-emerald-500 text-emerald-400" : "bg-slate-950 border-white/10 text-slate-700"
                                            )}>
                                                {step.done ? <CheckCircle2 size={10} /> : <div className="w-1 h-1 bg-current rounded-full" />}
                                            </div>
                                            
                                            <div className="pl-6">
                                                <h3 className={cn("text-lg font-black tracking-tight transition-colors", step.active ? "text-white" : "text-slate-600")}>{step.title}</h3>
                                                <p className="text-sm text-slate-500 font-medium mt-1">{step.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Support Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] flex gap-6 hover:bg-white/[0.04] transition-all duration-500">
                            <div className="w-12 h-12 bg-blue-600/10 text-blue-400 rounded-2xl flex items-center justify-center shrink-0"><AlertCircle size={24} /></div>
                            <div className="space-y-2">
                                <h4 className="font-black text-white tracking-tight uppercase text-xs">Sipariş No Bulma</h4>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    Sipariş numaranız, satın alma sonrası size gönderilen onay e-postasında ve faturanızda yer almaktadır.
                                </p>
                            </div>
                        </div>
                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] flex gap-6 hover:bg-white/[0.04] transition-all duration-500">
                            <div className="w-12 h-12 bg-emerald-600/10 text-emerald-400 rounded-2xl flex items-center justify-center shrink-0"><ShieldCheck size={24} /></div>
                            <div className="space-y-2">
                                <h4 className="font-black text-white tracking-tight uppercase text-xs">Güvenli Lojistik</h4>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    Tüm gönderilerimiz sigortalıdır ve en güvenli kargo partnerleri ile adresinize ulaştırılır.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
