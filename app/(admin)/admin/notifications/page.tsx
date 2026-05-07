"use client";

import React, { useState, useEffect } from "react";
import { 
    Bell, 
    Send, 
    Trash2, 
    Info, 
    AlertTriangle, 
    CheckCircle, 
    Megaphone,
    Search,
    ExternalLink,
    Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminNotifications() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        type: "INFO" as "INFO" | "SUCCESS" | "WARNING" | "DANGER",
        link: "",
        targetUserId: ""
    });

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/admin/notifications");
            const data = await res.json();
            setNotifications(data.notifications || []);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            const res = await fetch("/api/admin/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setFormData({ title: "", message: "", type: "INFO", link: "", targetUserId: "" });
                fetchNotifications();
            }
        } catch (err) {
            console.error("Send error:", err);
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu bildirimi silmek istediğinize emin misiniz?")) return;
        try {
            const res = await fetch(`/api/admin/notifications?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchNotifications();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between bg-slate-900/40 border border-white/5 p-8 rounded-[40px] backdrop-blur-xl">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">BİLDİRİM <span className="text-blue-500">YÖNETİMİ</span></h1>
                    <p className="text-slate-500 font-medium">Tüm kullanıcılara veya seçili kişilere sistem bildirimleri gönderin.</p>
                </div>
                <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                    <Bell size={32} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-8">
                {/* Send Notification Form */}
                <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-8 backdrop-blur-xl h-fit">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                        <Plus size={18} className="text-blue-500" /> Yeni Bildirim Oluştur
                    </h3>
                    <form onSubmit={handleSend} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Bildirim Başlığı</label>
                            <input 
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="Örn: Hafta Sonu İndirimi Başladı!"
                                className="w-full bg-[#020617] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500/30 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mesaj İçeriği</label>
                            <textarea 
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                rows={4}
                                placeholder="Bildirim detaylarını buraya yazın..."
                                className="w-full bg-[#020617] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500/30 transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tür</label>
                                <select 
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                                    className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none cursor-pointer"
                                >
                                    <option value="INFO">Bilgi (Mavi)</option>
                                    <option value="SUCCESS">Başarı (Yeşil)</option>
                                    <option value="WARNING">Uyarı (Sarı)</option>
                                    <option value="DANGER">Kritik (Kırmızı)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hedef</label>
                                <select 
                                    className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none cursor-pointer"
                                    onChange={(e) => setFormData({...formData, targetUserId: e.target.value})}
                                >
                                    <option value="">Herkes (Genel)</option>
                                    {/* Kullanıcı listesi buraya eklenebilir */}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Yönlendirme Linki (Opsiyonel)</label>
                            <input 
                                value={formData.link}
                                onChange={(e) => setFormData({...formData, link: e.target.value})}
                                placeholder="https://pixeon.com/indirim"
                                className="w-full bg-[#020617] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500/30 transition-all"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={sending}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] py-5 rounded-3xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {sending ? "GÖNDERİLİYOR..." : <>BİLDİRİMİ YAYINLA <Send size={18} /></>}
                        </button>
                    </form>
                </div>

                {/* Notification History */}
                <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-8 backdrop-blur-xl flex flex-col h-[700px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Megaphone size={18} className="text-blue-500" /> Gönderim Geçmişi
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                            <input type="text" placeholder="Ara..." className="bg-[#020617] border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs text-white outline-none" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
                        {notifications.map((notif) => (
                            <div key={notif.id} className="p-6 bg-[#020617]/60 border border-white/5 rounded-[32px] group hover:border-white/10 transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center",
                                            notif.type === "DANGER" ? "bg-red-500/10 text-red-500" :
                                            notif.type === "WARNING" ? "bg-amber-500/10 text-amber-500" :
                                            notif.type === "SUCCESS" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                                        )}>
                                            {notif.type === "DANGER" ? <AlertTriangle size={20} /> :
                                             notif.type === "WARNING" ? <AlertTriangle size={20} /> :
                                             notif.type === "SUCCESS" ? <CheckCircle size={20} /> : <Info size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">{notif.title}</h4>
                                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                                                {notif.userId ? "Özel Bildirim" : "Genel Duyuru"} • {new Date(notif.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(notif.id)} className="p-2 text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4">{notif.message}</p>
                                {notif.link && (
                                    <a href={notif.link} target="_blank" className="inline-flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-widest hover:underline">
                                        Linke Git <ExternalLink size={12} />
                                    </a>
                                )}
                            </div>
                        ))}

                        {notifications.length === 0 && !loading && (
                            <div className="flex flex-col items-center justify-center h-full opacity-20">
                                <Megaphone size={64} className="text-slate-700 mb-4" />
                                <p className="text-sm font-black uppercase tracking-widest text-slate-500">Henüz bildirim gönderilmemiş</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
