"use client";

import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";

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
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-10">
                {/* Page Header */}
                <div>
                    <h1 className="text-xl font-semibold text-white">İletişim</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Sorularınız için bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Info Cards */}
                    <div className="flex flex-col gap-4">
                        {[
                            {
                                icon: <Phone size={20} className="text-blue-400" />,
                                title: "Telefon",
                                lines: ["+90 552 833 08 83"],
                                sub: "Hafta içi 09:00 – 18:00",
                            },
                            {
                                icon: <Mail size={20} className="text-blue-400" />,
                                title: "E-posta",
                                lines: ["destek@pixeon.com.tr"],
                                sub: "Ort. yanıt süresi: 2 saat",
                            },
                            {
                                icon: <MapPin size={20} className="text-blue-400" />,
                                title: "Adres",
                                lines: ["Bağcılar Mah. No:12", "İstanbul, Türkiye"],
                                sub: "Ziyaret için randevu alınız",
                            },
                            {
                                icon: <Clock size={20} className="text-blue-400" />,
                                title: "Çalışma Saatleri",
                                lines: ["Pzt – Cmt: 09:00 – 20:00"],
                                sub: "Pazar: 10:00 – 18:00",
                            },
                        ].map((card, i) => (
                            <div key={i} className="bg-[#0b1220] border border-white/10 rounded-xl p-4 hover:border-blue-400/20 transition">
                                <div className="flex items-start gap-4">
                                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-400/20 flex items-center justify-center shrink-0">
                                        {card.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{card.title}</p>
                                        {card.lines.map((l, j) => (
                                            <p key={j} className="text-sm text-white font-medium">{l}</p>
                                        ))}
                                        <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-[#0b1220] border border-white/10 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-5">Bize Mesaj Gönderin</h2>

                        {sent && (
                            <div className="mb-5 flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm">
                                ✅ Mesajınız iletildi! En kısa sürede dönüş yapacağız.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">Ad Soyad</label>
                                    <input
                                        required
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        type="text"
                                        placeholder="Adınız Soyadınız"
                                        className="w-full bg-[#060d1f] text-white border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400/60 transition text-sm placeholder:text-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">E-posta</label>
                                    <input
                                        required
                                        value={form.email}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        type="email"
                                        placeholder="ornek@mail.com"
                                        className="w-full bg-[#060d1f] text-white border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400/60 transition text-sm placeholder:text-gray-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">Konu</label>
                                <select
                                    required
                                    value={form.subject}
                                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                                    className="w-full bg-[#060d1f] text-white border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400/60 transition text-sm"
                                >
                                    <option value="" disabled>Konu seçin...</option>
                                    <option value="siparis">Sipariş Hakkında</option>
                                    <option value="iade">İade & Değişim</option>
                                    <option value="teknik">Teknik Destek</option>
                                    <option value="oneri">Öneri & Şikayet</option>
                                    <option value="diger">Diğer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">Mesajınız</label>
                                <textarea
                                    required
                                    value={form.message}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                    rows={6}
                                    placeholder="Mesajınızı buraya yazın..."
                                    className="w-full bg-[#060d1f] text-white border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400/60 transition text-sm placeholder:text-gray-600 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="cursor-pointer flex items-center gap-2 border border-blue-400 text-blue-400 font-bold px-6 py-2 rounded-full hover:bg-blue-400 hover:text-white transition text-sm"
                            >
                                <Send size={14} />
                                Gönder
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
