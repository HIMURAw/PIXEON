"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Truck, Loader2 } from "lucide-react";
import { createShippingMethod, updateShippingMethod } from "@/lib/actions/shipping-actions";

interface ShippingMethodModalProps {
    isOpen: boolean;
    onClose: (success?: boolean) => void;
    method?: any;
}

export default function ShippingMethodModal({ isOpen, onClose, method }: ShippingMethodModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        type: "Kargo Firması",
        rate: 0,
        minOrderLimit: 0,
        status: "ACTIVE" as "ACTIVE" | "INACTIVE",
        estimatedDelivery: "",
    });

    useEffect(() => {
        if (method) {
            setFormData({
                name: method.name,
                type: method.type || "Kargo Firması",
                rate: method.rate || 0,
                minOrderLimit: method.minOrderLimit || 0,
                status: method.status || "ACTIVE",
                estimatedDelivery: method.estimatedDelivery || "",
            });
        } else {
            setFormData({
                name: "",
                type: "Kargo Firması",
                rate: 0,
                minOrderLimit: 0,
                status: "ACTIVE",
                estimatedDelivery: "",
            });
        }
    }, [method, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            ...formData,
            rate: Number(formData.rate),
            minOrderLimit: Number(formData.minOrderLimit),
        };

        let result;
        if (method) {
            result = await updateShippingMethod(method.id, data);
        } else {
            result = await createShippingMethod(data);
        }

        setLoading(false);
        if (result.success) {
            onClose(true);
        } else {
            alert(result.error || "İşlem başarısız oldu.");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => onClose()} />
            
            <div className="relative w-full max-w-lg bg-[#020617] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600 rounded-xl text-white">
                            <Truck size={20} />
                        </div>
                        <h2 className="text-xl font-black text-white">
                            {method ? "Kargo Yöntemini Düzenle" : "Yeni Yöntem Ekle"}
                        </h2>
                    </div>
                    <button onClick={() => onClose()} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 gap-5">
                        
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Yöntem / Firma Adı</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Örn: Yurtiçi Kargo, Jet Kurye"
                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Type */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tür</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    placeholder="Örn: Kargo Firması, Özel Kurye"
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>

                            {/* Estimated Delivery */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tahmini Teslimat</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.estimatedDelivery}
                                    onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                                    placeholder="Örn: 1-3 İş Günü, Aynı Gün"
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Rate */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kargo Ücreti (₺)</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    value={formData.rate}
                                    onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
                                    placeholder="0"
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>

                            {/* Min Order Limit */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Min. Ücretsiz Limiti (₺)</label>
                                <input
                                    required
                                    type="number"
                                    value={formData.minOrderLimit}
                                    onChange={(e) => setFormData({ ...formData, minOrderLimit: Number(e.target.value) })}
                                    placeholder="0 (Yok için)"
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Durum</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                            >
                                <option value="ACTIVE">Aktif (ACTIVE)</option>
                                <option value="INACTIVE">Pasif (INACTIVE)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={() => onClose()}
                            className="flex-1 px-6 py-3.5 bg-slate-900 text-slate-400 font-bold rounded-2xl hover:bg-slate-800 transition-all text-xs"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] px-6 py-3.5 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 text-xs"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={16} />
                            ) : (
                                <>
                                    <Save size={16} />
                                    {method ? "Güncelle" : "Ekle"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
