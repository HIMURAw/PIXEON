"use client";

import React from "react";
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    ChevronLeft,
    ChevronRight,
    Download,
    ArrowUpDown,
    ShoppingCart,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    Truck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminOrders() {
    const orders = [
        { id: "#PX-8421", customer: "Ahmet Yılmaz", email: "ahmet@mail.com", product: "PS5 Pro Bundle", amount: "₺28.499", status: "Completed", date: "24 Nis 2024, 23:12", payment: "Kredi Kartı" },
        { id: "#PX-8420", customer: "Mehmet Demir", email: "mehmet@mail.com", product: "DualSense Edge", amount: "₺6.499", status: "Pending", date: "24 Nis 2024, 22:55", payment: "Havale/EFT" },
        { id: "#PX-8419", customer: "Canan Öz", email: "canan@mail.com", product: "FC 25 - PS5", amount: "₺1.899", status: "Processing", date: "24 Nis 2024, 21:42", payment: "Kredi Kartı" },
        { id: "#PX-8418", customer: "Burak Arslan", email: "burak@mail.com", product: "God of War Ragnarök", amount: "₺1.499", status: "Shipped", date: "24 Nis 2024, 20:15", payment: "Kredi Kartı" },
        { id: "#PX-8417", customer: "Selim Ak", email: "selim@mail.com", product: "Pulse Elite Headset", amount: "₺5.299", status: "Cancelled", date: "24 Nis 2024, 18:30", payment: "Kredi Kartı" },
        { id: "#PX-8416", customer: "Ayşe Kır", email: "ayse@mail.com", product: "PS5 Slim Console", amount: "₺18.999", status: "Completed", date: "24 Nis 2024, 16:20", payment: "Havale/EFT" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Sipariş Yönetimi
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <ShoppingCart className="text-blue-400" size={14} />
                        Tüm sipariş süreçlerini, ödemeleri ve kargo durumlarını takip edin.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-slate-900 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                        <Download size={18} />
                        Listeyi İndir
                    </button>
                    <button className="bg-slate-900 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                        <Calendar size={18} />
                        Tarih Aralığı
                    </button>
                </div>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Yeni Siparişler", value: "24", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
                    { label: "Hazırlananlar", value: "12", icon: ShoppingCart, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { label: "Yoldakiler", value: "48", icon: Truck, color: "text-purple-400", bg: "bg-purple-400/10" },
                    { label: "Tamamlananlar", value: "1,142", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#020617] border border-white/10 p-6 rounded-2xl flex items-center gap-4 group hover:border-blue-500/20 transition-all">
                        <div className={cn("p-3 rounded-xl transition-all group-hover:scale-110", stat.bg, stat.color)}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-white mt-0.5">{stat.value}</p>
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
                        placeholder="Sipariş ID, müşteri adı veya e-posta..."
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-12 py-3 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-white/5 rounded-2xl text-sm font-bold text-slate-400 hover:text-white transition-all">
                        <Filter size={18} />
                        Filtrele
                    </button>
                    <select className="bg-slate-900 border border-white/5 rounded-2xl px-5 py-3 text-sm font-bold text-slate-400 outline-none focus:border-blue-500/50 transition-all cursor-pointer min-w-[160px]">
                        <option>Tüm Siparişler</option>
                        <option>Tamamlanan</option>
                        <option>Bekleyen</option>
                        <option>İptal Edilen</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#020617] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-white/[0.01] text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                <th className="px-8 py-5">
                                    <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                        Sipariş ID <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-8 py-5">Müşteri</th>
                                <th className="px-8 py-5">Ürün</th>
                                <th className="px-8 py-5">Ödeme</th>
                                <th className="px-8 py-5">Tutar</th>
                                <th className="px-8 py-5">Durum</th>
                                <th className="px-8 py-5 text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-white/[0.01] transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="font-black text-blue-400 text-sm group-hover:scale-105 transition-transform origin-left">
                                            {order.id}
                                        </div>
                                        <p className="text-[10px] text-slate-600 font-bold mt-1 uppercase tracking-tight">{order.date}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-white text-xs">{order.customer}</div>
                                        <p className="text-[10px] text-slate-500 font-medium">{order.email}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-slate-400 text-xs font-medium">{order.product}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-2 py-0.5 bg-slate-900 border border-white/5 rounded text-[9px] font-bold text-slate-500 uppercase">
                                            {order.payment}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-black text-white text-base">{order.amount}</td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            order.status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                order.status === "Pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                    order.status === "Processing" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                        order.status === "Shipped" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                                            "bg-red-500/10 text-red-400 border-red-500/20"
                                        )}>
                                            {order.status === "Completed" ? "TAMAMLANDI" :
                                                order.status === "Pending" ? "BEKLEMEDE" :
                                                    order.status === "Processing" ? "HAZIRLANIYOR" :
                                                        order.status === "Shipped" ? "KARGODA" : "İPTAL EDİLDİ"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all border border-transparent hover:border-white/10">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                                                <MoreHorizontal size={18} />
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
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">1,240 siparişten 1-6 arası gösteriliyor.</p>
                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-50 transition-all" disabled>
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, "...", 124].map((i, idx) => (
                                <button key={idx} className={cn(
                                    "w-10 h-10 rounded-xl text-xs font-black transition-all border border-transparent",
                                    i === 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" :
                                        i === "..." ? "text-slate-600 cursor-default" : "text-slate-500 hover:bg-white/5 hover:border-white/10"
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
