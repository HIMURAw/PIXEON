"use client";

import React, { useState, useEffect } from "react";
import { 
    Plus, 
    Save, 
    Trash2, 
    Image as ImageIcon, 
    Type, 
    ChevronRight,
    Box,
    Layout,
    CheckCircle2,
    XCircle,
    Eye
} from "lucide-react";
import { getHeroSlides, saveHeroSlide, deleteHeroSlide } from "@/lib/actions/hero-actions";
import { cn } from "@/lib/utils";

export default function SliderPage() {
    const [slides, setSlides] = useState<any[]>([]);
    const [selectedSlide, setSelectedSlide] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSlides();
    }, []);

    const loadSlides = async () => {
        setLoading(true);
        const res = await getHeroSlides();
        if (res.success && res.slides) {
            setSlides(res.slides);
        }
        setLoading(false);
    };

    const handleCreateSlide = () => {
        setSelectedSlide({
            title: "Yeni Slayt",
            subtitle: "Harika bir alt başlık...",
            price: "0 ₺",
            badge: "YENİ",
            badgeColor: "bg-blue-600",
            buttonText: "İncele",
            buttonLink: "/shop",
            modelPath: "/3D/ps5.glb",
            order: slides.length,
            status: "ACTIVE"
        });
    };

    const handleSave = async () => {
        if (!selectedSlide.title) return alert("Başlık gereklidir.");
        setSaving(true);
        const res = await saveHeroSlide(selectedSlide);
        if (res.success) {
            alert("Slayt kaydedildi!");
            loadSlides();
            setSelectedSlide(null);
        } else {
            alert(res.error);
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu slaytı silmek istediğinize emin misiniz?")) return;
        const res = await deleteHeroSlide(id);
        if (res.success) {
            loadSlides();
            if (selectedSlide?.id === id) setSelectedSlide(null);
        } else {
            alert(res.error);
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <Layout className="text-blue-500" size={32} />
                        Slider / Hero Yönetimi
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Ana sayfadaki 3D hero görsellerini ve içeriklerini düzenleyin.</p>
                </div>
                <button 
                    onClick={handleCreateSlide}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                    <Plus size={20} />
                    YENİ SLAYT EKLE
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Slides List */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white">Slaytlar</h2>
                            <span className="text-[10px] font-black bg-slate-800 text-slate-400 px-2 py-1 rounded-lg uppercase tracking-widest">
                                {slides.length} TOPLAM
                            </span>
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 animate-pulse rounded-2xl" />)}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {slides.map(slide => (
                                    <div 
                                        key={slide.id}
                                        onClick={() => setSelectedSlide(slide)}
                                        className={cn(
                                            "group p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between",
                                            selectedSlide?.id === slide.id 
                                                ? "bg-blue-600/10 border-blue-500/50" 
                                                : "bg-white/5 border-white/5 hover:border-white/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                                selectedSlide?.id === slide.id ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400"
                                            )}>
                                                <Box size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-white truncate w-40">{slide.title}</h3>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={cn(
                                                        "text-[8px] font-black uppercase px-1.5 py-0.5 rounded",
                                                        slide.status === "ACTIVE" ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
                                                    )}>
                                                        {slide.status}
                                                    </span>
                                                    <span className="text-[9px] text-slate-600 font-bold">SIRA: {slide.order}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className={cn("text-slate-600 group-hover:text-white transition-all", selectedSlide?.id === slide.id && "translate-x-1 text-blue-500")} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Editor */}
                <div className="lg:col-span-8">
                    {selectedSlide ? (
                        <div className="bg-slate-900 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">Slayt Düzenle</h2>
                                    <p className="text-xs text-slate-500 font-medium mt-1">ID: {selectedSlide.id || "Yeni"}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {selectedSlide.id && (
                                        <button 
                                            onClick={() => handleDelete(selectedSlide.id)}
                                            className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                    <button 
                                        disabled={saving}
                                        onClick={handleSave}
                                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                                    >
                                        <Save size={20} />
                                        {saving ? "KAYDEDİLİYOR..." : "KAYDET"}
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Status & Order */}
                                <div className="flex items-center gap-6 bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                                    <div className="flex-1 flex items-center gap-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Durum:</label>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => setSelectedSlide({ ...selectedSlide, status: "ACTIVE" })}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-2",
                                                    selectedSlide.status === "ACTIVE" ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-500"
                                                )}
                                            >
                                                <CheckCircle2 size={12} /> AKTİF
                                            </button>
                                            <button 
                                                onClick={() => setSelectedSlide({ ...selectedSlide, status: "INACTIVE" })}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-2",
                                                    selectedSlide.status === "INACTIVE" ? "bg-red-500 text-white" : "bg-slate-800 text-slate-500"
                                                )}
                                            >
                                                <XCircle size={12} /> PASİF
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sıralama:</label>
                                        <input 
                                            type="number"
                                            value={selectedSlide.order}
                                            onChange={(e) => setSelectedSlide({ ...selectedSlide, order: parseInt(e.target.value) })}
                                            className="w-16 bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-white text-center font-bold outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Content Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">SLAYT BAŞLIĞI</label>
                                            <input 
                                                type="text"
                                                value={selectedSlide.title}
                                                onChange={(e) => setSelectedSlide({ ...selectedSlide, title: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                                                placeholder="PlayStation 5"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ALT BAŞLIK / AÇIKLAMA</label>
                                            <textarea 
                                                value={selectedSlide.subtitle}
                                                onChange={(e) => setSelectedSlide({ ...selectedSlide, subtitle: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all min-h-[100px] resize-none"
                                                placeholder="Kısa bir açıklama girin..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">FİYAT</label>
                                                <input 
                                                    type="text"
                                                    value={selectedSlide.price}
                                                    onChange={(e) => setSelectedSlide({ ...selectedSlide, price: e.target.value })}
                                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                                                    placeholder="18.999 ₺"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ROZET (BADGE)</label>
                                                <input 
                                                    type="text"
                                                    value={selectedSlide.badge}
                                                    onChange={(e) => setSelectedSlide({ ...selectedSlide, badge: e.target.value })}
                                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                                                    placeholder="YENİ NESİL"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">3D MODEL YOLU (.glb)</label>
                                            <div className="relative">
                                                <Box size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                                                <input 
                                                    type="text"
                                                    value={selectedSlide.modelPath}
                                                    onChange={(e) => setSelectedSlide({ ...selectedSlide, modelPath: e.target.value })}
                                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all font-mono"
                                                    placeholder="/3D/ps5.glb"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">BUTON METNİ</label>
                                                <input 
                                                    type="text"
                                                    value={selectedSlide.buttonText}
                                                    onChange={(e) => setSelectedSlide({ ...selectedSlide, buttonText: e.target.value })}
                                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                                                    placeholder="Hemen İncele"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">BUTON LİNKİ</label>
                                                <input 
                                                    type="text"
                                                    value={selectedSlide.buttonLink}
                                                    onChange={(e) => setSelectedSlide({ ...selectedSlide, buttonLink: e.target.value })}
                                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                                                    placeholder="/shop"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ROZET RENGİ (Tailwind Class)</label>
                                            <input 
                                                type="text"
                                                value={selectedSlide.badgeColor}
                                                onChange={(e) => setSelectedSlide({ ...selectedSlide, badgeColor: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all font-mono"
                                                placeholder="bg-blue-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] border-2 border-dashed border-white/5 rounded-[48px] flex flex-col items-center justify-center space-y-6 text-center p-12">
                            <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center text-slate-700">
                                <Layout size={48} />
                            </div>
                            <div className="max-w-xs">
                                <h3 className="text-xl font-bold text-white">Slayt Seçin</h3>
                                <p className="text-slate-500 text-sm mt-2">Sol taraftan bir slayt seçerek düzenlemeye başlayın veya yeni bir slayt ekleyin.</p>
                            </div>
                            <button 
                                onClick={handleCreateSlide}
                                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-3 rounded-2xl transition-all border border-white/5"
                            >
                                İlk Slaytını Ekle
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
