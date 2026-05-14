"use client";

import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    memo,
} from "react";
import {
    X,
    Minus,
    Send,
    Paperclip,
    ZoomIn,
    User,
    Headset,
    MessageSquare,
    GripVertical,
    Maximize2,
    LifeBuoy,
} from "lucide-react";
import { useChatWindows, ChatWindow, LiveSession, Ticket } from "@/context/ChatWindowContext";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
    id: string;
    sessionId?: string;
    senderName: string;
    senderRole: "USER" | "ADMIN";
    message: string;
    imageUrl?: string;
    createdAt: string;
}

// ─── Live Chat Window Content ─────────────────────────────────────────────────

const LiveChatContent = memo(({ windowId, session }: { windowId: string; session: LiveSession }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [reply, setReply] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = useCallback(async () => {
        try {
            const res = await fetch(`/api/admin/support/chat?sessionId=${session.sessionId}`);
            const data = await res.json();
            setMessages((prev) => {
                const incoming = data.messages || [];
                if (prev.length === incoming.length && incoming.length > 0) {
                    const lastPrev = prev[prev.length - 1];
                    const lastIncoming = incoming[incoming.length - 1];
                    if (lastPrev?.id === lastIncoming?.id) return prev;
                }
                return incoming;
            });
        } catch { /* silent */ }
    }, [session.sessionId]);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim()) return;
        const text = reply;
        setReply("");
        try {
            const res = await fetch("/api/admin/support/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId: session.sessionId, message: text }),
            });
            if (res.ok) {
                const data = await res.json();
                setMessages((prev) => [...prev, data.message]);
            }
        } catch { /* silent */ }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        try {
            const uploadRes = await fetch("/api/support/upload", { method: "POST", body: formData });
            const uploadData = await uploadRes.json();
            if (uploadData.url) {
                await fetch("/api/admin/support/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sessionId: session.sessionId,
                        message: "Görsel gönderdi.",
                        imageUrl: uploadData.url,
                    }),
                });
                fetchMessages();
            }
        } catch { /* silent */ }
    };

    return (
        <>
            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide"
                style={{ background: "linear-gradient(180deg, #080e1c 0%, #0c1022 100%)" }}
            >
                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full opacity-30">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Henüz mesaj yok</p>
                    </div>
                )}
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn("flex", msg.senderRole === "ADMIN" ? "justify-end" : "justify-start")}
                    >
                        {msg.senderRole === "USER" && (
                            <div className="w-6 h-6 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center shrink-0 mr-2 mt-auto">
                                <User size={11} className="text-slate-500" />
                            </div>
                        )}
                        <div className={cn(
                            "max-w-[80%] px-3 py-2 rounded-2xl text-xs",
                            msg.senderRole === "ADMIN"
                                ? "bg-blue-600 text-white rounded-tr-none"
                                : "bg-slate-900 border border-white/5 text-slate-300 rounded-tl-none"
                        )}>
                            {msg.imageUrl && (
                                <div
                                    className="mb-1.5 rounded-lg overflow-hidden cursor-zoom-in border border-white/5 group/img relative"
                                    onClick={() => setPreviewImage(msg.imageUrl || null)}
                                >
                                    <img src={msg.imageUrl} alt="" className="w-full h-auto max-h-32 object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                        <ZoomIn className="text-white" size={16} />
                                    </div>
                                </div>
                            )}
                            {msg.message !== "Görsel gönderdi." && (
                                <p className="leading-relaxed">{msg.message}</p>
                            )}
                            <span className={cn(
                                "text-[9px] mt-1 block",
                                msg.senderRole === "ADMIN" ? "text-white/40 text-right" : "text-slate-600"
                            )}>
                                {new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-2.5 border-t border-white/5 bg-[#020617]/80">
                <form onSubmit={sendReply} className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Yanıtla..."
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 pr-9 text-xs text-white outline-none focus:border-blue-500/50 transition-colors"
                        />
                        <label className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-blue-400 cursor-pointer transition-colors">
                            <Paperclip size={13} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={!reply.trim()}
                        className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-500 disabled:opacity-40 transition-all shrink-0"
                    >
                        <Send size={13} />
                    </button>
                </form>
            </div>

            {/* Image lightbox */}
            {previewImage && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        onClick={() => setPreviewImage(null)}
                    />
                    <div className="relative max-w-3xl max-h-full animate-in zoom-in-95 duration-200">
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
                        />
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-10 right-0 p-2 text-white/60 hover:text-white transition-colors"
                        >
                            <X size={22} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
});
LiveChatContent.displayName = "LiveChatContent";

// ─── Ticket Chat Window Content ───────────────────────────────────────────────

const TicketChatContent = memo(({ ticket }: { ticket: Ticket }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [reply, setReply] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = useCallback(async () => {
        try {
            const res = await fetch(`/api/admin/support/tickets?ticketId=${ticket.id}`);
            const data = await res.json();
            setMessages((prev) => {
                const incoming = data.messages || [];
                if (prev.length === incoming.length) return prev;
                return incoming;
            });
        } catch { /* silent */ }
    }, [ticket.id]);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim()) return;
        const text = reply;
        setReply("");
        try {
            const res = await fetch("/api/admin/support/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketId: ticket.id, message: text }),
            });
            if (res.ok) fetchMessages();
        } catch { /* silent */ }
    };

    const statusColor = ticket.status === "OPEN" ? "text-green-400" : "text-amber-400";

    return (
        <>
            {/* Ticket Meta */}
            <div className="px-3 py-2 bg-blue-600/5 border-b border-white/5 flex items-center gap-2">
                <span className={cn("text-[9px] font-black uppercase tracking-widest", statusColor)}>
                    {ticket.status === "OPEN" ? "YENİ" : "İŞLEMDE"}
                </span>
                <span className="text-slate-600 text-[9px]">•</span>
                <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest truncate">
                    {ticket.category} / {ticket.priority}
                </span>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide"
                style={{ background: "linear-gradient(180deg, #080e1c 0%, #0c1022 100%)" }}
            >
                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full opacity-30">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Henüz mesaj yok</p>
                    </div>
                )}
                {messages.map((msg: any) => (
                    <div
                        key={msg.id}
                        className={cn("flex flex-col", msg.role === "ADMIN" ? "items-end" : "items-start")}
                    >
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
                            {msg.senderName}
                        </span>
                        <div className={cn(
                            "max-w-[85%] px-3 py-2 rounded-2xl text-xs",
                            msg.role === "ADMIN"
                                ? "bg-blue-600 text-white rounded-tr-none"
                                : "bg-slate-900 border border-white/5 text-slate-300 rounded-tl-none"
                        )}>
                            {msg.imageUrl && (
                                <div
                                    className="mb-1.5 rounded-lg overflow-hidden cursor-zoom-in border border-white/5"
                                    onClick={() => setPreviewImage(msg.imageUrl)}
                                >
                                    <img src={msg.imageUrl} alt="" className="w-full h-auto max-h-32 object-cover" />
                                </div>
                            )}
                            <p className="leading-relaxed">{msg.message}</p>
                            <span className={cn(
                                "text-[9px] mt-1 block",
                                msg.role === "ADMIN" ? "text-white/40" : "text-slate-600"
                            )}>
                                {new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-2.5 border-t border-white/5 bg-[#020617]/80">
                <form onSubmit={sendReply} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Yanıtla..."
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!reply.trim()}
                        className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-500 disabled:opacity-40 transition-all shrink-0"
                    >
                        <Send size={13} />
                    </button>
                </form>
            </div>

            {/* Image lightbox */}
            {previewImage && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        onClick={() => setPreviewImage(null)}
                    />
                    <div className="relative max-w-3xl max-h-full animate-in zoom-in-95 duration-200">
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
                        />
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-10 right-0 p-2 text-white/60 hover:text-white"
                        >
                            <X size={22} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
});
TicketChatContent.displayName = "TicketChatContent";

// ─── Floating Chat Window ─────────────────────────────────────────────────────

const WINDOW_WIDTH = 380;
const WINDOW_HEIGHT = 480;

interface FloatingChatWindowProps {
    window: ChatWindow;
}

const MIN_WIDTH = 300;
const MIN_HEIGHT = 350;

export const FloatingChatWindow = memo(({ window: win }: FloatingChatWindowProps) => {
    const { closeWindow, focusWindow, updatePosition, updateSize, toggleMinimize } = useChatWindows();

    // Drag & Resize state
    const isDragging = useRef(false);
    const isResizing = useRef(false);
    const startPoint = useRef({ x: 0, y: 0, w: 0, h: 0 });
    const windowRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if ((e.target as HTMLElement).closest("button, input, form, label, a")) return;

            focusWindow(win.id);
            isDragging.current = true;
            startPoint.current = {
                x: e.clientX - win.position.x,
                y: e.clientY - win.position.y,
                w: 0, h: 0
            };

            const onMouseMove = (me: MouseEvent) => {
                if (!isDragging.current) return;
                const newX = Math.max(0, Math.min(me.clientX - startPoint.current.x, globalThis.window.innerWidth - win.size.width));
                const newY = Math.max(0, Math.min(me.clientY - startPoint.current.y, globalThis.window.innerHeight - 60));
                updatePosition(win.id, { x: newX, y: newY });
            };

            const onMouseUp = () => {
                isDragging.current = false;
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        },
        [win.id, win.position.x, win.position.y, win.size.width, focusWindow, updatePosition]
    );

    const handleResizeMouseDown = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();

            focusWindow(win.id);
            isResizing.current = true;
            startPoint.current = {
                x: e.clientX,
                y: e.clientY,
                w: win.size.width,
                h: win.size.height
            };

            const onMouseMove = (me: MouseEvent) => {
                if (!isResizing.current) return;

                const deltaX = me.clientX - startPoint.current.x;
                const deltaY = me.clientY - startPoint.current.y;

                const newWidth = Math.max(MIN_WIDTH, startPoint.current.w + deltaX);
                const newHeight = Math.max(MIN_HEIGHT, startPoint.current.h + deltaY);

                updateSize(win.id, {
                    width: Math.min(newWidth, globalThis.window.innerWidth - win.position.x - 20),
                    height: Math.min(newHeight, globalThis.window.innerHeight - win.position.y - 20)
                });
            };

            const onMouseUp = () => {
                isResizing.current = false;
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        },
        [win.id, win.size.width, win.size.height, win.position.x, win.position.y, focusWindow, updateSize]
    );

    const isLive = win.type === "live";

    return (
        <div
            ref={windowRef}
            className="fixed select-none"
            style={{
                left: win.position.x,
                top: win.position.y,
                width: win.size.width,
                height: win.minimized ? "auto" : win.size.height,
                zIndex: win.zIndex,
            }}
            onClick={() => focusWindow(win.id)}
        >
            {/* Window container */}
            <div
                className={cn(
                    "flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all duration-200",
                    "bg-[#0c1022] border-white/10",
                    win.minimized ? "h-auto" : "h-full",
                    "shadow-black/60"
                )}
                style={{
                    boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 32px 64px -16px rgba(0,0,0,0.8), 0 0 40px -8px rgba(37,99,235,0.15)`,
                }}
            >
                {/* ── Title Bar ── */}
                <div
                    className="flex items-center gap-2.5 px-3.5 py-3 bg-gradient-to-r from-slate-950 to-[#0c1022] border-b border-white/10 cursor-grab active:cursor-grabbing shrink-0 select-none"
                    onMouseDown={handleMouseDown}
                >
                    {/* Icon */}
                    <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                        isLive ? "bg-blue-600/20 border border-blue-500/30" : "bg-purple-600/20 border border-purple-500/30"
                    )}>
                        {isLive
                            ? <Headset size={14} className="text-blue-400" />
                            : <LifeBuoy size={14} className="text-purple-400" />
                        }
                    </div>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-bold truncate leading-tight">{win.title}</p>
                        {win.subtitle && (
                            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest truncate leading-tight mt-0.5">
                                {win.subtitle}
                            </p>
                        )}
                    </div>

                    {/* Drag grip indicator */}
                    <GripVertical size={14} className="text-slate-700 shrink-0" />

                    {/* Controls */}
                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleMinimize(win.id); }}
                            className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all"
                            title={win.minimized ? "Geri yükle" : "Küçült"}
                        >
                            {win.minimized ? <Maximize2 size={11} /> : <Minus size={11} />}
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
                            className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            title="Kapat"
                        >
                            <X size={11} />
                        </button>
                    </div>
                </div>

                {/* ── Content ── */}
                {!win.minimized && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {isLive ? (
                            <LiveChatContent
                                windowId={win.id}
                                session={win.data as LiveSession}
                            />
                        ) : (
                            <TicketChatContent ticket={win.data as Ticket} />
                        )}
                    </div>
                )}

                {/* ── Resize Handle ── */}
                {!win.minimized && (
                    <div
                        className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-end justify-end p-1 z-50 group/resize"
                        onMouseDown={handleResizeMouseDown}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover/resize:bg-blue-500 transition-colors mr-0.5 mb-0.5" />
                        <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-slate-800 rounded-br-sm opacity-50" />
                    </div>
                )}
            </div>
        </div>
    );
});
FloatingChatWindow.displayName = "FloatingChatWindow";

// ─── Container (renders all open windows) ────────────────────────────────────

export function ChatWindowsContainer() {
    const { windows } = useChatWindows();

    return (
        <>
            {windows.map((win) => (
                <FloatingChatWindow key={win.id} window={win} />
            ))}
        </>
    );
}
