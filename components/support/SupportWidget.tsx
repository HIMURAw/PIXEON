"use client";

import { useSupport } from "@/context/SupportContext";
import { MessageCircle, X, Send, User, Headset, Image as ImageIcon, Paperclip } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function SupportWidget() {
    const { isOpen, toggleSupport, closeSupport } = useSupport();
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([
        { id: 1, type: "agent", text: "Merhaba! Ben TUGER Destek Asistanı. Size nasıl yardımcı olabilirim?", time: "02:30" }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage = { id: Date.now(), type: "user", text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setChat([...chat, newMessage]);
        setMessage("");

        // Mock Agent Reply
        setTimeout(() => {
            setChat(prev => [...prev, {
                id: Date.now() + 1,
                type: "agent",
                text: "Mesajınızı aldım. Hemen bir yetkiliye aktarıyorum, lütfen bekleyin.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {/* CHAT WINDOW */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[380px] h-[520px] bg-[#0c1022] border border-white/10 rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                <Headset className="text-white" size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">Canlı Destek</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-white/70 text-[10px] font-medium uppercase tracking-wider">Çevrimiçi</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={closeSupport} className="text-white/80 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-[url('/grid-pattern.png')] bg-fixed">
                        {chat.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.type === "user"
                                        ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/20"
                                        : "bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none"
                                    }`}>
                                    <p className="leading-relaxed">{msg.text}</p>
                                    <span className={`text-[10px] mt-1 block ${msg.type === "user" ? "text-white/50" : "text-slate-500"}`}>
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-slate-950 border-t border-white/5">
                        <form onSubmit={handleSend} className="relative">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Mesajınızı yazın..."
                                className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-3.5 pr-14 text-sm text-white outline-none focus:border-blue-500 transition"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <button type="button" className="p-2 text-slate-500 hover:text-sky-400 transition-colors">
                                    <Paperclip size={18} />
                                </button>
                                <button type="submit" className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/20">
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                        <p className="text-[10px] text-center text-slate-600 mt-3 font-medium uppercase tracking-widest">
                            TUGER DESTEK EKİBİ
                        </p>
                    </div>
                </div>
            )}

            {/* BUBBLE BUTTON */}
            <button
                onClick={toggleSupport}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl relative ${isOpen ? "bg-red-500 rotate-90" : "bg-blue-600 hover:bg-blue-500 hover:scale-110"
                    }`}
            >
                {isOpen ? <X className="text-white" size={28} /> : <MessageCircle className="text-white" size={28} />}

                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-[#020617] rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                        1
                    </span>
                )}
            </button>
        </div>
    );
}
