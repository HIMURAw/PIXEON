"use client";

import React, { useState, useEffect } from "react";
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
    Download,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getDashboardStats } from "@/lib/actions/report-actions";
import Link from "next/link";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        setIsLoading(true);
        const data = await getDashboardStats();
        setStats(data);
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Dashboard Verileri Yükleniyor...</p>
            </div>
        );
    }

    const statCards = [
        { 
            label: "Toplam Gelir", 
            value: `₺${stats?.stats?.totalRevenue?.toLocaleString('tr-TR') || "0"}`, 
            change: stats?.stats?.revenueChange || "+0.0%", 
            icon: CreditCard, 
            color: "from-blue-600/20 to-blue-400/20", 
            iconColor: "text-blue-400" 
        },
        { 
            label: "Siparişler", 
            value: stats?.stats?.totalOrders?.toLocaleString('tr-TR') || "0", 
            change: stats?.stats?.ordersChange || "+0.0%", 
            icon: ShoppingCart, 
            color: "from-emerald-600/20 to-emerald-400/20", 
            iconColor: "text-emerald-400" 
        },
        { 
            label: "Yeni Müşteriler (30 Gün)", 
            value: stats?.stats?.newCustomers?.toLocaleString('tr-TR') || "0", 
            change: stats?.stats?.customersChange || "+0.0%", 
            icon: Users, 
            color: "from-sky-600/20 to-sky-400/20", 
            iconColor: "text-sky-400" 
        },
        { 
            label: "Kayıtlı Kullanıcı", 
            value: stats?.stats?.totalUsers?.toLocaleString('tr-TR') || "0", 
            change: stats?.stats?.usersChange || "+0.0%", 
            icon: Activity, 
            color: "from-purple-600/20 to-purple-400/20", 
            iconColor: "text-purple-400" 
        },
    ];

    const categoryColors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-pink-500"];

    const filteredOrders = stats?.recentOrders?.filter((order: any) => 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

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
                    <button 
                        onClick={fetchDashboardStats}
                        className="bg-slate-900 border border-white/10 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
                    >
                        Verileri Yenile
                    </button>
                    <Link 
                        href="/admin/reports" 
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                    >
                        <TrendingUp size={16} />
                        Detaylı Raporlar
                    </Link>
                </div>
            </div>

            {/* Stats Grid - Glassmorphism Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
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
                
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-[#020617] border border-white/10 rounded-3xl p-8 flex flex-col group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full"></div>
                    
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h2 className="text-xl font-bold text-white">Satış Performansı</h2>
                            <p className="text-xs text-slate-500 font-medium">Bu yılın aylık brüt satış gelirleri</p>
                        </div>
                    </div>

                    {/* CSS Based Chart Representation */}
                    <div className="flex-1 h-64 flex items-end gap-2 relative z-10 pb-6">
                        {stats?.monthlySales?.map((val: number, i: number) => {
                            const maxVal = Math.max(...stats.monthlySales, 1000);
                            const h = (val / maxVal) * 100;
                            return (
                                <div key={i} className="flex-1 group/bar relative h-full flex flex-col justify-end">
                                    <div 
                                        style={{ height: `${Math.max(h, 3)}%` }} 
                                        className="w-full bg-gradient-to-t from-blue-600 to-sky-400 rounded-t-lg transition-all duration-1000 group-hover/bar:brightness-125 relative shadow-lg shadow-blue-500/10"
                                    >
                                        {/* Tooltip on hover */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl pointer-events-none">
                                            ₺{val.toLocaleString('tr-TR')}
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-600 uppercase">
                                        {['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'][i]}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Categories Breakdown */}
                <div className="bg-[#020617] border border-white/10 rounded-3xl p-8 flex flex-col relative overflow-hidden">
                    <h2 className="text-xl font-bold text-white mb-6">Kategori Dağılımı</h2>
                    <div className="space-y-6 flex-1">
                        {stats?.categorySales?.slice(0, 5).map((cat: any, i: number) => (
                            <div key={cat.name} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-slate-300 truncate max-w-[120px]">{cat.name}</span>
                                    <span className="text-xs text-slate-500 font-medium">{cat.count}</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        style={{ width: `${cat.percent}%` }} 
                                        className={cn("h-full rounded-full transition-all duration-1000", categoryColors[i % categoryColors.length])}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {(!stats?.categorySales || stats.categorySales.length === 0) && (
                            <p className="text-xs text-slate-500 italic text-center py-8">Kategori verisi bulunamadı.</p>
                        )}
                    </div>
                    <Link href="/admin/reports" className="mt-8 w-full border border-white/10 hover:bg-white/5 text-white font-bold py-3 rounded-2xl transition-all text-xs text-center uppercase tracking-wider">
                        Tüm Detayları Gör
                    </Link>
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
                                placeholder="Ara..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-slate-900/50 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-blue-500 w-40 sm:w-64 transition-all"
                            />
                        </div>
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
                                <th className="px-8 py-5 text-right">Detay</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOrders.map((order: any, i: number) => (
                                <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="px-8 py-5">
                                        <span className="font-bold text-blue-400 text-xs">{order.orderNumber}</span>
                                        <p className="text-[10px] text-slate-600 font-medium mt-1 uppercase tracking-tight">{order.relativeTime}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-[10px] font-bold text-white border border-white/5">
                                                {order.initials}
                                            </div>
                                            <span className="font-bold text-white text-xs">{order.userName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <Package size={14} className="text-slate-500" />
                                            <span className="text-slate-400 text-xs font-medium truncate max-w-[200px]">{order.productSummary}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-black text-white text-sm">₺{order.amount?.toLocaleString('tr-TR')}</td>
                                    <td className="px-8 py-5">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                            order.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                            order.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                            order.status === "PREPARING" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : 
                                            order.status === "SHIPPED" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : 
                                            "bg-red-500/10 text-red-400 border border-red-500/20"
                                        )}>
                                            {order.status === "COMPLETED" ? "Tamamlandı" :
                                             order.status === "PENDING" ? "Beklemede" :
                                             order.status === "PREPARING" ? "Hazırlanıyor" :
                                             order.status === "SHIPPED" ? "Kargoda" :
                                             order.status === "CANCELLED" ? "İptal Edildi" : order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <Link href={`/admin/orders?orderNumber=${order.orderNumber}`} className="inline-block p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                                            <ArrowUpRight size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-slate-500 text-xs italic">
                                        Sipariş bulunmuyor.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-white/[0.01] border-t border-white/5 text-center">
                    <Link href="/admin/orders" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">
                        Tüm Siparişleri Görüntüle →
                    </Link>
                </div>
            </div>
        </div>
    );
}

