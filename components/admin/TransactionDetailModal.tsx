"use client";

import React from "react";
import { X, User, Mail, Wallet, Calendar, DollarSign, ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: any;
}

export default function TransactionDetailModal({ isOpen, onClose, transaction }: TransactionDetailModalProps) {
    if (!isOpen || !transaction) return null;

    const formattedDate = new Date(transaction.createdAt).toLocaleString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
            
            {/* Modal Box */}
            <div className="relative w-full max-w-lg bg-[#020617] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600 rounded-xl text-white">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white">İşlem Detayı</h2>
                            <p className="text-xs text-blue-400 font-bold tracking-wider mt-0.5">{transaction.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    {/* User and Status */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-blue-400 font-bold text-sm">
                                {(transaction.user?.name || "B")[0].toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">{transaction.user?.name || "Bilinmeyen Kullanıcı"}</h3>
                                <p className="text-[10px] text-slate-500 font-medium">{transaction.user?.email || "E-posta yok"}</p>
                            </div>
                        </div>
                        <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                            transaction.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            transaction.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                            transaction.status === "FAILED" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                            "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        )}>
                            {transaction.status === "COMPLETED" ? "Tamamlandı" :
                             transaction.status === "PENDING" ? "Bekliyor" :
                             transaction.status === "FAILED" ? "Başarısız" : "İade Edildi"}
                        </span>
                    </div>

                    {/* Stats table */}
                    <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={14} className="text-slate-600" />
                                İşlem Tarihi
                            </span>
                            <span className="font-bold text-white">{formattedDate}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                <Wallet size={14} className="text-slate-600" />
                                Ödeme Yöntemi
                            </span>
                            <span className="font-bold text-white">{transaction.method || "Kredi Kartı"}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                <ExternalLink size={14} className="text-slate-600" />
                                İlişkili Sipariş
                            </span>
                            <span className="font-bold text-blue-400">
                                {transaction.order?.orderNumber || "Mevcut Değil"}
                            </span>
                        </div>
                        <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                            <span className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                <DollarSign size={14} className="text-slate-600" />
                                Ödenen Tutar
                            </span>
                            <span className="text-xl font-black text-white">₺{transaction.amount?.toLocaleString("tr-TR")}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-white/5 bg-slate-950/40 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-900 text-slate-400 font-bold rounded-xl hover:bg-slate-850 hover:text-white transition-all text-xs"
                    >
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
}
