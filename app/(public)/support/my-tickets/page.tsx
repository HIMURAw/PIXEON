"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
    MessageSquare, 
    ChevronRight, 
    Clock, 
    ArrowLeft,
    LifeBuoy,
    Send,
    User,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";

export default function MyTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        if (selectedTicket) {
            fetchMessages(selectedTicket.id);
        }
    }, [selectedTicket]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchTickets = async () => {
        try {
            const res = await fetch("/api/support/tickets/list"); // We'll create this API
            if (res.ok) {
                const data = await res.json();
                setTickets(data.tickets);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (ticketId: string) => {
        try {
            const res = await fetch(`/api/support/tickets/messages?ticketId=${ticketId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages);
            }
        } catch (err) {
            console.error("Fetch messages error:", err);
        }
    };

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim() || !selectedTicket) return;

        try {
            const res = await fetch("/api/support/tickets/reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketId: selectedTicket.id, message: reply })
            });
            if (res.ok) {
                setReply("");
                fetchMessages(selectedTicket.id);
            }
        } catch (err) {
            console.error("Reply error:", err);
        }
    };

    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[600px]">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">DESTEK TALEPLERİM</h1>
                        <p className="text-slate-500 text-sm">Geçmiş ve aktif tüm destek taleplerinizi buradan takip edebilirsiniz.</p>
                    </div>
                    <Link href="/support/ticket" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/20">
                        YENİ TALEP OLUŞTUR
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12">
                    {/* Ticket List */}
                    <div className="space-y-4">
                        {loading ? (
                            [1,2,3].map(i => <div key={i} className="h-24 bg-slate-900/50 rounded-3xl animate-pulse" />)
                        ) : tickets.length > 0 ? (
                            tickets.map((ticket) => (
                                <button 
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={cn(
                                        "w-full p-6 rounded-3xl border transition-all text-left",
                                        selectedTicket?.id === ticket.id 
                                        ? "bg-blue-600 border-blue-500 shadow-xl shadow-blue-600/20" 
                                        : "bg-slate-900/30 border-white/5 hover:border-white/10"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full uppercase", selectedTicket?.id === ticket.id ? "bg-white/20 text-white" : "bg-slate-950 text-slate-500")}>
                                            #{ticket.id.split('_').pop()?.substring(0,6)}
                                        </span>
                                        <span className={cn("text-[10px] font-black uppercase tracking-widest", 
                                            ticket.status === "OPEN" ? "text-green-400" : 
                                            ticket.status === "IN_PROGRESS" ? "text-amber-400" : "text-slate-600"
                                        )}>
                                            {ticket.status === "OPEN" ? "YENİ" : ticket.status === "IN_PROGRESS" ? "CEVAPLANDI" : "KAPALI"}
                                        </span>
                                    </div>
                                    <h3 className={cn("font-bold text-sm truncate", selectedTicket?.id === ticket.id ? "text-white" : "text-slate-200")}>{ticket.subject}</h3>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                                            <Clock size={12} /> {new Date(ticket.createdAt).toLocaleDateString()}
                                        </div>
                                        <ChevronRight size={16} className={cn(selectedTicket?.id === ticket.id ? "text-white" : "text-slate-700")} />
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="bg-slate-900/30 border border-dashed border-white/10 rounded-3xl p-12 text-center">
                                <LifeBuoy size={40} className="mx-auto text-slate-700 mb-4" />
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Henüz bir talebiniz yok.</p>
                            </div>
                        )}
                    </div>

                    {/* Chat Area */}
                    <div className="bg-slate-900/30 border border-white/5 rounded-[40px] flex flex-col overflow-hidden min-h-[600px]">
                        {selectedTicket ? (
                            <>
                                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500">
                                            <MessageSquare size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold">{selectedTicket.subject}</h3>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                                                {selectedTicket.category} • DURUM: {selectedTicket.status}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={cn("flex flex-col", msg.senderRole === "ADMIN" ? "items-start" : "items-end")}>
                                            <div className="flex items-center gap-2 mb-2 px-1">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    {msg.senderRole === "ADMIN" ? "PIXEON DESTEK" : "SİZ"}
                                                </span>
                                            </div>
                                            <div className={cn(
                                                "max-w-[80%] px-6 py-4 rounded-[24px] text-sm leading-relaxed",
                                                msg.senderRole === "ADMIN" 
                                                ? "bg-slate-900 border border-white/10 text-white rounded-tl-none" 
                                                : "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/10"
                                            )}>
                                                {msg.imageUrl && (
                                                    <div className="mb-4 rounded-xl overflow-hidden border border-white/5">
                                                        <img src={msg.imageUrl} alt="Ek" className="w-full h-auto" />
                                                    </div>
                                                )}
                                                {msg.message}
                                                <span className={cn("text-[9px] mt-2 block opacity-40", msg.senderRole === "ADMIN" ? "text-slate-400" : "text-white")}>
                                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={scrollRef} />
                                </div>
                                <div className="p-6 bg-slate-950/50 border-t border-white/5">
                                    <form onSubmit={handleSendReply} className="flex gap-4">
                                        <input 
                                            type="text" 
                                            value={reply}
                                            onChange={(e) => setReply(e.target.value)}
                                            placeholder="Mesajınızı yazın..."
                                            className="flex-1 bg-[#020617] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                                        />
                                        <button 
                                            type="submit"
                                            disabled={!reply.trim()}
                                            className="px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                                        >
                                            GÖNDER
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                                <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center border border-white/5 mb-6 text-slate-800">
                                    <MessageSquare size={32} />
                                </div>
                                <h3 className="text-white font-bold mb-2">Talebi Seçin</h3>
                                <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed">
                                    Mesajları ve verilen yanıtları görmek için soldaki listeden bir destek talebi seçin.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
