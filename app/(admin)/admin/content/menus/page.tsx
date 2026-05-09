"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Save,
    Trash2,
    MoveVertical,
    Link as LinkIcon,
    Settings,
    ChevronRight,
    ExternalLink,
    Search,
    Menu as MenuIcon
} from "lucide-react";
import { getMenus, saveMenu, deleteMenu } from "@/lib/actions/menu-actions";
import { cn } from "@/lib/utils";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

export default function MenusPage() {
    const [menus, setMenus] = useState<any[]>([]);
    const [selectedMenu, setSelectedMenu] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [menuToDelete, setMenuToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);


    useEffect(() => {
        loadMenus();
    }, []);

    const loadMenus = async () => {
        setLoading(true);
        const res = await getMenus();
        if (res.success && res.menus) {
            setMenus(res.menus);
        }
        setLoading(false);
    };

    const handleCreateMenu = () => {
        setSelectedMenu({
            name: "Yeni Menü",
            description: "",
            items: []
        });
    };

    const handleAddItem = () => {
        if (!selectedMenu) return;
        const newItem = {
            id: `new-${Date.now()}`,
            title: "Yeni Link",
            url: "/",
            order: selectedMenu.items.length,
            target: "_self"
        };
        setSelectedMenu({
            ...selectedMenu,
            items: [...selectedMenu.items, newItem]
        });
    };

    const handleUpdateItem = (id: string, field: string, value: any) => {
        const newItems = selectedMenu.items.map((item: any) =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setSelectedMenu({ ...selectedMenu, items: newItems });
    };

    const handleRemoveItem = (id: string) => {
        const newItems = selectedMenu.items.filter((item: any) => item.id !== id);
        setSelectedMenu({ ...selectedMenu, items: newItems });
    };

    const handleSave = async () => {
        if (!selectedMenu.name) return alert("Menü ismi gereklidir.");
        setSaving(true);
        const res = await saveMenu(selectedMenu);
        if (res.success) {
            alert("Menü kaydedildi!");
            loadMenus();
            setSelectedMenu(null);
        } else {
            alert(res.error);
        }
        setSaving(false);
    };

    const handleDelete = (id: string) => {
        setMenuToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!menuToDelete) return;
        setIsDeleting(true);
        const res = await deleteMenu(menuToDelete);
        if (res.success) {
            loadMenus();
            if (selectedMenu?.id === menuToDelete) setSelectedMenu(null);
            setIsDeleteModalOpen(false);
            setMenuToDelete(null);
        } else {
            alert(res.error);
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
                            <MenuIcon className="text-blue-500" size={32} />
                            Menü Yönetimi
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Sitedeki tüm navigasyon menülerini buradan düzenleyebilirsiniz.</p>
                    </div>
                    <button
                        onClick={handleCreateMenu}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        YENİ MENÜ OLUŞTUR
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Menu List */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-white">Menüler</h2>
                                <span className="text-[10px] font-black bg-slate-800 text-slate-400 px-2 py-1 rounded-lg uppercase tracking-widest">
                                    {menus.length} TOPLAM
                                </span>
                            </div>

                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 animate-pulse rounded-2xl" />)}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {menus.map(menu => (
                                        <div
                                            key={menu.id}
                                            onClick={() => setSelectedMenu(menu)}
                                            className={cn(
                                                "group p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between",
                                                selectedMenu?.id === menu.id
                                                    ? "bg-blue-600/10 border-blue-500/50"
                                                    : "bg-white/5 border-white/5 hover:border-white/10"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                                    selectedMenu?.id === menu.id ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400"
                                                )}>
                                                    <MenuIcon size={18} />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-white">{menu.name}</h3>
                                                    <p className="text-[10px] text-slate-500 font-medium">{menu.items?.length || 0} Link</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} className={cn("text-slate-600 group-hover:text-white transition-all", selectedMenu?.id === menu.id && "translate-x-1 text-blue-500")} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Editor */}
                    <div className="lg:col-span-8">
                        {selectedMenu ? (
                            <div className="bg-slate-900 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <div>
                                        <h2 className="text-xl font-bold text-white tracking-tight">Menü Düzenle</h2>
                                        <p className="text-xs text-slate-500 font-medium mt-1">ID: {selectedMenu.id || "Yeni"}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {selectedMenu.id && (
                                            <button
                                                onClick={() => handleDelete(selectedMenu.id)}
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
                                    {/* Basic Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">MENÜ İSMİ (Slug olarak kullanılır)</label>
                                            <input
                                                type="text"
                                                value={selectedMenu.name}
                                                onChange={(e) => setSelectedMenu({ ...selectedMenu, name: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                                                placeholder="örneğin: header-main"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">AÇIKLAMA</label>
                                            <input
                                                type="text"
                                                value={selectedMenu.description}
                                                onChange={(e) => setSelectedMenu({ ...selectedMenu, description: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                                                placeholder="Menü nerede kullanılıyor?"
                                            />
                                        </div>
                                    </div>

                                    {/* Items Manager */}
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between border-t border-white/5 pt-8">
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                <LinkIcon size={18} className="text-blue-500" />
                                                Menü Linkleri
                                            </h3>
                                            <button
                                                onClick={handleAddItem}
                                                className="text-xs font-black bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl transition-all uppercase tracking-widest"
                                            >
                                                Link Ekle
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {selectedMenu.items.length === 0 ? (
                                                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                                    <p className="text-slate-600 text-sm font-medium">Henüz link eklenmemiş.</p>
                                                </div>
                                            ) : (
                                                selectedMenu.items.sort((a: any, b: any) => a.order - b.order).map((item: any, index: number) => (
                                                    <div
                                                        key={item.id}
                                                        className="bg-slate-950/50 border border-white/5 p-4 rounded-3xl flex flex-col md:flex-row items-center gap-4 group"
                                                    >
                                                        <div className="flex items-center gap-4 flex-1 w-full">
                                                            <div className="text-slate-700 p-1">
                                                                <MoveVertical size={16} />
                                                            </div>
                                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <input
                                                                    type="text"
                                                                    value={item.title}
                                                                    onChange={(e) => handleUpdateItem(item.id, "title", e.target.value)}
                                                                    className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500/30 outline-none"
                                                                    placeholder="Link Başlığı"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={item.url}
                                                                    onChange={(e) => handleUpdateItem(item.id, "url", e.target.value)}
                                                                    className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500/30 outline-none font-mono"
                                                                    placeholder="/link-adresi"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                                                            <div className="flex items-center gap-2 bg-slate-900 rounded-xl px-3 py-1.5 border border-white/5">
                                                                <span className="text-[9px] font-black text-slate-600 uppercase">Sıra</span>
                                                                <input
                                                                    type="number"
                                                                    value={item.order}
                                                                    onChange={(e) => handleUpdateItem(item.id, "order", e.target.value)}
                                                                    className="w-10 bg-transparent text-center text-xs font-bold text-white outline-none"
                                                                />
                                                            </div>
                                                            <select
                                                                value={item.target}
                                                                onChange={(e) => handleUpdateItem(item.id, "target", e.target.value)}
                                                                className="bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-400 outline-none"
                                                            >
                                                                <option value="_self">AYNI SEKME</option>
                                                                <option value="_blank">YENİ SEKME</option>
                                                            </select>
                                                            <button
                                                                onClick={() => handleRemoveItem(item.id)}
                                                                className="p-2.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[500px] border-2 border-dashed border-white/5 rounded-[48px] flex flex-col items-center justify-center space-y-6 text-center p-12">
                                <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center text-slate-700">
                                    <MenuIcon size={48} />
                                </div>
                                <div className="max-w-xs">
                                    <h3 className="text-xl font-bold text-white">Menü Seçin</h3>
                                    <p className="text-slate-500 text-sm mt-2">Sol taraftan bir menü seçerek düzenlemeye başlayın veya yeni bir menü oluşturun.</p>
                                </div>
                                <button
                                    onClick={handleCreateMenu}
                                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-3 rounded-2xl transition-all border border-white/5"
                                >
                                    İlk Menünü Oluştur
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
                title="Menüyü Sil"
                description="Bu menü ve içindeki tüm linkler kalıcı olarak silinecektir."
            />
        </>
    );
}
