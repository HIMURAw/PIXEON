"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertCircle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationProps {
  id: string;
  type: NotificationType;
  message: string;
  onClose: (id: string) => void;
}

export function AdminNotification({ id, type, message, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    success: <CheckCircle2 className="text-emerald-400" size={20} />,
    error: <XCircle className="text-red-400" size={20} />,
    warning: <AlertCircle className="text-amber-400" size={20} />,
    info: <Info className="text-blue-400" size={20} />,
  };

  const colors = {
    success: "border-emerald-500/20 bg-emerald-500/5 shadow-emerald-500/10",
    error: "border-red-500/20 bg-red-500/5 shadow-red-500/10",
    warning: "border-amber-500/20 bg-amber-500/5 shadow-amber-500/10",
    info: "border-blue-500/20 bg-blue-500/5 shadow-blue-500/10",
  };

  return (
    <div className={cn(
      "pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl animate-in slide-in-from-right fade-in duration-500",
      colors[type]
    )}>
      <div className="shrink-0">{icons[type]}</div>
      <p className="text-sm font-bold text-slate-200 tracking-tight">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="ml-4 p-1 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"
      >
        <X size={16} />
      </button>
    </div>
  );
}

interface NotificationContainerProps {
  notifications: { id: string; type: NotificationType; message: string }[];
  onClose: (id: string) => void;
}

export function AdminNotificationContainer({ notifications, onClose }: NotificationContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-8 right-8 z-[999] flex flex-col-reverse gap-4 pointer-events-none max-w-md w-full">
      {notifications.map((n) => (
        <AdminNotification key={n.id} {...n} onClose={onClose} />
      ))}
    </div>,
    document.body
  );
}
