"use client";

import React, { useState, useEffect } from "react";
import { 
    FileSpreadsheet, 
    TrendingUp, 
    TrendingDown, 
    Calendar, 
    Download,
    BarChart3,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Users,
    ShoppingCart,
    CreditCard,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getReportStats } from "@/lib/actions/report-actions";

export default function AdminReports() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setIsLoading(true);
        const data = await getReportStats();
        setStats(data);
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Veriler Analiz Ediliyor...</p>
            </div>
        );
    }

    const performanceCards = [
        { 
            label: "Toplam Hasılat", 
            value: `₺${stats?.totalRevenue?.toLocaleString('tr-TR')}`, 
            info: "+12.5% geçen aya göre", 
            icon: CreditCard, 
            color: "text-emerald-400", 
            bg: "bg-emerald-400/10" 
        },
        { 
            label: "Toplam Müşteri", 
            value: stats?.totalCustomers || "0", 
            info: `+${stats?.newCustomersLastMonth || 0} yeni müşteri`, 
            icon: Users, 
            color: "text-blue-400", 
            bg: "bg-blue-400/10" 
        },
        { 
            label: "Sipariş Sayısı", 
            value: stats?.totalOrders || "0", 
            info: "Bekleyen 3 sipariş var", 
            icon: ShoppingCart, 
            color: "text-purple-400", 
            bg: "bg-purple-400/10" 
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Raporlar & Analiz
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <BarChart3 className="text-blue-400" size={14} />
                        İşletmenizin büyüme verilerini ve performans metriklerini inceleyin.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-slate-900 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                        <Calendar size={18} />
                        Tarih Aralığı
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20">
                        <Download size={18} />
                        PDF Raporu Al
                    </button>
                </div>
            </div>

            {/* Performance Overviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {performanceCards.map((stat, i) => (
                    <div key={i} className="bg-[#020617] border border-white/10 p-8 rounded-3xl group hover:border-blue-500/20 transition-all">
                        <div className="flex items-start justify-between">
                            <div className={cn("p-4 rounded-2xl", stat.bg, stat.color)}>
                                <stat.icon size={28} />
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-black text-white mt-1 tabular-nums">{stat.value}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-400">
                            {stat.info.startsWith("+") ? <ArrowUpRight size={14} className="text-emerald-400" /> : <ArrowDownRight size={14} className="text-red-400" />}
                            {stat.info}
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Charts Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Breakdown */}
                <div className="bg-[#020617] border border-white/10 rounded-[32px] p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Gelir Analizi</h2>
                        <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Detaylar →</button>
                    </div>
                    
                    <div className="h-64 flex items-end gap-3 px-4">
                        {[60, 45, 80, 55, 90, 70, 40].map((h, i) => (
                            <div key={i} className="flex-1 space-y-4">
                                <div className="h-full flex items-end gap-1">
                                    <div style={{ height: `${h}%` }} className="flex-1 bg-blue-600 rounded-t-lg opacity-80 hover:opacity-100 transition-all shadow-lg shadow-blue-500/10"></div>
                                    <div style={{ height: `${h * 0.7}%` }} className="flex-1 bg-purple-600 rounded-t-lg opacity-40 hover:opacity-60 transition-all shadow-lg shadow-purple-500/10"></div>
                                </div>
                                <div className="text-center text-[9px] font-bold text-slate-600 uppercase">G{i+1}</div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex items-center justify-center gap-8 pt-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                            <div className="w-3 h-3 bg-blue-600 rounded-full shadow-sm shadow-blue-500/20"></div> Brüt Satış
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                            <div className="w-3 h-3 bg-purple-600 rounded-full shadow-sm shadow-purple-500/20"></div> Net Kar
                        </div>
                    </div>
                </div>

                {/* Sales by Category */}
                <div className="bg-[#020617] border border-white/10 rounded-[32px] p-8 flex flex-col items-center text-center justify-between">
                    <div className="w-full text-left mb-8">
                        <h2 className="text-xl font-bold text-white">Kategori Dağılımı</h2>
                        <p className="text-xs text-slate-500 mt-1">Sistemdeki ürünlerin kategorilere göre sayısı</p>
                    </div>
                    
                    <div className="relative w-48 h-48 mb-8">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-blue-600" strokeDasharray="251.2" strokeDashoffset="62.8" />
                            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-purple-600" strokeDasharray="251.2" strokeDashoffset="188.4" />
                            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-emerald-500" strokeDasharray="251.2" strokeDashoffset="220" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-white">{stats?.categoryStats?.length || 0}</span>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Kategori</span>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-4">
                        {stats?.categoryStats?.slice(0, 4).map((c: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-950 border border-white/5 rounded-2xl">
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-2 h-2 rounded-full", i === 0 ? "bg-blue-600" : i === 1 ? "bg-purple-600" : "bg-emerald-500")}></div>
                                    <span className="text-[10px] font-bold text-slate-400 truncate max-w-[80px]">{c.name}</span>
                                </div>
                                <span className="text-xs font-black text-white">{c.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Products Table */}
            <div className="bg-[#020617] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">En Çok Satan Ürünler</h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">Sistemdeki satış adetlerine göre ilk 5 ürün</p>
                    </div>
                    <button className="p-3 bg-slate-900 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all">
                        <Filter size={18} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.01] text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                <th className="px-8 py-5">Ürün Adı</th>
                                <th className="px-8 py-5">Kategori</th>
                                <th className="px-8 py-5 text-center">Satış Adedi</th>
                                <th className="px-8 py-5 text-center">Stok</th>
                                <th className="px-8 py-5">Birim Fiyat</th>
                                <th className="px-8 py-5 text-right">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats?.topProducts?.map((p: any, i: number) => (
                                <tr key={i} className="hover:bg-white/[0.01] transition-all group">
                                    <td className="px-8 py-6 font-bold text-white text-sm">{p.name}</td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-black uppercase text-slate-400">{p.category || "Genel"}</span>
                                    </td>
                                    <td className="px-8 py-6 text-center font-black text-blue-400">{p.sales}</td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className={cn("w-1.5 h-1.5 rounded-full", p.stock > 10 ? "bg-emerald-500" : "bg-red-500")}></div>
                                            <span className="text-xs font-bold text-slate-300">{p.stock}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-black text-white">₺{p.price.toLocaleString('tr-TR')}</td>
                                    <td className="px-8 py-6 text-right">
                                        <TrendingUp size={18} className="text-emerald-400 inline" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
