"use client";

import React from "react";
import { 
    MessageSquare, 
    Search, 
    Filter, 
    Star, 
    ThumbsUp, 
    ThumbsDown, 
    CheckCircle2, 
    XCircle, 
    Trash2, 
    MoreHorizontal, 
    ChevronLeft, 
    ChevronRight,
    User,
    Gamepad2,
    Clock,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminReviews() {
    const reviews = [
        { id: 1, user: "Ahmet Y.", product: "PlayStation 5 Slim", rating: 5, comment: "Harika bir ürün, PIXEON kalitesi yine şaşırtmadı. Kargo çok hızlıydı.", date: "24 Nisan 2024", status: "Approved", likes: 12 },
        { id: 2, user: "Merve K.", product: "DualSense Edge", rating: 4, comment: "Kollar çok ergonomik ama batarya biraz daha uzun gidebilirdi.", date: "23 Nisan 2024", status: "Pending", likes: 2 },
        { id: 3, user: "Caner T.", product: "Marvel's Spider-Man 2", rating: 5, comment: "Oyun efsane! Grafikler ve hikaye büyüleyici.", date: "22 Nisan 2024", status: "Approved", likes: 45 },
        { id: 4, user: "Selin D.", product: "Pulse 3D Kulaklık", rating: 2, comment: "Ses kalitesi güzel ama pedleri biraz terletiyor, uzun kullanımda rahatsız.", date: "21 Nisan 2024", status: "Rejected", likes: 0 },
        { id: 5, user: "Burak B.", product: "God of War Ragnarök", rating: 5, comment: "Kratos yine formunda. Kesinlikle tavsiye ederim.", date: "20 Nisan 2024", status: "Approved", likes: 8 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Yorum & Değerlendirmeler
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <MessageSquare className="text-blue-400" size={14} />
                        Müşteri geri bildirimlerini yönetin, yanıtlayın ve mağaza puanını takip edin.
                    </p>
                </div>
                <div className="flex items-center gap-6 bg-[#020617] border border-white/10 px-8 py-3 rounded-[24px] shadow-lg">
                    <div className="text-center border-r border-white/5 pr-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mağaza Puanı</p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-2xl font-black text-white">4.8</span>
                            <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Toplam Yorum</p>
                        <p className="text-2xl font-black text-white mt-1">1,420</p>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#020617] border border-white/10 p-4 rounded-[32px] flex flex-col lg:flex-row items-center gap-4 shadow-xl">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Kullanıcı, ürün veya anahtar kelime ara..." 
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-12 py-3 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-white/5 rounded-2xl text-sm font-bold text-slate-400 hover:text-white transition-all">
                        <Filter size={18} />
                        Filtrele
                    </button>
                    <select className="bg-slate-900 border border-white/5 rounded-2xl px-5 py-3 text-sm font-bold text-slate-400 outline-none focus:border-blue-500/50 transition-all cursor-pointer min-w-[160px]">
                        <option>Tüm Yıldızlar</option>
                        <option>5 Yıldız</option>
                        <option>4 Yıldız</option>
                        <option>3 Yıldız</option>
                        <option>2 Yıldız</option>
                        <option>1 Yıldız</option>
                    </select>
                </div>
            </div>

            {/* Reviews List */}
            <div className="grid grid-cols-1 gap-6">
                {reviews.map((rv) => (
                    <div key={rv.id} className="bg-[#020617] border border-white/10 rounded-[40px] p-8 hover:border-blue-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none transition-all group-hover:bg-blue-500/10"></div>
                        
                        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center justify-between lg:justify-start lg:gap-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-900 rounded-2xl border border-white/5 flex items-center justify-center text-slate-500">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white tracking-tight">{rv.user}</h3>
                                            <p className="text-xs text-slate-500 font-medium">Onaylı Alıcı ✓</p>
                                        </div>
                                    </div>
                                    <div className="flex bg-slate-900/50 border border-white/5 px-4 py-2 rounded-xl items-center gap-3">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className={cn(i < rv.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-700")} />
                                            ))}
                                        </div>
                                        <span className="text-white font-black text-sm">{rv.rating}.0</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest">
                                        <Gamepad2 size={14} />
                                        {rv.product}
                                    </div>
                                    <p className="text-slate-300 leading-relaxed text-base font-medium">"{rv.comment}"</p>
                                </div>

                                <div className="flex items-center gap-6 pt-2">
                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                        <Clock size={14} />
                                        {rv.date}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-emerald-400/60 text-[10px] font-black uppercase tracking-tighter">
                                            <ThumbsUp size={14} />
                                            {rv.likes} Beğeni
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-48 shrink-0 flex flex-col justify-between items-end gap-4">
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg",
                                    rv.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5" :
                                    rv.status === "Pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5" :
                                    "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/5"
                                )}>
                                    {rv.status === "Approved" ? "Yayında" :
                                     rv.status === "Pending" ? "Onay Bekliyor" : "Reddedildi"}
                                </span>

                                <div className="flex items-center gap-2">
                                    {rv.status === "Pending" && (
                                        <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-slate-950 font-black rounded-2xl hover:bg-emerald-400 transition-all text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20">
                                            <CheckCircle2 size={14} />
                                            Onayla
                                        </button>
                                    )}
                                    <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-slate-500 hover:text-white transition-all">
                                        <MoreHorizontal size={20} />
                                    </button>
                                    <button className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 pb-10">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Görüntülenen: 5 / 1,420 Yorum</p>
                <div className="flex items-center gap-2">
                    <button className="p-3 bg-slate-900 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-50 transition-all" disabled>
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
                    <button className="p-3 bg-slate-900 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
