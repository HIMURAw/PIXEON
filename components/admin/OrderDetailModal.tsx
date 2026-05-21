"use client";

import React, { useState, useEffect } from "react";
import { X, User, Mail, Phone, MapPin, Calendar, Package, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateOrderStatus, updateOrderPaymentStatus } from "@/lib/actions/admin-order-actions";

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: (success?: boolean) => void;
    order: any;
}

export default function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("PENDING");
    const [paymentStatus, setPaymentStatus] = useState("PENDING");
    const [shippingProvider, setShippingProvider] = useState("");
    const [trackingNumber, setTrackingNumber] = useState("");

    useEffect(() => {
        if (order) {
            setStatus(order.status);
            setPaymentStatus(order.paymentStatus);
            setShippingProvider(order.shippingProvider || "");
            setTrackingNumber(order.trackingNumber || "");
        }
    }, [order, isOpen]);

    if (!isOpen || !order) return null;

    const handleSave = async () => {
        setLoading(true);
        try {
            // Update order status if changed
            if (status !== order.status || shippingProvider !== (order.shippingProvider || "") || trackingNumber !== (order.trackingNumber || "")) {
                const res = await updateOrderStatus(order.id, status as any, shippingProvider, trackingNumber);
                if (!res.success) {
                    alert(res.error);
                    setLoading(false);
                    return;
                }
            }
            // Update payment status if changed
            if (paymentStatus !== order.paymentStatus) {
                const res = await updateOrderPaymentStatus(order.id, paymentStatus as any);
                if (!res.success) {
                    alert(res.error);
                    setLoading(false);
                    return;
                }
            }
            onClose(true);
        } catch (err) {
            console.error(err);
            alert("Sipariş güncellenirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const formattedDate = new Date(order.createdAt).toLocaleString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => onClose()} />
            
            {/* Modal Box */}
            <div className="relative w-full max-w-2xl bg-[#020617] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-transparent shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600 rounded-xl text-white">
                            <Package size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white">Sipariş Detayı</h2>
                            <p className="text-xs text-blue-400 font-bold tracking-wider mt-0.5">{order.orderNumber}</p>
                        </div>
                    </div>
                    <button onClick={() => onClose()} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                    
                    {/* Basic Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Customer Info */}
                        <div className="bg-slate-950/50 border border-white/5 p-5 rounded-2xl space-y-4">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <User size={14} className="text-blue-400" />
                                Müşteri Bilgileri
                            </h3>
                            <div className="space-y-2">
                                <div className="font-bold text-white text-sm">{order.user?.name || "Bilinmeyen Kullanıcı"}</div>
                                <div className="text-xs text-slate-400 flex items-center gap-2">
                                    <Mail size={12} className="text-slate-600" />
                                    {order.user?.email || "E-posta yok"}
                                </div>
                                {order.user?.phone && (
                                    <div className="text-xs text-slate-400 flex items-center gap-2">
                                        <Phone size={12} className="text-slate-600" />
                                        {order.user.phone}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order info */}
                        <div className="bg-slate-950/50 border border-white/5 p-5 rounded-2xl space-y-4">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={14} className="text-blue-400" />
                                Sipariş Özeti
                            </h3>
                            <div className="space-y-2">
                                <div className="text-xs text-slate-400 flex justify-between">
                                    <span className="font-medium">Tarih:</span>
                                    <span className="font-bold text-white">{formattedDate}</span>
                                </div>
                                <div className="text-xs text-slate-400 flex justify-between">
                                    <span className="font-medium">Ödeme Yöntemi:</span>
                                    <span className="font-bold text-white">{order.paymentMethod || "Belirtilmemiş"}</span>
                                </div>
                                <div className="text-xs text-slate-400 flex justify-between">
                                    <span className="font-medium">Toplam Tutar:</span>
                                    <span className="font-black text-white text-sm">₺{order.totalAmount?.toLocaleString("tr-TR")}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-slate-950/50 border border-white/5 p-5 rounded-2xl space-y-3">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <MapPin size={14} className="text-blue-400" />
                            Teslimat Adresi
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                            {order.shippingAddress}
                        </p>
                    </div>

                    {/* Order Items */}
                    <div className="border border-white/5 rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 bg-white/[0.01] border-b border-white/5">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Sipariş Edilen Ürünler</h3>
                        </div>
                        <div className="divide-y divide-white/5 bg-slate-950/20">
                            {order.items?.map((item: any, index: number) => (
                                <div key={index} className="px-5 py-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        {item.product?.image ? (
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-600 shrink-0">
                                                <Package size={20} />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-bold text-white leading-tight truncate">
                                                {item.product?.name || "Bilinmeyen Ürün"}
                                            </h4>
                                            <p className="text-[10px] text-slate-500 font-bold mt-1">SKU: {item.product?.sku || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-xs font-bold text-white">₺{item.price?.toLocaleString("tr-TR")}</div>
                                        <div className="text-[10px] text-slate-500 font-bold mt-0.5">{item.quantity} Adet</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status Management */}
                    <div className="bg-slate-950/50 border border-white/5 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Sipariş Durumu</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white font-bold outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                            >
                                <option value="PENDING">Beklemede (PENDING)</option>
                                <option value="PREPARING">Hazırlanıyor (PREPARING)</option>
                                <option value="SHIPPED">Kargoya Verildi (SHIPPED)</option>
                                <option value="COMPLETED">Tamamlandı (COMPLETED)</option>
                                <option value="CANCELLED">İptal Edildi (CANCELLED)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Ödeme Durumu</label>
                            <select
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white font-bold outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                            >
                                <option value="PENDING">Beklemede (PENDING)</option>
                                <option value="PAID">Ödendi (PAID)</option>
                                <option value="FAILED">Başarısız (FAILED)</option>
                            </select>
                        </div>
                    </div>

                    {/* Shipping Details */}
                    {status === "SHIPPED" && (
                        <div className="bg-slate-950/50 border border-white/5 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-200">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Kargo Firması</label>
                                <input
                                    type="text"
                                    value={shippingProvider}
                                    onChange={(e) => setShippingProvider(e.target.value)}
                                    placeholder="Örn: Yurtiçi Kargo, MNG, PTT"
                                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white font-bold outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Kargo Takip No</label>
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="Takip Numarası"
                                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white font-bold outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-white/5 bg-slate-950/40 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={() => onClose()}
                        className="px-6 py-3 bg-slate-900 text-slate-400 font-bold rounded-2xl hover:bg-slate-800 hover:text-white transition-all text-xs"
                    >
                        Kapat
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 text-xs"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <>
                                <Save size={16} />
                                Kaydet
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
