"use client";

import React from "react";
import { 
    TrendingUp, 
    ShoppingCart, 
    Users, 
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Activity,
    Package,
    Search,
    Filter,
    Download
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header with Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <Activity size={14} className="text-blue-400" />
                        Sitenizin anlık performans verileri ve istatistikleri.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-slate-900 border border-white/10 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                        <Download size={16} />
                        Rapor İndir
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all">
                        <TrendingUp size={16} />
                        Analiz Yap
                    </button>
                </div>
            </div>

            {/* Stats Grid - Glassmorphism Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Toplam Gelir", value: "₺242.000", change: "+12.5%", icon: CreditCard, color: "from-blue-600/20 to-blue-400/20", iconColor: "text-blue-400" },
                    { label: "Siparişler", value: "1,240", change: "+8.2%", icon: ShoppingCart, color: "from-emerald-600/20 to-emerald-400/20", iconColor: "text-emerald-400" },
                    { label: "Yeni Müşteriler", value: "48", change: "-2.4%", icon: Users, color: "from-sky-600/20 to-sky-400/20", iconColor: "text-sky-400" },
                    { label: "Aktif Kullanıcı", value: "312", change: "+4.1%", icon: Activity, color: "from-purple-600/20 to-purple-400/20", iconColor: "text-purple-400" },
                ].map((stat, i) => (
                    <div key={i} className="relative group overflow-hidden bg-[#020617] border border-white/10 p-6 rounded-3xl hover:border-blue-500/40 transition-all duration-500">
                        <div className={cn("absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20 bg-gradient-to-br transition-all group-hover:opacity-40", stat.color)}></div>
                        
                        <div className="flex items-start justify-between relative z-10">
                            <div className={cn("p-3 rounded-2xl bg-white/5 border border-white/5", stat.iconColor)}>
                                <stat.icon size={22} />
                            </div>
                            <div className={cn(
                                "px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1",
                                stat.change.startsWith("+") ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                            )}>
                                {stat.change} 
                                {stat.change.startsWith("+") ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            </div>
                        </div>
                        
                        <div className="mt-6 relative z-10">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</h3>
                            <p className="text-3xl font-black text-white mt-1 tabular-nums">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content: Chart & Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Sales Chart Placeholder - Styled as a real chart */}
                <div className="lg:col-span-2 bg-[#020617] border border-white/10 rounded-3xl p-8 flex flex-col group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full"></div>
                    
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h2 className="text-xl font-bold text-white">Satış Performansı</h2>
                            <p className="text-xs text-slate-500 font-medium">Son 30 günlük gelir değişimi</p>
                        </div>
                        <div className="flex bg-slate-900/50 border border-white/5 p-1 rounded-xl">
                            {['7G', '1A', '3A', '1Y'].map(t => (
                                <button key={t} className={cn(
                                    "px-3 py-1 rounded-lg text-[10px] font-bold transition-all",
                                    t === '1A' ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white"
                                )}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* CSS Based Chart Representation */}
                    <div className="flex-1 h-64 flex items-end gap-2 relative z-10">
                        {[40, 65, 30, 85, 45, 70, 90, 55, 60, 40, 80, 95].map((h, i) => (
                            <div key={i} className="flex-1 group/bar relative">
                                <div 
                                    style={{ height: `${h}%` }} 
                                    className="w-full bg-gradient-to-t from-blue-600 to-sky-400 rounded-t-lg transition-all duration-1000 group-hover/bar:brightness-125 relative shadow-lg shadow-blue-500/10"
                                >
                                    {/* Tooltip on hover */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl">
                                        ₺{(h * 120).toLocaleString()}
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-600 uppercase">
                                    {['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'][i]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categories Breakdown */}
                <div className="bg-[#020617] border border-white/10 rounded-3xl p-8 flex flex-col relative overflow-hidden">
                    <h2 className="text-xl font-bold text-white mb-6">Kategori Dağılımı</h2>
                    <div className="space-y-6 flex-1">
                        {[
                            { name: "Konsollar", percent: 65, color: "bg-blue-500", count: "842 Satış" },
                            { name: "Oyunlar", percent: 45, color: "bg-purple-500", count: "512 Satış" },
                            { name: "Aksesuarlar", percent: 25, color: "bg-emerald-500", count: "210 Satış" },
                            { name: "Dijital", percent: 15, color: "bg-amber-500", count: "145 Satış" },
                        ].map((cat) => (
                            <div key={cat.name} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-slate-300">{cat.name}</span>
                                    <span className="text-xs text-slate-500 font-medium">{cat.count}</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        style={{ width: `${cat.percent}%` }} 
                                        className={cn("h-full rounded-full transition-all duration-1000", cat.color)}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-8 w-full border border-white/10 hover:bg-white/5 text-white font-bold py-3 rounded-2xl transition-all text-xs uppercase tracking-wider">
                        Tüm Detayları Gör
                    </button>
                </div>
            </div>

            {/* Bottom Section: Recent Orders */}
            <div className="bg-[#020617] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">Son Siparişler</h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">Sitenizden verilen en güncel 5 sipariş</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                                type="text" 
                                placeholder="Sipariş No..." 
                                className="bg-slate-900/50 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-blue-500 w-40 sm:w-64 transition-all"
                            />
                        </div>
                        <button className="p-2.5 bg-slate-900 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-colors">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.01] text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                <th className="px-8 py-5">Sipariş No</th>
                                <th className="px-8 py-5">Müşteri</th>
                                <th className="px-8 py-5">Ürün</th>
                                <th className="px-8 py-5">Tutar</th>
                                <th className="px-8 py-5">Durum</th>
                                <th className="px-8 py-5 text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[
                                { id: "#PX-8421", name: "Ahmet Yılmaz", product: "PS5 Pro Bundle", amount: "₺28.499", status: "Tamamlandı", date: "2 dakika önce", initial: "AY" },
                                { id: "#PX-8420", name: "Mehmet Demir", product: "DualSense Edge", amount: "₺6.499", status: "Beklemede", date: "15 dakika önce", initial: "MD" },
                                { id: "#PX-8419", name: "Canan Öz", product: "FC 25 - PS5", amount: "₺1.899", status: "Hazırlanıyor", date: "42 dakika önce", initial: "CÖ" },
                                { id: "#PX-8418", name: "Burak Arslan", product: "God of War Ragnarök", amount: "₺1.499", status: "Tamamlandı", date: "1 saat önce", initial: "BA" },
                                { id: "#PX-8417", name: "Selim Ak", product: "Pulse Elite Headset", amount: "₺5.299", status: "İptal Edildi", date: "3 saat önce", initial: "SA" },
                            ].map((order, i) => (
                                <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="px-8 py-5">
                                        <span className="font-bold text-blue-400 text-xs">{order.id}</span>
                                        <p className="text-[10px] text-slate-600 font-medium mt-1 uppercase tracking-tight">{order.date}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-[10px] font-bold text-white border border-white/5">
                                                {order.initial}
                                            </div>
                                            <span className="font-bold text-white text-xs">{order.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <Package size={14} className="text-slate-500" />
                                            <span className="text-slate-400 text-xs font-medium">{order.product}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-black text-white text-sm">{order.amount}</td>
                                    <td className="px-8 py-5">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                            order.status === "Tamamlandı" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                            order.status === "Beklemede" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                            order.status === "Hazırlanıyor" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : 
                                            "bg-red-500/10 text-red-400 border border-red-500/20"
                                        )}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-white/[0.01] border-t border-white/5 text-center">
                    <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">
                        Tüm Siparişleri Görüntüle →
                    </button>
                </div>
            </div>
        </div>
    );
}
