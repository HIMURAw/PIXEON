"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, ShoppingBag, Truck, Calendar, ShieldCheck, Loader2 } from "lucide-react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "PX-GECERSIZ-SIPARIS";

  // Generate today's date in Turkish format
  const today = new Date().toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="max-w-2xl mx-auto bg-[#0b1220]/50 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 lg:p-12 shadow-2xl relative overflow-hidden text-center space-y-8 animate-in">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none"></div>

      {/* Success Icon */}
      <div className="relative">
        <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-inner relative z-10 animate-pulse">
          <CheckCircle2 size={48} className="text-emerald-400" />
        </div>
        <div className="absolute inset-0 w-32 h-32 bg-emerald-500/10 blur-[30px] rounded-full mx-auto -mt-4 opacity-50 z-0"></div>
      </div>

      {/* Message */}
      <div className="space-y-3">
        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/20">
          ÖDEME ONAYLANDI
        </span>
        <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
          Siparişiniz Alındı!
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Tebrikler! Efsanevi donanım ve oyun siparişiniz sisteme başarıyla kaydedildi. Detaylar aşağıda listelenmiştir.
        </p>
      </div>

      {/* Details Box */}
      <div className="bg-[#020617] border border-white/5 rounded-2xl p-6 text-left grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Truck size={12} className="text-slate-500" />
            Sipariş Numarası
          </p>
          <p className="text-sm font-mono font-bold text-sky-400">{orderNumber}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Calendar size={12} className="text-slate-500" />
            Sipariş Tarihi
          </p>
          <p className="text-sm font-bold text-white">{today}</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-left text-xs text-slate-400 bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-2">
        <h4 className="font-bold text-white uppercase text-[10px] tracking-wider">Sonraki Adımlar:</h4>
        <ul className="list-disc list-inside space-y-1 text-slate-400">
          <li>Siparişinizin durumunu dilediğiniz zaman aşağıdaki takip linki ile sorgulayabilirsiniz.</li>
          <li>Kargo takip numaranız, paketiniz yola çıktığında SMS ve E-posta olarak iletilecektir.</li>
          <li>Havale/EFT seçeneğini kullandıysanız, ödemeniz onaylandıktan sonra sipariş hazırlık sürecine geçilecektir.</li>
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link 
          href={`/siparis-takibi?orderNumber=${orderNumber}`} 
          className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-6 rounded-2xl border border-white/10 hover:border-white/20 transition flex items-center justify-center gap-2 group text-xs uppercase tracking-wider"
        >
          Siparişi Takip Et
          <Truck size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
        
        <Link 
          href="/" 
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2 group text-xs uppercase tracking-wider shadow-lg shadow-blue-500/10"
        >
          Alışverişe Devam Et
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <TopBar />
      <MainBar />
      <Head />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <Suspense fallback={
          <div className="max-w-2xl mx-auto text-center py-20 bg-[#0b1220]/50 rounded-[40px] border border-white/10">
            <Loader2 size={40} className="animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Sipariş Bilgileri Yükleniyor...</p>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
