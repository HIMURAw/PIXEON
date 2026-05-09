"use client";

import React, { useState, useEffect } from "react";
import { 
    Plus, 
    Save, 
    Trash2, 
    Image as ImageIcon, 
    Layout, 
    ChevronRight,
    Search,
    Calendar,
    Link as LinkIcon,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { getBanners, saveBanner, deleteBanner } from "@/lib/actions/banner-actions";
import { cn } from "@/lib/utils";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { useNotification } from "@/context/NotificationContext";

export default function AdminBanners() {
    const { notify } = useNotification();
    const [banners, setBanners] = useState<any[]>([]);
    const [selectedBanner, setSelectedBanner] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        setLoading(true);
        const res = await getBanners();
        if (res.success && res.banners) {
            setBanners(res.banners);
        }
        setLoading(false);
    };

    const handleCreateBanner = () => {
        setSelectedBanner({
            title: "Yeni Kampanya",
            subtitle: "Kampanya detayları...",
            image: "",
            link: "/shop",
            position: "home-middle",
            status: "ACTIVE"
        });
    };

    const handleSave = async () => {
        if (!selectedBanner.image) return notify("error", "Banner görseli gereklidir.");
        setSaving(true);
        const res = await saveBanner(selectedBanner);
        if (res.success) {
            notify("success", "Banner başarıyla kaydedildi.");
            loadBanners();
            setSelectedBanner(null);
        } else {
            notify("error", res.error || "Bir hata oluştu.");
        }
        setSaving(false);
    };

    const handleDelete = (id: string) => {
        setBannerToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!bannerToDelete) return;
        setIsDeleting(true);
        const res = await deleteBanner(bannerToDelete);
        if (res.success) {
            notify("success", "Banner başarıyla silindi.");
            loadBanners();
            if (selectedBanner?.id === bannerToDelete) setSelectedBanner(null);
            setIsDeleteModalOpen(false);
            setBannerToDelete(null);
        } else {
            notify("error", res.error || "Bir hata oluştu.");
        }
        setIsDeleting(false);
    };

    return (
        <>
            <div className="p-8 space-y-8 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                            <ImageIcon className="text-blue-500" size={32} />
                            Kampanya & Banner Yönetimi
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Sitedeki tüm reklam alanlarını ve kampanyaları buradan yönetin.</p>
                    </div>
                    <button 
                        onClick={handleCreateBanner}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        YENİ BANNER EKLE
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Banner List */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-white">Aktif Bannerlar</h2>
                                <span className="text-[10px] font-black bg-slate-800 text-slate-400 px-2 py-1 rounded-lg uppercase tracking-widest">
                                    {banners.length} TOPLAM
                                </span>
                            </div>

                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 animate-pulse rounded-2xl" />)}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {banners.map(banner => (
                                        <div 
                                            key={banner.id}
                                            onClick={() => setSelectedBanner(banner)}
                                            className={cn(
                                                "group p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4",
                                                selectedBanner?.id === banner.id 
                                                    ? "bg-blue-600/10 border-blue-500/50" 
                                                    : "bg-white/5 border-white/5 hover:border-white/10"
                                            )}
                                        >
                                            <div className="w-16 h-12 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                                                {banner.image ? (
                                                    <img src={banner.image} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                        <ImageIcon size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xs font-bold text-white truncate">{banner.title || "İsimsiz Banner"}</h3>
                                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider mt-0.5">{banner.position}</p>
                                            </div>
                                            <ChevronRight size={16} className={cn("text-slate-600 group-hover:text-white transition-all", selectedBanner?.id === banner.id && "translate-x-1 text-blue-500")} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Editor */}
                    <div className="lg:col-span-8">
                        {selectedBanner ? (
                            <div className="bg-slate-900 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <div>
                                        <h2 className="text-xl font-bold text-white tracking-tight">Banner Düzenle</h2>
                                        <p className="text-xs text-slate-500 font-medium mt-1">Banner bilgilerini aşağıdan güncelleyebilirsiniz.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {selectedBanner.id && (
                                            <button 
                                                onClick={() => handleDelete(selectedBanner.id)}
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
                                    {/* Preview & Image Upload */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">BANNER GÖRSELİ</label>
                                        <div className="relative group aspect-video lg:aspect-[21/9] bg-slate-950 rounded-3xl border-2 border-dashed border-white/5 overflow-hidden flex items-center justify-center">
                                            {selectedBanner.image ? (
                                                <>
                                                    <img src={selectedBanner.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" alt="" />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <label htmlFor="banner-upload" className="bg-white text-black px-6 py-3 rounded-2xl font-black text-xs cursor-pointer hover:scale-105 transition-transform">
                                                            GÖRSELİ DEĞİŞTİR
                                                        </label>
                                                    </div>
                                                </>
                                            ) : (
                                                <label htmlFor="banner-upload" className="flex flex-col items-center gap-4 cursor-pointer hover:text-blue-400 transition-colors">
                                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                                                        <Plus size={32} />
                                                    </div>
                                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Görsel Seçin veya Yükleyin</span>
                                                </label>
                                            )}
                                            <input 
                                                type="file" 
                                                id="banner-upload" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    const formData = new FormData();
                                                    formData.append("file", file);
                                                    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                                                    const data = await res.json();
                                                    if (data.success) {
                                                        setSelectedBanner({ ...selectedBanner, image: data.url });
                                                        notify("success", "Görsel yüklendi.");
                                                    } else {
                                                        notify("error", "Yükleme hatası: " + data.error);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Text Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">KAMPANYA BAŞLIĞI</label>
                                            <input 
                                                type="text"
                                                value={selectedBanner.title || ""}
                                                onChange={(e) => setSelectedBanner({ ...selectedBanner, title: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                                                placeholder="Örn: %50 Yaz İndirimi"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">BANNER POZİSYONU</label>
                                            <select 
                                                value={selectedBanner.position}
                                                onChange={(e) => setSelectedBanner({ ...selectedBanner, position: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all appearance-none"
                                            >
                                                <option value="home-top">Ana Sayfa Üst</option>
                                                <option value="home-middle">Ana Sayfa Orta</option>
                                                <option value="home-bottom">Ana Sayfa Alt</option>
                                                <option value="promo-vertical">Yan Menü Büyük (VR2 Yeri)</option>
                                                <option value="products-sidebar">Ürünler Yan Menü</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ALT BAŞLIK / AÇIKLAMA</label>
                                        <textarea 
                                            value={selectedBanner.subtitle || ""}
                                            onChange={(e) => setSelectedBanner({ ...selectedBanner, subtitle: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all h-24 resize-none"
                                            placeholder="Kampanya hakkında kısa bilgi..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">TIKLAMA LİNKİ (URL)</label>
                                            <div className="relative">
                                                <LinkIcon size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input 
                                                    type="text"
                                                    value={selectedBanner.link || ""}
                                                    onChange={(e) => setSelectedBanner({ ...selectedBanner, link: e.target.value })}
                                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all font-mono"
                                                    placeholder="/kategori/kampanyali-urunler"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">DURUM</label>
                                            <div className="flex gap-2">
                                                {["ACTIVE", "INACTIVE"].map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => setSelectedBanner({ ...selectedBanner, status })}
                                                        className={cn(
                                                            "flex-1 py-4 rounded-2xl text-[10px] font-black transition-all border",
                                                            selectedBanner.status === status 
                                                                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20" 
                                                                : "bg-slate-950 border-white/5 text-slate-500 hover:border-white/10"
                                                        )}
                                                    >
                                                        {status === "ACTIVE" ? "YAYINDA" : "PASİF"}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[500px] border-2 border-dashed border-white/5 rounded-[48px] flex flex-col items-center justify-center space-y-6 text-center p-12">
                                <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center text-slate-700">
                                    <ImageIcon size={48} />
                                </div>
                                <div className="max-w-xs">
                                    <h3 className="text-xl font-bold text-white">Banner Seçin</h3>
                                    <p className="text-slate-500 text-sm mt-2">Sol taraftan bir banner seçerek düzenlemeye başlayın veya yeni bir tane oluşturun.</p>
                                </div>
                                <button 
                                    onClick={handleCreateBanner}
                                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-3 rounded-2xl transition-all border border-white/5"
                                >
                                    İlk Banner'ını Oluştur
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                loading={isDeleting}
                title="Banner'ı Sil"
                description="Bu kampanya banner'ı siteden kalıcı olarak kaldırılacaktır."
            />
        </>
    );
}
