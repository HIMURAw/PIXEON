"use client";

import React from "react";
import {
    MonitorPlay,
    Plus,
    GripVertical,
    Pencil,
    Trash2,
    Eye,
    ShoppingCart,
    Box,
    Layers,
    Palette
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SliderManagement() {
    const slides = [
        { id: 1, title: "PlayStation 5", badge: "YENİ NESİL", model: "/3D/ps5.glb", color: "bg-blue-600", active: true },
        { id: 2, title: "DualSense™ Wireless", badge: "KONTROL", model: "/3D/controller.glb", color: "bg-sky-500", active: true },
        { id: 3, title: "PlayStation 4 Pro", badge: "GÜÇLÜ", model: "/3D/ps4pro.glb", color: "bg-zinc-700", active: true },
        { id: 4, title: "Xbox Series X", badge: "XBOX", model: "/3D/xbox.glb", color: "bg-green-600", active: false },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Slider / Hero Yönetimi
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <MonitorPlay className="text-blue-400" size={14} />
                        Ana sayfadaki 3D modelli slider alanını ve kampanyaları yönetin.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-slate-900 border border-white/10 text-slate-300 px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                        <Palette size={20} />
                        Tema Ayarları
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                        <Plus size={20} />
                        Yeni Slayt Ekle
                    </button>
                </div>
            </div>

            {/* Slider Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {slides.map((slide, i) => (
                    <div key={slide.id} className="bg-[#020617] border border-white/10 rounded-[32px] overflow-hidden group hover:border-blue-500/40 transition-all duration-500 shadow-2xl relative">
                        {/* Status Badge */}
                        <div className="absolute top-6 left-6 z-20">
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                slide.active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-900 text-slate-500 border-white/10"
                            )}>
                                {slide.active ? "AKTİF" : "TASLAK"}
                            </span>
                        </div>

                        {/* Slide Preview Mock */}
                        <div className="h-64 bg-gradient-to-br from-slate-900 to-slate-800 relative flex items-center px-10 overflow-hidden">
                            <div className="relative z-10 space-y-3">
                                <span className={cn("px-2 py-0.5 rounded text-[8px] font-black text-white uppercase", slide.color)}>
                                    {slide.badge}
                                </span>
                                <h3 className="text-2xl font-black text-white">{slide.title}</h3>
                                <p className="text-[10px] text-slate-400 max-w-[140px] leading-relaxed">Yeni nesil oyun deneyimi ve 4K performansın tadını çıkarın.</p>
                            </div>

                            {/* 3D Model Placeholder Visual */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full flex items-center justify-center opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700">
                                <Box size={120} className="text-blue-400" />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-l from-[#020617]/50 to-transparent"></div>
                        </div>

                        {/* Info & Actions */}
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">3D Model Dosyası</p>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                        <Layers size={14} className="text-blue-400" />
                                        {slide.model}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-3 bg-slate-950 border border-white/5 rounded-2xl text-slate-500 hover:text-blue-400 hover:border-blue-500/20 transition-all">
                                        <Pencil size={18} />
                                    </button>
                                    <button className="p-3 bg-slate-950 border border-white/5 rounded-2xl text-slate-500 hover:text-red-400 hover:border-red-500/20 transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                    <button className="cursor-move p-3 bg-slate-950 border border-white/5 rounded-2xl text-slate-500 hover:text-white transition-all">
                                        <GripVertical size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                        <Eye size={14} /> 4.2k Görüntülenme
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                        <ShoppingCart size={14} /> 124 Tıklama
                                    </div>
                                </div>
                                <button className="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest transition-colors">
                                    Önizleme →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Slide Placeholder */}
                <button className="border-2 border-dashed border-white/10 rounded-[32px] h-full min-h-[400px] flex flex-col items-center justify-center gap-4 group hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-500">
                    <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                        <Plus size={32} />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-black text-white">Yeni Slayt Ekle</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Sınırsız 3D slayt desteği</p>
                    </div>
                </button>
            </div>
        </div>
    );
}
