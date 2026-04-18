"use client";

import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Image from "next/image";
import { Award, ShieldCheck, Truck, Zap, Gamepad2, Users } from "lucide-react";

export default function AboutUs() {
    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="min-h-screen bg-[#020617] text-slate-200">
                {/* Hero Section */}
                <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/products/spiderman.jpg"
                            alt="PlayStation Hero"
                            fill
                            className="object-cover opacity-30 scale-105 animate-pulse-slow"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-transparent to-[#020617]"></div>
                    </div>

                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 animate-fade-in-up">
                            OYUNUN GELECEĞİ BURADA
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-400 font-medium animate-fade-in-up delay-200">
                            PIXEON olarak, Türkiye'nin en seçkin PlayStation topluluğunu inşa ediyoruz.
                        </p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">

                    {/* Brand Story */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-bold tracking-tight">Biz Kimiz?</h2>
                            <p className="text-lg text-slate-400 leading-relaxed">
                                PIXEON, 2024 yılında oyun tutkunları tarafından oyun tutkunları için kuruldu.
                                Sadece bir mağaza değil, PlayStation ekosisteminin kalbinde yer alan bir teknoloji merkeziyiz.
                                En yeni konsolları, en heyecan verici oyunları ve özel aksesuarları en hızlı şekilde sizlere ulaştırmayı görev edindik.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div className="space-y-2 border-l-2 border-sky-500 pl-4">
                                    <span className="text-3xl font-bold text-sky-400">10k+</span>
                                    <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Mutlu Oyuncu</p>
                                </div>
                                <div className="space-y-2 border-l-2 border-blue-500 pl-4">
                                    <span className="text-3xl font-bold text-blue-400">5k+</span>
                                    <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Ürün Çeşidi</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative aspect-square rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-sky-500/10">
                            <Image
                                src="/products/ps5.png"
                                alt="Gaming"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-transparent to-transparent opacity-60"></div>
                        </div>
                    </section>

                    {/* Why Us? */}
                    <section className="space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl font-bold tracking-tight">Neden PIXEON?</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                                PlayStation deneyiminizi mükemmelleştirmek için buradayız. İşte bizi farklı kılan özelliklerimiz:
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Award className="w-8 h-8 text-sky-400" />,
                                    title: "Yetkili Satış",
                                    desc: "Tüm ürünlerimiz %100 orijinal ve resmi distribütör garantilidir."
                                },
                                {
                                    icon: <Truck className="w-8 h-8 text-blue-400" />,
                                    title: "Hızlı Teslimat",
                                    desc: "Aynı gün kargo ve İstanbul içi hızlı teslimat seçenekleri."
                                },
                                {
                                    icon: <ShieldCheck className="w-8 h-8 text-sky-400" />,
                                    title: "Güvenli Alışveriş",
                                    desc: "En üst düzey güvenlik protokolleri ile huzurlu bir alışveriş deneyimi."
                                },
                                {
                                    icon: <Zap className="w-8 h-8 text-blue-400" />,
                                    title: "En Yeni Teknolojiler",
                                    desc: "PS5 Pro, VR2 ve en yeni özel sürümler her zaman ilk bizde."
                                },
                                {
                                    icon: <Users className="w-8 h-8 text-sky-400" />,
                                    title: "Uzman Destek",
                                    desc: "Oyun dünyasına hakim uzman ekibimizle her zaman yanınızdayız."
                                },
                                {
                                    icon: <Gamepad2 className="w-8 h-8 text-blue-400" />,
                                    title: "Oyuncu Dostu",
                                    desc: "Topluluk etkinlikleri, turnuvalar ve özel indirim fırsatları."
                                }
                            ].map((item, i) => (
                                <div key={i} className="group p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-800/80 hover:border-sky-500/50 transition-all duration-300">
                                    <div className="mb-6 p-4 bg-slate-950 rounded-xl w-fit group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Mission Section */}
                    <section className="relative py-24 px-8 md:px-16 bg-gradient-to-br from-blue-900/20 to-sky-900/20 rounded-[40px] border border-slate-800 overflow-hidden">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-sky-500/10 blur-[100px] rounded-full"></div>
                        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full"></div>

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-6">
                                <h2 className="text-4xl font-bold">Misyonumuz</h2>
                                <p className="text-lg text-slate-300 leading-relaxed">
                                    Türkiye'deki PlayStation ekosistemini güçlendirmek ve her seviyeden oyuncuya kusursuz bir deneyim sunmak. Teknolojinin sınırlarını zorlayan ürünleri, samimi bir hizmet anlayışıyla birleştiriyoruz.
                                </p>
                                <div className="pt-4">
                                    <button className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-sky-500/20">
                                        MAĞAZAYI KEŞFET
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-6 bg-slate-950/40 backdrop-blur-md border border-slate-700/50 rounded-2xl">
                                    <h4 className="font-bold mb-2">Vizyonumuz</h4>
                                    <p className="text-sm text-slate-400 text-justify">Bölgenin en güvenilir ve yenilikçi oyun perakendecisi olmak.</p>
                                </div>
                                <div className="p-6 bg-slate-950/40 backdrop-blur-md border border-slate-700/50 rounded-2xl">
                                    <h4 className="font-bold mb-2">Değerlerimiz</h4>
                                    <p className="text-sm text-slate-400 text-justify">Dürüstlük, tutku, mükemmeliyetçilik ve topluluk odaklılık.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                .animate-pulse-slow {
                    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(1.05);
                    }
                    50% {
                        opacity: 0.4;
                        transform: scale(1.1);
                    }
                }
                .delay-200 {
                    animation-delay: 0.2s;
                }
            `}</style>
        </>
    );
}
