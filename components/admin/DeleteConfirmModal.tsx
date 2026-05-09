"use client";

import React from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    loading?: boolean;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Silmek istediğinize emin misiniz?",
    description = "bu işlem geri alınamaz ve ilgili tüm veriler kalıcı olarak silinecektir.",
    loading = false
}: DeleteConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#0c1022] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
                
                <div className="p-8">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto group">
                        <Trash2 className="text-red-500 group-hover:scale-110 transition-transform" size={32} />
                    </div>

                    {/* Text */}
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                        <p className="text-sm text-slate-400 font-medium px-4">
                            {description}
                        </p>
                    </div>

                    {/* Warning Box */}
                    <div className="mt-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex items-start gap-3">
                        <AlertTriangle className="text-amber-500 shrink-0" size={18} />
                        <p className="text-[11px] font-bold text-amber-500/80 uppercase tracking-wider leading-relaxed">
                            DİKKAT: Veritabanından kalıcı olarak silinecektir.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <button 
                            onClick={onClose}
                            className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-sm transition-all border border-white/5"
                        >
                            İPTAL ET
                        </button>
                        <button 
                            disabled={loading}
                            onClick={onConfirm}
                            className={cn(
                                "px-6 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2",
                                loading ? "bg-red-900/50 text-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-500 text-white"
                            )}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "EVET, SİL"
                            )}
                        </button>
                    </div>
                </div>

                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}
