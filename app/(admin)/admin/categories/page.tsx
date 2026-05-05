"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Eye,
    Layers,
    Gamepad2,
    Disc,
    Headset,
    CreditCard,
    Loader2,
    X,
    Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategories, createCategory, deleteCategory, updateCategory } from "@/lib/actions/category-actions";

export default function AdminCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        slug: "",
        description: "",
        image: ""
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
        setLoading(false);
    };

    const handleOpenModal = (cat: any = null) => {
        if (cat) {
            setFormData({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                description: cat.description || "",
                image: cat.image || ""
            });
        } else {
            setFormData({ id: "", name: "", slug: "", description: "", image: "" });
        }
        setIsModalOpen(true);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name.toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");
        setFormData(prev => ({ ...prev, name, slug }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        let result;
        if (formData.id) {
            result = await updateCategory(formData.id, {
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                image: formData.image
            });
        } else {
            result = await createCategory({
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                image: formData.image
            });
        }

        if (result.success) {
            setIsModalOpen(false);
            loadCategories();
        } else {
            alert(result.error);
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;

        const result = await deleteCategory(id);
        if (result.success) {
            loadCategories();
        } else {
            alert(result.error);
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.slug.toLowerCase().includes(search.toLowerCase())
    );

    const getIcon = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes("konsol")) return Gamepad2;
        if (n.includes("oyun")) return Disc;
        if (n.includes("aksesuar")) return Headset;
        if (n.includes("kod") || n.includes("dijital")) return CreditCard;
        return Layers;
    };

    return (
        <>
            {/* Modal - Sayfa animasyonunun dışında, en üstte */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 md:p-8">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-500"
                        onClick={() => !submitting && setIsModalOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-lg bg-[#020617] border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 z-10">
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none"></div>

                        <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10 bg-white/[0.01]">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">
                                    {formData.id ? "Kategoriyi Düzenle" : "Yeni Kategori"}
                                </h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Katalog Yönetimi</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2.5 hover:bg-white/10 rounded-2xl text-slate-500 hover:text-white transition-all bg-white/5 border border-white/5"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 relative z-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Kategori Adı</label>
                                    <input
                                        required
                                        autoFocus
                                        type="text"
                                        value={formData.name}
                                        onChange={handleNameChange}
                                        placeholder="Örn: PlayStation 5"
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Slug (URL Yapısı)</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 text-sm font-bold">/</span>
                                        <input
                                            required
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                            placeholder="playstation-5"
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 pl-8 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Kısa Açıklama</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Kategori hakkında bilgi (opsiyonel)..."
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all min-h-[100px] resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold py-4 rounded-2xl transition-all border border-white/5"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : (formData.id ? "GÜNCELLE" : "KAYDET")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Page Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Kategori Yönetimi
                        </h1>
                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                            <Layers className="text-blue-400" size={14} />
                            Mağazanızdaki ürün gruplarını ve menü yapısını yönetin.
                        </p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        <Plus size={20} />
                        Yeni Kategori Ekle
                    </button>
                </div>

                {/* Categories Table */}
                <div className="bg-[#020617] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                        <div className="relative max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Kategori adı veya slug ara..."
                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-12 py-3 text-sm outline-none focus:border-blue-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-white/[0.01] text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                    <th className="px-8 py-5">Kategori</th>
                                    <th className="px-8 py-5">Slug / URL</th>
                                    <th className="px-8 py-5 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center">
                                            <Loader2 className="animate-spin mx-auto text-blue-500 mb-2" size={32} />
                                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Yükleniyor...</p>
                                        </td>
                                    </tr>
                                ) : filteredCategories.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                                            Kategori bulunamadı.
                                        </td>
                                    </tr>
                                ) : filteredCategories.map((cat) => {
                                    const Icon = getIcon(cat.name);
                                    return (
                                        <tr key={cat.id} className="hover:bg-white/[0.01] transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 bg-blue-500/10 text-blue-400"
                                                    )}>
                                                        <Icon size={24} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-white text-base group-hover:text-blue-400 transition-colors">{cat.name}</span>
                                                        {cat.description && <span className="text-[10px] text-slate-600 truncate max-w-[200px]">{cat.description}</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <code className="text-xs font-bold text-slate-500 bg-slate-900 px-3 py-1 rounded-lg border border-white/5">
                                                    /{cat.slug}
                                                </code>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => handleOpenModal(cat)}
                                                        className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat.id)}
                                                        className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-red-400 transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
    );
}
