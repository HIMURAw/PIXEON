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
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "ai" | "live";

interface Message {
    id: number;
    role: "user" | "ai" | "agent";
    text: string;
    time: string;
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
    const [liveMessages, setLiveMessages] = useState<Message[]>([
        {
            id: 1,
            role: "agent",
            text: "Merhaba! Ben TUGER Destek Ekibi'nden bir yetkiliyim. Size nasıl yardımcı olabilirim?",
            time: now(),
        },
    ]);
    const [liveInput, setLiveInput] = useState("");
    const liveScrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        if (aiScrollRef.current) {
            aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight;
        }
    }, [aiMessages, isTyping]);

    useEffect(() => {
        if (liveScrollRef.current) {
            liveScrollRef.current.scrollTop = liveScrollRef.current.scrollHeight;
        }
    }, [liveMessages]);

    // ── AI Send ──────────────────────────────────────────────────────────────
    const handleAiSend = async (text?: string) => {
        const msg = (text ?? aiInput).trim();
        if (!msg || isTyping) return;

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
                {
                    id: Date.now() + 1,
                    role: "ai",
                    text: "Bağlantı hatası. Lütfen tekrar deneyin.",
                    time: now(),
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    // ── Live Send ─────────────────────────────────────────────────────────────
    const handleLiveSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!liveInput.trim()) return;

        const userMsg: Message = { id: Date.now(), role: "user", text: liveInput, time: now() };
        setLiveMessages((prev) => [...prev, userMsg]);
        setLiveInput("");

        setTimeout(() => {
            setLiveMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "agent",
                    text: "Mesajınızı aldım. En kısa sürede size dönüş yapacağız.",
                    time: now(),
                },
            ]);
        }, 1200);
    };

    // ── Reset AI ──────────────────────────────────────────────────────────────
    const resetAi = () => {
        setAiMessages([
            {
                id: 1,
                role: "ai",
                text: "👋 Merhaba! Ben **Pixeon AI Asistanı**. Kargo, iade, ödeme, garanti ve daha fazlası hakkında sorularınızı yanıtlayabilirim.\n\nSize nasıl yardımcı olabilirim?",
                time: now(),
                isMarkdown: true,
            },
        ]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {/* ── Chat Window ─────────────────────────────────────────── */}
            {isOpen && (
                <div
                    className="absolute bottom-20 right-0 w-[390px] bg-[#0c1022] border border-white/10 rounded-[28px] shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
                    style={{
                        height: "560px",
                        animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                >
                    {/* ── Header ──────────────────────────────────────── */}
                    <div className="bg-gradient-to-r from-[#1a2aff] via-[#2563eb] to-[#06b6d4] p-5 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-11 h-11 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                    {tab === "ai" ? (
                                        <Bot className="text-white" size={22} />
                                    ) : (
                                        <Headset className="text-white" size={22} />
                                    )}
                                </div>
                                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#1a40c9] animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">
                                    {tab === "ai" ? "Pixeon AI Asistanı" : "Canlı Destek"}
                                </h3>
                                <span className="text-white/65 text-[10px] font-medium uppercase tracking-wider">
                                    {tab === "ai" ? "7/24 Hizmetinizdeyim" : "Çevrimiçi · Ortalama 5 dk"}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {tab === "ai" && (
                                <button
                                    onClick={resetAi}
                                    title="Sohbeti sıfırla"
                                    className="w-8 h-8 bg-white/15 hover:bg-white/25 transition-colors rounded-xl flex items-center justify-center text-white/80 hover:text-white"
                                >
                                    <RotateCcw size={14} />
                                </button>
                            )}
                            <button
                                onClick={closeSupport}
                                className="w-8 h-8 bg-white/15 hover:bg-white/25 transition-colors rounded-xl flex items-center justify-center text-white/80 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* ── Tab Bar ─────────────────────────────────────── */}
                    <div className="flex shrink-0 bg-slate-950/80 border-b border-white/5">
                        {(["ai", "live"] as Tab[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${tab === t
                                    ? "text-blue-400 border-b-2 border-blue-500"
                                    : "text-slate-500 hover:text-slate-300 border-b-2 border-transparent"
                                    }`}
                            >
                                {t === "ai" ? (
                                    <>
                                        <Sparkles size={12} />
                                        AI Asistan
                                    </>
                                ) : (
                                    <>
                                        <Headset size={12} />
                                        Canlı Destek
                                    </>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* ── AI TAB ──────────────────────────────────────── */}
                    {tab === "ai" && (
                        <>
                            {/* Messages */}
                            <div
                                ref={aiScrollRef}
                                className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-hide"
                                style={{ background: "linear-gradient(180deg, #080e1c 0%, #0c1022 100%)" }}
                            >
                                {aiMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        {msg.role === "ai" && (
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 mr-2 mt-auto mb-1 shadow-lg shadow-blue-500/20">
                                                <Bot size={13} className="text-white" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[78%] px-4 py-3 rounded-2xl ${msg.role === "user"
                                                ? "bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-600/25"
                                                : "bg-slate-900 border border-white/6 text-slate-300 rounded-tl-sm"
                                                }`}
                                        >
                                            {msg.isMarkdown ? (
                                                <RenderText text={msg.text} />
                                            ) : (
                                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                            )}
                                            <span
                                                className={`text-[9px] mt-1.5 block ${msg.role === "user" ? "text-white/40 text-right" : "text-slate-600"}`}
                                            >
                                                {msg.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && <TypingIndicator />}

                                {/* Quick suggestions — only show after first message */}
                                {aiMessages.length === 1 && !isTyping && (
                                    <div className="pt-2 space-y-1.5">
                                        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold pl-1">
                                            Hızlı sorular
                                        </p>
                                        {QUICK_SUGGESTIONS.map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => handleAiSend(s)}
                                                className="block w-full text-left text-xs text-slate-400 bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 hover:border-blue-500/30 rounded-xl px-3 py-2.5 transition-all hover:text-slate-200"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <div className="p-3 bg-slate-950/90 border-t border-white/5 shrink-0">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleAiSend();
                                    }}
                                    className="relative"
                                >
                                    <input
                                        type="text"
                                        value={aiInput}
                                        onChange={(e) => setAiInput(e.target.value)}
                                        placeholder="Bir şey sorun..."
                                        disabled={isTyping}
                                        className="w-full bg-slate-900 border border-white/6 focus:border-blue-500/50 rounded-2xl px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-600 outline-none transition-all disabled:opacity-50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isTyping || !aiInput.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                                    >
                                        <Send size={14} />
                                    </button>
                                </form>
                                <div className="flex items-center justify-center gap-1.5 mt-2">
                                    <Sparkles size={9} className="text-blue-500/60" />
                                    <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">
                                        Pixeon AI · Kural Tabanlı Asistan
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── LIVE SUPPORT TAB ────────────────────────────── */}
                    {tab === "live" && (
                        <>
                            {/* Messages */}
                            <div
                                ref={liveScrollRef}
                                className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-hide"
                                style={{ background: "linear-gradient(180deg, #080e1c 0%, #0c1022 100%)" }}
                            >
                                {liveMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        {msg.role === "agent" && (
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-600 to-cyan-500 flex items-center justify-center shrink-0 mr-2 mt-auto mb-1 shadow-lg shadow-sky-500/20">
                                                <Headset size={12} className="text-white" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm ${msg.role === "user"
                                                ? "bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-600/25"
                                                : "bg-slate-900 border border-white/6 text-slate-300 rounded-tl-sm"
                                                }`}
                                        >
                                            <p className="leading-relaxed">{msg.text}</p>
                                            <span
                                                className={`text-[9px] mt-1.5 block ${msg.role === "user" ? "text-white/40 text-right" : "text-slate-600"}`}
                                            >
                                                {msg.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="p-3 bg-slate-950/90 border-t border-white/5 shrink-0">
                                <form onSubmit={handleLiveSend} className="relative">
                                    <input
                                        type="text"
                                        value={liveInput}
                                        onChange={(e) => setLiveInput(e.target.value)}
                                        placeholder="Mesajınızı yazın..."
                                        className="w-full bg-slate-900 border border-white/6 focus:border-sky-500/50 rounded-2xl px-4 py-3 pr-24 text-sm text-white placeholder:text-slate-600 outline-none transition-all"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <button
                                            type="button"
                                            className="w-7 h-7 text-slate-500 hover:text-sky-400 transition-colors flex items-center justify-center"
                                        >
                                            <Paperclip size={15} />
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-8 h-8 bg-sky-600 hover:bg-sky-500 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-sky-600/20 active:scale-95"
                                        >
                                            <Send size={14} />
                                        </button>
                                    </div>
                                </form>
                                <p className="text-[9px] text-center text-slate-600 mt-2 uppercase tracking-widest font-bold">
                                    Tuger Destek Ekibi · Hft İçi 09:00–18:00
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ── Bubble Button ─────────────────────────────────────────── */}
            <button
                id="support-bubble-btn"
                onClick={toggleSupport}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl relative group ${isOpen
                    ? "bg-red-500 shadow-red-500/30 rotate-[135deg]"
                    : "bg-gradient-to-br from-blue-600 to-cyan-500 shadow-blue-600/40 hover:scale-110 hover:shadow-blue-500/60"
                    }`}
                aria-label={isOpen ? "Destek panelini kapat" : "Destek panelini aç"}
            >
                {isOpen ? (
                    <X className="text-white" size={26} />
                ) : (
                    <MessageCircle className="text-white" size={26} />
                )}

                {/* Pulse ring */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" />
                )}

                {/* Unread badge */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-[#020617] rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-lg shadow-red-500/50">
                        AI
                    </span>
                )}
            </button>

            {/* ── Tooltip (when closed) ──────────────────────────────── */}
            {!isOpen && (
                <div className="absolute bottom-20 right-0 bg-slate-900 border border-white/10 text-white text-xs font-semibold px-4 py-2 rounded-2xl whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    AI Asistanla Konuş ✨
                </div>
            )}

            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    );
}
