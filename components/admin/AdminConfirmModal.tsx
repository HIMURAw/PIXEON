"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
}

export default function AdminConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Onayla",
  cancelText = "İptal",
  onConfirm,
  onCancel,
  variant = "danger"
}: AdminConfirmModalProps) {
  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: <AlertTriangle className="text-red-400" size={32} />,
      button: "bg-red-600 hover:bg-red-500 shadow-red-600/20",
      glow: "bg-red-600/10",
      border: "border-red-500/20"
    },
    warning: {
      icon: <AlertTriangle className="text-amber-400" size={32} />,
      button: "bg-amber-600 hover:bg-amber-500 shadow-amber-600/20",
      glow: "bg-amber-600/10",
      border: "border-amber-500/20"
    },
    info: {
      icon: <AlertTriangle className="text-blue-400" size={32} />,
      button: "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20",
      glow: "bg-blue-600/10",
      border: "border-blue-500/20"
    }
  };

  const currentVariant = variants[variant];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-md bg-[#0b1220] border rounded-[40px] p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300",
        currentVariant.border
      )}>
        {/* Glow Effect */}
        <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-[80px] rounded-full pointer-events-none", currentVariant.glow)} />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-6 border border-white/5 bg-white/5", currentVariant.border)}>
            {currentVariant.icon}
          </div>
          
          <h3 className="text-2xl font-black text-white tracking-tight mb-2">{title}</h3>
          <p className="text-slate-400 font-medium leading-relaxed mb-10">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              onClick={onCancel}
              className="w-full px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold rounded-2xl transition-all active:scale-95"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={cn(
                "w-full px-8 py-4 text-white font-black rounded-2xl transition-all shadow-xl active:scale-95",
                currentVariant.button
              )}
            >
              {confirmText}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
