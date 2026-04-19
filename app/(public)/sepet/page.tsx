"use client";

import React, { useState } from "react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import { 
    Trash2, 
    Plus, 
    Minus, 
    ChevronLeft, 
    CreditCard, 
    ShieldCheck, 
    Truck,
    ShoppingBag
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
    // Mock cart data
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
        <div className="min-h-screen bg-[#020617] text-slate-200">
            <TopBar />
            <MainBar />
            <Head />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center gap-4 mb-10">
                    <Link href="/" className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                        Sepetim <span className="text-sky-500 text-lg font-bold bg-sky-500/10 px-3 py-1 rounded-full">{cartItems.length} Ürün</span>
                    </h1>
                </div>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        
                        {/* LEFT: Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 hover:border-sky-500/20 transition-all duration-500 shadow-2xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    
                                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
                                        {/* Image */}
                                        <div className="w-32 h-32 bg-slate-950 rounded-2xl border border-white/5 flex items-center justify-center p-4 group-hover:scale-105 transition-transform duration-500">
                                            <Image src={item.image} alt={item.name} width={100} height={100} className="object-contain" />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 text-center sm:text-left">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 mb-1 block">
                                                {item.category}
                                            </span>
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{item.name}</h3>
                                            <div className="text-2xl font-black text-white">
                                                {item.price.toLocaleString("tr-TR")} ₺
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center bg-slate-950 border border-white/5 rounded-2xl p-1">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:text-sky-400 transition-colors disabled:opacity-20"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={18} />
                                                </button>
                                                <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:text-sky-400 transition-colors"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>

                                            <button 
                                                onClick={() => removeItem(item.id)}
                                                className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT: Summary Card */}
                        <div className="space-y-6">
                            <div className="bg-[#0c1022] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl sticky top-8">
                                <h2 className="text-2xl font-black mb-8 border-b border-white/5 pb-4">Sipariş Özeti</h2>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-slate-400">
                                        <span>Ara Toplam</span>
                                        <span className="text-white font-bold">{subtotal.toLocaleString("tr-TR")} ₺</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>Kargo</span>
                                        <span className={shipping === 0 ? "text-emerald-400 font-bold" : "text-white font-bold"}>
                                            {shipping === 0 ? "Ücretsiz" : `${shipping} ₺`}
                                        </span>
                                    </div>
                                    <div className="pt-4 border-t border-white/5 flex justify-between">
                                        <span className="text-xl font-bold">Toplam</span>
                                        <div className="text-right">
                                            <div className="text-3xl font-black text-sky-400">{total.toLocaleString("tr-TR")} ₺</div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">KDV DAHİL</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full relative group overflow-hidden rounded-2xl p-px transition-all active:scale-[0.98]">
                                    <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600 group-hover:bg-sky-500" />
                                    <div className="relative bg-sky-600 group-hover:bg-transparent py-5 flex items-center justify-center gap-3 font-black text-lg text-white transition-all uppercase tracking-widest">
                                        <CreditCard size={22} />
                                        ÖDEMEYE GEÇ
                                    </div>
                                </button>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-3 text-xs text-slate-400">
                                        <ShieldCheck className="text-emerald-400" size={18} />
                                        <span>Güvenli 256-bit SSL Ödeme Altyapısı</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-400">
                                        <Truck className="text-sky-400" size={18} />
                                        <span>Aynı Gün Ücretsiz Kargo (5000 ₺ ve üzeri)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="bg-[#0c1022] border border-white/5 rounded-[3rem] p-20 text-center space-y-8 animate-in shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-slate-900 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
                                <ShoppingBag size={48} className="text-slate-500" />
                            </div>
                            <h2 className="text-3xl font-black text-white">Sepetiniz Boş Görünüyor</h2>
                            <p className="text-slate-400 max-w-sm mx-auto">
                                Henüz sepetinize bir ürün eklemediniz. En yeni oyun ve konsollara göz atmaya ne dersiniz?
                            </p>
                            <div className="pt-8">
                                <Link href="/" className="inline-flex items-center gap-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-10 py-4 rounded-2xl transition-all shadow-xl shadow-sky-500/20 active:scale-95 uppercase tracking-widest text-sm">
                                    Alışverişe Başla
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
