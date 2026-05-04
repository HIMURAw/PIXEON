"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationType = "success" | "error" | "info";

interface NotificationToastProps {
    message: string;
    type?: NotificationType;
    onClose: () => void;
}

export function NotificationToast({ message, type = "success", onClose }: NotificationToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        error: "bg-red-500/10 border-red-500/20 text-red-400",
        info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    };

    const Icon = type === "success" ? CheckCircle2 : type === "error" ? X : AlertCircle;

    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-5 duration-300 pointer-events-none">
            <div className={cn(
                "px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-4 min-w-[300px] max-w-[500px] pointer-events-auto",
                styles[type]
            )}>
                <Icon size={20} className="shrink-0" />
                <span className="font-black text-sm uppercase tracking-widest">{message}</span>
                <button onClick={onClose} className="ml-auto opacity-60 hover:opacity-100 transition-opacity">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}

interface ConfirmModalProps {
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({
    title,
    description,
    confirmLabel = "Onayla",
    cancelLabel = "İptal",
    destructive = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                onClick={onCancel}
            />
            <div className="relative w-full max-w-md bg-[#0b1220] border border-white/10 rounded-[36px] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200">
                <div className="space-y-3">
                    <h3 className="text-xl font-black text-white">{title}</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{description}</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={cn(
                            "flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95",
                            destructive
                                ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20"
                                : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
                        )}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Convenience hook for managing notification state
export function useNotification() {
    const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);

    const show = (message: string, type: NotificationType = "success") => {
        setNotification({ message, type });
    };

    const hide = () => setNotification(null);

    return { notification, show, hide };
}
