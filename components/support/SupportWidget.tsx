"use client";

import { useSupport } from "@/context/SupportContext";
import {
    MessageCircle,
    X,
    Send,
    Headset,
    Bot,
    Paperclip,
    Sparkles,
    RotateCcw,
    ExternalLink,
    Clock,
    ZoomIn,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "ai" | "live";

interface Message {
    id: string | number;
    role: "user" | "ai" | "agent";
    text: string;
    time: string;
    senderName?: string;
    senderImage?: string;
    imageUrl?: string;
    isMarkdown?: boolean;
}

// ─── Tiny Markdown Renderer (bold + links only) ───────────────────────────────
function RenderText({ text }: { text: string }) {
    const lines = text.split("\n");
    return (
        <span className="leading-relaxed whitespace-pre-wrap text-sm">
            {lines.map((line, li) => {
                // Parse **bold** and [text](href)
                const parts: React.ReactNode[] = [];
                const regex = /(\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\))/g;
                let last = 0;
                let match: RegExpExecArray | null;
                regex.lastIndex = 0;

                while ((match = regex.exec(line)) !== null) {
                    if (match.index > last) {
                        parts.push(line.slice(last, match.index));
                    }
                    if (match[0].startsWith("**")) {
                        parts.push(
                            <strong key={`b-${li}-${match.index}`} className="font-bold text-white">
                                {match[2]}
                            </strong>
                        );
                    } else {
                        parts.push(
                            <Link
                                key={`l-${li}-${match.index}`}
                                href={match[4]}
                                className="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                            >
                                {match[3]}
                                <ExternalLink size={10} />
                            </Link>
                        );
                    }
                    last = match.index + match[0].length;
                }
                if (last < line.length) parts.push(line.slice(last));

                return (
                    <span key={li}>
                        {parts}
                        {li < lines.length - 1 && <br />}
                    </span>
                );
            })}
        </span>
    );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
    return (
        <div className="flex justify-start">
            <div className="bg-slate-900 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms`, animationDuration: "1s" }}
                    />
                ))}
            </div>
        </div>
    );
}

// ─── Quick Suggestion Chips ───────────────────────────────────────────────────
const QUICK_SUGGESTIONS = [
    "Kargo süresi ne kadar?",
    "İade nasıl yapılır?",
    "Hangi ödeme yöntemleri var?",
    "Garanti kapsamı nedir?",
    "Siparişimi nasıl takip ederim?",
];

