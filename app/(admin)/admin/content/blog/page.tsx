"use client";

import React from "react";
import { 
    PenTool, 
    Search, 
    Plus, 
    MoreHorizontal, 
    Eye, 
    Pencil, 
    Trash2, 
    Calendar, 
    MessageSquare, 
    Share2, 
    User,
    Tag,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminBlog() {
    const posts = [
        { id: 1, title: "PS5 Pro Hakkında Her Şey", category: "Donanım", author: "Admin", date: "22 Nis 2024", views: "1.2k", comments: 12, status: "Published", image: "/blog/ps5-pro.jpg" },
        { id: 2, title: "Mayıs Ayı Ücretsiz PS Plus Oyunları", category: "PS Plus", author: "Admin", date: "20 Nis 2024", views: "3.5k", comments: 45, status: "Published", image: "/blog/ps-plus.jpg" },
        { id: 3, title: "GTA VI Çıkış Tarihi Sızıntıları", category: "Oyun Haberleri", author: "Editör", date: "15 Nis 2024", views: "12k", comments: 156, status: "Published", image: "/blog/gta-6.jpg" },
        { id: 4, title: "En İyi PS5 Aksesuarları 2024", category: "Rehber", author: "Admin", date: "10 Nis 2024", views: "842", comments: 5, status: "Draft", image: "/blog/acc.jpg" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Blog Yazıları
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <PenTool className="text-blue-400" size={14} />
                        İçeriklerinizi yönetin, haberler yayınlayın ve etkileşimi takip edin.
                    </p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                    <Plus size={20} />
                    Yeni Yazı Oluştur
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#020617] border border-white/10 p-4 rounded-3xl flex flex-col lg:flex-row items-center gap-4 shadow-xl">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Yazı başlığı veya kategori ara..." 
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-12 py-3 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <select className="bg-slate-900 border border-white/5 rounded-2xl px-5 py-3 text-sm font-bold text-slate-400 outline-none focus:border-blue-500/50 transition-all cursor-pointer min-w-[160px]">
                        <option>Tüm Kategoriler</option>
                        <option>Haberler</option>
                        <option>İncelemeler</option>
                        <option>Rehberler</option>
                    </select>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {posts.map((post) => (
                    <div key={post.id} className="bg-[#020617] border border-white/10 rounded-[32px] overflow-hidden group hover:border-blue-500/40 transition-all duration-500 shadow-2xl flex flex-col md:flex-row">
                        <div className="md:w-48 h-48 md:h-auto bg-slate-900 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 to-transparent z-10 opacity-60"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ImageIcon className="text-slate-800" size={48} />
                            </div>
                            <div className="absolute top-4 left-4 z-20">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                    post.status === "Published" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-900 text-slate-500 border-white/10"
                                )}>
                                    {post.status === "Published" ? "YAYINDA" : "TASLAK"}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex-1 p-8 space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                    <Tag size={12} />
                                    {post.category}
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                    <User size={14} className="text-slate-700" />
                                    {post.author}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                    <Calendar size={14} className="text-slate-700" />
                                    {post.date}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                        <Eye size={14} className="text-slate-600" />
                                        {post.views}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                        <MessageSquare size={14} className="text-slate-600" />
                                        {post.comments}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><Pencil size={18} /></button>
                                    <button className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-red-400 transition-all"><Trash2 size={18} /></button>
                                    <button className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><MoreHorizontal size={18} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 pt-8">
                <button className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-50 transition-all" disabled>
                    <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-1">
                    {[1, 2, 3].map(i => (
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
    );
}
