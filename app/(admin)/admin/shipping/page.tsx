"use client";

import React from "react";
import { 
    Truck, 
    Plus, 
    Settings, 
    MapPin, 
    Globe, 
    ShieldCheck, 
    Clock, 
    Trash2, 
    Pencil, 
    AlertCircle,
    ChevronRight,
    Package
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminShipping() {
    const shippingMethods = [
        { id: 1, name: "Yurtiçi Kargo", type: "Kargo Firması", rate: "49.90 ₺", minOrder: "5.000 ₺ üzeri Ücretsiz", status: "Active", estDelivery: "1-3 İş Günü" },
        { id: 2, name: "Aras Kargo", type: "Kargo Firması", rate: "44.90 ₺", minOrder: "5.000 ₺ üzeri Ücretsiz", status: "Active", estDelivery: "2-4 İş Günü" },
        { id: 3, name: "JetTeslimat (İstanbul İçi)", type: "Özel Kurye", rate: "149.90 ₺", minOrder: "Yok", status: "Active", estDelivery: "Aynı Gün" },
        { id: 4, name: "Mağazadan Teslim", type: "Yerinde Teslim", rate: "Ücretsiz", minOrder: "Yok", status: "Inactive", estDelivery: "Hemen" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Kargo & Teslimat Ayarları
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <Truck className="text-blue-400" size={14} />
                        Kargo firmalarını, teslimat bölgelerini ve ücretlendirme kurallarını yönetin.
                    </p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                    <Plus size={20} />
                    Yeni Yöntem Ekle
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Shipping Methods List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#020617] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                            <h2 className="font-bold text-white flex items-center gap-2">
                                <Package size={18} className="text-blue-400" />
                                Aktif Teslimat Yöntemleri
                            </h2>
                        </div>
                        <div className="divide-y divide-white/5">
                            {shippingMethods.map((method) => (
                                <div key={method.id} className="p-6 hover:bg-white/[0.01] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all",
                                            method.status === "Active" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-slate-800 border-white/5 text-slate-500"
                                        )}>
                                            <Truck size={24} />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-white tracking-tight">{method.name}</h3>
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                                                    method.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"
                                                )}>{method.status === "Active" ? "Aktif" : "Pasif"}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium">{method.type} • {method.estDelivery}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-10">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-black text-white">{method.rate}</p>
                                            <p className="text-[10px] text-slate-500 font-bold">{method.minOrder}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button className="p-2.5 hover:bg-blue-500/10 rounded-xl text-slate-500 hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/20">
                                                <Pencil size={18} />
                                            </button>
                                            <button className="p-2.5 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Zone Management Brief */}
                    <div className="bg-gradient-to-br from-blue-600/5 to-transparent border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6 text-center md:text-left">
                            <div className="w-16 h-16 bg-blue-600/10 text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
                                <Globe size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Teslimat Bölgeleri</h3>
                                <p className="text-sm text-slate-500 max-w-sm">Şehir bazlı kargo ücretlerini ve yasaklı bölgeleri yapılandırın.</p>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-slate-900 border border-white/10 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 whitespace-nowrap">
                            Bölgeleri Yönet
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Right: General Rules & Settings */}
                <div className="space-y-6">
                    <div className="bg-[#020617] border border-white/10 rounded-3xl p-8 space-y-8 shadow-xl">
                        <h2 className="font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
                            <Settings size={18} className="text-blue-400" />
                            Genel Kurallar
                        </h2>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Ücretsiz Kargo Alt Limiti</label>
                                <div className="relative">
                                    <input type="text" defaultValue="5.000" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-blue-500/50 transition-all" />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₺</span>
                                </div>
                                <p className="text-[10px] text-slate-600 font-medium italic">* Bu tutarın üzerindeki siparişlerde kargo bedeli sistem tarafından sıfırlanır.</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Tahmini Paketleme Süresi</label>
                                <select className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-blue-500/50 transition-all cursor-pointer">
                                    <option>Aynı Gün (Saat 16:00'ya kadar)</option>
                                    <option>24 Saat İçinde</option>
                                    <option>1-2 İş Günü</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-white/5 space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="text-emerald-400" size={18} />
                                        <span className="text-xs font-bold text-slate-300">Sigortalı Gönderim</span>
                                    </div>
                                    <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Clock className="text-blue-400" size={18} />
                                        <span className="text-xs font-bold text-slate-300">SMS Bilgilendirme</span>
                                    </div>
                                    <div className="w-10 h-5 bg-slate-800 rounded-full relative">
                                        <div className="absolute left-1 top-1 w-3 h-3 bg-slate-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 text-xs">
                                Ayarları Kaydet
                            </button>
                        </div>
                    </div>

                    {/* Notice */}
                    <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex gap-4">
                        <AlertCircle className="text-amber-500 shrink-0" size={20} />
                        <p className="text-[10px] text-amber-500/80 font-medium leading-relaxed">
                            Kargo API entegrasyonlarını (Yurtiçi, Aras, MNG) yapmak için "Entegrasyonlar" sayfasını ziyaret etmeniz gerekmektedir.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
