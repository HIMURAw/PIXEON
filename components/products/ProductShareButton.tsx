"use client";

import React, { useState, useEffect, useRef } from "react";
import { Share2, Copy, Check, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

interface ProductShareButtonProps {
    productName: string;
    className?: string;
}

export default function ProductShareButton({ productName, className }: ProductShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getShareUrl = () => {
        if (typeof window !== "undefined") {
            return window.location.href;
        }
        return "";
    };

    const handleCopy = async () => {
        const url = getShareUrl();
        if (!url) return;

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("Ürün bağlantısı kopyalandı!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Bağlantı kopyalanamadı.");
        }
    };

    const shareOptions = [
        {
            name: "Bağlantıyı Kopyala",
            icon: copied ? <Check size={16} className="text-green-400 animate-in zoom-in duration-300" /> : <Copy size={16} />,
            action: handleCopy,
            className: "text-slate-300 hover:text-white hover:bg-white/5"
        },
        {
            name: "WhatsApp",
            icon: (
                <svg className="w-4 h-4 fill-current text-emerald-500" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.148 5.148 0 11.5 0c3.078.001 5.97 1.2 8.138 3.37C21.8 5.54 23 8.43 23 11.5c-.004 6.351-5.148 11.5-11.5 11.5-2.001-.001-3.97-.52-5.765-1.512L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.925 1.451 5.403.002 9.799-4.394 9.802-9.797.001-2.618-1.017-5.08-2.868-6.932C16.6 2.025 14.135 1.002 11.5 1.002c-5.403 0-9.8 4.394-9.803 9.798-.001 1.874.5 3.707 1.452 5.31l-.994 3.633 3.722-.976zm11.233-6.046c-.29-.145-1.716-.848-1.982-.945-.267-.097-.461-.146-.656.145-.195.29-.757.945-.928 1.139-.17.194-.341.218-.631.073-.29-.145-1.226-.452-2.336-1.442-.864-.77-1.447-1.721-1.617-2.011-.17-.29-.018-.447.127-.591.13-.13.29-.34.436-.509.145-.17.194-.291.291-.485.097-.194.049-.364-.025-.509-.073-.146-.656-1.579-.9-2.172-.236-.57-.478-.493-.656-.5-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8 1.02-.275.945-1.05 2.33-1.05 2.524 0 .195.195.388.293.486.097.097 1.83 2.793 4.432 3.916.619.267 1.1.427 1.478.547.621.197 1.185.169 1.631.102.497-.074 1.716-.701 1.958-1.378.243-.678.243-1.258.17-1.378-.073-.121-.267-.194-.558-.339z"/>
                </svg>
            ),
            action: () => {
                const text = encodeURIComponent(`PIXEON'da harika bir ürün buldum! ${productName}: ${getShareUrl()}`);
                window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
            },
            className: "text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10"
        },
        {
            name: "Telegram",
            icon: <Send size={16} className="text-sky-400" />,
            action: () => {
                const url = encodeURIComponent(getShareUrl());
                const text = encodeURIComponent(`PIXEON'da harika bir ürün buldum! ${productName}`);
                window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
            },
            className: "text-slate-300 hover:text-sky-400 hover:bg-sky-500/10"
        },
        {
            name: "X / Twitter",
            icon: (
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
            ),
            action: () => {
                const url = encodeURIComponent(getShareUrl());
                const text = encodeURIComponent(`PIXEON'da harika bir ürün buldum! ${productName}`);
                window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
            },
            className: "text-slate-300 hover:text-white hover:bg-white/5"
        }
    ];

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl transition-all border border-white/10 bg-white/5 text-white hover:bg-white/10 font-black text-sm uppercase italic tracking-tighter cursor-pointer"
            >
                <Share2 size={20} className={isOpen ? "animate-pulse text-blue-400" : ""} />
                ÜRÜNÜ PAYLAŞ
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute bottom-full left-0 right-0 mb-3 bg-[#0b1220]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-2 z-[100] flex flex-col gap-1"
                    >
                        <div className="px-3 py-2 border-b border-white/5">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Paylaşım Kanalları</span>
                        </div>
                        {shareOptions.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    option.action();
                                    if (option.name !== "Bağlantıyı Kopyala") {
                                        setIsOpen(false);
                                    }
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-xs font-bold text-left cursor-pointer ${option.className}`}
                            >
                                <span className="shrink-0">{option.icon}</span>
                                <span className="flex-1">{option.name}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
