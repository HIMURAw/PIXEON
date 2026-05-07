"use client";

import React, { useState, useEffect } from "react";
import { Bell, Info, AlertTriangle, CheckCircle, ExternalLink, X, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // 10 saniyede bir kontrol
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            const data = await res.json();
            const notifs = data.notifications || [];
            setNotifications(notifs);
            setUnreadCount(notifs.filter((n: any) => !n.isRead).length);
        } catch (err) {
            console.error("Notifications fetch error:", err);
        }
    };

    const handleOpen = async () => {
        setIsOpen(!isOpen);
        if (!isOpen && unreadCount > 0) {
            // Bildirimlere bakıldığı an hepsini okundu işaretle
            try {
                // Her bir okunmamış bildirimi işaretle
                const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
                for (const id of unreadIds) {
                    await fetch("/api/notifications", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id })
                    });
                }
                setUnreadCount(0); // Sayıyı hemen sıfırla
                // Veriyi tekrar çekip state'i güncelle (isRead: true olsunlar)
                fetchNotifications();
            } catch (err) {
                console.error("Mark as read error:", err);
            }
        }
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button 
                onClick={handleOpen}
                className={cn(
                    "relative w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-500 group overflow-hidden",
                    isOpen ? "bg-blue-600 shadow-lg shadow-blue-600/20 scale-95" : "bg-slate-900/50 border border-white/5 hover:border-blue-500/30 hover:bg-slate-900"
                )}
            >
                <Bell size={20} className={cn(
                    "transition-all duration-500",
                    isOpen ? "text-white scale-110" : "text-slate-400 group-hover:text-blue-400",
                    unreadCount > 0 && !isOpen && "animate-ring"
                )} />
                
                {unreadCount > 0 && !isOpen && (
                    <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-red-500 border-2 border-[#0c1022] rounded-full text-[8px] font-black flex items-center justify-center text-white animate-in zoom-in duration-300">
                        {unreadCount}
                    </span>
                )}
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-4 w-[380px] bg-[#0c1022]/95 border border-white/10 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] z-50 overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                        
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
                                    <Bell size={16} />
                                </div>
                                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Bildirim Merkezi</h3>
                            </div>
                            <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                {notifications.length} Toplam
                            </span>
                        </div>

                        {/* List */}
                        <div className="max-h-[450px] overflow-y-auto scrollbar-hide py-2">
                            {notifications.length > 0 ? (
                                notifications.map((notif, index) => (
                                    <div 
                                        key={notif.id}
                                        className="px-8 py-6 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors group relative overflow-hidden"
                                    >
                                        <div className="flex gap-5">
                                            {/* Type Icon */}
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110 duration-500",
                                                notif.type === "DANGER" ? "bg-red-500/10 border-red-500/20 text-red-500" :
                                                notif.type === "WARNING" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                                                notif.type === "SUCCESS" ? "bg-green-500/10 border-green-500/20 text-green-500" : 
                                                "bg-blue-600/10 border-blue-500/20 text-blue-500"
                                            )}>
                                                {notif.type === "DANGER" ? <AlertTriangle size={20} /> :
                                                 notif.type === "WARNING" ? <AlertTriangle size={20} /> :
                                                 notif.type === "SUCCESS" ? <CheckCircle size={20} /> : <Info size={20} />}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{notif.title}</h4>
                                                    <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">
                                                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4 group-hover:text-slate-400 transition-colors">{notif.message}</p>
                                                
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={cn("w-1.5 h-1.5 rounded-full", notif.isRead ? "bg-slate-800" : "bg-blue-500 animate-pulse")} />
                                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                                            {notif.isRead ? "Görüldü" : "Yeni Bildirim"}
                                                        </span>
                                                    </div>
                                                    {notif.link && (
                                                        <Link 
                                                            href={notif.link}
                                                            className="px-4 py-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                                        >
                                                            Detay <ExternalLink size={10} />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-center px-12">
                                    <div className="w-20 h-20 bg-slate-900/50 rounded-[32px] flex items-center justify-center border border-white/5 mb-6 text-slate-700">
                                        <BellOff size={32} />
                                    </div>
                                    <h4 className="text-white font-bold mb-2">Henüz Bildirim Yok</h4>
                                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest leading-loose">
                                        Yeni duyuru veya güncellemeler <br /> burada görünecektir.
                                    </p>
                                </div>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-6 bg-white/[0.01] border-t border-white/5 text-center">
                                <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto">
                                    Tüm Bildirimleri Temizle
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
            
            <style jsx>{`
                @keyframes ring {
                    0% { transform: rotate(0); }
                    5% { transform: rotate(15deg); }
                    10% { transform: rotate(-15deg); }
                    15% { transform: rotate(10deg); }
                    20% { transform: rotate(-10deg); }
                    25% { transform: rotate(5deg); }
                    30% { transform: rotate(-5deg); }
                    35% { transform: rotate(0); }
                    100% { transform: rotate(0); }
                }
                .animate-ring {
                    animation: ring 3s ease infinite;
                    transform-origin: top center;
                }
            `}</style>
        </div>
    );
}
