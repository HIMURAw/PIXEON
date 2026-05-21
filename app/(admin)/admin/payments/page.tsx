"use client";

import React, { useState, useEffect } from "react";
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
    ExternalLink,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAdminTransactions } from "@/lib/actions/admin-order-actions";
import TransactionDetailModal from "@/components/admin/TransactionDetailModal";
import { AdminNotificationContainer, NotificationType } from "@/components/admin/AdminNotification";

export default function AdminPayments() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [sortField, setSortField] = useState("createdAt");
    
    // Modal states
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Notification states
    const [notifications, setNotifications] = useState<{ id: string; type: NotificationType; message: string }[]>([]);

    const addNotification = (type: NotificationType, message: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications(prev => [...prev, { id, type, message }]);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const fetchTransactions = async () => {
        setLoading(true);
        const data = await getAdminTransactions();
        setTransactions(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Statistics calculations
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCollection = transactions
        .filter(t => {
            const date = new Date(t.createdAt);
            return t.status === "COMPLETED" && date >= today;
        })
        .reduce((sum, t) => sum + t.amount, 0);

    const pendingApprovals = transactions.filter(t => t.status === "PENDING").length;
    const failedTransactions = transactions.filter(t => t.status === "FAILED").length;
    const totalNetRevenue = transactions
        .filter(t => t.status === "COMPLETED")
        .reduce((sum, t) => sum + t.amount, 0);

    // Filtered and sorted transactions
    const filteredTransactions = transactions
        .filter(tr => {
            const matchesSearch = 
                tr.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (tr.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (tr.order?.orderNumber || "").toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = statusFilter === "ALL" || tr.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];

            if (sortField === "amount") {
                valA = a.amount;
                valB = b.amount;
            }

            if (valA < valB) return sortDirection === "asc" ? -1 : 1;
            if (valA > valB) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });

    // Pagination
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
    const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
        setCurrentPage(1);
    };

    const handleDownloadCSV = () => {
        if (filteredTransactions.length === 0) {
            addNotification("error", "İndirilecek işlem raporu bulunamadı.");
            return;
        }
        const headers = ["Islem ID", "Musteri", "E-posta", "Siparis No", "Odeme Yontemi", "Tutar", "Durum", "Tarih"];
        const rows = filteredTransactions.map(t => [
            t.id,
            t.user?.name || "",
            t.user?.email || "",
            t.order?.orderNumber || "",
            t.method || "",
            t.amount,
            t.status,
            new Date(t.createdAt).toLocaleString("tr-TR")
        ]);

        let csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
            + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `pixeon_odeme_raporu_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addNotification("success", "Ödeme raporu CSV olarak indirildi.");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <AdminNotificationContainer notifications={notifications} onClose={removeNotification} />

            {selectedTransaction && (
                <TransactionDetailModal
                    isOpen={isModalOpen}
                    transaction={selectedTransaction}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedTransaction(null);
                    }}
                />
            )}

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
                    <button 
                        onClick={handleDownloadCSV}
                        className="bg-slate-900 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 hover:border-white/20 transition-all active:scale-95"
                    >
                        <Download size={18} />
                        Rapor İndir (CSV)
                    </button>
                    <button 
                        onClick={fetchTransactions}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCcw size={18} />}
                        Yenile
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Bugünkü Tahsilat", value: loading ? "..." : `₺${todayCollection.toLocaleString("tr-TR")}`, icon: Wallet, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { label: "Bekleyen Onay", value: loading ? "..." : pendingApprovals, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
                    { label: "Başarısız İşlem", value: loading ? "..." : failedTransactions, icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10" },
                    { label: "Toplam Net", value: loading ? "..." : `₺${totalNetRevenue.toLocaleString("tr-TR")}`, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
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
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        placeholder="İşlem ID, müşteri adı veya sipariş no ara..." 
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-12 py-3 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600 text-white"
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-white/5 rounded-2xl text-sm font-bold text-slate-400 hover:text-white transition-all">
                        <Filter size={18} />
                        Filtrele
                    </button>
                    <select 
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className="bg-slate-900 border border-white/5 rounded-2xl px-5 py-3 text-sm font-bold text-slate-400 outline-none focus:border-blue-500/50 transition-all cursor-pointer min-w-[160px]"
                    >
                        <option value="ALL">Tüm Durumlar</option>
                        <option value="COMPLETED">Tamamlandı (COMPLETED)</option>
                        <option value="PENDING">Bekliyor (PENDING)</option>
                        <option value="FAILED">Başarısız (FAILED)</option>
                        <option value="REFUNDED">İade Edildi (REFUNDED)</option>
                    </select>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-[#020617] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative border-b border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-white/[0.01] text-slate-500 font-bold uppercase tracking-widest text-[10px] select-none border-b border-white/5">
                                <th className="px-8 py-5">
                                    <div 
                                        onClick={() => handleSort("id")}
                                        className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
                                    >
                                        İşlem ID <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-8 py-5">Müşteri / Tarih</th>
                                <th className="px-8 py-5">Sipariş No</th>
                                <th className="px-8 py-5">Yöntem</th>
                                <th className="px-8 py-5">
                                    <div 
                                        onClick={() => handleSort("amount")}
                                        className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
                                    >
                                        Tutar <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-8 py-5">Durum</th>
                                <th className="px-8 py-5 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-20 text-slate-500">
                                        <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={32} />
                                        <p className="font-bold uppercase tracking-widest text-[10px]">İşlemler Yükleniyor...</p>
                                    </td>
                                </tr>
                            ) : paginatedTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-20 text-slate-500">
                                        <Wallet className="text-slate-700 mx-auto mb-4" size={48} />
                                        <p className="font-bold">Gösterilecek ödeme işlemi bulunamadı.</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedTransactions.map((tr) => (
                                    <tr key={tr.id} className="hover:bg-white/[0.01] transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="font-black text-white group-hover:text-blue-400 transition-colors">
                                                {tr.id}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <div className="font-bold text-white text-sm">{tr.user?.name || "Bilinmeyen"}</div>
                                                <div className="text-[10px] text-slate-500 font-medium">
                                                    {new Date(tr.createdAt).toLocaleString("tr-TR")}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors font-bold">
                                                {tr.order?.orderNumber || "N/A"}
                                                <ExternalLink size={12} />
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-slate-400 font-medium">
                                            {tr.method || "Kredi Kartı"}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-black text-white text-base">₺{tr.amount?.toLocaleString("tr-TR")}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                                tr.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                tr.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                tr.status === "FAILED" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                            )}>
                                                {tr.status === "COMPLETED" ? "Tamamlandı" :
                                                 tr.status === "PENDING" ? "Bekliyor" :
                                                 tr.status === "FAILED" ? "Başarısız" : "İade Edildi"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => { setSelectedTransaction(tr); setIsModalOpen(true); }}
                                                className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && filteredTransactions.length > 0 && (
                    <div className="p-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            {filteredTransactions.length} işlemden {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredTransactions.length)} arası gösteriliyor.
                        </p>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500 disabled:hover:bg-slate-950 transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }).map((_, idx) => {
                                    const pageNum = idx + 1;
                                    return (
                                        <button 
                                            key={idx} 
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={cn(
                                                "w-10 h-10 rounded-xl text-xs font-black transition-all border border-transparent",
                                                currentPage === pageNum ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:bg-white/5 hover:border-white/10"
                                            )}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500 disabled:hover:bg-slate-950 transition-all"
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
