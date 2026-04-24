"use client";

import React, { useState } from "react";
import "../globals.css";
import Link from "next/link";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Bell,
    Search,
    FileSpreadsheet,
    TicketPlus,
    Menu,
    Gamepad2,
    Disc,
    Headset,
    CreditCard,
    Layers,
    Wallet,
    Truck,
    MessageSquare,
    LifeBuoy,
    MonitorPlay,
    Image,
    FileText,
    PenTool,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuGroups = [
        {
            title: "GENEL",
            items: [
                { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
                { label: "Raporlar & Analiz", icon: FileSpreadsheet, href: "/admin/reports" },
            ]
        },
        {
            title: "KATALOG YÖNETİMİ",
            items: [
                { label: "Tüm Ürünler", icon: Package, href: "/admin/products" },
                { label: "Konsollar", icon: Gamepad2, href: "/admin/products?category=consoles" },
                { label: "Oyunlar", icon: Disc, href: "/admin/products?category=games" },
                { label: "Aksesuarlar", icon: Headset, href: "/admin/products?category=accessories" },
                { label: "Dijital Kodlar", icon: CreditCard, href: "/admin/products?category=codes" },
                { label: "Kategoriler", icon: Layers, href: "/admin/categories" },
            ]
        },
        {
            title: "SATIŞ & OPERASYON",
            items: [
                { label: "Siparişler", icon: ShoppingCart, href: "/admin/orders" },
                { label: "Ödemeler", icon: Wallet, href: "/admin/payments" },
                { label: "Kuponlar", icon: TicketPlus, href: "/admin/coupons" },
                { label: "Kargo Ayarları", icon: Truck, href: "/admin/shipping" },
            ]
        },
        {
            title: "MÜŞTERİLER",
            items: [
                { label: "Müşteri Listesi", icon: Users, href: "/admin/customers" },
                { label: "Yorum & Değerlendirme", icon: MessageSquare, href: "/admin/reviews" },
                { label: "Destek Talepleri", icon: LifeBuoy, href: "/admin/support" },
            ]
        },
        {
            title: "İÇERİK YÖNETİMİ",
            items: [
                { label: "Slider / Hero", icon: MonitorPlay, href: "/admin/content/slider" },
                { label: "Kampanya Bannerları", icon: Image, href: "/admin/content/banners" },
                { label: "Sayfalar (CMS)", icon: FileText, href: "/admin/content/pages" },
                { label: "Blog Yazıları", icon: PenTool, href: "/admin/content/blog" },
            ]
        },
        {
            title: "AYARLAR",
            items: [
                { label: "Genel Ayarlar", icon: Settings, href: "/admin/settings" },
                { label: "Admin Kullanıcıları", icon: ShieldCheck, href: "/admin/settings/admins" },
            ]
        }
    ];

    return (
        <html lang="en">
            <body className="antialiased">
                <div className="min-h-screen bg-slate-950 text-slate-200 flex">

                    {/* SIDEBAR */}
                    <aside className={cn(
                        "bg-[#020617] border-r border-white/10 transition-all duration-300 flex flex-col",
                        isSidebarOpen ? "w-64" : "w-20"
                    )}>
                        {/* Logo Section */}
                        <div className="h-20 flex items-center px-6 border-b border-white/10">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-white">
                                P
                            </div>
                            {isSidebarOpen && (
                                <span className="ml-3 font-bold text-xl tracking-tight text-white">TUGER<span className="text-blue-500">.</span></span>
                            )}
                        </div>

                        {/* Nav Links */}
                        <nav className="flex-1 py-6 px-3 space-y-8 overflow-y-auto custom-scrollbar">
                            {menuGroups.map((group) => (
                                <div key={group.title} className="space-y-2">
                                    {isSidebarOpen && (
                                        <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                                            {group.title}
                                        </h3>
                                    )}
                                    <div className="space-y-1">
                                        {group.items.map((item) => (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all group relative"
                                            >
                                                <item.icon size={18} className="group-hover:text-blue-400 transition-colors" />
                                                {isSidebarOpen && <span className="font-medium text-xs">{item.label}</span>}
                                                {!isSidebarOpen && (
                                                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 border border-white/10 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                                        {item.label}
                                                    </div>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>

                        {/* Logout / Footer */}
                        <div className="p-4 border-t border-white/10">
                            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-all">
                                <LogOut size={20} />
                                {isSidebarOpen && <span className="font-medium text-sm">Çıkış Yap</span>}
                            </button>
                        </div>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

                        {/* Header */}
                        <header className="h-20 bg-[#020617]/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-8 shrink-0">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-400"
                                >
                                    <Menu size={20} />
                                </button>

                                <div className="relative hidden md:block w-72">
                                    <input
                                        type="text"
                                        placeholder="Hızlı arama..."
                                        className="w-full bg-slate-900 border border-white/5 rounded-full px-4 py-2 pl-10 text-sm outline-none focus:border-blue-500 transition"
                                    />
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                                    <Bell size={20} />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                                </button>

                                <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-bold text-white">Admin User</p>
                                        <p className="text-xs text-slate-500">Yönetici</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 border-2 border-[#020617] shadow-lg"></div>
                                </div>
                            </div>
                        </header>

                        {/* Content Area (Scrollable) */}
                        <main className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}
