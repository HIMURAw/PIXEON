"use client";

import React, { useState, useEffect } from "react";
import { getAboutUsContent, saveAboutUsContent } from "@/lib/actions/about-actions";
import { Save, Info, Zap, BookOpen, Target, Loader2, Upload, Layout } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminAboutPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        getAboutUsContent().then(res => {
            if (res.success) setContent(res.data);
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const res = await saveAboutUsContent(content);
        if (res.success) {
            toast.success("Hakkımızda sayfası başarıyla güncellendi!");
        } else {
            toast.error("Hata: " + res.error);
        }
        setSaving(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: string, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setContent({
                    ...content,
                    [section]: { ...content[section], [field]: data.url }
                });
                toast.success("Görsel yüklendi!");
            }
        } catch (error) {
            toast.error("Görsel yüklenemedi!");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Info className="text-blue-500" />
                        Hakkımızda Sayfası Yönetimi
                    </h1>
                    <p className="text-slate-500 mt-1">Sitenizin vizyon, misyon ve hikaye bölümünü buradan düzenleyin.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    DEĞİŞİKLİKLERİ KAYDET
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Hero Section */}
                <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 space-y-6">
                    <div className="flex items-center gap-3 text-blue-400 font-bold uppercase tracking-widest text-xs">
                        <Layout size={16} />
                        Hero (Giriş) Bölümü
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ana Başlık</label>
                            <input 
                                type="text"
                                value={content.hero.title}
                                onChange={(e) => setContent({...content, hero: {...content.hero, title: e.target.value}})}
                                className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Alt Başlık</label>
                            <textarea 
                                rows={3}
                                value={content.hero.subtitle}
                                onChange={(e) => setContent({...content, hero: {...content.hero, subtitle: e.target.value}})}
                                className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Arka Plan Görseli</label>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-slate-950">
                                    <img src={content.hero.image} className="w-full h-full object-cover" />
                                </div>
                                <label className="flex-1 cursor-pointer bg-[#020617] border border-dashed border-white/20 rounded-xl p-4 hover:border-blue-500 transition-colors flex flex-col items-center justify-center gap-2">
                                    <Upload size={20} className="text-slate-500" />
                                    <span className="text-xs text-slate-500 font-bold uppercase">Görseli Değiştir</span>
                                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'hero', 'image')} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hikayemiz Bölümü */}
                <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 space-y-6">
                    <div className="flex items-center gap-3 text-blue-400 font-bold uppercase tracking-widest text-xs">
                        <BookOpen size={16} />
                        Hikayemiz Bölümü
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bölüm Başlığı</label>
                            <input 
                                type="text"
                                value={content.story.title}
                                onChange={(e) => setContent({...content, story: {...content.story, title: e.target.value}})}
                                className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Paragraf 1</label>
                            <textarea 
                                rows={3}
                                value={content.story.content1}
                                onChange={(e) => setContent({...content, story: {...content.story, content1: e.target.value}})}
                                className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Paragraf 2</label>
                            <textarea 
                                rows={3}
                                value={content.story.content2}
                                onChange={(e) => setContent({...content, story: {...content.story, content2: e.target.value}})}
                                className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">İstatistik 1 (Örn: 10K+)</label>
                                <input 
                                    type="text"
                                    value={content.story.stat1}
                                    onChange={(e) => setContent({...content, story: {...content.story, stat1: e.target.value}})}
                                    className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-2 text-white outline-none"
                                />
                                <input 
                                    type="text"
                                    placeholder="Etiket"
                                    value={content.story.stat1Label}
                                    onChange={(e) => setContent({...content, story: {...content.story, stat1Label: e.target.value}})}
                                    className="w-full mt-2 bg-transparent border-b border-white/10 text-xs text-slate-400 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">İstatistik 2</label>
                                <input 
                                    type="text"
                                    value={content.story.stat2}
                                    onChange={(e) => setContent({...content, story: {...content.story, stat2: e.target.value}})}
                                    className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-2 text-white outline-none"
                                />
                                <input 
                                    type="text"
                                    placeholder="Etiket"
                                    value={content.story.stat2Label}
                                    onChange={(e) => setContent({...content, story: {...content.story, stat2Label: e.target.value}})}
                                    className="w-full mt-2 bg-transparent border-b border-white/10 text-xs text-slate-400 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Misyon & Vizyon */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-white/10 rounded-3xl p-8 space-y-6">
                    <div className="flex items-center gap-3 text-blue-400 font-bold uppercase tracking-widest text-xs">
                        <Target size={16} />
                        Misyon, Vizyon & Değerler
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Misyon Başlığı</label>
                                <input 
                                    type="text"
                                    value={content.mission.title}
                                    onChange={(e) => setContent({...content, mission: {...content.mission, title: e.target.value}})}
                                    className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Misyon İçeriği</label>
                                <textarea 
                                    rows={4}
                                    value={content.mission.content}
                                    onChange={(e) => setContent({...content, mission: {...content.mission, content: e.target.value}})}
                                    className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition resize-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Vizyon</label>
                                <textarea 
                                    rows={3}
                                    value={content.mission.vision}
                                    onChange={(e) => setContent({...content, mission: {...content.mission, vision: e.target.value}})}
                                    className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Değerlerimiz</label>
                                <textarea 
                                    rows={3}
                                    value={content.mission.values}
                                    onChange={(e) => setContent({...content, mission: {...content.mission, values: e.target.value}})}
                                    className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
