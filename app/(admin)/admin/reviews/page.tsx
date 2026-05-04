"use client";

import React, { useState, useEffect } from "react";
import { 
    MessageSquare, 
    Search, 
    Filter, 
    Star, 
    ThumbsUp, 
    CheckCircle2, 
    XCircle, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    User,
    Gamepad2,
    Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getReviews, updateReviewStatus, deleteReview } from "@/lib/actions/review-actions";
import { AdminNotificationContainer, NotificationType } from "@/components/admin/AdminNotification";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";

export default function AdminReviews() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState<{ id: string; type: NotificationType; message: string }[]>([]);
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const addNotification = (type: NotificationType, message: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications(prev => [...prev, { id, type, message }]);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const fetchData = async () => {
        setLoading(true);
        const data = await getReviews();
        setReviews(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (id: string, status: "APPROVED" | "REJECTED") => {
        const result = await updateReviewStatus(id, status);
        if (result.success) {
            addNotification("success", status === "APPROVED" ? "Yorum onaylandı." : "Yorum reddedildi.");
            fetchData();
        } else {
            addNotification("error", result.error || "Hata oluştu.");
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteReview(id);
        if (result.success) {
            addNotification("success", "Yorum başarıyla silindi.");
            fetchData();
        } else {
            addNotification("error", result.error || "Silinemedi.");
        }
        setConfirmModal({ isOpen: false, id: null });
    };

    const filteredReviews = reviews.filter(rv => {
        const matchesSearch = 
            rv.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rv.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rv.comment.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (statusFilter !== "all" && rv.status !== statusFilter) return false;
        
        return matchesSearch;
    });

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, rv) => acc + rv.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <AdminConfirmModal 
                isOpen={confirmModal.isOpen}
                title="Yorumu Sil"
                message="Bu yorumu silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                onConfirm={() => confirmModal.id && handleDelete(confirmModal.id)}
                onCancel={() => setConfirmModal({ isOpen: false, id: null })}
                variant="danger"
            />

            <AdminNotificationContainer 
                notifications={notifications}
                onClose={removeNotification}
            />

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Yorum & Değerlendirmeler
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <MessageSquare className="text-blue-400" size={14} />
                        Müşteri geri bildirimlerini yönetin, yanıtlayın ve mağaza puanını takip edin.
                    </p>
                </div>
                <div className="flex items-center gap-6 bg-[#020617] border border-white/10 px-8 py-3 rounded-[24px] shadow-lg">
                    <div className="text-center border-r border-white/5 pr-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mağaza Puanı</p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-2xl font-black text-white">{averageRating}</span>
                            <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Toplam Yorum</p>
                        <p className="text-2xl font-black text-white mt-1">{reviews.length}</p>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#020617] border border-white/10 p-4 rounded-[32px] flex flex-col lg:flex-row items-center gap-4 shadow-xl">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Kullanıcı, ürün veya anahtar kelime ara..." 
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-12 py-3 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-900 border border-white/5 rounded-2xl px-5 py-3 text-sm font-bold text-slate-400 outline-none focus:border-blue-500/50 transition-all cursor-pointer min-w-[160px]"
                    >
                        <option value="all">Tüm Durumlar</option>
                        <option value="PENDING">Onay Bekliyor</option>
                        <option value="APPROVED">Yayında</option>
                        <option value="REJECTED">Reddedildi</option>
                    </select>
                </div>
            </div>

            {/* Reviews List */}
            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-[#020617] border border-white/10 rounded-[40px] p-8 h-[200px] animate-pulse" />
                    ))
                ) : filteredReviews.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-[#020617] border border-white/10 rounded-[40px]">
                        <MessageSquare size={48} className="mx-auto text-slate-700 mb-4" />
                        <p className="text-slate-500 font-bold">Yorum bulunamadı.</p>
                    </div>
                ) : (
                    filteredReviews.map((rv) => (
                        <div key={rv.id} className="bg-[#020617] border border-white/10 rounded-[40px] p-8 hover:border-blue-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none transition-all group-hover:bg-blue-500/10"></div>
                            
                            <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center justify-between lg:justify-start lg:gap-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-900 rounded-2xl border border-white/5 flex items-center justify-center text-slate-500">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white tracking-tight">{rv.user?.name}</h3>
                                                <p className="text-xs text-slate-500 font-medium">Onaylı Alıcı ✓</p>
                                            </div>
                                        </div>
                                        <div className="flex bg-slate-900/50 border border-white/5 px-4 py-2 rounded-xl items-center gap-3">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} className={cn(i < rv.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-700")} />
                                                ))}
                                            </div>
                                            <span className="text-white font-black text-sm">{rv.rating}.0</span>
                                        </div>
                                    </div>
    
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest">
                                            <Gamepad2 size={14} />
                                            {rv.product?.name || "Genel Site Yorumu"}
                                        </div>
                                        <p className="text-slate-300 leading-relaxed text-base font-medium">"{rv.comment}"</p>
                                    </div>
    
                                    <div className="flex items-center gap-6 pt-2">
                                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                            <Clock size={14} />
                                            {new Date(rv.createdAt).toLocaleDateString('tr-TR')}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-emerald-400/60 text-[10px] font-black uppercase tracking-tighter">
                                                <ThumbsUp size={14} />
                                                {rv.likes} Beğeni
                                            </div>
                                        </div>
                                    </div>
                                </div>
    
                                <div className="lg:w-48 shrink-0 flex flex-col justify-between items-end gap-4">
                                    <span className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg",
                                        rv.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5" :
                                        rv.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5" :
                                        "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/5"
                                    )}>
                                        {rv.status === "APPROVED" ? "Yayında" :
                                         rv.status === "PENDING" ? "Onay Bekliyor" : "Reddedildi"}
                                    </span>
    
                                    <div className="flex items-center gap-2">
                                        {rv.status === "PENDING" && (
                                            <button 
                                                onClick={() => handleStatusUpdate(rv.id, "APPROVED")}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-slate-950 font-black rounded-2xl hover:bg-emerald-400 transition-all text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20"
                                            >
                                                <CheckCircle2 size={14} />
                                                Onayla
                                            </button>
                                        )}
                                        {rv.status !== "REJECTED" && rv.status !== "APPROVED" && (
                                            <button 
                                                onClick={() => handleStatusUpdate(rv.id, "REJECTED")}
                                                className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => setConfirmModal({ isOpen: true, id: rv.id })}
                                            className="p-3 bg-slate-950 border border-white/5 rounded-2xl text-slate-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Placeholder */}
            {!loading && filteredReviews.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 pb-10">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Görüntülenen: {filteredReviews.length} Yorum</p>
                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-slate-900 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-50 transition-all" disabled>
                            <ChevronLeft size={20} />
                        </button>
                        <button className="p-3 bg-slate-900 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
