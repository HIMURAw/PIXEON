"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
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
import {
    DndContext,
    useDraggable,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import { useChatWindows, LiveSession, Ticket } from "@/context/ChatWindowContext";
import { History, FileText, Calendar, Trash } from "lucide-react";

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
    const [activeTab, setActiveTab] = useState<"tickets" | "live" | "logs">("live");
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
    const [mounted, setMounted] = useState(false);

    // Support Ticket States
    const [tickets, setTickets] = useState<any[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [ticketMessages, setTicketMessages] = useState<any[]>([]);
    const [ticketReply, setTicketReply] = useState("");
    const [ticketToDelete, setTicketToDelete] = useState<any>(null);
    const [closedTickets, setClosedTickets] = useState<any[]>([]);
    const [searchLogs, setSearchLogs] = useState("");
    const [filterCategory, setFilterCategory] = useState("ALL");
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);
    const ticketScrollRef = useRef<HTMLDivElement>(null);

    // Chat Window Context
    const { openWindow } = useChatWindows();

    useEffect(() => {
        setMounted(true);
        // Destek sayfasına girildiğinde ilgili bildirimleri okundu say
        fetch("/api/admin/notifications", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ link: "/admin/support" })
        }).catch(err => console.error("Notification mark read error:", err));
    }, []);

    // Dnd Kit Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Prevent accidental drags when clicking
            },
        })
    );

    const [activeDragItem, setActiveDragItem] = useState<{ type: "live" | "ticket"; data: any } | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveDragItem(active.data.current as any);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;

        // Treat as a drop if moved more than 10px
        if (Math.abs(delta.x) > 10 || Math.abs(delta.y) > 10) {
            const dragData = active.data.current;
            if (!dragData) return;

            // Use the client coordinates from the activator event + the delta
            const activator = event.activatorEvent as MouseEvent | PointerEvent;
            const dropPos = {
                x: activator.clientX + delta.x - 180, // Offset to center window roughly
                y: activator.clientY + delta.y - 20
            };

            // Clamp to screen bounds
            dropPos.x = Math.max(10, Math.min(dropPos.x, window.innerWidth - 400));
            dropPos.y = Math.max(10, Math.min(dropPos.y, window.innerHeight - 500));

            if (dragData.type === "live") {
                const s = dragData.data as ChatSession;
                openWindow(s.sessionId, "live", s.senderName, "Canlı Sohbet", s as any, dropPos);
            } else {
                const t = dragData.data as any;
                openWindow(t.id, "ticket", t.subject, t.userName, t, dropPos);
            }
        }

        setActiveDragItem(null);
    };

    // Helper component for Draggable items
    const DraggableItem = ({ id, type, data, children, className }: any) => {
        const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
            id,
            data: { type, data },
        });

        const style = transform ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
            zIndex: 999,
        } : undefined;

        return (
            <div
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                className={cn(className, isDragging && "opacity-50 cursor-grabbing")}
            >
                {children}
            </div>
        );
    };

    // Fetch initial status and sessions
    const fetchSessions = async () => {
        const sessionsRes = await fetch("/api/admin/support/chat");
        const sessionsData = await sessionsRes.json();
        // Sadece aktif (arşivlenmemiş) sohbetleri ana listede göster
        const activeSessions = sessionsData.sessions?.filter((s: any) => s.status !== "ARCHIVED") || [];
        setSessions(activeSessions);
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
        } else if (activeTab === "logs") {
            fetchClosedTickets();
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
            // Filter only non-closed tickets for the main tickets tab
            setTickets(data.tickets?.filter((t: any) => t.status !== "CLOSED") || []);
        } catch (err) {
            console.error("Fetch tickets error:", err);
        }
    };

    const fetchClosedTickets = async () => {
        setIsLoadingLogs(true);
        try {
            // Fetch both tickets and sessions for a complete log
            const [tRes, sRes] = await Promise.all([
                fetch("/api/admin/support/tickets"),
                fetch("/api/admin/support/chat")
            ]);
            const tData = await tRes.json();
            const sData = await sRes.json();

            const closedT = tData.tickets?.filter((t: any) => t.status === "CLOSED") || [];
            const archivedS = sData.sessions?.filter((s: any) => s.status === "ARCHIVED") || []; // Assuming status field exists

            setClosedTickets([...closedT, ...archivedS.map((s: any) => ({
                id: s.sessionId,
                userName: s.senderName,
                subject: "Canlı Sohbet Geçmişi",
                category: "CANLI DESTEK",
                createdAt: s.createdAt,
                type: "LIVE_CHAT"
            }))].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (err) {
            console.error("Fetch logs error:", err);
        } finally {
            setIsLoadingLogs(false);
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

    const handleCloseSession = async (sid: string) => {
        setIsDeleting(true);
        try {
            const res = await fetch("/api/admin/support/chat", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId: sid, status: "ARCHIVED" })
            });
            if (res.ok) {
                if (sid === selectedSessionId) setSelectedSessionId(null);
                fetchSessions();
                fetchClosedTickets();
            }
        } catch (err) {
            console.error("Close session error:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseTicket = async (ticketId: string) => {
        setIsDeleting(true);
        try {
            const res = await fetch("/api/admin/support/tickets", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketId, status: "CLOSED" })
            });
            if (res.ok) {
                setTickets(tickets.filter(t => t.id !== ticketId));
                setSelectedTicket(null);
                fetchClosedTickets();
            }
        } catch (err) {
            console.error("Close ticket error:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteTicket = async () => {
        if (!ticketToDelete) return;

        // If it's already closed, we delete it permanently
        if (ticketToDelete.status === "CLOSED") {
            setIsDeleting(true);
            try {
                const res = await fetch(`/api/admin/support/tickets?ticketId=${ticketToDelete.id}`, { method: "DELETE" });
                if (res.ok) {
                    setClosedTickets(closedTickets.filter(t => t.id !== ticketToDelete.id));
                    setTicketToDelete(null);
                }
            } catch (err) {
                console.error("Delete permanent error:", err);
            } finally {
                setIsDeleting(false);
            }
            return;
        }

        // Otherwise, we archive it
        handleCloseTicket(ticketToDelete.id);
        setTicketToDelete(null);
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

        // Check if it's already in logs (using current sessions state is tricky, better to just archive)
        const session = sessions.find(s => s.sessionId === sessionToDelete);

        if (!session) {
            // If not found in active sessions, it might be in logs, do permanent delete
            setIsDeleting(true);
            await fetch(`/api/admin/support/chat?sessionId=${sessionToDelete}`, { method: "DELETE" });
            setClosedTickets(closedTickets.filter(t => t.id !== sessionToDelete));
            setSessionToDelete(null);
            setIsDeleting(false);
            return;
        }

        // Archive active session
        handleCloseSession(sessionToDelete);
        setSessionToDelete(null);
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
                <button onClick={() => setActiveTab("live")} className={cn("px-6 py-4 text-xs font-black uppercase tracking-widest relative", activeTab === "live" ? "text-blue-400" : "text-slate-500")}>
                    Canlı Sohbetler {activeTab === "live" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                </button>
                <button onClick={() => setActiveTab("tickets")} className={cn("px-6 py-4 text-xs font-black uppercase tracking-widest relative", activeTab === "tickets" ? "text-blue-400" : "text-slate-500")}>
                    Destek Talepleri {activeTab === "tickets" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                </button>
                <button onClick={() => setActiveTab("logs")} className={cn("px-6 py-4 text-xs font-black uppercase tracking-widest relative", activeTab === "logs" ? "text-blue-400" : "text-slate-500")}>
                    <div className="flex items-center gap-2">
                        <History size={14} /> Arşiv (Log)
                    </div>
                    {activeTab === "logs" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                </button>
            </div>

            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                {activeTab === "live" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 h-[600px]">
                        <div className="bg-[#020617] border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-xl">
                            <div className="p-4 border-b border-white/5"><div className="relative group"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} /><input type="text" placeholder="Sohbet ara..." className="w-full bg-slate-950 border border-white/5 rounded-xl px-10 py-2.5 text-xs outline-none" /></div></div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
                                {sessions.map((session) => (
                                    <DraggableItem
                                        key={session.sessionId}
                                        id={session.sessionId}
                                        type="live"
                                        data={session}
                                    >
                                        <button
                                            onClick={() => setSelectedSessionId(session.sessionId)}
                                            className={cn("w-full text-left p-4 rounded-2xl transition-all group flex items-start gap-4", selectedSessionId === session.sessionId ? "bg-blue-600/10 border border-blue-500/20" : "hover:bg-white/5 border border-transparent")}
                                        >
                                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-white/5 relative">
                                                <User size={18} className="text-slate-500" />
                                                {session.unreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] font-black flex items-center justify-center text-white">
                                                        {session.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-bold text-white text-sm truncate">{session.senderName}</h4>
                                                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                                                        {new Date(session.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-xs text-slate-500 truncate flex-1">{session.lastMessage}</p>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(session.sessionId); }}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-600 hover:text-red-500 transition-all"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </button>
                                    </DraggableItem>
                                ))}
                            </div>
                        </div>
                        <div className="bg-[#020617] border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-xl">
                            {selectedSessionId ? (
                                <>
                                    <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                        <div className="flex items-center gap-4"><div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-500/20"><User size={18} className="text-blue-400" /></div><div><h3 className="font-bold text-white text-sm">{sessions.find(s => s.sessionId === selectedSessionId)?.senderName || "Misafir"}</h3><div className="flex items-center gap-1.5 mt-0.5"><Circle size={8} className="text-green-500 fill-green-500 animate-pulse" /><span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Çevrimiçi</span></div></div></div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleDeleteClick(selectedSessionId)} className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:text-white hover:bg-red-500 transition-all"><Trash2 size={18} /></button>
                                            <button onClick={() => setSelectedSessionId(null)} className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><X size={18} /></button>
                                        </div>
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
                ) : activeTab === "tickets" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 h-[600px] animate-in fade-in duration-500">
                        <div className="bg-[#020617] border border-white/10 rounded-[32px] flex flex-col overflow-hidden shadow-xl">
                            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <TicketPlus size={14} className="text-blue-500" /> Aktif Destek Talepleri
                                </h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-hide">
                                {tickets.map((t) => (
                                    <DraggableItem
                                        key={t.id}
                                        id={t.id}
                                        type="ticket"
                                        data={t}
                                    >
                                        <button
                                            onClick={() => setSelectedTicket(t)}
                                            className={cn("w-full text-left p-4 rounded-2xl border transition-all", selectedTicket?.id === t.id ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20" : "bg-slate-950/40 border-white/5 hover:border-white/10")}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={cn("text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest", selectedTicket?.id === t.id ? "bg-white/20 text-white" : "bg-slate-900 text-slate-500")}>#{t.id.split('_').pop()?.substring(0, 6)}</span>
                                                <span className={cn("text-[9px] font-black uppercase tracking-widest", t.status === "OPEN" ? "text-green-400" : "text-amber-400")}>{t.status === "OPEN" ? "YENİ" : "İŞLEMDE"}</span>
                                            </div>
                                            <h4 className={cn("font-bold text-sm truncate", selectedTicket?.id === t.id ? "text-white" : "text-slate-200")}>{t.subject}</h4>
                                            <div className="flex items-center gap-2 mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                                <User size={10} /> {t.userName}
                                            </div>
                                        </button>
                                    </DraggableItem>
                                ))}
                                {tickets.length === 0 && (
                                    <div className="p-12 text-center opacity-20">
                                        <FileText className="mx-auto mb-4" size={32} />
                                        <p className="text-xs font-bold uppercase tracking-widest">Aktif talep yok</p>
                                    </div>
                                )}
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
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setTicketToDelete(selectedTicket)}
                                                className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-black text-red-500 hover:text-white hover:bg-red-500 transition-all uppercase tracking-widest"
                                            >
                                                Sil
                                            </button>
                                            <button
                                                onClick={() => setSelectedTicket(null)}
                                                className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-500 hover:text-white transition-all"
                                            >
                                                <X size={18} />
                                            </button>
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
                ) : (
                    <div className="bg-[#020617] border border-white/10 rounded-[32px] overflow-hidden shadow-xl animate-in fade-in duration-500">
                        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <History size={16} className="text-blue-500" /> Kapatılan Talepler Arşivi
                                </h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Geçmişte sonuçlandırılmış destek kayıtları</p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                {/* Search */}
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Ara (İsim, Konu...)"
                                        value={searchLogs}
                                        onChange={(e) => setSearchLogs(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-blue-500/50 transition-all"
                                    />
                                </div>

                                {/* Category Filter */}
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                                >
                                    <option value="ALL">TÜMÜ</option>
                                    <option value="CANLI DESTEK">CANLI DESTEK</option>
                                    <option value="KARGO">KARGO</option>
                                    <option value="IADE">İADE</option>
                                    <option value="TEKNIK">TEKNİK</option>
                                    <option value="DIGER">DİĞER</option>
                                </select>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-slate-900/20">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Kullanıcı</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Konu</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Kategori</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tarih</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {closedTickets
                                        .filter(t => {
                                            const matchesSearch = t.userName.toLowerCase().includes(searchLogs.toLowerCase()) ||
                                                t.subject.toLowerCase().includes(searchLogs.toLowerCase());
                                            const matchesCategory = filterCategory === "ALL" || t.category === filterCategory;
                                            return matchesSearch && matchesCategory;
                                        })
                                        .map((t) => (
                                            <tr
                                                key={t.id}
                                                className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                                onClick={() => {
                                                    if (t.type === "LIVE_CHAT") {
                                                        setSelectedSessionId(t.id);
                                                        setActiveTab("live");
                                                    } else {
                                                        setSelectedTicket(t);
                                                        setActiveTab("tickets");
                                                    }
                                                }}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500">
                                                            <User size={14} />
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-300">{t.userName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-400">{t.subject}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md border border-white/5">{t.category}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Calendar size={12} />
                                                        <span className="text-xs">{new Date(t.createdAt).toLocaleDateString("tr-TR")}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => setTicketToDelete(t)}
                                                        className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    {closedTickets.length === 0 && !isLoadingLogs && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-24 text-center">
                                                <History size={48} className="mx-auto text-slate-800 mb-4" />
                                                <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Henüz arşivlenmiş talep bulunmuyor.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                            active: {
                                opacity: '0.4',
                            },
                        },
                    }),
                }}>
                    {activeDragItem ? (
                        <div className="bg-blue-600/20 border-2 border-blue-500 rounded-2xl p-4 w-[300px] backdrop-blur-md shadow-2xl scale-105 transition-transform">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    {activeDragItem.type === 'live' ? <User size={16} className="text-white" /> : <LifeBuoy size={16} className="text-white" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-xs font-bold truncate">
                                        {activeDragItem.type === 'live' ? activeDragItem.data.senderName : activeDragItem.data.subject}
                                    </p>
                                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-0.5">
                                        Pencere Olarak Aç
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* ── Portals for Modals ─────────────────────────────────────────────────── */}
            {mounted && createPortal(
                <>
                    {/* Ticket Delete Modal */}
                    {ticketToDelete && (
                        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setTicketToDelete(null)} />
                            <div className="relative bg-[#0c1022] border border-white/10 rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95">
                                <div className="w-16 h-16 bg-red-500/10 rounded-[24px] flex items-center justify-center border border-red-500/20 mb-6 mx-auto"><Trash2 className="text-red-500" size={32} /></div>
                                <h3 className="text-xl font-extrabold text-white text-center mb-2">Talebi Sil?</h3>
                                <p className="text-slate-400 text-center text-sm leading-relaxed mb-2">Bu destek talebi ve tüm mesajları kalıcı olarak silinecektir.</p>
                                <p className="text-red-500/50 text-center text-[10px] font-black uppercase mb-8">Bu işlem geri alınamaz!</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setTicketToDelete(null)} className="flex-1 px-6 py-3.5 bg-white/5 rounded-2xl text-xs font-black uppercase text-slate-400 hover:bg-white/10 transition-colors">İptal</button>
                                    <button onClick={handleDeleteTicket} disabled={isDeleting} className="flex-1 px-6 py-3.5 bg-red-600 rounded-2xl text-xs font-black uppercase text-white shadow-lg shadow-red-600/20 hover:bg-red-500 transition-colors">
                                        {isDeleting ? "SİLİNİYOR..." : "EVET, SİL"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Session Delete Modal */}
                    {sessionToDelete && (
                        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setSessionToDelete(null)} />
                            <div className="relative bg-[#0c1022] border border-white/10 rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95">
                                <div className="w-16 h-16 bg-red-500/10 rounded-[24px] flex items-center justify-center border border-red-500/20 mb-6 mx-auto"><Trash2 className="text-red-500" size={32} /></div>
                                <h3 className="text-xl font-extrabold text-white text-center mb-2">Sohbeti Sil?</h3>
                                <p className="text-slate-400 text-center text-sm leading-relaxed mb-8">Bu işlem geri alınamaz ve tüm mesaj geçmişi silinecektir.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setSessionToDelete(null)} className="flex-1 px-6 py-3.5 bg-white/5 rounded-2xl text-xs font-black uppercase text-slate-400 hover:bg-white/10 transition-colors">İptal</button>
                                    <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 px-6 py-3.5 bg-red-600 rounded-2xl text-xs font-black uppercase text-white shadow-lg shadow-red-600/20 hover:bg-red-500 transition-colors">
                                        {isDeleting ? "SİLİNİYOR..." : "EVET, SİL"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Global Image Preview Modal */}
                    {previewImage && (
                        <div className="fixed inset-0 z-[110000] flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setPreviewImage(null)} />
                            <div className="relative max-w-5xl max-h-full animate-in zoom-in-95 duration-300">
                                <img src={previewImage} alt="Preview" className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10" />
                                <button onClick={() => setPreviewImage(null)} className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white transition-colors">
                                    <X size={32} />
                                </button>
                            </div>
                        </div>
                    )}
                </>,
                document.body
            )}
        </div>
    );
}
