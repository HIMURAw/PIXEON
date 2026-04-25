"use client";

import React from "react";
import { 
    LifeBuoy, 
    Search, 
    Filter, 
    Plus, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    MessageSquare, 
    User, 
    ArrowRight, 
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Zap,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSupport() {
    const tickets = [
        { id: "#TKT-1024", user: "Murat S.", subject: "Kargom Nerede?", priority: "High", status: "Open", date: "10 dk önce", category: "Lojistik" },
        { id: "#TKT-1023", user: "Zeynep L.", subject: "İade Talebi - Yanlış Ürün", priority: "Medium", status: "In Progress", date: "1 saat önce", category: "İade" },
        { id: "#TKT-1022", user: "Hakan V.", subject: "PS Plus Kodu Çalışmıyor", priority: "Emergency", status: "Open", date: "2 saat önce", category: "Teknik" },
        { id: "#TKT-1021", user: "Ayşe T.", subject: "Ödeme Onayı Bekliyor", priority: "Low", status: "Closed", date: "5 saat önce", category: "Ödeme" },
        { id: "#TKT-1020", user: "Deniz G.", subject: "Ürün Bilgisi Hakkında", priority: "Low", status: "Closed", date: "1 gün önce", category: "Bilgi" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Destek Merkezi
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <LifeBuoy className="text-blue-400" size={14} />
                        Müşteri taleplerini yanıtlayın, sorunları çözün ve memnuniyeti artırın.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-[#020617] border border-white/10 p-1.5 rounded-2xl items-center gap-2">
                        <div className="px-4 py-1.5 bg-blue-600/10 text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest">
                            8 Aktif
                        </div>
                        <div className="px-4 py-1.5 bg-slate-900 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                            142 Tamamlanan
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Yeni Talepler", value: "3", icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10" },
                    { label: "Yanıt Bekleyen", value: "5", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
                    { label: "Çözüm Süresi", value: "2.4 sa", icon: Zap, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { label: "Memnuniyet", value: "%98", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#020617] border border-white/10 p-6 rounded-3xl flex items-center gap-4 shadow-lg">
                        <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-xl font-black text-white mt-0.5">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Support List & Controls */}
            <div className="space-y-6">
                <div className="bg-[#020617] border border-white/10 p-4 rounded-3xl flex flex-col lg:flex-row items-center gap-4 shadow-xl">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Talep ID, Müşteri veya Konu ara..." 
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-12 py-3 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-white/5 rounded-2xl text-sm font-bold text-slate-400 hover:text-white transition-all">
                            <Filter size={18} />
                            Filtrele
                        </button>
                        <select className="bg-slate-900 border border-white/5 rounded-2xl px-5 py-3 text-sm font-bold text-slate-400 outline-none focus:border-blue-500/50 transition-all cursor-pointer min-w-[160px]">
                            <option>Tüm Durumlar</option>
                            <option>Açık</option>
                            <option>İşlemde</option>
                            <option>Kapalı</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {tickets.map((tkt) => (
                        <div key={tkt.id} className="bg-[#0b1220]/50 border border-white/5 rounded-[32px] p-6 hover:border-blue-500/30 transition-all duration-300 group flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6 w-full lg:w-auto">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all",
                                    tkt.status === "Open" ? "bg-red-500/10 border-red-500/20 text-red-400 shadow-lg shadow-red-500/5" :
                                    tkt.status === "In Progress" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                    "bg-slate-900 border-white/5 text-slate-600"
                                )}>
                                    <MessageSquare size={20} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{tkt.id}</span>
                                        <h3 className="font-bold text-white text-base tracking-tight">{tkt.subject}</h3>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">Başlatan: {tkt.user} • Kategori: {tkt.category}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between w-full lg:w-auto lg:justify-end gap-8">
                                <div className="flex items-center gap-12">
                                    <div className="text-center lg:text-right hidden sm:block">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Öncelik</p>
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full",
                                            tkt.priority === "Emergency" ? "bg-red-600 text-white" :
                                            tkt.priority === "High" ? "bg-orange-500/20 text-orange-400" :
                                            tkt.priority === "Medium" ? "bg-blue-500/20 text-blue-400" : "bg-slate-800 text-slate-500"
                                        )}>{tkt.priority}</span>
                                    </div>
                                    <div className="text-center lg:text-right">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Son İşlem</p>
                                        <p className="text-xs font-bold text-white">{tkt.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-500 transition-all text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95">
                                        Yanıtla
                                        <ArrowRight size={14} />
                                    </button>
                                    <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-6">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Görüntülenen: 5 / 150 Talep</p>
                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-slate-900 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-50 transition-all" disabled>
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3].map(i => (
                                <button key={i} className={cn(
                                    "w-10 h-10 rounded-xl text-xs font-black transition-all border border-transparent",
                                    i === 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:bg-white/5 hover:border-white/10"
                                )}>{i}</button>
                            ))}
                        </div>
                        <button className="p-3 bg-slate-900 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
