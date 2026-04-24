"use client";

import React, { useState } from "react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, ShieldCheck, Headphones, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function IletisimPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => setSent(false), 4000);
        setForm({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <TopBar />
            <MainBar />
            <Head />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-16">
                {/* Hero Section */}
                <div className="relative rounded-[40px] overflow-hidden bg-[#020617] border border-white/5 p-12 lg:p-20 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
                    
                    <div className="relative z-10 max-w-2xl space-y-8">
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                            <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/20">
                                Destek Merkezi
                            </span>
                        </div>
                        <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tight">
                            Bize Her Zaman <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-600">Ulaşabilirsiniz</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed">
                            Satış öncesi sorularınız, teknik destek talepleriniz veya önerileriniz için buradayız. PIXEON ekibi size yardımcı olmaktan mutluluk duyar.
                        </p>
                    </div>

                    <div className="relative z-10 hidden lg:flex items-center justify-center">
                        <div className="w-80 h-80 bg-gradient-to-tr from-blue-600 to-sky-400 rounded-full blur-[100px] opacity-20 absolute animate-pulse"></div>
                        <Headphones size={240} className="text-white/10 rotate-6" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Sidebar: Info Cards */}
                    <div className="space-y-6">
                        {[
                            {
                                icon: Phone,
                                title: "Telefon",
                                lines: ["+90 552 833 08 83"],
                                sub: "Hafta içi 09:00 – 18:00",
                                color: "text-blue-400",
                                bg: "bg-blue-400/10"
                            },
                            {
                                icon: Mail,
                                title: "E-posta",
                                lines: ["destek@pixeon.com.tr"],
                                sub: "Ort. yanıt süresi: 2 saat",
                                color: "text-purple-400",
                                bg: "bg-purple-400/10"
                            },
                            {
                                icon: MapPin,
                                title: "Merkez Ofis",
                                lines: ["Bağcılar Mah. No:12", "İstanbul, Türkiye"],
                                sub: "Ziyaret için randevu alınız",
                                color: "text-emerald-400",
                                bg: "bg-emerald-400/10"
                            },
                            {
                                icon: Clock,
                                title: "Çalışma Saatleri",
                                lines: ["Pzt – Cmt: 09:00 – 20:00"],
                                sub: "Pazar: 10:00 – 18:00",
                                color: "text-amber-400",
                                bg: "bg-amber-400/10"
                            },
                        ].map((card, i) => (
                            <div key={i} className="group bg-[#0b1220]/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 hover:border-blue-500/30 transition-all duration-500">
                                <div className="flex items-start gap-5">
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 shadow-inner", card.bg, card.color)}>
                                        <card.icon size={22} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{card.title}</p>
                                        {card.lines.map((l, j) => (
                                            <p key={j} className="text-base font-bold text-white tracking-tight">{l}</p>
                                        ))}
                                        <p className="text-xs text-slate-500 font-medium">{card.sub}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main: Contact Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#0b1220]/50 backdrop-blur-md border border-white/5 rounded-[40px] p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full -mr-32 -mt-32"></div>
                            
                            <div className="relative z-10 mb-10">
                                <h2 className="text-2xl font-black text-white tracking-tight">Hızlı İletişim Formu</h2>
                                <p className="text-slate-500 text-sm mt-2">Mesajınızı bırakın, ekibimiz 24 saat içinde size dönüş yapsın.</p>
                            </div>

                            {sent && (
                                <div className="mb-8 animate-in zoom-in duration-300 flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-4 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-500/10">
                                    <ShieldCheck size={20} />
                                    Mesajınız başarıyla iletildi! En kısa sürede sizinle iletişime geçeceğiz.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Ad Soyad</label>
                                        <input
                                            required
                                            value={form.name}
                                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                            type="text"
                                            placeholder="Tam adınız"
                                            className="w-full bg-slate-950/50 text-white border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500/50 transition-all text-sm placeholder:text-slate-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">E-posta Adresi</label>
                                        <input
                                            required
                                            value={form.email}
                                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                            type="email"
                                            placeholder="ornek@alanadi.com"
                                            className="w-full bg-slate-950/50 text-white border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500/50 transition-all text-sm placeholder:text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Konu Başlığı</label>
                                    <select
                                        required
                                        value={form.subject}
                                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                                        className="w-full bg-slate-950/50 text-white border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500/50 transition-all text-sm cursor-pointer"
                                    >
                                        <option value="" disabled className="bg-slate-950">Seçim yapın...</option>
                                        <option value="siparis" className="bg-slate-950">Sipariş Süreçleri</option>
                                        <option value="iade" className="bg-slate-950">İade & İptal İşlemleri</option>
                                        <option value="teknik" className="bg-slate-950">Teknik Destek</option>
                                        <option value="oneri" className="bg-slate-950">Öneri & İş Birliği</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Mesajınız</label>
                                    <textarea
                                        required
                                        value={form.message}
                                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                        rows={5}
                                        placeholder="Size nasıl yardımcı olabiliriz?"
                                        className="w-full bg-slate-950/50 text-white border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500/50 transition-all text-sm placeholder:text-slate-700 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-10 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 active:scale-95 group"
                                >
                                    Mesajı Gönder
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                        
                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Güvenli İletişim</h4>
                                    <p className="text-[10px] text-slate-500 uppercase font-black">256-Bit SSL Şifreleme</p>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                                    <MessageSquare size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Canlı Destek</h4>
                                    <p className="text-[10px] text-slate-500 uppercase font-black">Çok Yakında Sizlerle</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
