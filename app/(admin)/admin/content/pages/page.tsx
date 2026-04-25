"use client";

import React from "react";
import { 
    FileText, 
    Plus, 
    Search, 
    Filter, 
    MoreHorizontal, 
    Pencil, 
    Trash2, 
    Eye, 
    Globe, 
    Clock, 
    ChevronLeft, 
    ChevronRight,
    ArrowUpRight,
    Settings,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminPages() {
    const pages = [
        { id: 1, title: "Hakkımızda", slug: "/hakkimizda", lastUpdated: "12 Nisan 2024", status: "Published", author: "Admin" },
        { id: 2, title: "İletişim", slug: "/iletisim", lastUpdated: "10 Nisan 2024", status: "Published", author: "Admin" },
        { id: 3, title: "Mesafeli Satış Sözleşmesi", slug: "/mesafeli-satis", lastUpdated: "05 Ocak 2024", status: "Published", author: "Legal" },
        { id: 4, title: "Gizlilik Politikası", slug: "/gizlilik", lastUpdated: "05 Ocak 2024", status: "Published", author: "Legal" },
        { id: 5, title: "KVKK Aydınlatma Metni", slug: "/kvkk", lastUpdated: "05 Ocak 2024", status: "Published", author: "Legal" },
        { id: 6, title: "Kargo ve İade", slug: "/kargo-iade", lastUpdated: "20 Mart 2024", status: "Draft", author: "Admin" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Sayfa Yönetimi (CMS)
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <FileText className="text-blue-400" size={14} />
                        Statik sayfaları, kurumsal içerikleri ve yasal metinleri yönetin.
                    </p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                    <Plus size={20} />
                    Yeni Sayfa Ekle
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#020617] border border-white/10 p-4 rounded-3xl flex flex-col lg:flex-row items-center gap-4 shadow-xl">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Sayfa başlığı veya slug ara..." 
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-12 py-3 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-white/5 rounded-2xl text-sm font-bold text-slate-400 hover:text-white transition-all">
                        <Filter size={18} />
                        Filtrele
                    </button>
                    <select className="bg-slate-900 border border-white/5 rounded-2xl px-5 py-3 text-sm font-bold text-slate-400 outline-none focus:border-blue-500/50 transition-all cursor-pointer min-w-[160px]">
                        <option>Tüm Durumlar</option>
                        <option>Yayında</option>
                        <option>Taslak</option>
                        <option>Arşivlendi</option>
                    </select>
                </div>
            </div>

            {/* Pages Table */}
            <div className="bg-[#020617] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-white/[0.01] text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                <th className="px-8 py-5">Sayfa Başlığı</th>
                                <th className="px-8 py-5">Slug / URL</th>
                                <th className="px-8 py-5">Son Güncelleme</th>
                                <th className="px-8 py-5">Yazar</th>
                                <th className="px-8 py-5">Durum</th>
                                <th className="px-8 py-5 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {pages.map((page) => (
                                <tr key={page.id} className="hover:bg-white/[0.01] transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-900 rounded-xl border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors">
                                                <FileText size={20} />
                                            </div>
                                            <div className="font-black text-white group-hover:text-blue-400 transition-colors">
                                                {page.title}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-500 font-medium hover:text-white cursor-pointer transition-colors">
                                            {page.slug}
                                            <ArrowUpRight size={12} />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Clock size={14} className="text-slate-600" />
                                            {page.lastUpdated}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-slate-400 font-bold">{page.author}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                            page.status === "Published" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        )}>
                                            {page.status === "Published" ? "Yayında" : "Taslak"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2.5 hover:bg-blue-500/10 rounded-xl text-slate-500 hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/20">
                                                <Pencil size={18} />
                                            </button>
                                            <button className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all border border-transparent hover:border-white/10">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2.5 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tüm sayfalar Google tarafından indekslenmeye hazır.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-50 transition-all" disabled>
                            <ChevronLeft size={20} />
                        </button>
                        <button className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick SEO Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#0b1220]/50 border border-white/10 rounded-[32px] p-8 space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Globe size={24} className="text-blue-400" />
                        Global SEO Ayarları
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ana Sayfa Title</label>
                            <input type="text" defaultValue="PIXEON | Türkiye'nin PlayStation Mağazası" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-white font-bold outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-3 px-8 rounded-xl transition-all text-[10px] active:scale-95">Ayarları Kaydet</button>
                    </div>
                </div>
                <div className="bg-[#0b1220]/50 border border-white/10 rounded-[32px] p-8 flex items-center gap-8">
                    <div className="w-16 h-16 bg-blue-600/10 text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
                        <ShieldCheck size={32} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white tracking-tight">Yasal Metinler</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">Sözleşmelerinizi ve yasal metinlerinizi her zaman güncel tutmayı unutmayın.</p>
                        <button className="text-blue-400 text-[10px] font-black uppercase tracking-widest hover:underline pt-2 block">Şablonları Gör →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
