"use client";

import React, { useState, useEffect } from "react";
import { 
    TicketPlus, 
    Search, 
    Filter, 
    Pencil, 
    Trash2, 
    Calendar,
    Tag,
    Percent,
    Copy,
    Plus,
    Clock,
    Ticket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCoupons, deleteCoupon } from "@/lib/actions/coupon-actions";
import CouponModal from "@/components/admin/CouponModal";
import { AdminNotificationContainer, NotificationType } from "@/components/admin/AdminNotification";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
    const [notifications, setNotifications] = useState<{ id: string; type: NotificationType; message: string }[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null
    });

    const addNotification = (type: NotificationType, message: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications(prev => [...prev, { id, type, message }]);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const fetchData = async () => {
        setLoading(true);
        const data = await getCoupons();
        setCoupons(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        const result = await deleteCoupon(id);
        if (result.success) {
            addNotification("success", "Kupon başarıyla silindi.");
            fetchData();
        } else {
            addNotification("error", result.error || "Bir hata oluştu.");
        }
        setConfirmModal({ isOpen: false, id: null });
    };

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        addNotification("success", "Kupon kodu kopyalandı!");
    };

    const filteredCoupons = coupons.filter(coupon => {
        const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase());
        
        const now = new Date();
        const expiry = coupon.expiryDate ? new Date(coupon.expiryDate) : null;
        const isExpired = expiry && expiry < now;
        const isExhausted = coupon.usageLimit && coupon.usageCount >= coupon.usageLimit;

        if (statusFilter === "active") return !isExpired && !isExhausted;
        if (statusFilter === "expired") return isExpired;
        if (statusFilter === "exhausted") return isExhausted;
        
        return matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <CouponModal 
                isOpen={isModalOpen}
                coupon={selectedCoupon}
                onClose={(success) => {
                    setIsModalOpen(false);
                    if (success) {
                        addNotification("success", selectedCoupon ? "Kupon güncellendi." : "Yeni kupon oluşturuldu.");
                        fetchData();
                    }
                }}
            />

            <AdminConfirmModal 
                isOpen={confirmModal.isOpen}
                title="Kuponu Sil"
                message="Bu kuponu silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
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
                        Kupon & İndirim Yönetimi
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <Tag className="text-blue-400" size={14} />
                        Kampanya kodları oluşturun ve kullanım istatistiklerini takip edin.
                    </p>
                </div>
                <button 
                    onClick={() => { setSelectedCoupon(null); setIsModalOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                    <Plus size={20} />
                    Yeni Kupon Oluştur
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#020617] border border-white/10 p-4 rounded-3xl flex flex-col lg:flex-row items-center gap-4 shadow-xl">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Kupon kodu ara..." 
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
                        <option value="active">Aktif</option>
                        <option value="expired">Süresi Dolan</option>
                        <option value="exhausted">Limit Dolu</option>
                    </select>
                </div>
            </div>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-[#020617] border border-white/10 rounded-[32px] p-8 h-[300px] animate-pulse">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl mb-6"></div>
                            <div className="w-full h-24 bg-white/5 rounded-2xl mb-6"></div>
                            <div className="w-1/2 h-4 bg-white/5 rounded-full"></div>
                        </div>
                    ))
                ) : filteredCoupons.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-[#020617] border border-white/10 rounded-[32px]">
                        <Ticket size={48} className="mx-auto text-slate-700 mb-4" />
                        <p className="text-slate-500 font-bold">Kupon bulunamadı.</p>
                    </div>
                ) : (
                    filteredCoupons.map((coupon) => {
                        const now = new Date();
                        const expiry = coupon.expiryDate ? new Date(coupon.expiryDate) : null;
                        const isExpired = expiry && expiry < now;
                        const isExhausted = coupon.usageLimit && coupon.usageCount >= coupon.usageLimit;
                        const status = isExpired ? "Expired" : isExhausted ? "Exhausted" : "Active";

                        return (
                            <div key={coupon.id} className="bg-[#020617] border border-white/10 rounded-[32px] p-8 space-y-6 group hover:border-blue-500/40 transition-all duration-500 relative overflow-hidden">
                                {status !== "Active" && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                        <span className={cn(
                                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                                            status === "Expired" ? "bg-red-500/20 text-red-400 border-red-500/40" : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                                        )}>
                                            {status === "Expired" ? "SÜRESİ DOLDU" : "LİMİT DOLDU"}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between relative z-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
                                            {coupon.discountType === "PERCENTAGE" ? <Percent size={20} /> : <Ticket size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-white">
                                                {coupon.discountType === "PERCENTAGE" ? "% Yüzde" : "Sabit Tutar"} İndirim
                                            </h3>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Kupon Türü</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={() => { setSelectedCoupon(coupon); setIsModalOpen(true); }}
                                            className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button 
                                            onClick={() => setConfirmModal({ isOpen: true, id: coupon.id })}
                                            className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-red-400 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 text-center space-y-4 relative">
                                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#020617] rounded-full border-r border-white/5"></div>
                                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#020617] rounded-full border-l border-white/5"></div>
                                    
                                    <div className="space-y-1">
                                        <div className="text-2xl font-black text-white tracking-widest uppercase flex items-center justify-center gap-2">
                                            {coupon.code}
                                            <button 
                                                onClick={() => handleCopy(coupon.code)}
                                                className="text-slate-600 hover:text-blue-400 transition-colors"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">İNDİRİM KODU</p>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-dashed border-white/10 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-600 uppercase">DEĞER</p>
                                            <p className="text-lg font-black text-blue-400">
                                                {coupon.discountType === "PERCENTAGE" ? `%${coupon.discountValue}` : `₺${coupon.discountValue.toLocaleString('tr-TR')}`}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-600 uppercase">MİN. HARCAMA</p>
                                            <p className="text-lg font-black text-white">₺{coupon.minPurchase?.toLocaleString('tr-TR') || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                        <Clock size={14} className="text-slate-600" />
                                        {coupon.usageCount} / {coupon.usageLimit || "∞"} Kullanım
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 justify-end">
                                        <Calendar size={14} className="text-slate-600" />
                                        {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('tr-TR') : "Süresiz"}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {!loading && (
                    <button 
                        onClick={() => { setSelectedCoupon(null); setIsModalOpen(true); }}
                        className="border-2 border-dashed border-white/10 rounded-[32px] h-full min-h-[300px] flex flex-col items-center justify-center gap-4 group hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-500"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                            <Plus size={32} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black text-white">Yeni Kupon Oluştur</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Özel indirimler tanımlayın</p>
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
}
