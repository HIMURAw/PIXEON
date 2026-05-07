"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    LifeBuoy,
    Search,
    MessageSquare,
    User,
    ArrowRight,
    MoreHorizontal,
    Send,
    Bot,
    Headset,
    Circle,
    Clock,
    X,
    Trash2,
    CheckCircle,
    Paperclip,
    ZoomIn,
    LogOut,
    TicketPlus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatSession {
    sessionId: string;
    senderName: string;
    lastMessage: string;
    createdAt: string;
    unreadCount: number;
}

interface Message {
    id: string;
    sessionId: string;
    senderName: string;
    senderRole: "USER" | "ADMIN";
    message: string;
    imageUrl?: string;
    createdAt: string;
}

export default function AdminSupport() {
    const [activeTab, setActiveTab] = useState<"tickets" | "live">("live");
    const [liveEnabled, setLiveEnabled] = useState(false);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [reply, setReply] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
    const [adminUser, setAdminUser] = useState<any>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Support Ticket States
    const [tickets, setTickets] = useState<any[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [ticketMessages, setTicketMessages] = useState<any[]>([]);
    const [ticketReply, setTicketReply] = useState("");
    const ticketScrollRef = useRef<HTMLDivElement>(null);

    // Fetch initial status and sessions
    const fetchSessions = async () => {
        const sessionsRes = await fetch("/api/admin/support/chat");
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData.sessions || []);
    };

    useEffect(() => {
        const fetchData = async () => {
            const statusRes = await fetch("/api/admin/support/status");
            const statusData = await statusRes.json();
            setLiveEnabled(statusData.isEnabled);
            fetchSessions();

            const meRes = await fetch("/api/auth/me");
            if (meRes.ok) {
                const meData = await meRes.json();
                setAdminUser(meData.user);
            }
        };
        fetchData();

        const interval = setInterval(fetchSessions, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeTab === "tickets") {
            fetchTickets();
        }
    }, [activeTab]);

    useEffect(() => {
        if (selectedTicket) {
            fetchTicketMessages(selectedTicket.id);
        }
    }, [selectedTicket]);

    useEffect(() => {
        if (ticketScrollRef.current) {
            ticketScrollRef.current.scrollTop = ticketScrollRef.current.scrollHeight;
        }
    }, [ticketMessages]);

    const fetchTickets = async () => {
        try {
            const res = await fetch("/api/admin/support/tickets");
            const data = await res.json();
            setTickets(data.tickets || []);
        } catch (err) {
            console.error("Fetch tickets error:", err);
        }
    };

    const fetchTicketMessages = async (ticketId: string) => {
        try {
            const res = await fetch(`/api/admin/support/tickets?ticketId=${ticketId}`);
            const data = await res.json();
            setTicketMessages(data.messages || []);
        } catch (err) {
            console.error("Fetch ticket messages error:", err);
        }
    };

    const handleSendTicketReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketReply.trim() || !selectedTicket) return;
        try {
            const res = await fetch("/api/admin/support/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketId: selectedTicket.id, message: ticketReply })
            });
            if (res.ok) {
                setTicketReply("");
                fetchTicketMessages(selectedTicket.id);
            }
        } catch (err) {
            console.error("Send reply error:", err);
        }
    };

    useEffect(() => {
        if (!selectedSessionId) return;
        const fetchMessages = async () => {
            const res = await fetch(`/api/admin/support/chat?sessionId=${selectedSessionId}`);
            const data = await res.json();
            setMessages(data.messages || []);
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [selectedSessionId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const toggleLiveSupport = async () => {
        const newValue = !liveEnabled;
        setLiveEnabled(newValue);
        await fetch("/api/admin/support/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ enabled: newValue }),
        });
    };

    const sendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim() || !selectedSessionId) return;
        const msgText = reply;
        setReply("");
        const res = await fetch("/api/admin/support/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: selectedSessionId, message: msgText }),
        });
        if (res.ok) {
            const data = await res.json();
            setMessages(prev => [...prev, data.message]);
        }
    };

    const confirmDelete = async () => {
        if (!sessionToDelete) return;
        setIsDeleting(true);
        const res = await fetch(`/api/admin/support/chat?sessionId=${sessionToDelete}`, { method: "DELETE" });
        if (res.ok) {
            if (sessionToDelete === selectedSessionId) setSelectedSessionId(null);
            fetchSessions();
            setSessionToDelete(null);
        }
        setIsDeleting(false);
    };

    const handleDeleteClick = (sid: string) => setSessionToDelete(sid);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedSessionId) return;
        const formData = new FormData();
        formData.append("file", file);
        try {
            const uploadRes = await fetch("/api/support/upload", { method: "POST", body: formData });
            const uploadData = await uploadRes.json();
            if (uploadData.url) {
                await fetch("/api/admin/support/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId: selectedSessionId, message: "Görsel gönderdi.", imageUrl: uploadData.url }),
                });
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Destek Merkezi</h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2"><LifeBuoy className="text-blue-400" size={14} /> Müşteri taleplerini yanıtlayın.</p>
                </div>
                <div className="flex items-center gap-6">
                    {/* Admin Profile Card */}
                    <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-white uppercase tracking-widest">
                                {adminUser?.name || "Yükleniyor..."}
                            </p>
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">
                                Yetkili Yönetici
                            </p>
                        </div>
                        <div className="w-11 h-11 rounded-2xl border border-white/10 bg-[#020617] p-0.5 shadow-2xl relative group cursor-pointer">
                            <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-900 flex items-center justify-center">
                                {adminUser?.image ? (
                                    <img src={adminUser.image} alt={adminUser.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                ) : (
                                    <User size={20} className="text-slate-600" />
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#020617] rounded-full" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-2 bg-[#020617] border border-white/10 rounded-2xl">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Destek Durumu</span>
                        <button onClick={toggleLiveSupport} className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors", liveEnabled ? "bg-green-500" : "bg-slate-700")}>
                            <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", liveEnabled ? "translate-x-6" : "translate-x-1")} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/5 pb-px">
                <button onClick={() => setActiveTab("live")} className={cn("px-6 py-4 text-xs font-black uppercase tracking-widest relative", activeTab === "live" ? "text-blue-400" : "text-slate-500")}>Canlı Sohbetler {activeTab === "live" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}</button>
                <button onClick={() => setActiveTab("tickets")} className={cn("px-6 py-4 text-xs font-black uppercase tracking-widest relative", activeTab === "tickets" ? "text-blue-400" : "text-slate-500")}>Destek Talepleri {activeTab === "tickets" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}</button>
            </div>

            {activeTab === "live" ? (
                <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 h-[600px]">
                    <div className="bg-[#020617] border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-xl">
                        <div className="p-4 border-b border-white/5"><div className="relative group"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} /><input type="text" placeholder="Sohbet ara..." className="w-full bg-slate-950 border border-white/5 rounded-xl px-10 py-2.5 text-xs outline-none" /></div></div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
                            {sessions.map((session) => (
                                <button key={session.sessionId} onClick={() => setSelectedSessionId(session.sessionId)} className={cn("w-full text-left p-4 rounded-2xl transition-all group flex items-start gap-4", selectedSessionId === session.sessionId ? "bg-blue-600/10 border border-blue-500/20" : "hover:bg-white/5 border border-transparent")}>
                                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-white/5 relative"><User size={18} className="text-slate-500" />{session.unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] font-black flex items-center justify-center text-white">{session.unreadCount}</span>}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1"><h4 className="font-bold text-white text-sm truncate">{session.senderName}</h4><span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{new Date(session.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span></div>
                                        <div className="flex items-center justify-between gap-2"><p className="text-xs text-slate-500 truncate flex-1">{session.lastMessage}</p><button onClick={(e) => { e.stopPropagation(); handleDeleteClick(session.sessionId); }} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-600 hover:text-red-500 transition-all"><Trash2 size={12} /></button></div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-[#020617] border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-xl">
                        {selectedSessionId ? (
                            <>
                                <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <div className="flex items-center gap-4"><div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-500/20"><User size={18} className="text-blue-400" /></div><div><h3 className="font-bold text-white text-sm">{sessions.find(s => s.sessionId === selectedSessionId)?.senderName || "Misafir"}</h3><div className="flex items-center gap-1.5 mt-0.5"><Circle size={8} className="text-green-500 fill-green-500 animate-pulse" /><span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Çevrimiçi</span></div></div></div>
                                    <div className="flex items-center gap-2"><button onClick={() => handleDeleteClick(selectedSessionId)} className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:text-white hover:bg-red-500 transition-all"><Trash2 size={18} /></button><button onClick={() => setSelectedSessionId(null)} className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><X size={18} /></button></div>
                                </div>
                                <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-hide">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={cn("flex", msg.senderRole === "ADMIN" ? "justify-end" : "justify-start")}>
                                            <div className={cn("max-w-[70%] flex flex-col", msg.senderRole === "ADMIN" ? "items-end" : "items-start")}>
                                                {msg.senderRole === "ADMIN" && <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{msg.senderName} (Admin)</span>}
                                                <div className={cn("px-5 py-3 rounded-2xl text-sm", msg.senderRole === "ADMIN" ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-900 border border-white/5 text-slate-300 rounded-tl-none")}>
                                                    {msg.imageUrl && (
                                                        <div className="mb-2 rounded-lg overflow-hidden border border-white/5 cursor-zoom-in group/img relative" onClick={() => setPreviewImage(msg.imageUrl || null)}>
                                                            <img src={msg.imageUrl} alt="" className="max-w-full h-auto max-h-80 object-cover transition-transform group-hover/img:scale-105" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center"><ZoomIn className="text-white" size={24} /></div>
                                                        </div>
                                                    )}
                                                    {msg.message !== "Görsel gönderdi." && <p className="leading-relaxed">{msg.message}</p>}
                                                    <span className={cn("text-[9px] mt-1.5 block", msg.senderRole === "ADMIN" ? "text-white/40 text-right" : "text-slate-600")}>{new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 bg-slate-950/50 border-t border-white/5">
                                    <form onSubmit={sendReply} className="relative flex items-center gap-3">
                                        <div className="relative flex-1">
                                            <input type="text" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Yanıtınızı buraya yazın..." className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 pr-12 text-sm text-white outline-none" />
                                            <label className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-blue-400 cursor-pointer"><Paperclip size={18} /><input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} /></label>
                                        </div>
                                        <button type="submit" disabled={!reply.trim()} className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-500 disabled:opacity-40 transition-all shrink-0"><Send size={20} /></button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30"><div className="w-24 h-24 bg-slate-900 rounded-[40px] flex items-center justify-center border border-white/5 mb-6"><MessageSquare size={40} className="text-slate-500" /></div><h3 className="text-xl font-black text-white uppercase tracking-[0.2em]">Sohbet Seçin</h3><p className="text-sm mt-3 max-w-xs font-bold text-slate-500">Bir canlı destek oturumu seçin.</p></div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 h-[650px] animate-in fade-in duration-500">
                    <div className="bg-[#020617] border border-white/10 rounded-[32px] flex flex-col overflow-hidden shadow-xl">
                        <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <TicketPlus size={14} className="text-blue-500" /> Aktif Destek Talepleri
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-hide">
                            {tickets.map((t) => (
                                <button key={t.id} onClick={() => setSelectedTicket(t)} className={cn("w-full text-left p-4 rounded-2xl border transition-all", selectedTicket?.id === t.id ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20" : "bg-slate-950/40 border-white/5 hover:border-white/10")}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={cn("text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest", selectedTicket?.id === t.id ? "bg-white/20 text-white" : "bg-slate-900 text-slate-500")}>#{t.id.split('_').pop()?.substring(0, 6)}</span>
                                        <span className={cn("text-[9px] font-black uppercase tracking-widest", t.status === "OPEN" ? "text-green-400" : "text-amber-400")}>{t.status === "OPEN" ? "YENİ" : "İŞLEMDE"}</span>
                                    </div>
                                    <h4 className={cn("font-bold text-sm truncate", selectedTicket?.id === t.id ? "text-white" : "text-slate-200")}>{t.subject}</h4>
                                    <div className="flex items-center gap-2 mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                        <User size={10} /> {t.userName}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#020617] border border-white/10 rounded-[32px] flex flex-col overflow-hidden shadow-xl relative">
                        {selectedTicket ? (
                            <>
                                <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-500/20 text-blue-500"><MessageSquare size={18} /></div>
                                        <div><h3 className="text-white font-bold text-sm">{selectedTicket.subject}</h3><p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-0.5">{selectedTicket.category} • {selectedTicket.priority}</p></div>
                                    </div>
                                </div>
                                <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide">
                                    {ticketMessages.map((msg) => (
                                        <div key={msg.id} className={cn("flex flex-col", msg.role === "ADMIN" ? "items-end" : "items-start")}>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{msg.senderName}</span>
                                            </div>
                                            <div className={cn("max-w-[80%] px-5 py-3 rounded-2xl text-sm", msg.role === "ADMIN" ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-900 border border-white/5 text-slate-300 rounded-tl-none")}>
                                                {msg.imageUrl && (
                                                    <div className="mb-3 rounded-xl overflow-hidden border border-white/5 cursor-zoom-in" onClick={() => setPreviewImage(msg.imageUrl)}>
                                                        <img src={msg.imageUrl} alt="" className="max-w-full h-auto" />
                                                    </div>
                                                )}
                                                <p className="leading-relaxed">{msg.message}</p>
                                                <span className={cn("text-[9px] mt-1.5 block", msg.role === "ADMIN" ? "text-white/40" : "text-slate-600")}>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={ticketScrollRef} />
                                </div>
                                <div className="p-4 bg-slate-950/50 border-t border-white/5">
                                    <form onSubmit={handleSendTicketReply} className="flex gap-3">
                                        <input type="text" value={ticketReply} onChange={(e) => setTicketReply(e.target.value)} placeholder="Cevabınızı buraya yazın..." className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none" />
                                        <button type="submit" disabled={!ticketReply.trim()} className="px-8 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all disabled:opacity-40">GÖNDER</button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
                                <LifeBuoy size={48} className="text-slate-700 mb-6" />
                                <h3 className="text-xl font-black text-white uppercase tracking-widest">Talep Seçin</h3>
                                <p className="text-sm mt-3 max-w-xs font-bold text-slate-500">Yanıtlamak istediğiniz destek talebini soldan seçin.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modals */}
            {sessionToDelete && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md" onClick={() => setSessionToDelete(null)} />
                    <div className="relative bg-[#0c1022] border border-white/10 rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-red-500/10 rounded-[24px] flex items-center justify-center border border-red-500/20 mb-6 mx-auto"><Trash2 className="text-red-500" size={32} /></div>
                        <h3 className="text-xl font-extrabold text-white text-center mb-2">Sohbeti Sil?</h3>
                        <p className="text-slate-400 text-center text-sm leading-relaxed mb-8">Bu işlem geri alınamaz.</p>
                        <div className="flex gap-3"><button onClick={() => setSessionToDelete(null)} className="flex-1 px-6 py-3.5 bg-white/5 rounded-2xl text-xs font-black uppercase text-slate-400">İptal</button><button onClick={confirmDelete} disabled={isDeleting} className="flex-1 px-6 py-3.5 bg-red-600 rounded-2xl text-xs font-black uppercase text-white shadow-lg shadow-red-600/20">{isDeleting ? "SİLİNİYOR..." : "EVET, SİL"}</button></div>
                    </div>
                </div>
            )}

            {previewImage && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setPreviewImage(null)} />
                    <div className="relative max-w-5xl max-h-full animate-in zoom-in-95">
                        <img src={previewImage} alt="Preview" className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10" />
                        <button onClick={() => setPreviewImage(null)} className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white"><X size={32} /></button>
                    </div>
                </div>
            )}
        </div>
    );
}
