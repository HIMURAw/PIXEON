"use client";

import React, { useState, useEffect } from "react";
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
    ShieldCheck,
    Trash2,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAdminCustomers, deleteUser } from "@/lib/actions/admin-actions";
import toast from "react-hot-toast";

export default function AdminCustomers() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalMatching, setTotalMatching] = useState(0);
    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        loyal: 0
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchCustomers = async () => {
        setLoading(true);
        const res = await getAdminCustomers({
            search: debouncedSearch,
            page,
            limit: 10
        });
        if (res.success) {
            setCustomers(res.customers || []);
            setStats({
                total: res.totalCustomers || 0,
                new: res.newCustomersThisMonth || 0,
                loyal: res.loyalCustomers || 0
            });
            setTotalMatching(res.totalMatching || 0);
            setTotalPages(res.totalPages || 1);
        } else {
            toast.error(res.error || "Müşteriler yüklenemedi.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCustomers();
    }, [debouncedSearch, page]);

    const handleDeleteCustomer = async (userId: string, name: string) => {
        if (!confirm(`"${name}" adlı müşteriyi silmek istediğinize emin misiniz?`)) {
            return;
        }
        const res = await deleteUser(userId);
        if (res.success) {
            toast.success("Müşteri başarıyla silindi.");
            fetchCustomers();
        } else {
            toast.error(res.error || "Müşteri silinemedi.");
        }
    };

    const renderPageButtons = () => {
        const buttons = [];
        
        buttons.push(1);
        
        if (page > 3) {
            buttons.push("...");
        }
        
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            if (!buttons.includes(i)) {
                buttons.push(i);
            }
        }
        
        if (page < totalPages - 2) {
            buttons.push("...");
        }
        
        if (totalPages > 1 && !buttons.includes(totalPages)) {
            buttons.push(totalPages);
        }
        
        return buttons.map((p, idx) => {
            if (p === "...") {
                return (
                    <span key={`dots-${idx}`} className="w-10 h-10 flex items-center justify-center text-slate-600 font-bold">
                        ...
                    </span>
                );
            }
            return (
                <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={cn(
                        "w-10 h-10 rounded-xl text-xs font-black transition-all border border-transparent",
                        page === p 
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                            : "text-slate-500 hover:bg-white/5 hover:border-white/10"
                    )}
                >
                    {p}
                </button>
            );
        });
    };

    const TableSkeleton = () => (
        <>
            {[...Array(5)].map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-slate-900 rounded w-28"></div>
                                <div className="h-3 bg-slate-900 rounded w-20"></div>
                            </div>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="space-y-2">
                            <div className="h-3 bg-slate-900 rounded w-36"></div>
                            <div className="h-3 bg-slate-900 rounded w-28"></div>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="h-3 bg-slate-900 rounded w-24"></div>
                    </td>
                    <td className="px-8 py-6 text-center">
                        <div className="h-4 bg-slate-900 rounded w-8 mx-auto"></div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="h-4 bg-slate-900 rounded w-16"></div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="h-5 bg-slate-900 rounded-full w-14"></div>
                    </td>
                    <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-900"></div>
                            <div className="w-8 h-8 rounded-lg bg-slate-900"></div>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );

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
                    { label: "Toplam Müşteri", value: stats.total.toLocaleString("tr-TR"), icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { label: "Yeni (Bu Ay)", value: stats.new.toLocaleString("tr-TR"), icon: Star, color: "text-amber-400", bg: "bg-amber-400/10" },
                    { label: "Sadık Müşteriler", value: stats.loyal.toLocaleString("tr-TR"), icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                <div className="overflow-x-auto font-sans">
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
                            {loading ? (
                                <TableSkeleton />
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-12 text-center text-slate-500">
                                        <Users className="mx-auto mb-3 text-slate-600" size={36} />
                                        Aradığınız kriterlere uygun müşteri bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
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
                                            <div className="font-black text-white text-base">₺{customer.spent.toLocaleString("tr-TR")}</div>
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
                                                <button 
                                                    onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                                                    className="p-2.5 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-400 transition-all"
                                                    title="Müşteriyi Sil"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            {totalMatching} müşteriden {Math.min(totalMatching, (page - 1) * 10 + 1)}-{Math.min(totalMatching, page * 10)} arası gösteriliyor.
                        </p>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-50 transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="flex items-center gap-1">
                                {renderPageButtons()}
                            </div>
                            <button 
                                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={page === totalPages}
                                className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-50 transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
