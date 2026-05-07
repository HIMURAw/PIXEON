"use client";

import React, { useState } from "react";
import { 
    Send, 
    CheckCircle2, 
    ArrowLeft,
    LifeBuoy,
    Clock,
    ShieldCheck,
    MessageSquare
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";

const CATEGORIES = [
    { id: "technical", name: "Teknik Destek" },
    { id: "billing", name: "Ödeme & Fatura" },
    { id: "account", name: "Hesap İşlemleri" },
    { id: "other", name: "Diğer" },
];

export default function CreateTicketPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        subject: "",
        category: "technical",
        priority: "LOW",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/support/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push("/"), 3000);
            } else {
                const data = await res.json();
                setError(data.error || "Hata oluştu.");
            }
        } catch (err) {
            setError("Bağlantı hatası.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md bg-slate-900 border border-white/5 rounded-3xl p-10 text-center shadow-xl">
                    <CheckCircle2 className="text-blue-500 mx-auto mb-6" size={56} />
                    <h2 className="text-xl font-bold text-white mb-3">Talebiniz Alındı</h2>
                    <p className="text-slate-500 text-sm mb-8">En kısa sürede tarafınıza dönüş yapılacaktır.</p>
                    <Link href="/" className="text-blue-500 font-bold text-sm hover:underline">Anasayfaya Dön</Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 border-b border-white/5 pb-12">
                    <div className="max-w-2xl">
                        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 text-sm">
                            <ArrowLeft size={16} /> Geri Dön
                        </Link>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Destek Talebi Oluştur</h1>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Müşteri hizmetlerimiz şu an yoğun olabilir. Sorununuzu detaylıca iletirseniz, uzman ekibimiz en kısa sürede size dönüş yapacaktır.
                        </p>
                    </div>
                    <div className="hidden lg:flex items-center gap-4">
                        <div className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500"><ShieldCheck size={20} /></div>
                            <div><p className="text-white text-xs font-bold">Güvenli Destek</p><p className="text-slate-500 text-[10px]">SSL Korumalı</p></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
                    {/* Form Area */}
                    <div className="bg-slate-900/30 border border-white/5 rounded-[32px] p-8 lg:p-10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 ml-1">Konu Başlığı</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        placeholder="Kısaca belirtin..."
                                        className="w-full bg-[#020617] border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-slate-700 outline-none focus:border-blue-500/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 ml-1">Kategori</label>
                                    <select 
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="w-full bg-[#020617] border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.id} className="bg-[#020617]">{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 ml-1">Öncelik</label>
                                <div className="flex gap-2">
                                    {["LOW", "MEDIUM", "HIGH"].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setFormData({...formData, priority: p})}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                                                formData.priority === p 
                                                ? "bg-blue-600 border-blue-600 text-white" 
                                                : "bg-transparent border-white/10 text-slate-500 hover:border-white/20"
                                            }`}
                                        >
                                            {p === "LOW" ? "Düşük" : p === "MEDIUM" ? "Orta" : "Yüksek"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 ml-1">Mesajınız</label>
                                <textarea 
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    rows={8}
                                    placeholder="Lütfen sorununuzu detaylı bir şekilde açıklayın..."
                                    className="w-full bg-[#020617] border border-white/10 rounded-2xl px-5 py-5 text-sm text-white placeholder:text-slate-700 outline-none focus:border-blue-500/50 transition-all resize-none"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-5 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-blue-600/10"
                            >
                                {loading ? "GÖNDERİLİYOR..." : <>TALEP OLUŞTUR <Send size={16} /></>}
                            </button>
                        </form>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6">
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Clock size={16} className="text-blue-500" /> Çalışma Saatleri
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs"><span className="text-slate-500">Hafta İçi</span><span className="text-white">09:00 - 18:00</span></div>
                                <div className="flex justify-between text-xs"><span className="text-slate-500">Cumartesi</span><span className="text-white">10:00 - 14:00</span></div>
                                <div className="flex justify-between text-xs"><span className="text-slate-500">Pazar</span><span className="text-red-500">Kapalı</span></div>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6">
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                <LifeBuoy size={16} className="text-blue-500" /> Bilgilendirme
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                Destek talepleriniz en geç 24 saat içerisinde incelenir ve hesabınıza kayıtlı e-posta adresi üzerinden bilgilendirme yapılır.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
