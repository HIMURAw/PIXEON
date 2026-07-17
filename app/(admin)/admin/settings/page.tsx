"use client";

import React, { useState, useEffect } from "react";
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
    Trash2,
    Loader2,
    Wrench,
    Flag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSettings, updateSettings } from "@/lib/actions/settings-actions";
import { FEATURE_FLAGS, getAllFeatureFlags, setFeatureFlag, type FeatureFlagKey } from "@/lib/feature-flags";
import { toast } from "react-hot-toast";

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState("genel");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [flags, setFlags] = useState<Record<string, boolean>>({});
    const [flagsLoading, setFlagsLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
        fetchFlags();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        const data = await getSettings();
        setFormData(data);
        setIsLoading(false);
    };

    const fetchFlags = async () => {
        setFlagsLoading(true);
        const data = await getAllFeatureFlags();
        setFlags(data);
        setFlagsLoading(false);
    };

    const handleFlagToggle = async (key: FeatureFlagKey) => {
        const next = !flags[key];
        setFlags((prev) => ({ ...prev, [key]: next }));
        const res = await setFeatureFlag(key, next);
        if (res.success) {
            toast.success(next ? "Özellik etkinleştirildi." : "Özellik devre dışı bırakıldı.");
        } else {
            setFlags((prev) => ({ ...prev, [key]: !next }));
            toast.error(res.error || "Bayrak güncellenemedi.");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
        setFormData((prev: any) => ({ ...prev, [name]: val }));
    };

    const handleToggle = (name: string, currentVal: boolean) => {
        setFormData((prev: any) => ({ ...prev, [name]: !currentVal }));
    };

    const onSave = async () => {
        setIsSaving(true);
        const res = await updateSettings(formData);
        if (res.success) {
            toast.success("Ayarlar başarıyla kaydedildi.");
        } else {
            toast.error("Ayarlar kaydedilirken bir hata oluştu.");
        }
        setIsSaving(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const toastId = toast.loading("Logo yükleniyor...");

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setFormData((prev: any) => ({ ...prev, siteLogo: data.url }));
                toast.success("Logo yüklendi. Kaydetmeyi unutmayın!", { id: toastId });
            } else {
                toast.error(data.message || "Yükleme başarısız.", { id: toastId });
            }
        } catch (error) {
            toast.error("Bir hata oluştu.", { id: toastId });
        }
    };

    const tabs = [
        { id: "genel", label: "Genel Ayarlar", icon: Globe },
        { id: "odeme", label: "Ödeme Yöntemleri", icon: CreditCard },
        { id: "kargo", label: "Kargo & Teslimat", icon: Truck },
        { id: "bildirim", label: "Bildirimler", icon: Bell },
        { id: "guvenlik", label: "Güvenlik & API", icon: Lock },
        { id: "ozellikler", label: "Özellik Bayrakları", icon: Flag },
    ];

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Ayarlar Yükleniyor...</p>
            </div>
        );
    }

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
                <button 
                    onClick={onSave}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/50 text-white font-bold px-8 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
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
                                        name="siteTitle"
                                        value={formData.siteTitle || ""}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500 transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Destek E-posta</label>
                                    <input 
                                        type="email" 
                                        name="supportEmail"
                                        value={formData.supportEmail || ""}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500 transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-4 md:col-span-2">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Site Logo</label>
                                    <div className="flex items-center gap-6 p-6 bg-slate-950 border border-dashed border-white/10 rounded-3xl">
                                        <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5 overflow-hidden">
                                            {formData.siteLogo ? (
                                                <img src={formData.siteLogo} alt="Logo" className="w-full h-full object-contain" />
                                            ) : (
                                                <ImageIcon className="text-slate-700" size={32} />
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-slate-400">Yeni bir logo yükleyin (PNG, SVG, Max 2MB)</p>
                                            <input 
                                                type="file" 
                                                id="logo-upload" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                            />
                                            <label 
                                                htmlFor="logo-upload"
                                                className="inline-block bg-white text-black font-black text-[10px] px-4 py-2 rounded-lg uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer"
                                            >
                                                Dosya Seç
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 md:col-span-2">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Meta Açıklaması</label>
                                    <textarea
                                        rows={4}
                                        name="siteDescription"
                                        value={formData.siteDescription || ""}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500 transition-all font-bold resize-none"
                                    ></textarea>
                                </div>

                                <div className="space-y-4 md:col-span-2 p-6 bg-slate-950 border border-white/5 rounded-3xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center border",
                                                formData.maintenanceMode ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-slate-900 border-white/5 text-slate-600"
                                            )}>
                                                <Wrench size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white">Bakım Modu</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-0.5">Aktifken ziyaretçiler bakım ekranı görür, adminler siteyi normal kullanmaya devam eder</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleToggle("maintenanceMode", formData.maintenanceMode)}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                                                formData.maintenanceMode ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-white/5 text-slate-500 border border-white/5"
                                            )}
                                        >
                                            {formData.maintenanceMode ? "Aktif" : "Devre Dışı"}
                                        </button>
                                    </div>
                                    <textarea
                                        rows={2}
                                        name="maintenanceMessage"
                                        placeholder="Ziyaretçilere gösterilecek bakım mesajı (opsiyonel)"
                                        value={formData.maintenanceMessage || ""}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500 transition-all font-medium resize-none placeholder:text-slate-600"
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {activeTab === "odeme" && (
                            <div className="space-y-6">
                                {[
                                    { key: "iyzicoEnabled", name: "Kredi / Banka Kartı (Iyzico)", info: "Mastercard, Visa, Troy desteği aktif" },
                                    { key: "bankTransferEnabled", name: "Havale / EFT", info: "Banka hesap bilgileriniz aktif" },
                                    { key: "cryptoEnabled", name: "Kripto Ödeme", info: "Bitcoin, Ethereum ve USDT (Yakında)" },
                                ].map((method) => (
                                    <div key={method.key} className="flex items-center justify-between p-6 bg-slate-950 border border-white/5 rounded-3xl group hover:border-blue-500/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center border",
                                                formData[method.key] ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-slate-900 border-white/5 text-slate-600"
                                            )}>
                                                <CreditCard size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white">{method.name}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-0.5">{method.info}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleToggle(method.key, formData[method.key])}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                formData[method.key] ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-slate-500 border border-white/5"
                                            )}
                                        >
                                            {formData[method.key] ? "Aktif" : "Devre Dışı"}
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
                                                type="number" 
                                                name="shippingFee"
                                                value={formData.shippingFee || 0}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500 transition-all font-bold"
                                            />
                                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₺</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Ücretsiz Kargo Alt Limiti</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                name="freeShippingLimit"
                                                value={formData.freeShippingLimit || 0}
                                                onChange={handleInputChange}
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
                                                <div className="w-5 h-5 rounded border border-white/10 bg-blue-600 flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "bildirim" && (
                            <div className="p-8 text-center bg-slate-950/50 rounded-3xl border border-white/5 border-dashed">
                                <Bell className="mx-auto text-slate-700 mb-4" size={48} />
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Bildirim ayarları çok yakında!</p>
                            </div>
                        )}

                        {activeTab === "guvenlik" && (
                            <div className="p-8 text-center bg-slate-950/50 rounded-3xl border border-white/5 border-dashed">
                                <Lock className="mx-auto text-slate-700 mb-4" size={48} />
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Güvenlik ve API ayarları çok yakında!</p>
                            </div>
                        )}

                        {activeTab === "ozellikler" && (
                            <div className="space-y-6">
                                {flagsLoading ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="animate-spin text-blue-500" size={32} />
                                    </div>
                                ) : (
                                    FEATURE_FLAGS.map((flag) => (
                                        <div key={flag.key} className="flex items-center justify-between p-6 bg-slate-950 border border-white/5 rounded-3xl group hover:border-blue-500/20 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center border",
                                                    flags[flag.key] ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-slate-900 border-white/5 text-slate-600"
                                                )}>
                                                    <Flag size={22} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white">{flag.label}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-0.5">{flag.description}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleFlagToggle(flag.key)}
                                                className={cn(
                                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                    flags[flag.key] ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-slate-500 border border-white/5"
                                                )}
                                            >
                                                {flags[flag.key] ? "Aktif" : "Devre Dışı"}
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
