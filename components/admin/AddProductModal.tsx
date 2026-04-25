"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Save, AlertCircle } from "lucide-react";
import { createProduct } from "@/lib/actions/product-actions";
import { getCategories } from "@/lib/actions/category-actions";
import { cn } from "@/lib/utils";

export default function AddProductModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            getCategories().then(setCategories);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Basic slug generation if empty
        if (!data.slug) {
            data.slug = (data.name as string).toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        }

        const result = await createProduct(data);
        setLoading(false);

        if (result.success) {
            onClose();
        } else {
            setError(result.error || "Bir hata oluştu.");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#020617] border border-white/10 w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Yeni Ürün Ekle</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Mağaza kataloğuna yeni bir öğe tanımlayın.</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-bold">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ürün Adı</label>
                            <input name="name" required type="text" placeholder="Örn: PS5 Pro" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kategori</label>
                            <select name="categoryId" required className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all cursor-pointer">
                                <option value="">Seçiniz...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">SKU Kodu</label>
                            <input name="sku" required type="text" placeholder="Örn: PX-PS5-01" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Stok Adedi</label>
                            <input name="stock" required type="number" defaultValue="0" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fiyat (₺)</label>
                            <input name="price" required type="number" step="0.01" placeholder="0.00" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Eski Fiyat (₺) - Opsiyonel</label>
                            <input name="oldPrice" type="number" step="0.01" placeholder="0.00" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ürün Görseli (URL)</label>
                        <div className="relative group">
                            <input name="image" type="text" placeholder="/products/example.png" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all" />
                            <Upload className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-all" size={18} />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 transition-all">İptal</button>
                        <button disabled={loading} type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50">
                            {loading ? "Kaydediliyor..." : <><Save size={18} /> Ürünü Kaydet</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
