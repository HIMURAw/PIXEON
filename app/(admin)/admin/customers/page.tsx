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
    Users,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Star,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminCustomers() {
    const customers = [
        { id: 1, name: "Ahmet Yılmaz", email: "ahmet@mail.com", phone: "+90 555 123 45 67", location: "İstanbul", joined: "12 Mar 2024", orders: 12, spent: "₺142.500", status: "Active", initial: "AY" },
        { id: 2, name: "Mehmet Demir", email: "mehmet@mail.com", phone: "+90 555 234 56 78", location: "Ankara", joined: "15 Mar 2024", orders: 4, spent: "₺8.400", status: "Active", initial: "MD" },
        { id: 3, name: "Canan Öz", email: "canan@mail.com", phone: "+90 555 345 67 89", location: "İzmir", joined: "02 Nis 2024", orders: 2, spent: "₺3.200", status: "Inactive", initial: "CÖ" },
        { id: 4, name: "Burak Arslan", email: "burak@mail.com", phone: "+90 555 456 78 90", location: "Bursa", joined: "10 Nis 2024", orders: 1, spent: "₺1.499", status: "Active", initial: "BA" },
        { id: 5, name: "Selim Ak", email: "selim@mail.com", phone: "+90 555 567 89 01", location: "Antalya", joined: "20 Nis 2024", orders: 0, spent: "₺0", status: "Active", initial: "SA" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Müşteri Yönetimi
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <Users className="text-blue-400" size={14} />
                        Kayıtlı müşterilerinizi yönetin, harcama verilerini ve sipariş geçmişlerini inceleyin.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-slate-900 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                        <Download size={18} />
                        Dışa Aktar
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                        <ShieldCheck size={20} />
                        Doğrulama Ayarları
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Toplam Müşteri", value: "4,842", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { label: "Yeni (Bu Ay)", value: "312", icon: Star, color: "text-amber-400", bg: "bg-amber-400/10" },
                    { label: "Sadık Müşteriler", value: "842", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#020617] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                        <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
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
                        placeholder="Müşteri adı, e-posta veya telefon ara..."
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
                        <option>Pasif</option>
                        <option>VIP</option>
                    </select>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-[#020617] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-white/[0.01] text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                <th className="px-8 py-5">Müşteri</th>
                                <th className="px-8 py-5">İletişim</th>
                                <th className="px-8 py-5">Konum</th>
                                <th className="px-8 py-5 text-center">Sipariş</th>
                                <th className="px-8 py-5">Toplam Harcama</th>
                                <th className="px-8 py-5">Durum</th>
                                <th className="px-8 py-5 text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-white/[0.01] transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-black text-blue-400 text-sm group-hover:scale-105 transition-all">
                                                {customer.initial}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{customer.name}</div>
                                                <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold uppercase mt-0.5">
                                                    <Calendar size={10} />
                                                    Katılım: {customer.joined}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-slate-400 text-xs">
                                                <Mail size={12} className="text-slate-600" />
                                                {customer.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 text-xs">
                                                <Phone size={12} className="text-slate-600" />
                                                {customer.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                            <MapPin size={12} className="text-slate-600" />
                                            {customer.location}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="font-black text-slate-300">{customer.orders}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-black text-white text-base">{customer.spent}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            customer.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                                        )}>
                                            {customer.status === "Active" ? "AKTİF" : "PASİF"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
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
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">4,842 müşteriden 1-5 arası gösteriliyor.</p>
                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-50 transition-all" disabled>
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, "...", 124].map((i, idx) => (
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
