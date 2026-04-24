"use client";

import React from "react";
import { 
    TicketPlus, 
    Search, 
    Filter, 
    MoreHorizontal, 
    Pencil, 
    Trash2, 
    Calendar,
    Tag,
    Percent,
    Copy,
    Plus,
    CheckCircle2,
    Clock,
    XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminCoupons() {
    const coupons = [
        { id: 1, code: "PIXEON2024", type: "Yüzde", value: "10%", minSpend: "₺2.500", uses: "42/100", expiry: "30 Ara 2024", status: "Active" },
        { id: 2, code: "PS5LAUNCH", type: "Sabit", value: "₺500", minSpend: "₺15.000", uses: "85/200", expiry: "15 Haz 2024", status: "Active" },
        { id: 3, code: "WELCOME50", type: "Yüzde", value: "5%", minSpend: "₺500", uses: "124/∞", expiry: "Yok", status: "Active" },
        { id: 4, code: "SPRING20", type: "Yüzde", value: "20%", minSpend: "₺1.000", uses: "50/50", expiry: "01 May 2024", status: "Expired" },
        { id: 5, code: "DUMMY10", type: "Sabit", value: "₺100", minSpend: "₺1.000", uses: "0/10", expiry: "20 May 2024", status: "Inactive" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Kupon & İndirim Yönetimi
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <Tag className="text-blue-400" size={14} />
                        Kampanya kodları oluşturun ve kullanım istatistiklerini takip edin.
                    </p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                    <Plus size={20} />
                    Yeni Kupon Oluştur
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#020617] border border-white/10 p-4 rounded-3xl flex flex-col lg:flex-row items-center gap-4 shadow-xl">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Kupon kodu ara..." 
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
                        <option>Aktif</option>
                        <option>Süresi Dolan</option>
                        <option>Pasif</option>
                    </select>
                </div>
            </div>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon) => (
                    <div key={coupon.id} className="bg-[#020617] border border-white/10 rounded-[32px] p-8 space-y-6 group hover:border-blue-500/40 transition-all duration-500 relative overflow-hidden">
                        {/* Status Overlay for Expired/Inactive */}
                        {coupon.status !== "Active" && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                <span className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                                    coupon.status === "Expired" ? "bg-red-500/20 text-red-400 border-red-500/40" : "bg-slate-900/80 text-slate-500 border-white/10"
                                )}>
                                    {coupon.status === "Expired" ? "SÜRESİ DOLDU" : "PASİF"}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center justify-between relative z-0">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
                                    <Percent size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white">{coupon.type} İndirim</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Kupon Türü</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"><Pencil size={16} /></button>
                                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-red-400 transition-all"><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 text-center space-y-4 relative">
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#020617] rounded-full border-r border-white/5"></div>
                            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#020617] rounded-full border-l border-white/5"></div>
                            
                            <div className="space-y-1">
                                <div className="text-2xl font-black text-white tracking-widest uppercase flex items-center justify-center gap-2">
                                    {coupon.code}
                                    <button className="text-slate-600 hover:text-blue-400 transition-colors"><Copy size={16} /></button>
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">İNDİRİM KODU</p>
                            </div>
                            
                            <div className="pt-4 border-t border-dashed border-white/10 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-600 uppercase">DEĞER</p>
                                    <p className="text-lg font-black text-blue-400">{coupon.value}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-600 uppercase">MİN. HARCAMA</p>
                                    <p className="text-lg font-black text-white">{coupon.minSpend}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                <Clock size={14} className="text-slate-600" />
                                {coupon.uses} Kullanım
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 justify-end">
                                <Calendar size={14} className="text-slate-600" />
                                {coupon.expiry}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Placeholder */}
                <button className="border-2 border-dashed border-white/10 rounded-[32px] h-full min-h-[300px] flex flex-col items-center justify-center gap-4 group hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-500">
                    <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                        <Plus size={32} />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-black text-white">Yeni Kupon Oluştur</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Özel indirimler tanımlayın</p>
                    </div>
                </button>
            </div>
        </div>
    );
}
