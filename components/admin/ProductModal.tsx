"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Save, AlertCircle } from "lucide-react";
import { createProduct, updateProduct } from "@/lib/actions/product-actions";
import { getCategories } from "@/lib/actions/category-actions";
import { cn } from "@/lib/utils";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: any; // If provided, we are in EDIT mode
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const isEdit = !!product;

    useEffect(() => {
        if (isOpen) {
            getCategories().then(setCategories);
            if (isEdit && product.image) {
                setImagePreview(product.image);
            } else {
                setImagePreview(null);
            }
        }
    }, [isOpen, isEdit, product]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        
        // Basic slug generation if empty
        if (!formData.get("slug")) {
            const name = formData.get("name") as string;
            formData.set("slug", name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
        }

        let result;
        if (isEdit) {
            result = await updateProduct(product.id, formData);
        } else {
            result = await createProduct(formData);
        }

        setLoading(false);

        if (result.success) {
            onClose();
        } else {
            setError(result.error || "Bir hata oluştu.");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#020617] border border-white/10 w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">
                            {isEdit ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
                        </h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                            {isEdit ? "Ürün bilgilerini ve görselini güncelleyin." : "Mağaza kataloğuna yeni bir öğe tanımlayın."}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-bold">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ürün Adı</label>
                            <input name="name" defaultValue={product?.name} required type="text" placeholder="Örn: PS5 Pro" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kategori</label>
                            <select name="categoryId" defaultValue={product?.categoryId} required className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all cursor-pointer">
                                <option value="">Seçiniz...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">SKU Kodu</label>
                            <input name="sku" defaultValue={product?.sku} required type="text" placeholder="Örn: PX-PS5-01" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Stok Adedi</label>
                            <input name="stock" defaultValue={product?.stock || 0} required type="number" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fiyat (₺)</label>
                            <input name="price" defaultValue={product?.price} required type="number" step="0.01" placeholder="0.00" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Eski Fiyat (₺) - Opsiyonel</label>
                            <input name="oldPrice" defaultValue={product?.oldPrice} type="number" step="0.01" placeholder="0.00" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ürün Görseli</label>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-slate-950 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center p-2 relative group">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <Upload className="text-slate-700" size={32} />
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <input 
                                    name="image" 
                                    required={!isEdit} 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange}
                                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20" 
                                />
                                <p className="text-[10px] text-slate-600 font-bold ml-1">
                                    {isEdit ? "Değiştirmek istemiyorsanız boş bırakın." : "PNG, JPG veya WEBP formatında bir görsel seçin."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 transition-all">İptal</button>
                        <button disabled={loading} type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50">
                            {loading ? "Kaydediliyor..." : <><Save size={18} /> {isEdit ? "Değişiklikleri Kaydet" : "Ürünü Kaydet"}</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
