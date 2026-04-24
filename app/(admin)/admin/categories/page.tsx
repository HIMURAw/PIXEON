"use client";

import React from "react";
import { 
    Plus, 
    Search, 
    MoreHorizontal, 
    Pencil, 
    Trash2, 
    Eye,
    Layers,
    ArrowUpDown,
    Gamepad2,
    Disc,
    Headset,
    CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminCategories() {
    const categories = [
        { id: 1, name: "Konsollar", slug: "/konsollar", items: 24, icon: Gamepad2, color: "text-blue-400", bg: "bg-blue-400/10" },
        { id: 2, name: "Oyunlar", slug: "/oyunlar", items: 842, icon: Disc, color: "text-purple-400", bg: "bg-purple-400/10" },
        { id: 3, name: "Aksesuarlar", slug: "/aksesuarlar", items: 156, icon: Headset, color: "text-emerald-400", bg: "bg-emerald-400/10" },
        { id: 4, name: "Dijital Kodlar", slug: "/dijital-kodlar", items: 84, icon: CreditCard, color: "text-amber-400", bg: "bg-amber-400/10" },
    ];

    return (
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
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
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
                                <th className="px-8 py-5 text-center">Ürün Sayısı</th>
                                <th className="px-8 py-5 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-white/[0.01] transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110", cat.bg, cat.color)}>
                                                <cat.icon size={24} />
                                            </div>
                                            <div className="font-black text-white text-base group-hover:text-blue-400 transition-colors">
                                                {cat.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <code className="text-xs font-bold text-slate-500 bg-slate-900 px-3 py-1 rounded-lg border border-white/5">
                                            {cat.slug}
                                        </code>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="font-black text-slate-300 text-lg">{cat.items}</span>
                                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">Aktif Ürün</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                                                <Pencil size={18} />
                                            </button>
                                            <button className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-red-400 transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                            <button className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
