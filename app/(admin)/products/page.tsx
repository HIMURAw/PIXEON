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
    ChevronRight,
    Download,
    ArrowUpDown,
    LayoutGrid,
    List,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminProducts() {
    const products = [
        { id: 1, name: "PlayStation 5 Slim Standart Edition", category: "Konsollar", price: "18.999 ₺", stock: 12, sales: 142, image: "/products/ps5.png", status: "Active" },
        { id: 2, name: "DualSense Kablosuz Kontrolcü", category: "Aksesuarlar", price: "2.899 ₺", stock: 45, sales: 512, image: "/products/dualsense.png", status: "Active" },
        { id: 3, name: "Marvel's Spider-Man 2", category: "Oyunlar", price: "1.499 ₺", stock: 8, sales: 842, image: "/products/spiderman_2_hero.png", status: "Active" },
        { id: 4, name: "Pulse 3D Kablosuz Kulaklık", category: "Aksesuarlar", price: "3.499 ₺", stock: 0, sales: 64, image: "/products/pulse-3d.png", status: "Out of Stock" },
        { id: 5, name: "God of War Ragnarök", category: "Oyunlar", price: "1.249 ₺", stock: 22, sales: 320, image: "/products/spiderman.jpg", status: "Active" },
        { id: 6, name: "PS5 Bundle – FC 25 Edition", category: "Konsollar", price: "20.999 ₺", stock: 5, sales: 18, image: "/products/ps5.png", status: "Active" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Ürün Yönetimi
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <Package className="text-blue-400" size={14} />
                        Katalogdaki ürünlerin stok, fiyat ve durumlarını yönetin.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-slate-900 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                        <Download size={18} />
                        Dışa Aktar
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                        <Plus size={20} />
                        Yeni Ürün Ekle
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Toplam Ürün", value: "1,240", icon: Package, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { label: "Düşük Stok", value: "12", icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-400/10" },
                    { label: "Aktif Kategoriler", value: "8", icon: LayoutGrid, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#020617] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                        <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-white mt-0.5">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#020617] border border-white/10 p-4 rounded-3xl flex flex-col lg:flex-row items-center gap-4 shadow-xl">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Ürün adı, SKU veya kategori ara..." 
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-12 py-3 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="flex bg-slate-900/50 border border-white/5 p-1 rounded-xl">
                        <button className="p-2 rounded-lg bg-blue-600 text-white"><List size={18} /></button>
                        <button className="p-2 rounded-lg text-slate-500 hover:text-white"><LayoutGrid size={18} /></button>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-white/5 rounded-2xl text-sm font-bold text-slate-400 hover:text-white transition-all">
                        <Filter size={18} />
                        Filtrele
                    </button>
                    <select className="bg-slate-900 border border-white/5 rounded-2xl px-5 py-3 text-sm font-bold text-slate-400 outline-none focus:border-blue-500/50 transition-all cursor-pointer min-w-[160px]">
                        <option>Tüm Kategoriler</option>
                        <option>Konsollar</option>
                        <option>Oyunlar</option>
                        <option>Aksesuarlar</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#020617] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-white/[0.01] text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                <th className="px-8 py-5">
                                    <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                        Ürün <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-8 py-5">Kategori</th>
                                <th className="px-8 py-5 text-center">Satış</th>
                                <th className="px-8 py-5">Fiyat</th>
                                <th className="px-8 py-5">Stok Durumu</th>
                                <th className="px-8 py-5 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-white/[0.01] transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-slate-900 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center p-2 group-hover:border-blue-500/30 transition-all">
                                                <img src={product.image} alt="" className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="font-black text-white group-hover:text-blue-400 transition-colors text-sm">
                                                    {product.name}
                                                </div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">SKU: PX-00{product.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-500/20">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="font-bold text-slate-400">{product.sales}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-black text-white text-base">{product.price}</div>
                                        <p className="text-[10px] text-slate-600 font-bold">+ 18% KDV Dahil</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-[10px] font-bold">
                                                <span className={cn(
                                                    product.stock === 0 ? "text-red-400" : 
                                                    product.stock < 10 ? "text-amber-400" : "text-emerald-400"
                                                )}>
                                                    {product.stock === 0 ? "Stok Bitti" : `${product.stock} Adet`}
                                                </span>
                                                <span className="text-slate-600">{product.stock}%</span>
                                            </div>
                                            <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    style={{ width: `${Math.min(product.stock, 100)}%` }} 
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-1000",
                                                        product.stock === 0 ? "bg-red-500" : 
                                                        product.stock < 10 ? "bg-amber-500" : "bg-emerald-500"
                                                    )}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2.5 hover:bg-blue-500/10 rounded-xl text-slate-500 hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/20">
                                                <Pencil size={18} />
                                            </button>
                                            <button className="p-2.5 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20">
                                                <Trash2 size={18} />
                                            </button>
                                            <button className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all border border-transparent hover:border-white/10">
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">50 üründen 1-6 arası gösteriliyor.</p>
                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-50 transition-all" disabled>
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4].map(i => (
                                <button key={i} className={cn(
                                    "w-10 h-10 rounded-xl text-xs font-black transition-all border border-transparent",
                                    i === 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:bg-white/5 hover:border-white/10"
                                )}>{i}</button>
                            ))}
                        </div>
                        <button className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper components normally defined elsewhere
function Package(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}
