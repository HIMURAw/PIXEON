"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Filter,
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
    Truck,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAdminOrders } from "@/lib/actions/admin-order-actions";
import OrderDetailModal from "@/components/admin/OrderDetailModal";
import { AdminNotificationContainer, NotificationType } from "@/components/admin/AdminNotification";

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [sortField, setSortField] = useState("createdAt");
    
    // Modal states
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
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

    const fetchOrders = async () => {
        setLoading(true);
        const data = await getAdminOrders();
        setOrders(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Statistics
    const totalPending = orders.filter(o => o.status === "PENDING").length;
    const totalPreparing = orders.filter(o => o.status === "PREPARING").length;
    const totalCompleted = orders.filter(o => o.status === "COMPLETED").length;
    const totalCancelled = orders.filter(o => o.status === "CANCELLED").length;

    // Filtered and sorted list
    const filteredOrders = orders
        .filter(order => {
            const matchesSearch = 
                order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (order.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (order.user?.email || "").toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];
            
            if (sortField === "customer") {
                valA = a.user?.name || "";
                valB = b.user?.name || "";
            } else if (sortField === "amount") {
                valA = a.totalAmount;
                valB = b.totalAmount;
            }
            
            if (valA < valB) return sortDirection === "asc" ? -1 : 1;
            if (valA > valB) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
        if (filteredOrders.length === 0) {
            addNotification("error", "İndirilecek sipariş bulunamadı.");
            return;
        }
        const headers = ["Siparis No", "Musteri", "E-posta", "Urun Adedi", "Odeme Yontemi", "Tutar", "Durum", "Tarih"];
        const rows = filteredOrders.map(o => [
            o.orderNumber,
            o.user?.name || "",
            o.user?.email || "",
            o.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0,
            o.paymentMethod || "",
            o.totalAmount,
            o.status,
            new Date(o.createdAt).toLocaleString("tr-TR")
        ]);
        
        let csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
            + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `pixeon_siparisler_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addNotification("success", "Sipariş listesi CSV olarak indirildi.");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <AdminNotificationContainer notifications={notifications} onClose={removeNotification} />
            
            {selectedOrder && (
                <OrderDetailModal
                    isOpen={isModalOpen}
                    order={selectedOrder}
                    onClose={(success) => {
                        setIsModalOpen(false);
                        setSelectedOrder(null);
                        if (success) {
                            addNotification("success", "Sipariş başarıyla güncellendi.");
                            fetchOrders();
                        }
                    }}
                />
            )}

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
                    <button 
                        onClick={handleDownloadCSV}
                        className="bg-slate-900 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 hover:border-white/20 transition-all active:scale-95"
                    >
                        <Download size={18} />
                        Listeyi İndir (CSV)
                    </button>
                    <button 
                        onClick={fetchOrders}
                        disabled={loading}
                        className="bg-[#020617] border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-900 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Calendar size={18} />}
                        Verileri Yenile
                    </button>
                </div>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Bekleyenler", value: loading ? "..." : totalPending, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
                    { label: "Hazırlananlar", value: loading ? "..." : totalPreparing, icon: ShoppingCart, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { label: "Tamamlananlar", value: loading ? "..." : totalCompleted, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    { label: "İptal Edilenler", value: loading ? "..." : totalCancelled, icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#020617] border border-white/10 p-6 rounded-2xl flex items-center gap-4 group hover:border-blue-500/20 transition-all shadow-lg">
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
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        placeholder="Sipariş numarası veya müşteri bilgisi ara..."
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
                        className="bg-slate-900 border border-white/5 rounded-2xl px-5 py-3 text-sm font-bold text-slate-400 outline-none focus:border-blue-500/50 transition-all cursor-pointer min-w-[180px]"
                    >
                        <option value="ALL">Tüm Durumlar</option>
                        <option value="PENDING">Beklemede (PENDING)</option>
                        <option value="PREPARING">Hazırlanıyor (PREPARING)</option>
                        <option value="SHIPPED">Kargoya Verildi (SHIPPED)</option>
                        <option value="COMPLETED">Tamamlandı (COMPLETED)</option>
                        <option value="CANCELLED">İptal Edildi (CANCELLED)</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#020617] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-white/[0.01] text-slate-500 font-bold uppercase tracking-widest text-[10px] select-none border-b border-white/5">
                                <th className="px-8 py-5">
                                    <div 
                                        onClick={() => handleSort("orderNumber")}
                                        className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
                                    >
                                        Sipariş ID <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-8 py-5">
                                    <div 
                                        onClick={() => handleSort("customer")}
                                        className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
                                    >
                                        Müşteri <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-8 py-5">Ürün Sayısı</th>
                                <th className="px-8 py-5">Ödeme</th>
                                <th className="px-8 py-5">
                                    <div 
                                        onClick={() => handleSort("amount")}
                                        className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
                                    >
                                        Tutar <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-8 py-5">Durum</th>
                                <th className="px-8 py-5 text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-20 text-slate-500">
                                        <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={32} />
                                        <p className="font-bold uppercase tracking-widest text-[10px]">Siparişler Yükleniyor...</p>
                                    </td>
                                </tr>
                            ) : paginatedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-20 text-slate-500">
                                        <ShoppingCart className="text-slate-700 mx-auto mb-4" size={48} />
                                        <p className="font-bold">Gösterilecek sipariş bulunamadı.</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedOrders.map((order) => {
                                    const totalItems = order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
                                    
                                    return (
                                        <tr key={order.id} className="hover:bg-white/[0.01] transition-all group">
                                            <td className="px-8 py-6">
                                                <div 
                                                    onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                                                    className="font-black text-blue-400 text-sm group-hover:scale-105 transition-transform origin-left cursor-pointer"
                                                >
                                                    {order.orderNumber}
                                                </div>
                                                <p className="text-[10px] text-slate-600 font-bold mt-1 uppercase tracking-tight">
                                                    {new Date(order.createdAt).toLocaleString("tr-TR")}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-white text-xs">{order.user?.name || "Bilinmeyen"}</div>
                                                <p className="text-[10px] text-slate-500 font-medium">{order.user?.email || "E-posta Yok"}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-slate-400 text-xs font-semibold">{totalItems} Ürün</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-2 py-0.5 bg-slate-900 border border-white/5 rounded text-[9px] font-bold text-slate-400 uppercase">
                                                    {order.paymentMethod || "Belirtilmemiş"}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 font-black text-white text-base">₺{order.totalAmount?.toLocaleString("tr-TR")}</td>
                                            <td className="px-8 py-6">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                    order.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                    order.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                    order.status === "PREPARING" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                    order.status === "SHIPPED" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                                    "bg-red-500/10 text-red-400 border-red-500/20"
                                                )}>
                                                    {order.status === "COMPLETED" ? "TAMAMLANDI" :
                                                     order.status === "PENDING" ? "BEKLEMEDE" :
                                                     order.status === "PREPARING" ? "HAZIRLANIYOR" :
                                                     order.status === "SHIPPED" ? "KARGOYA VERİLDİ" : "İPTAL EDİLDİ"}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button 
                                                    onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                                                    className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && filteredOrders.length > 0 && (
                    <div className="p-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            {filteredOrders.length} siparişten {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredOrders.length)} arası gösteriliyor.
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
