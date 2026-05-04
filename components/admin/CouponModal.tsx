"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Ticket } from "lucide-react";
import { createCoupon, updateCoupon } from "@/lib/actions/coupon-actions";
import { cn } from "@/lib/utils";

interface CouponModalProps {
    isOpen: boolean;
    onClose: (success?: boolean) => void;
    coupon?: any;
}

export default function CouponModal({ isOpen, onClose, coupon }: CouponModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
        discountValue: 0,
        minPurchase: 0,
        expiryDate: "",
        usageLimit: "" as string | number,
    });

    useEffect(() => {
        if (coupon) {
            setFormData({
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minPurchase: coupon.minPurchase || 0,
                expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : "",
                usageLimit: coupon.usageLimit || "",
            });
        } else {
            setFormData({
                code: "",
                discountType: "PERCENTAGE",
                discountValue: 0,
                minPurchase: 0,
                expiryDate: "",
                usageLimit: "",
            });
        }
    }, [coupon, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            ...formData,
            discountValue: Number(formData.discountValue),
            minPurchase: Number(formData.minPurchase),
            usageLimit: formData.usageLimit === "" ? null : Number(formData.usageLimit),
            expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
        };

        let result;
        if (coupon) {
            result = await updateCoupon(coupon.id, data);
        } else {
            result = await createCoupon(data);
        }

        setLoading(false);
        if (result.success) {
            onClose(true);
        } else {
            alert(result.error);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => onClose()} />
            
            <div className="relative w-full max-w-lg bg-[#020617] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-xl text-white">
                            <Ticket size={20} />
                        </div>
                        <h2 className="text-xl font-black text-white">
                            {coupon ? "Kuponu Düzenle" : "Yeni Kupon Oluştur"}
                        </h2>
                    </div>
                    <button onClick={() => onClose()} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Code */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kupon Kodu</label>
                            <input
                                required
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                placeholder="Örn: YAZ2024"
                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Type */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">İndirim Türü</label>
                                <select
                                    value={formData.discountType}
                                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                                >
                                    <option value="PERCENTAGE">Yüzde (%)</option>
                                    <option value="FIXED">Sabit Tutar (₺)</option>
                                </select>
                            </div>

                            {/* Value */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Değer</label>
                                <input
                                    required
                                    type="number"
                                    value={formData.discountValue}
                                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Min Purchase */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Min. Harcama (₺)</label>
                                <input
                                    type="number"
                                    value={formData.minPurchase}
                                    onChange={(e) => setFormData({ ...formData, minPurchase: Number(e.target.value) })}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>

                            {/* Usage Limit */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kullanım Limiti</label>
                                <input
                                    type="number"
                                    value={formData.usageLimit}
                                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                    placeholder="Sınırsız için boş bırakın"
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Expiry */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Son Kullanma Tarihi</label>
                            <input
                                type="date"
                                value={formData.expiryDate}
                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => onClose()}
                            className="flex-1 px-6 py-3 bg-slate-900 text-slate-400 font-bold rounded-2xl hover:bg-slate-800 transition-all"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={18} />
                                    {coupon ? "Güncelle" : "Oluştur"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
