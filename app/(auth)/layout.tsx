import React from "react";
import "../globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="antialiased selection:bg-sky-500/30">
        <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden font-sans">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 z-0 opacity-20" 
               style={{ backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
          
          {/* Refined Animated Orbs */}
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-sky-500/10 blur-[150px] rounded-full animate-pulse transition-all duration-1000" />
          
          {/* Interactive Glow following cursor (optional/simulated) */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />

          {/* Main Content */}
          <div className="relative z-10 w-full max-w-[440px] px-6 py-12">
            <div className="animate-in">
              {children}
            </div>
          </div>

          {/* Copyright / Brand Badge */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] opacity-40">
              Powered by TUGER Engine
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
