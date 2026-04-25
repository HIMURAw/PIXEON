"use client";

import React from "react";
import { 
    CreditCard, 
    Search, 
    Filter, 
    Download, 
    ArrowUpDown, 
    ChevronLeft, 
    ChevronRight,
    Wallet,
    CheckCircle2,
    Clock,
    AlertCircle,
    Eye,
    RefreshCcw,
    ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminPayments() {
    const transactions = [
        { id: "TR-8921", customer: "Ahmet Yılmaz", date: "24 Nisan 2024, 14:20", amount: "18.999 ₺", method: "Kredi Kartı (Bonus)", status: "Completed", orderId: "#PX-98231" },
        { id: "TR-8920", customer: "Mehmet Demir", date: "24 Nisan 2024, 13:15", amount: "2.899 ₺", method: "Havale/EFT", status: "Pending", orderId: "#PX-98230" },
        { id: "TR-8919", customer: "Ayşe Kaya", date: "24 Nisan 2024, 12:45", amount: "1.499 ₺", method: "Kredi Kartı (Maximum)", status: "Completed", orderId: "#PX-98229" },
        { id: "TR-8918", customer: "Can Aksoy", date: "24 Nisan 2024, 11:30", amount: "20.999 ₺", method: "Kredi Kartı (Axess)", status: "Failed", orderId: "#PX-98228" },
        { id: "TR-8917", customer: "Selin Öztürk", date: "23 Nisan 2024, 21:10", amount: "3.499 ₺", method: "Kredi Kartı (World)", status: "Refunded", orderId: "#PX-98227" },
        { id: "TR-8916", customer: "Bora Yıldız", date: "23 Nisan 2024, 19:40", amount: "1.249 ₺", method: "Kredi Kartı (Ziraat)", status: "Completed", orderId: "#PX-98226" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Ödeme Yönetimi
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <Wallet className="text-blue-400" size={14} />
                        Tüm ödeme işlemlerini, iadeleri ve işlem durumlarını takip edin.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-slate-900 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                        <Download size={18} />
                        Rapor İndir
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                        <RefreshCcw size={18} />
                        Yenile
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Bugünkü Tahsilat", value: "45,240 ₺", icon: Wallet, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { label: "Bekleyen Onay", value: "3", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
                    { label: "Başarısız İşlem", value: "1", icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10" },
                    { label: "Toplam Net", value: "842,500 ₺", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#020617] border border-white/10 p-6 rounded-2xl flex items-center gap-4 shadow-lg shadow-black/20">
                        <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-xl font-black text-white mt-0.5">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#020617] border border-white/10 p-4 rounded-3xl flex flex-col lg:flex-row items-center gap-4 shadow-xl">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="İşlem ID, Müşteri veya Sipariş No ara..." 
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
                        <option>Tamamlandı</option>
                        <option>Bekliyor</option>
                        <option>Başarısız</option>
                        <option>İade Edildi</option>
                    </select>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-[#020617] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-white/[0.01] text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                <th className="px-8 py-5">
                                    <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                        İşlem ID <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-8 py-5">Müşteri / Tarih</th>
                                <th className="px-8 py-5">Sipariş No</th>
                                <th className="px-8 py-5">Yöntem</th>
                                <th className="px-8 py-5">Tutar</th>
                                <th className="px-8 py-5">Durum</th>
                                <th className="px-8 py-5 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.map((tr) => (
                                <tr key={tr.id} className="hover:bg-white/[0.01] transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="font-black text-white group-hover:text-blue-400 transition-colors">
                                            {tr.id}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="font-bold text-white text-sm">{tr.customer}</div>
                                            <div className="text-[10px] text-slate-500 font-medium">{tr.date}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors font-bold">
                                            {tr.orderId}
                                            <ExternalLink size={12} />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-slate-400 font-medium">
                                        {tr.method}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-black text-white text-base">{tr.amount}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                            tr.status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            tr.status === "Pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                            tr.status === "Failed" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                            "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                        )}>
                                            {tr.status === "Completed" ? "Tamamlandı" :
                                             tr.status === "Pending" ? "Bekliyor" :
                                             tr.status === "Failed" ? "Başarısız" : "İade Edildi"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all border border-transparent hover:border-white/10">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2.5 hover:bg-blue-500/10 rounded-xl text-slate-500 hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/20">
                                                <RefreshCcw size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Görüntülenen: 6 / 2,450 İşlem</p>
                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-50 transition-all" disabled>
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
                        <button className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
