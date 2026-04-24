"use client";

import React, { useState } from "react";
import { 
    Settings,
    Globe,
    Lock,
    Bell,
    CreditCard,
    Truck,
    Mail,
    ShieldCheck,
    Save,
    Image as ImageIcon,
    Plus,
    Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState("genel");

    const tabs = [
        { id: "genel", label: "Genel Ayarlar", icon: Globe },
        { id: "odeme", label: "Ödeme Yöntemleri", icon: CreditCard },
        { id: "kargo", label: "Kargo & Teslimat", icon: Truck },
        { id: "bildirim", label: "Bildirimler", icon: Bell },
        { id: "guvenlik", label: "Güvenlik & API", icon: Lock },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Sistem Ayarları
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <Settings className="text-blue-400" size={14} />
                        Sitenizin genel yapılandırmasını, ödeme ve kargo tercihlerini yönetin.
                    </p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                    <Save size={20} />
                    Değişiklikleri Kaydet
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                {/* Tabs Sidebar */}
                <div className="space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all border",
                                activeTab === tab.id 
                                    ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20" 
                                    : "bg-[#020617] text-slate-500 border-white/10 hover:border-white/20 hover:text-white"
                            )}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="bg-[#020617] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-white/5">
                        <h2 className="text-xl font-bold text-white">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">
                            Bu bölümden {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} yapılandırabilirsiniz.
                        </p>
                    </div>

                    <div className="p-8 space-y-8">
                        {activeTab === "genel" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Site Başlığı</label>
                                    <input 
                                        type="text" 
                                        defaultValue="PIXEON - Yetkili PlayStation Satış Merkezi"
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500 transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Destek E-posta</label>
                                    <input 
                                        type="email" 
                                        defaultValue="destek@pixeon.com"
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500 transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-4 md:col-span-2">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Site Logo</label>
                                    <div className="flex items-center gap-6 p-6 bg-slate-950 border border-dashed border-white/10 rounded-3xl">
                                        <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5">
                                            <ImageIcon className="text-slate-700" size={32} />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-slate-400">Yeni bir logo yükleyin (PNG, SVG, Max 2MB)</p>
                                            <button className="bg-white text-black font-black text-[10px] px-4 py-2 rounded-lg uppercase tracking-widest hover:bg-slate-200 transition-all">Dosya Seç</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 md:col-span-2">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Meta Açıklaması</label>
                                    <textarea 
                                        rows={4}
                                        defaultValue="PlayStation 5, PS4 ve en yeni oyunları en uygun fiyatlarla satın alın."
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500 transition-all font-bold resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {activeTab === "odeme" && (
                            <div className="space-y-6">
                                {[
                                    { name: "Kredi / Banka Kartı (Iyzico)", status: true, info: "Mastercard, Visa, Troy desteği aktif" },
                                    { name: "Havale / EFT", status: true, info: "Banka hesap bilgileriniz aktif" },
                                    { name: "Kripto Ödeme", status: false, info: "Bitcoin, Ethereum ve USDT (Yakında)" },
                                ].map((method, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-slate-950 border border-white/5 rounded-3xl group hover:border-blue-500/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center border",
                                                method.status ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-slate-900 border-white/5 text-slate-600"
                                            )}>
                                                <CreditCard size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white">{method.name}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-0.5">{method.info}</p>
                                            </div>
                                        </div>
                                        <button className={cn(
                                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                            method.status ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-slate-500 border border-white/5"
                                        )}>
                                            {method.status ? "Aktif" : "Devre Dışı"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "kargo" && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Sabit Kargo Ücreti</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                defaultValue="49.90"
                                                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500 transition-all font-bold"
                                            />
                                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₺</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Ücretsiz Kargo Alt Limiti</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                defaultValue="2500"
                                                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500 transition-all font-bold"
                                            />
                                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₺</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                        <Truck className="text-blue-400" size={16} />
                                        Aktif Kargo Firmaları
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {['Aras Kargo', 'Yurtiçi Kargo', 'MNG Kargo', 'Hepsijet'].map(k => (
                                            <div key={k} className="flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-2xl">
                                                <span className="text-xs font-bold text-slate-300">{k}</span>
                                                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-white/10 bg-slate-900 text-blue-600 focus:ring-blue-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
