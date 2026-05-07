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
    X
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
    createdAt: string;
}

export default function AdminSupport() {
    const [activeTab, setActiveTab] = useState<"tickets" | "live">("live");
    const [liveEnabled, setLiveEnabled] = useState(false);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [reply, setReply] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch initial status and sessions
    useEffect(() => {
        const fetchData = async () => {
            const statusRes = await fetch("/api/admin/support/status");
            const statusData = await statusRes.json();
            setLiveEnabled(statusData.isEnabled);

            const sessionsRes = await fetch("/api/admin/support/chat");
            const sessionsData = await sessionsRes.json();
            setSessions(sessionsData.sessions || []);
        };
        fetchData();

        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    // Fetch messages for selected session
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

    // Scroll to bottom
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

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Destek Merkezi
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <LifeBuoy className="text-blue-400" size={14} />
                        Müşteri taleplerini yanıtlayın ve canlı destek verin.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-4 py-2 bg-[#020617] border border-white/10 rounded-2xl">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Canlı Destek Durumu</span>
                        <button 
                            onClick={toggleLiveSupport}
                            className={cn(
                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                                liveEnabled ? "bg-green-500" : "bg-slate-700"
                            )}
                        >
                            <span className={cn(
                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                liveEnabled ? "translate-x-6" : "translate-x-1"
                            )} />
                        </button>
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            liveEnabled ? "text-green-400" : "text-slate-500"
                        )}>
                            {liveEnabled ? "AKTİF" : "KAPALI"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/5 pb-px">
                <button 
                    onClick={() => setActiveTab("live")}
                    className={cn(
                        "px-6 py-4 text-xs font-black uppercase tracking-widest transition-all relative",
                        activeTab === "live" ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
                    )}
                >
                    Canlı Sohbetler
                    {activeTab === "live" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
                </button>
                <button 
                    onClick={() => setActiveTab("tickets")}
                    className={cn(
                        "px-6 py-4 text-xs font-black uppercase tracking-widest transition-all relative",
                        activeTab === "tickets" ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
                    )}
                >
                    Destek Talepleri
                    {activeTab === "tickets" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
                </button>
            </div>

            {activeTab === "live" ? (
                <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 h-[600px]">
                    {/* Session List */}
                    <div className="bg-[#020617] border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-xl">
                        <div className="p-4 border-b border-white/5">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="Sohbet ara..." 
                                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-10 py-2.5 text-xs outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
                            {sessions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                                    <MessageSquare size={32} className="mb-2" />
                                    <p className="text-xs font-bold uppercase tracking-widest">Henüz sohbet yok</p>
                                </div>
                            ) : (
                                sessions.map((session) => (
                                    <button 
                                        key={session.sessionId}
                                        onClick={() => setSelectedSessionId(session.sessionId)}
                                        className={cn(
                                            "w-full text-left p-4 rounded-2xl transition-all group flex items-start gap-4",
                                            selectedSessionId === session.sessionId ? "bg-blue-600/10 border border-blue-500/20" : "hover:bg-white/5 border border-transparent"
                                        )}
                                    >
                                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-white/10 shrink-0 relative">
                                            <User size={18} className="text-slate-500" />
                                            {session.unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] font-black flex items-center justify-center text-white ring-2 ring-[#020617]">
                                                    {session.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-bold text-white text-sm truncate">{session.senderName}</h4>
                                                <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{new Date(session.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 truncate group-hover:text-slate-400">{session.lastMessage}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="bg-[#020617] border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-xl">
                        {selectedSessionId ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                                            <User size={18} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-sm">
                                                {sessions.find(s => s.sessionId === selectedSessionId)?.senderName || "Misafir"}
                                            </h3>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Circle size={8} className="text-green-500 fill-green-500 animate-pulse" />
                                                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Çevrimiçi</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                                            <MoreHorizontal size={18} />
                                        </button>
                                        <button onClick={() => setSelectedSessionId(null)} className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:text-white hover:bg-red-500 transition-all">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Chat Messages */}
                                <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-[url('/grid-pattern.png')] bg-fixed scrollbar-hide">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={cn("flex", msg.senderRole === "ADMIN" ? "justify-end" : "justify-start")}>
                                            <div className={cn(
                                                "max-w-[70%] px-5 py-3 rounded-2xl text-sm shadow-sm",
                                                msg.senderRole === "ADMIN" 
                                                    ? "bg-blue-600 text-white rounded-tr-none shadow-blue-600/10" 
                                                    : "bg-slate-900 border border-white/5 text-slate-300 rounded-tl-none"
                                            )}>
                                                <p className="leading-relaxed">{msg.message}</p>
                                                <span className={cn(
                                                    "text-[9px] mt-1.5 block",
                                                    msg.senderRole === "ADMIN" ? "text-white/40 text-right" : "text-slate-600"
                                                )}>
                                                    {new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Chat Input */}
                                <div className="p-4 bg-slate-950/50 border-t border-white/5">
                                    <form onSubmit={sendReply} className="relative">
                                        <input 
                                            type="text" 
                                            value={reply}
                                            onChange={(e) => setReply(e.target.value)}
                                            placeholder="Yanıtınızı buraya yazın..."
                                            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 pr-16 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-all shadow-inner"
                                        />
                                        <button 
                                            type="submit"
                                            disabled={!reply.trim()}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-500 disabled:opacity-40 disabled:scale-100 transition-all active:scale-90 shadow-lg shadow-blue-600/20"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
                                <div className="w-24 h-24 bg-slate-900 rounded-[40px] flex items-center justify-center border border-white/5 mb-6">
                                    <MessageSquare size={40} className="text-slate-500" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-[0.2em]">Sohbet Seçin</h3>
                                <p className="text-sm mt-3 max-w-xs font-bold text-slate-500">Yanıtlamak istediğiniz bir canlı destek oturumunu soldaki listeden seçin.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-[#020617] border border-white/10 p-12 rounded-[40px] text-center shadow-xl">
                    <LifeBuoy size={48} className="mx-auto text-slate-700 mb-6" />
                    <h3 className="text-xl font-black text-white uppercase tracking-widest">Destek Talepleri</h3>
                    <p className="text-slate-500 mt-2">Bu bölümdeki geliştirmeler devam ediyor.</p>
                </div>
            )}
        </div>
    );
}
