"use client";

import React, { useState, useEffect } from "react";
import { 
    BookOpen, 
    Plus, 
    Save, 
    Trash2, 
    ChevronRight,
    Search,
    Globe,
    AlertCircle,
    Image as ImageIcon,
    Layout
} from "lucide-react";
import { getBlogPosts, saveBlogPost, deleteBlogPost } from "@/lib/actions/blog-actions";
import { cn } from "@/lib/utils";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { useNotification } from "@/context/NotificationContext";

export default function AdminBlog() {
    const { notify } = useNotification();
    const [posts, setPosts] = useState<any[]>([]);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setLoading(true);
        const res = await getBlogPosts();
        if (res.success && res.posts) {
            setPosts(res.posts);
        }
        setLoading(false);
    };

    const handleCreatePost = () => {
        setSelectedPost({
            title: "Yeni Blog Yazısı",
            slug: "yeni-blog-yazisi",
            excerpt: "",
            content: "",
            image: "",
            status: "DRAFT"
        });
    };

    const handleSave = async () => {
        if (!selectedPost.title || !selectedPost.slug) {
            return notify("error", "Başlık ve Slug alanları zorunludur.");
        }
        setSaving(true);
        const res = await saveBlogPost(selectedPost);
        if (res.success) {
            notify("success", "Yazı başarıyla kaydedildi.");
            loadPosts();
            setSelectedPost(null);
        } else {
            notify("error", res.error || "Bir hata oluştu.");
        }
        setSaving(false);
    };

    const handleDelete = (id: string) => {
        setPostToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!postToDelete) return;
        setIsDeleting(true);
        const res = await deleteBlogPost(postToDelete);
        if (res.success) {
            notify("success", "Yazı başarıyla silindi.");
            loadPosts();
            if (selectedPost?.id === postToDelete) setSelectedPost(null);
            setIsDeleteModalOpen(false);
            setPostToDelete(null);
        } else {
            notify("error", res.error || "Bir hata oluştu.");
        }
        setIsDeleting(false);
    };

    const filteredPosts = posts.filter(p => 
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
                            <BookOpen className="text-blue-500" size={32} />
                            Blog Yönetimi
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">İçeriklerinizi, haberleri ve rehberleri buradan paylaşın.</p>
                    </div>
                    <button 
                        onClick={handleCreatePost}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        YENİ YAZI EKLE
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left List */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-all" size={18} />
                                <input 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Yazı ara..."
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-3">
                                {loading ? (
                                    [1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 animate-pulse rounded-2xl" />)
                                ) : (
                                    filteredPosts.map(post => (
                                        <div 
                                            key={post.id}
                                            onClick={() => setSelectedPost(post)}
                                            className={cn(
                                                "group p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4",
                                                selectedPost?.id === post.id 
                                                    ? "bg-blue-600/10 border-blue-500/50" 
                                                    : "bg-white/5 border-white/5 hover:border-white/10"
                                            )}
                                        >
                                            <div className="w-12 h-12 bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center text-slate-500 flex-shrink-0">
                                                {post.image ? <img src={post.image} className="w-full h-full object-cover" /> : <BookOpen size={20} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xs font-bold text-white truncate">{post.title}</h3>
                                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider mt-0.5">{post.status === "PUBLISHED" ? "YAYINDA" : "TASLAK"}</p>
                                            </div>
                                            <ChevronRight size={16} className={cn("text-slate-600 group-hover:text-white transition-all", selectedPost?.id === post.id && "translate-x-1 text-blue-500")} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Editor */}
                    <div className="lg:col-span-8">
                        {selectedPost ? (
                            <div className="bg-slate-900 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <div>
                                        <h2 className="text-xl font-bold text-white tracking-tight">Yazıyı Düzenle</h2>
                                        <p className="text-xs text-slate-500 font-medium mt-1">Görsel ve içerik detaylarını ayarlayın.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {selectedPost.id && (
                                            <button 
                                                onClick={() => handleDelete(selectedPost.id)}
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
                                    {/* Image Upload */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">KAPAK GÖRSELİ</label>
                                        <div 
                                            onClick={() => document.getElementById('post-image-upload')?.click()}
                                            className="w-full aspect-video rounded-3xl border-2 border-dashed border-white/5 bg-slate-950 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-500/50 transition-all overflow-hidden relative group"
                                        >
                                            {selectedPost.image ? (
                                                <>
                                                    <img src={selectedPost.image} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                        <ImageIcon className="text-white" size={32} />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-700">
                                                        <ImageIcon size={32} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-500">Görsel Yükle</span>
                                                </>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            id="post-image-upload" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const formData = new FormData();
                                                    formData.append("file", file);
                                                    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                                                    const result = await res.json();
                                                    if (result.success) {
                                                        setSelectedPost({ ...selectedPost, image: result.url });
                                                        notify("success", "Görsel yüklendi.");
                                                    }
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">YAZI BAŞLIĞI</label>
                                            <input 
                                                type="text"
                                                value={selectedPost.title}
                                                onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                                                placeholder="Örn: Yeni PS5 Pro İncelemesi"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">SLUG (URL)</label>
                                            <input 
                                                type="text"
                                                value={selectedPost.slug}
                                                onChange={(e) => setSelectedPost({ ...selectedPost, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all font-mono"
                                                placeholder="yeni-ps5-pro-incelemesi"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">KISA ÖZET (EXCERPT)</label>
                                        <textarea 
                                            value={selectedPost.excerpt || ""}
                                            onChange={(e) => setSelectedPost({ ...selectedPost, excerpt: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all h-20 resize-none"
                                            placeholder="Yazı hakkında kısa bir giriş cümlesi..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">BLOG İÇERİĞİ (HTML)</label>
                                        <textarea 
                                            value={selectedPost.content || ""}
                                            onChange={(e) => setSelectedPost({ ...selectedPost, content: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all h-64 font-mono leading-relaxed resize-none"
                                            placeholder="<p>Blog içeriği buraya gelecek...</p>"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                                selectedPost.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                            )}>
                                                {selectedPost.status === "PUBLISHED" ? <Globe size={24} /> : <AlertCircle size={24} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">Yayın Durumu</p>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                                    {selectedPost.status === "PUBLISHED" ? "SİTEDE YAYINDA" : "TASLAK OLARAK KAYITLI"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {["DRAFT", "PUBLISHED"].map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => setSelectedPost({ ...selectedPost, status })}
                                                    className={cn(
                                                        "px-6 py-3 rounded-xl text-[10px] font-black transition-all border",
                                                        selectedPost.status === status 
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
                                    <BookOpen size={48} />
                                </div>
                                <div className="max-w-xs">
                                    <h3 className="text-xl font-bold text-white">Yazı Seçin</h3>
                                    <p className="text-slate-500 text-sm mt-2">Sol taraftan bir yazı seçerek düzenlemeye başlayın veya yeni bir tane oluşturun.</p>
                                </div>
                                <button 
                                    onClick={handleCreatePost}
                                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-3 rounded-2xl transition-all border border-white/5"
                                >
                                    İlk Blog Yazını Paylaş
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
                title="Blog Yazısını Sil"
                description="Bu yazı kalıcı olarak silinecektir. Bu işlem geri alınamaz."
            />
        </>
    );
}
