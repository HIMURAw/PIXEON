"use client";

import React from "react";
import { 
    Image as ImageIcon, 
    Plus, 
    Trash2, 
    Pencil, 
    Eye, 
    Calendar, 
    Layout, 
    ExternalLink, 
    MousePointer2, 
    BarChart3,
    MoreVertical,
    Clock,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminBanners() {
    const banners = [
        { id: 1, title: "PS5 Pro Ön Sipariş", position: "Ana Sayfa Hero", size: "1920x600", clicks: 4250, ctr: "8.4%", status: "Active", date: "12-30 Nisan" },
        { id: 2, title: "Bahar İndirimleri", position: "Ürünler Sayfası Üst", size: "1200x200", clicks: 1120, ctr: "3.2%", status: "Scheduled", date: "1-15 Mayıs" },
        { id: 3, title: "Ücretsiz Kargo Duyurusu", position: "Global Top Bar", size: "100%x40", clicks: 8400, ctr: "12.1%", status: "Active", date: "Süresiz" },
        { id: 4, title: "FC 25 Turnuvası", position: "Blog Yan Menü", size: "300x250", clicks: 450, ctr: "1.8%", status: "Expired", date: "1-10 Nisan" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Kampanya & Banner Yönetimi
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <ImageIcon className="text-blue-400" size={14} />
                        Site genelindeki reklam alanlarını, kampanya görsellerini ve tıklanma oranlarını yönetin.
                    </p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                    <Plus size={20} />
                    Yeni Banner Ekle
                </button>
            </div>

            {/* Banner Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {banners.map((banner) => (
                    <div key={banner.id} className="bg-[#020617] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl group flex flex-col md:flex-row relative">
                        {/* Status Overlay for Expired */}
                        {banner.status === "Expired" && (
                            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                                <span className="bg-red-600/20 text-red-500 border border-red-500/30 px-6 py-2 rounded-full font-black uppercase tracking-widest text-xs">Süresi Doldu</span>
                            </div>
                        )}

                        {/* Banner Preview Area */}
                        <div className="md:w-56 h-48 md:h-auto bg-slate-900 flex items-center justify-center relative overflow-hidden group">
                            <ImageIcon size={48} className="text-slate-700 group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-4">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{banner.size}</span>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-8 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">{banner.title}</h3>
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                                        <Layout size={12} className="text-blue-500" />
                                        {banner.position}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                        banner.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                        banner.status === "Scheduled" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                        "bg-red-500/10 text-red-400 border-red-500/20"
                                    )}>
                                        {banner.status === "Active" ? "Yayında" :
                                         banner.status === "Scheduled" ? "Planlandı" : "Pasif"}
                                    </span>
                                    <button className="p-2 text-slate-600 hover:text-white transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <div className="text-center">
                                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Tıklama</p>
                                    <p className="text-sm font-black text-white">{banner.clicks.toLocaleString()}</p>
                                </div>
                                <div className="text-center border-x border-white/5">
                                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">CTR</p>
                                    <p className="text-sm font-black text-emerald-400">{banner.ctr}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Dönüşüm</p>
                                    <p className="text-sm font-black text-white">-%</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                    <Calendar size={12} className="text-blue-500" />
                                    {banner.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                                        <Pencil size={18} />
                                    </button>
                                    <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-500 hover:text-blue-400 transition-all">
                                        <Eye size={18} />
                                    </button>
                                    <button className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Guidelines Card */}
            <div className="bg-[#0b1220]/50 border border-white/10 rounded-[32px] p-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-20 h-20 bg-blue-600/10 text-blue-400 rounded-3xl flex items-center justify-center shrink-0">
                    <BarChart3 size={40} />
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                    <h3 className="text-xl font-bold text-white tracking-tight">Performans İpuçları</h3>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
                        Bannerlarınızın tıklanma oranlarını artırmak için görsellerde parlak renkler ve net "Call to Action" butonları kullanın. 
                        Mobil cihazlar için özel boyutlarda (300x250) bannerlar eklemeyi unutmayın.
                    </p>
                </div>
                <button className="px-8 py-4 bg-slate-900 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-800 transition-all shadow-xl">
                    Tüm Analizler
                </button>
            </div>
        </div>
    );
}
