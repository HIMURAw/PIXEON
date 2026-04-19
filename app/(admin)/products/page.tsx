"use client";

import React from "react";
import { 
    Plus, 
    Search, 
    Filter, 
    MoreHorizontal, 
    Pencil, 
    Trash2, 
    Eye,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminProducts() {
    const products = [
        { id: 1, name: "PlayStation 5 Slim Standart Edition", category: "Konsollar", price: "18.999 ₺", stock: 12, image: "/products/ps5-slim.png" },
        { id: 2, name: "DualSense Kablosuz Kontrolcü", category: "Aksesuarlar", price: "2.899 ₺", stock: 45, image: "/products/dualsense-white.png" },
        { id: 3, name: "Marvel's Spider-Man 2", category: "Oyunlar", price: "1.499 ₺", stock: 8, image: "/products/spiderman-2.png" },
        { id: 4, name: "Pulse 3D Kablosuz Kulaklık", category: "Aksesuarlar", price: "3.499 ₺", stock: 0, image: "/products/pulse-3d.png" },
        { id: 5, name: "God of War Ragnarök", category: "Oyunlar", price: "1.249 ₺", stock: 22, image: "/products/gow-ragnarok.png" },
    ];

    return (
        <div className="space-y-8 animate-in">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Ürün Yönetimi</h1>
                    <p className="text-slate-500 mt-1">Stoktaki tüm ürünleri listeleyin ve güncelleyin.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                    <Plus size={20} />
                    Yeni Ürün Ekle
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#020617] border border-white/10 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Ürün adı, SKU veya kategori ara..." 
                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-10 py-2.5 text-sm outline-none focus:border-blue-500 transition"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/5 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition">
                        <Filter size={18} />
                        Filtrele
                    </button>
                    <select className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 outline-none focus:border-blue-500 transition appearance-none cursor-pointer pr-10">
                        <option>Tüm Kategoriler</option>
                        <option>Konsollar</option>
                        <option>Oyunlar</option>
                        <option>Aksesuarlar</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#020617] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-white/[0.02] text-slate-500 font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Ürün</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Fiyat</th>
                                <th className="px-6 py-4">Stok</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-900 rounded-lg overflow-hidden border border-white/5 flex items-center justify-center p-1">
                                                <img src={product.image} alt="" className="max-w-full max-h-full object-contain" />
                                            </div>
                                            <div className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                                {product.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-slate-900 text-slate-400 rounded-lg text-[10px] font-bold uppercase border border-white/5">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-black text-white">{product.price}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                product.stock > 10 ? "bg-emerald-500" :
                                                product.stock > 0 ? "bg-amber-500" : "bg-red-500"
                                            )}></div>
                                            <span className={cn(
                                                "font-medium",
                                                product.stock === 0 ? "text-red-400" : "text-slate-300"
                                            )}>
                                                {product.stock === 0 ? "Stokta Yok" : `${product.stock} Adet`}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-blue-400 transition-all">
                                                <Pencil size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-red-400 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-white/5 flex items-center justify-between">
                    <p className="text-sm text-slate-500">50 üründen 1-5 arası gösteriliyor.</p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 bg-slate-900 border border-white/5 rounded-lg text-slate-500 hover:text-white disabled:opacity-50" disabled>
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4].map(i => (
                                <button key={i} className={cn(
                                    "w-8 h-8 rounded-lg text-sm font-bold transition-all",
                                    i === 1 ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-white/5"
                                )}>{i}</button>
                            ))}
                        </div>
                        <button className="p-2 bg-slate-900 border border-white/5 rounded-lg text-slate-500 hover:text-white">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