function now() {
    return new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function SupportWidget() {
    const { isOpen, toggleSupport, closeSupport } = useSupport();
    const [tab, setTab] = useState<Tab>("ai");

    // User Auth state
    const [user, setUser] = useState<any>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // AI Chat state
    const [aiMessages, setAiMessages] = useState<Message[]>([
        {
            id: 1,
            role: "ai",
            text: "👋 Merhaba! Ben **Pixeon AI Asistanı**. Kargo, iade, ödeme, garanti ve daha fazlası hakkında sorularınızı yanıtlayabilirim.\n\nSize nasıl yardımcı olabilirim?",
            time: now(),
            isMarkdown: true,
        },
    ]);
    const [aiInput, setAiInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const aiScrollRef = useRef<HTMLDivElement>(null);

    // Live Support state
    const [isLiveEnabled, setIsLiveEnabled] = useState(true);
    const [liveMessages, setLiveMessages] = useState<Message[]>([]);
    const [liveInput, setLiveInput] = useState("");
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const liveScrollRef = useRef<HTMLDivElement>(null);

    // Initial load: handle sessionId, check live status, and check auth
    useEffect(() => {
        const initSupport = async () => {
            // 1. Check User Auth First
            let currentUser = null;
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    currentUser = data.user;
                    setUser(currentUser);
                }
            } catch (err) {
                console.error("Auth check failed", err);
            } finally {
                setIsAuthLoading(false);
            }

            // 2. Handle Session ID based on Auth
            let sid = localStorage.getItem("pixeon_support_sid") || "";
            if (!sid) {
                if (currentUser) {
                    sid = `user_${currentUser.id}_${Date.now()}`;
                } else {
                    sid = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                }
                localStorage.setItem("pixeon_support_sid", sid);
            }
            setSessionId(sid);

            // 3. Check Live Support Status
            try {
                const res = await fetch("/api/support/status");
                const data = await res.json();
                setIsLiveEnabled(data.isEnabled);
            } catch (err) {
                console.error("Status check failed", err);
            }
        };

        initSupport();
    }, []);

    // Fetch live messages periodically if tab is "live" and isOpen
    useEffect(() => {
        if (!isOpen || tab !== "live" || !sessionId || !user) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/support/chat?sessionId=${sessionId}`);
                const data = await res.json();

                if (data.status === "ARCHIVED") {
                    // Session ended by admin
                    localStorage.removeItem("pixeon_support_sid");
                    setSessionId(null);
                    setLiveMessages([]);
                    return;
                }

                if (data.messages) {
                    const mapped: Message[] = data.messages.map((m: any) => ({
                        id: m.id,
                        role: m.senderRole === "ADMIN" ? "agent" : "user",
                        text: m.message,
                        senderName: m.senderName,
                        senderImage: m.senderImage,
                        imageUrl: m.imageUrl,
                        time: new Date(m.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
                    }));

                    setLiveMessages(prev => {
                        if (prev.length === mapped.length) return prev;
                        return mapped;
                    });
                }
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [isOpen, tab, sessionId, user]);

    // Auto-scroll
    useEffect(() => {
        if (aiScrollRef.current) aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight;
    }, [aiMessages, isTyping]);

    useEffect(() => {
        if (liveScrollRef.current) liveScrollRef.current.scrollTop = liveScrollRef.current.scrollHeight;
    }, [liveMessages]);

    // ── Image Upload ────────────────────────────────────────────────────────
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !sessionId || !user) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const uploadRes = await fetch("/api/support/upload", {
                method: "POST",
                body: formData,
            });
            const uploadData = await uploadRes.json();

            if (uploadData.url) {
                // Send as a message
                const res = await fetch("/api/support/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sessionId,
                        message: "Görsel gönderdi.",
                        imageUrl: uploadData.url,
                        senderName: user.name
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setLiveMessages(prev => [...prev, {
                        id: data.message.id,
                        role: "user",
                        text: data.message.message,
                        imageUrl: data.message.imageUrl,
                        time: now()
                    }]);
                }
            }
        } catch (err) {
            console.error("Image upload failed", err);
        }
    };

    // ── AI Send ──────────────────────────────────────────────────────────────
    const handleAiSend = async (text?: string) => {
        const msg = (text ?? aiInput).trim();
        if (!msg || isTyping || !user) return;

        const userMsg: Message = { id: Date.now(), role: "user", text: msg, time: now() };
        setAiMessages((prev) => [...prev, userMsg]);
        setAiInput("");
        setIsTyping(true);

        try {
            const res = await fetch("/api/ai-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: msg }),
            });
            const data = await res.json();
            const answer = data.answer || "Bir hata oluştu, lütfen tekrar deneyin.";
            setAiMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, role: "ai", text: answer, time: now(), isMarkdown: true },
            ]);
        } catch {
            setAiMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, role: "ai", text: "Bağlantı hatası.", time: now() },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    // ── Live Send ─────────────────────────────────────────────────────────────
    const handleLiveSend = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let currentSid = sessionId;
        if (!currentSid) {
            // Generate a new one if it was cleared
            if (user) {
                currentSid = `user_${user.id}_${Date.now()}`;
            } else {
                currentSid = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            }
            localStorage.setItem("pixeon_support_sid", currentSid);
            setSessionId(currentSid);
        }

        if (!liveInput.trim() || !currentSid || !user) return;

        const msgText = liveInput;
        setLiveInput("");

        try {
            const res = await fetch("/api/support/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId: currentSid, message: msgText, senderName: user.name }),
            });

            if (res.ok) {
                const data = await res.json();
                const newMessage: Message = { id: data.message.id, role: "user", text: data.message.message, time: now() };
                setLiveMessages(prev => [...prev, newMessage]);
            }
        } catch (err) {
            console.error("Failed to send live message", err);
        }
    };

    const resetAi = () => {
        setAiMessages([{ id: 1, role: "ai", text: "👋 Merhaba! Ben **Pixeon AI Asistanı**. Size nasıl yardımcı olabilirim?", time: now(), isMarkdown: true }]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {isOpen && (
                <div
                    className="fixed md:absolute bottom-24 md:bottom-20 right-4 md:right-0 left-4 md:left-auto top-4 md:top-auto w-auto md:w-[390px] h-auto md:h-[560px] bg-[#0c1022] border border-white/10 rounded-[24px] md:rounded-[28px] shadow-2xl flex flex-col overflow-hidden"
                    style={{ animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#1a2aff] via-[#2563eb] to-[#06b6d4] p-5 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-11 h-11 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                    {tab === "ai" ? <Bot className="text-white" size={22} /> : <Headset className="text-white" size={22} />}
                                </div>
                                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#1a40c9] animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">{tab === "ai" ? "Pixeon AI Asistanı" : "Canlı Destek"}</h3>
                                <span className="text-white/65 text-[10px] font-medium uppercase tracking-wider">{tab === "ai" ? "7/24 Hizmetinizde" : "Çevrimiçi"}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {tab === "ai" && <button onClick={resetAi} className="w-8 h-8 bg-white/15 hover:bg-white/25 rounded-xl flex items-center justify-center text-white/80"><RotateCcw size={14} /></button>}
                            <button onClick={closeSupport} className="w-8 h-8 bg-white/15 hover:bg-white/25 rounded-xl flex items-center justify-center text-white/80"><X size={16} /></button>
                        </div>
                    </div>

                    {/* Tab Bar */}
                    <div className="flex shrink-0 bg-slate-950/80 border-b border-white/5">
                        {(["ai", "live"] as Tab[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${tab === t ? "text-blue-400 border-blue-500" : "text-slate-500 border-transparent hover:text-slate-300"}`}
                            >
                                {t === "ai" ? "AI Asistan" : "Canlı Destek"}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-hidden flex flex-col relative">
                        {/* Auth Required Overlay */}
                        {!isAuthLoading && !user && (
                            <div className="absolute inset-0 z-50 backdrop-blur-md bg-slate-950/60 flex flex-col items-center justify-center text-center p-8 space-y-4">
                                <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center border border-white/5 text-blue-500 shadow-xl">
                                    {tab === "ai" ? <Bot size={32} /> : <Headset size={32} />}
                                </div>
                                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Giriş Yapmalısınız</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">Destek sistemini kullanabilmek için lütfen hesabınıza giriş yapın.</p>
                                <Link href="/login" className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all">Giriş Yap</Link>
                            </div>
                        )}

                        {tab === "ai" ? (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div ref={aiScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-hide" style={{ background: "linear-gradient(180deg, #080e1c 0%, #0c1022 100%)" }}>
                                    {aiMessages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                            {msg.role === "ai" && <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 mr-2 mt-auto mb-1"><Bot size={13} className="text-white" /></div>}
                                            <div className={`max-w-[78%] px-4 py-3 rounded-2xl ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-slate-900 border border-white/6 text-slate-300 rounded-tl-sm"}`}>
                                                {msg.isMarkdown ? <RenderText text={msg.text} /> : <p className="text-sm leading-relaxed">{msg.text}</p>}
                                                <span className={`text-[9px] mt-1.5 block ${msg.role === "user" ? "text-white/40 text-right" : "text-slate-600"}`}>{msg.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && <TypingIndicator />}
                                    {aiMessages.length === 1 && !isTyping && user && (
                                        <div className="pt-2 space-y-1.5">
                                            {QUICK_SUGGESTIONS.map((s) => (
                                                <button key={s} onClick={() => handleAiSend(s)} className="block w-full text-left text-xs text-slate-400 bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 rounded-xl px-3 py-2.5 transition-all">{s}</button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 bg-slate-950/90 border-t border-white/5">
                                    <form onSubmit={(e) => { e.preventDefault(); handleAiSend(); }} className="relative">
                                        <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Bir şey sorun..." disabled={isTyping || !user} className="w-full bg-slate-900 border border-white/6 rounded-2xl px-4 py-3 pr-12 text-sm text-white outline-none disabled:opacity-50" />
                                        <button type="submit" disabled={isTyping || !aiInput.trim() || !user} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center disabled:opacity-40"><Send size={14} /></button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div ref={liveScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-hide flex flex-col" style={{ background: "linear-gradient(180deg, #080e1c 0%, #0c1022 100%)" }}>
                                    {!isLiveEnabled && (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                                            <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center border border-white/5 text-slate-500"><Clock size={32} /></div>
                                            <h4 className="text-white font-bold text-sm">Canlı Destek Şu An Kapalı</h4>
                                            <p className="text-slate-500 text-xs leading-relaxed">Şu an aktif değiliz. Lütfen AI Asistan ile devam edin.</p>
                                            <button onClick={() => setTab("ai")} className="px-6 py-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">AI Asistana Sor</button>
                                        </div>
                                    )}
                                    {isLiveEnabled && user && liveMessages.length === 0 && <div className="flex-1 flex flex-col items-center justify-center text-center p-6"><p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Bir mesaj yazarak ekibimizle görüşmeye başlayın.</p></div>}
                                    {!isLiveEnabled && (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-700">
                                            <div className="w-20 h-20 bg-slate-900 rounded-[32px] flex items-center justify-center border border-white/5 mb-6 relative">
                                                <Clock className="text-slate-600" size={32} />
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                                </div>
                                            </div>
                                            <h3 className="text-white font-black uppercase tracking-widest mb-3">Canlı Destek Çevrimdışı</h3>
                                            <p className="text-slate-500 text-xs leading-relaxed mb-8 max-w-[220px]">
                                                Şu an canlı destek ekibimiz müsait değil. Sorununuzu bir destek talebi olarak bize iletebilirsiniz.
                                            </p>
                                            <div className="grid grid-cols-1 gap-3 w-full">
                                                <Link
                                                    href="/support/ticket"
                                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-blue-600/20"
                                                >
                                                    YENİ TALEP OLUŞTUR
                                                </Link>
                                                <Link
                                                    href="/support/my-tickets"
                                                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-white/5 transition-all"
                                                >
                                                    TALEPLERİM VE CEVAPLAR
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                    {isLiveEnabled && user && liveMessages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                            {msg.role === "agent" && (
                                                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 mr-2 mt-auto mb-1 overflow-hidden bg-slate-900">
                                                    {msg.senderImage ? (
                                                        <img src={msg.senderImage} alt={msg.senderName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Headset size={14} className="text-white" />
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex flex-col max-w-[78%]">
                                                {msg.role === "agent" && (
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">{msg.senderName}</span>
                                                )}
                                                <div className={`px-4 py-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-slate-900 border border-white/6 text-slate-300 rounded-tl-sm"}`}>
                                                    {msg.imageUrl && (
                                                        <div
                                                            className="mb-2 rounded-lg overflow-hidden border border-white/5 cursor-zoom-in group/img relative"
                                                            onClick={() => setPreviewImage(msg.imageUrl || null)}
                                                        >
                                                            <img src={msg.imageUrl} alt="Chat" className="w-full h-auto max-h-60 object-cover transition-transform group-hover/img:scale-105" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                                <ZoomIn className="text-white" size={20} />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {msg.text !== "Görsel gönderdi." && <p className="leading-relaxed">{msg.text}</p>}
                                                    <span className={`text-[9px] mt-1.5 block ${msg.role === "user" ? "text-white/40 text-right" : "text-slate-600"}`}>{msg.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {isLiveEnabled && user && (
                                    <div className="p-3 bg-slate-950/90 border-t border-white/5">
                                        <form onSubmit={handleLiveSend} className="relative">
                                            <input type="text" value={liveInput} onChange={(e) => setLiveInput(e.target.value)} placeholder="Mesajınızı yazın..." className="w-full bg-slate-900 border border-white/6 rounded-2xl px-4 py-3 pr-24 text-sm text-white outline-none" />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                                <label className="w-7 h-7 text-slate-500 hover:text-sky-400 cursor-pointer flex items-center justify-center transition-colors">
                                                    <Paperclip size={15} />
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                                </label>
                                                <button type="submit" className="w-8 h-8 bg-sky-600 text-white rounded-xl flex items-center justify-center shadow-lg"><Send size={14} /></button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <button
                onClick={toggleSupport}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl relative group ${isOpen ? "bg-red-500 rotate-[135deg]" : "bg-gradient-to-br from-blue-600 to-cyan-500 hover:scale-110"}`}
            >
                {isOpen ? <X className="text-white" size={26} /> : <MessageCircle className="text-white" size={26} />}
                {!isOpen && <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" />}
                {!isOpen && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-[#020617] rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-lg shadow-red-500/50">AI</span>}
            </button>

            <style>{`
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Image Preview Modal (Lightbox) */}
            {previewImage && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setPreviewImage(null)}
                    />
                    <div className="relative max-w-full max-h-full animate-in zoom-in-95 duration-300">
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
                        />
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-10 right-0 p-2 text-white/60 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
