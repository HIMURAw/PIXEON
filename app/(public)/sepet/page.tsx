"use client";

import React, { useState } from "react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import { 
    Trash2, 
    Plus, 
    Minus, 
    ChevronLeft, 
    CreditCard, 
    ShieldCheck, 
    Truck,
    ShoppingBag,
    ArrowRight,
    Zap,
    Ticket
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([
        { 
            id: 1, 
            name: "PlayStation 5 Slim Standart Edition", 
            price: 18999, 
            quantity: 1, 
            image: "/products/ps5-slim.png",
            category: "Konsollar"
        },
        { 
            id: 2, 
            name: "DualSense Kablosuz Kontrolcü - Beyaz", 
            price: 2899, 
            quantity: 2, 
            image: "/products/dualsense-white.png",
            category: "Aksesuarlar"
        }
    ]);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 5000 ? 0 : 99;
    const total = subtotal + shipping;

    const updateQuantity = (id: number, delta: number) => {
        setCartItems(prev => prev.map(item => 
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const removeItem = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <TopBar />
            <MainBar />
            <Head />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                {/* Cart Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="group p-4 bg-white/5 border border-white/5 rounded-3xl text-slate-400 hover:text-white transition-all hover:bg-blue-600 hover:border-blue-500 shadow-xl">
                            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Alışveriş Sepeti</h1>
                            <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
                                <ShoppingBag size={14} className="text-blue-400" />
                                {cartItems.length} ürün hazır ve sizi bekliyor.
                            </p>
                        </div>
                    </div>
                </div>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        
                        {/* LEFT: Items List (8 cols) */}
                        <div className="lg:col-span-8 space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="group bg-[#0b1220]/50 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 hover:border-blue-500/20 transition-all duration-500 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none group-hover:bg-blue-500/10 transition-all duration-500"></div>
                                    
                                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-10">
                                        {/* Image */}
                                        <div className="w-40 h-40 bg-slate-950 rounded-[32px] border border-white/5 flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-700 shadow-2xl">
                                            <Image src={item.image} alt={item.name} width={120} height={120} className="object-contain drop-shadow-2xl shadow-blue-500/20" />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 text-center sm:text-left space-y-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                                                {item.category}
                                            </span>
                                            <h3 className="text-xl lg:text-2xl font-black text-white leading-tight group-hover:text-blue-400 transition-colors">{item.name}</h3>
                                            <div className="text-2xl font-black text-white tracking-tighter pt-2">
                                                ₺{item.price.toLocaleString("tr-TR")}
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex flex-col sm:items-end gap-6">
                                            <div className="flex items-center bg-slate-950 border border-white/5 rounded-2xl p-1.5 shadow-inner">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:text-blue-400 transition-colors disabled:opacity-20"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={18} />
                                                </button>
                                                <span className="w-10 text-center font-black text-xl text-white">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:text-blue-400 transition-colors"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>

                                            <button 
                                                onClick={() => removeItem(item.id)}
                                                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors font-black text-[10px] uppercase tracking-widest"
                                            >
                                                <Trash2 size={16} />
                                                Ürünü Kaldır
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Cart Features */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                                {[
                                    { icon: Zap, title: "Anında Onay", desc: "Siparişin saniyeler içinde işleme alınır." },
                                    { icon: ShieldCheck, title: "Resmi Garanti", desc: "Tüm ürünler 2 yıl Sony Türkiye garantilidir." },
                                    { icon: Truck, title: "Hızlı Kargo", desc: "Bugün saat 16:00'ya kadar aynı gün kargo." },
                                ].map((feat, i) => (
                                    <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-4">
                                        <div className="p-3 bg-blue-600/10 text-blue-400 rounded-xl"><feat.icon size={20} /></div>
                                        <div>
                                            <h4 className="text-xs font-black text-white uppercase tracking-tight">{feat.title}</h4>
                                            <p className="text-[10px] text-slate-500 font-medium mt-1">{feat.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Order Summary (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-[#0b1220]/80 backdrop-blur-2xl border border-white/10 rounded-[48px] p-10 shadow-2xl sticky top-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none"></div>
                                
                                <h2 className="text-2xl font-black text-white tracking-tight mb-8">Sipariş Özeti</h2>
                                
                                <div className="space-y-5 mb-10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-bold">Ara Toplam</span>
                                        <span className="text-white font-black">₺{subtotal.toLocaleString("tr-TR")}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-bold">Kargo Bedeli</span>
                                        <span className={cn("font-black", shipping === 0 ? "text-emerald-400" : "text-white")}>
                                            {shipping === 0 ? "Ücretsiz" : `₺${shipping}`}
                                        </span>
                                    </div>
                                    
                                    {/* Coupon Input */}
                                    <div className="pt-4">
                                        <div className="relative group">
                                            <Ticket size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" />
                                            <input 
                                                type="text" 
                                                placeholder="İndirim Kuponu" 
                                                className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                                        <div>
                                            <span className="text-xs text-slate-500 font-black uppercase tracking-widest">Ödenecek Tutar</span>
                                            <div className="text-4xl font-black text-white tracking-tighter mt-1">₺{total.toLocaleString("tr-TR")}</div>
                                        </div>
                                        <p className="text-[10px] text-slate-600 font-black tracking-widest pb-1 uppercase">KDV DAHİL</p>
                                    </div>
                                </div>

                                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-6 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/30 active:scale-95 group">
                                    <CreditCard size={22} />
                                    Güvenle Öde
                                    <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                                </button>

                                <div className="mt-10 flex items-center justify-center gap-3 opacity-40">
                                    <ShieldCheck size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">256-Bit SSL Güvenlik</span>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="bg-[#0b1220]/50 backdrop-blur-xl border border-white/5 rounded-[60px] p-24 text-center space-y-10 animate-in fade-in zoom-in duration-1000 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
                        <div className="relative z-10 space-y-8">
                            <div className="w-32 h-32 bg-slate-950 border border-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-2xl group animate-bounce-slow">
                                <ShoppingBag size={56} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-white tracking-tight">Sepetin Bomboş...</h2>
                                <p className="text-xl text-slate-500 font-medium max-w-md mx-auto">
                                    En yeni maceralar ve güçlü donanımlar sizi bekliyor. Hemen keşfetmeye başlayın!
                                </p>
                            </div>
                            <div className="pt-6">
                                <Link href="/" className="inline-flex items-center gap-4 bg-blue-600 hover:bg-blue-500 text-white font-black px-12 py-5 rounded-[2rem] transition-all shadow-2xl shadow-blue-600/30 active:scale-95 uppercase tracking-widest text-sm group">
                                    Alışverişe Başla
                                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />

            <style jsx>{`
                @keyframes bounceSlow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-bounce-slow {
                    animation: bounceSlow 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
