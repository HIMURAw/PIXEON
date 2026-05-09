"use client";

import React, { useState, useEffect } from "react";
import { 
    FileText, 
    Plus, 
    Save, 
    Trash2, 
    ChevronRight,
    Search,
    Globe,
    AlertCircle,
    Eye,
    Link as LinkIcon
} from "lucide-react";
import { getPages, savePage, deletePage } from "@/lib/actions/cms-actions";
import { cn } from "@/lib/utils";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { useNotification } from "@/context/NotificationContext";

export default function AdminPages() {
    const { notify } = useNotification();
    const [pages, setPages] = useState<any[]>([]);
    const [selectedPage, setSelectedPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [pageToDelete, setPageToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        setLoading(true);
        const res = await getPages();
        if (res.success && res.pages) {
            setPages(res.pages);
        }
        setLoading(false);
    };

    const handleCreatePage = () => {
        setSelectedPage({
            title: "Yeni Sayfa",
            slug: "yeni-sayfa",
            content: "",
            status: "DRAFT"
        });
    };

    const handleSave = async () => {
        if (!selectedPage.title || !selectedPage.slug) {
            return notify("error", "Başlık ve Slug alanları zorunludur.");
        }
        setSaving(true);
        const res = await savePage(selectedPage);
        if (res.success) {
            notify("success", "Sayfa başarıyla kaydedildi.");
            loadPages();
            setSelectedPage(null);
        } else {
            notify("error", res.error || "Bir hata oluştu.");
        }
        setSaving(false);
    };

    const handleDelete = (id: string) => {
        setPageToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!pageToDelete) return;
        setIsDeleting(true);
        const res = await deletePage(pageToDelete);
        if (res.success) {
            notify("success", "Sayfa başarıyla silindi.");
            loadPages();
            if (selectedPage?.id === pageToDelete) setSelectedPage(null);
            setIsDeleteModalOpen(false);
            setPageToDelete(null);
        } else {
            notify("error", res.error || "Bir hata oluştu.");
        }
        setIsDeleting(false);
    };

    const filteredPages = pages.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="p-8 space-y-8 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                            <FileText className="text-blue-500" size={32} />
                            Sayfa Yönetimi (CMS)
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Kurumsal sayfaları, sözleşmeleri ve yasal metinleri buradan yönetin.</p>
                    </div>
                    <button 
                        onClick={handleCreatePage}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        YENİ SAYFA EKLE
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Pages List */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-all" size={18} />
                                <input 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Sayfa ara..."
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-3">
                                {loading ? (
                                    [1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 animate-pulse rounded-2xl" />)
                                ) : (
                                    filteredPages.map(page => (
                                        <div 
                                            key={page.id}
                                            onClick={() => setSelectedPage(page)}
                                            className={cn(
                                                "group p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4",
                                                selectedPage?.id === page.id 
                                                    ? "bg-blue-600/10 border-blue-500/50" 
                                                    : "bg-white/5 border-white/5 hover:border-white/10"
                                            )}
                                        >
                                            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 flex-shrink-0">
                                                <FileText size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xs font-bold text-white truncate">{page.title}</h3>
                                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider mt-0.5">/p/{page.slug}</p>
                                            </div>
                                            <ChevronRight size={16} className={cn("text-slate-600 group-hover:text-white transition-all", selectedPage?.id === page.id && "translate-x-1 text-blue-500")} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Editor */}
                    <div className="lg:col-span-8">
                        {selectedPage ? (
                            <div className="bg-slate-900 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <div>
                                        <h2 className="text-xl font-bold text-white tracking-tight">Sayfa Düzenle</h2>
                                        <p className="text-xs text-slate-500 font-medium mt-1">İçeriği aşağıdan HTML veya Metin olarak düzenleyin.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {selectedPage.id && (
                                            <button 
                                                onClick={() => handleDelete(selectedPage.id)}
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

                                <div className="p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">SAYFA BAŞLIĞI</label>
                                            <input 
                                                type="text"
                                                value={selectedPage.title}
                                                onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                                                placeholder="Örn: Kullanım Koşulları"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">SLUG (URL YOLU)</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 text-sm font-mono">/p/</span>
                                                <input 
                                                    type="text"
                                                    value={selectedPage.slug}
                                                    onChange={(e) => setSelectedPage({ ...selectedPage, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all font-mono"
                                                    placeholder="kullanim-kosullari"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">SAYFA İÇERİĞİ (HTML DESTEKLER)</label>
                                            <span className="text-[9px] text-blue-500 font-bold">Zengin metin için HTML etiketleri kullanabilirsiniz.</span>
                                        </div>
                                        <textarea 
                                            value={selectedPage.content || ""}
                                            onChange={(e) => setSelectedPage({ ...selectedPage, content: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all h-96 font-mono leading-relaxed resize-none"
                                            placeholder="<p>Sayfa içeriği buraya gelecek...</p>"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                                selectedPage.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                            )}>
                                                {selectedPage.status === "PUBLISHED" ? <Globe size={24} /> : <AlertCircle size={24} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">Yayın Durumu</p>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                                    {selectedPage.status === "PUBLISHED" ? "SİTEDE GÖRÜNÜR" : "SADECE TASLAK"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {["DRAFT", "PUBLISHED"].map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => setSelectedPage({ ...selectedPage, status })}
                                                    className={cn(
                                                        "px-6 py-3 rounded-xl text-[10px] font-black transition-all border",
                                                        selectedPage.status === status 
                                                            ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20" 
                                                            : "bg-slate-950 border-white/5 text-slate-500 hover:border-white/10"
                                                    )}
                                                >
                                                    {status === "PUBLISHED" ? "YAYINLA" : "TASLAK"}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[500px] border-2 border-dashed border-white/5 rounded-[48px] flex flex-col items-center justify-center space-y-6 text-center p-12">
                                <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center text-slate-700">
                                    <FileText size={48} />
                                </div>
                                <div className="max-w-xs">
                                    <h3 className="text-xl font-bold text-white">Sayfa Seçin</h3>
                                    <p className="text-slate-500 text-sm mt-2">Sol taraftan bir sayfa seçerek düzenlemeye başlayın veya yeni bir tane oluşturun.</p>
                                </div>
                                <button 
                                    onClick={handleCreatePage}
                                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-3 rounded-2xl transition-all border border-white/5"
                                >
                                    İlk Sayfanı Oluştur
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
                title="Sayfayı Sil"
                description="Bu sayfa ve tüm içeriği kalıcı olarak silinecektir. Bu işlem geri alınamaz."
            />
        </>
    );
}
