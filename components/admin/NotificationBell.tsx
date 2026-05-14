"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, MessageSquare, Ticket, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Notification {
    id: string;
    title: string;
    message: string;
    link: string;
    type: string;
    createdAt: string;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/admin/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Check every 10s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await fetch("/api/admin/notifications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const markAllRead = async () => {
        try {
            // Logic to mark all as read could be added to API, 
            // but for now let's just mark the visible ones
            for (const n of notifications) {
                await markAsRead(n.id);
            }
            setNotifications([]);
        } catch (error) {
            console.error("Failed to mark all read", error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
                <Bell size={20} />
                {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 border-2 border-[#020617] rounded-full flex items-center justify-center text-[8px] font-black text-white">
                        {notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-12 right-0 w-80 bg-[#0c1022] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Bildirimler</h4>
                        {notifications.length > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-[9px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-widest transition-colors"
                            >
                                Tümünü Okundu Say
                            </button>
                        )}
                    </div>

                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/5">
                                    <Bell size={20} className="text-slate-600" />
                                </div>
                                <p className="text-xs text-slate-500 font-medium">Henüz yeni bildirim yok.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {notifications.map((n) => (
                                    <Link
                                        key={n.id}
                                        href={n.link || "#"}
                                        onClick={() => markAsRead(n.id)}
                                        className="p-4 flex gap-3 hover:bg-white/[0.03] transition-all group"
                                    >
                                        <div className={cn(
                                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border",
                                            n.title.includes("Sohbet")
                                                ? "bg-blue-600/10 border-blue-500/20 text-blue-400"
                                                : "bg-amber-600/10 border-amber-500/20 text-amber-400"
                                        )}>
                                            {n.title.includes("Sohbet") ? <MessageSquare size={16} /> : <Ticket size={16} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{n.title}</p>
                                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">{n.message}</p>
                                            <div className="flex items-center gap-1.5 mt-2 text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                                                <Clock size={10} />
                                                {new Date(n.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-3 bg-slate-950/50 border-t border-white/5 text-center">
                            <Link href="/admin/notifications" onClick={() => setIsOpen(false)} className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all">
                                Tümünü Gör
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
