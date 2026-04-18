"use client";

import { useState } from "react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import {
    User,
    ShoppingBag,
    MapPin,
    Settings,
    LogOut,
    ChevronRight,
    Package,
    Clock,
    CheckCircle2,
    CreditCard,
    Heart
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type TabType = "dashboard" | "orders" | "addresses" | "profile" | "favorites";

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState<TabType>("dashboard");

    const menuItems = [
        { id: "dashboard", label: "Genel Bakış", icon: <User size={20} /> },
        { id: "orders", label: "Siparişlerim", icon: <ShoppingBag size={20} /> },
        { id: "addresses", label: "Adreslerim", icon: <MapPin size={20} /> },
        { id: "favorites", label: "Favorilerim", icon: <Heart size={20} /> },
        { id: "profile", label: "Profil Ayarları", icon: <Settings size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200">
            <TopBar />
            <MainBar />
            <Head />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* SIDEBAR */}
                    <aside className="w-full lg:w-72 shrink-0">
                        <div className="bg-[#0c1022] border border-slate-800 rounded-3xl overflow-hidden sticky top-8">
                            {/* User Info Brief */}
                            <div className="p-6 border-b border-slate-800 bg-gradient-to-br from-blue-900/20 to-transparent">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center font-bold text-slate-950 text-xl">
                                        JD
                                    </div>
                                    <div>
                                        <h3 className="font-bold">John Doe</h3>
                                        <p className="text-xs text-slate-400">john.doe@example.com</p>
                                    </div>
                                </div>
                            </div>

                            {/* Nav Items */}
                            <nav className="p-2">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id as TabType)}
                                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group ${activeTab === item.id
                                                ? "bg-sky-500 text-slate-950 font-bold shadow-lg shadow-sky-500/20"
                                                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </div>
                                        <ChevronRight size={16} className={`${activeTab === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`} />
                                    </button>
                                ))}

                                <div className="mt-4 pt-4 border-t border-slate-800">
                                    <button className="w-full flex items-center gap-3 px-4 py-3.5 text-red-400 hover:bg-red-400/10 rounded-2xl transition-all">
                                        <LogOut size={20} />
                                        <span>Çıkış Yap</span>
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-[#0c1022] border border-slate-800 rounded-[32px] p-6 md:p-10 min-h-[600px] shadow-2xl">
                            {activeTab === "dashboard" && <DashboardView setActiveTab={setActiveTab} />}
                            {activeTab === "orders" && <OrdersView />}
                            {activeTab === "addresses" && <AddressesView />}
                            {activeTab === "profile" && <ProfileView />}
                            {activeTab === "favorites" && <FavoritesView />}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

function DashboardView({ setActiveTab }: { setActiveTab: (tab: TabType) => void }) {
    return (
        <div className="space-y-10 animate-in">
            <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Hoş Geldin, John! 👋</h1>
                <p className="text-slate-400">Hesap özetin ve son aktivitelerin burada yer alır.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-4">
                    <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-2xl flex items-center justify-center">
                        <Package size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-sm text-slate-400">Toplam Sipariş</div>
                    </div>
                </div>
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-4">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center">
                        <Clock size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">1</div>
                        <div className="text-sm text-slate-400">Yoldaki Sipariş</div>
                    </div>
                </div>
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-4">
                    <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center">
                        <Heart size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">5</div>
                        <div className="text-sm text-slate-400">Favori Ürün</div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Son Siparişin</h2>
                    <button onClick={() => setActiveTab("orders")} className="text-sky-400 text-sm font-semibold hover:underline">Tümünü Gör</button>
                </div>

                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center p-2">
                        <Image src="/products/ps5-slim.png" alt="Product" width={80} height={80} className="object-contain" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="text-xs text-sky-400 font-bold uppercase tracking-widest mb-1">Teslim Edildi</div>
                        <h3 className="font-bold text-lg">PlayStation 5 Slim Standart Edition</h3>
                        <p className="text-sm text-slate-400">Sipariş No: #PX-98231 • 12 Nisan 2024</p>
                    </div>
                    <div className="text-xl font-black text-white">
                        18.999 TL
                    </div>
                </div>
            </div>
        </div>
    );
}

function OrdersView() {
    const orders = [
        { id: "#PX-98231", date: "12 Nisan 2024", total: "18.999 TL", status: "Teslim Edildi", items: "1 Ürün" },
        { id: "#PX-97512", date: "05 Mart 2024", total: "1.249 TL", status: "Teslim Edildi", items: "1 Ürün" },
        { id: "#PX-96104", date: "22 Ocak 2024", total: "3.499 TL", status: "Teslim Edildi", items: "1 Ürün" },
    ];

    return (
        <div className="space-y-8 animate-in">
            <div>
                <h2 className="text-2xl font-black mb-2">Siparişlerim</h2>
                <p className="text-slate-400">Geçmişten bugüne tüm siparişlerinizi buradan takip edebilirsiniz.</p>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="group p-6 bg-slate-900/30 border border-slate-800 rounded-3xl hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-slate-500">
                                <Package size={24} />
                            </div>
                            <div>
                                <div className="font-bold">{order.id}</div>
                                <div className="text-sm text-slate-500">{order.date}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-12">
                            <div className="hidden md:block">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Miktar</div>
                                <div className="font-medium">{order.items}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Durum</div>
                                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                    <CheckCircle2 size={14} />
                                    {order.status}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Toplam</div>
                                <div className="font-black text-lg">{order.total}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AddressesView() {
    return (
        <div className="space-y-8 animate-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black mb-2">Adreslerim</h2>
                    <p className="text-slate-400">Teslimat ve fatura adreslerinizi yönetin.</p>
                </div>
                <button className="px-5 py-2.5 bg-sky-500 text-slate-950 font-bold rounded-2xl hover:bg-sky-400 transition-all">
                    Yeni Adres Ekle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-900/30 border-2 border-sky-500/30 rounded-3xl relative">
                    <div className="absolute top-6 right-6 px-2 py-1 bg-sky-500 text-[10px] font-black text-slate-950 rounded uppercase tracking-tighter">Varsayılan</div>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <MapPin size={18} className="text-sky-500" />
                        Ev Adresim
                    </h3>
                    <div className="text-slate-400 text-sm leading-relaxed space-y-1">
                        <p className="font-bold text-slate-200">John Doe</p>
                        <p>Atatürk Mah. İstiklal Cad. No:123 Daire:5</p>
                        <p>Ataşehir / İSTANBUL</p>
                        <p>+90 532 000 00 00</p>
                    </div>
                    <div className="mt-6 flex gap-4">
                        <button className="text-sky-400 text-sm font-bold hover:underline">Düzenle</button>
                        <button className="text-red-400 text-sm font-bold hover:underline">Sil</button>
                    </div>
                </div>

                <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-3xl hover:border-slate-700 transition-all border-dashed flex items-center justify-center">
                    <p className="text-slate-500 font-medium">Başka bir kayıtlı adresiniz bulunmuyor.</p>
                </div>
            </div>
        </div>
    );
}

function ProfileView() {
    return (
        <div className="space-y-10 animate-in">
            <div>
                <h2 className="text-2xl font-black mb-2">Profil Ayarları</h2>
                <p className="text-slate-400">Kişisel bilgilerinizi ve şifrenizi güncelleyin.</p>
            </div>

            <form className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400">Ad Soyad</label>
                        <input type="text" defaultValue="John Doe" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 outline-none focus:border-sky-500 transition" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400">E-posta</label>
                        <input type="email" defaultValue="john.doe@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 outline-none focus:border-sky-500 transition" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Telefon</label>
                    <input type="tel" defaultValue="+90 532 000 00 00" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 outline-none focus:border-sky-500 transition" />
                </div>

                <div className="pt-4 space-y-4">
                    <h3 className="text-lg font-bold">Şifre Değiştir</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400">Yeni Şifre</label>
                            <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 outline-none focus:border-sky-500 transition" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400">Şifre Tekrar</label>
                            <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 outline-none focus:border-sky-500 transition" />
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <button type="button" className="px-8 py-3 bg-sky-500 text-slate-950 font-black rounded-2xl hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20">
                        DEĞİŞİKLİKLERİ KAYDET
                    </button>
                </div>
            </form>
        </div>
    );
}

function FavoritesView() {
    return (
        <div className="space-y-8 animate-in">
            <div>
                <h2 className="text-2xl font-black mb-2">Favorilerim</h2>
                <p className="text-slate-400">Beğendiğiniz ürünlere buradan hızlıca ulaşın.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[
                    { id: 1, name: "Marvel's Spider-Man 2", price: "1.499 TL", img: "/products/spiderman-2.png" },
                    { id: 2, name: "DualSense Edge", price: "7.499 TL", img: "/products/dualsense-white.png" }
                ].map((item) => (
                    <div key={item.id} className="p-4 bg-slate-900/30 border border-slate-800 rounded-3xl hover:border-sky-500/30 transition-all group">
                        <div className="relative aspect-square bg-slate-950 rounded-2xl mb-4 p-4 flex items-center justify-center overflow-hidden">
                            <Image src={item.img} alt={item.name} width={150} height={150} className="object-contain group-hover:scale-110 transition-transform duration-500" />
                            <button className="absolute top-3 right-3 p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all">
                                <Heart size={16} fill="currentColor" />
                            </button>
                        </div>
                        <h3 className="font-bold text-sm mb-1">{item.name}</h3>
                        <div className="text-sky-400 font-black">{item.price}</div>
                        <button className="w-full mt-4 py-2.5 bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-xs font-bold rounded-xl transition-all">
                            SEPETE EKLE
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
