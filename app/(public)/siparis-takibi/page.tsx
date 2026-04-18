"use client";

import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import { Search, Package, Truck, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function OrderTrackingPage() {
    const [orderId, setOrderId] = useState("");
    const [email, setEmail] = useState("");
    const [showStatus, setShowStatus] = useState(false);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderId && email) {
            setShowStatus(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200">
            <TopBar />
            <MainBar />
            <Head />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white mb-3">Sipariş Takibi</h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Siparişinizin durumunu öğrenmek için lütfen aşağıdaki bilgileri eksiksiz doldurunuz.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    {/* Tracking Form */}
                    <div className="bg-[#0b1220] border border-white/10 rounded-xl p-8 shadow-2xl">
                        <form onSubmit={handleTrack} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sipariş Numarası</label>
                                    <input
                                        type="text"
                                        placeholder="Örn: PX-12345"
                                        required
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">E-Posta Adresi</label>
                                    <input
                                        type="email"
                                        placeholder="ornek@mail.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/20"
                            >
                                <Search size={18} className="group-hover:scale-110 transition-transform" />
                                SİPARİŞİ SORGULA
                            </button>
                        </form>
                    </div>

                    {/* Mock Status Result */}
                    {showStatus && (
                        <div className="mt-8 animate-in">
                            <div className="bg-[#0b1220] border border-blue-500/30 rounded-xl p-8">
                                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Sipariş Durumu</div>
                                        <div className="text-xl font-bold text-blue-400 flex items-center gap-2">
                                            <Truck size={24} />
                                            Kargoya Verildi
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Tahmini Teslimat</div>
                                        <div className="text-lg font-bold text-white">21 Nisan 2024</div>
                                    </div>
                                </div>

                                {/* Tracking Steps */}
                                <div className="relative">
                                    {/* Line */}
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-800"></div>

                                    <div className="space-y-8 relative">
                                        {[
                                            { title: "Sipariş Hazırlanıyor", date: "18 Nisan 2024, 09:45", active: true, done: true, icon: <Package size={16} /> },
                                            { title: "Kargoya Verildi", date: "19 Nisan 2024, 14:20", active: true, done: true, icon: <Truck size={16} /> },
                                            { title: "Yolda", date: "Siparişiniz transfer merkezinde.", active: true, done: false, icon: <Truck size={16} /> },
                                            { title: "Teslim Edildi", date: "Henüz ulaşmadı.", active: false, done: false, icon: <CheckCircle2 size={16} /> },
                                        ].map((step, i) => (
                                            <div key={i} className={`flex gap-6 ${step.active ? 'opacity-100' : 'opacity-30'}`}>
                                                <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${step.done ? 'bg-blue-500 border-blue-500 text-white' :
                                                    step.active ? 'bg-slate-900 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-700 text-slate-500'
                                                    }`}>
                                                    {step.icon}
                                                </div>
                                                <div>
                                                    <h3 className={`font-bold text-sm ${step.active ? 'text-white' : 'text-gray-500'}`}>{step.title}</h3>
                                                    <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Section */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex gap-4 p-4 bg-slate-900/30 rounded-xl border border-white/5">
                            <AlertCircle className="text-sky-400 shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">Numaramı bulamıyorum?</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Sipariş numaranız, satın alma sonrası size gönderilen onay e-postasında yer almaktadır.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 bg-slate-900/30 rounded-xl border border-white/5">
                            <Truck className="text-sky-400 shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">Kargo Süresi</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Aynı gün kargo seçeneğiyle verilen siparişler genellikle 1-3 iş günü içinde teslim edilir.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
