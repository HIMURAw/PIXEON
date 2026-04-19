import React from "react";
import "../globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="antialiased">
        <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md p-4">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tighter mb-2">
              TUGER
            </h1>
            <p className="text-slate-400 text-sm font-medium">PlayStation Store & Beyond</p>
          </div>
          {children}
        </div>
      </div>

      {/* Footer Text */}
      <div className="absolute bottom-6 left-0 w-full text-center text-slate-500 text-xs font-medium uppercase tracking-widest opacity-50">
        © 2026 TUGER Gaming Store
      </div>
    </div>
  );
}
