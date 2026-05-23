"use client";

import React, { useState, useEffect } from "react";
import "../globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    ShieldCheck,
    User,
    Info,
    ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationProvider } from "@/context/NotificationContext";
import { ChatWindowProvider } from "@/context/ChatWindowContext";
import { ChatWindowsContainer } from "@/components/admin/FloatingChatWindow";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { Toaster } from "react-hot-toast";

const menuGroups = [
    {
        title: "GENEL",
        items: [
            { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
            { label: "Bildirimler", icon: Bell, href: "/admin/notifications" },
            { label: "Raporlar & Analiz", icon: FileSpreadsheet, href: "/admin/reports" },
        ]
    },
    {
        title: "KATALOG YÖNETİMİ",
        items: [
            { label: "Tüm Ürünler", icon: Package, href: "/admin/products" },
            { label: "Konsollar", icon: Gamepad2, href: "/admin/products?category=konsollar" },
            { label: "Oyunlar", icon: Disc, href: "/admin/products?category=oyunlar" },
            { label: "Aksesuarlar", icon: Headset, href: "/admin/products?category=aksesuarlar" },
            { label: "Dijital Kodlar", icon: CreditCard, href: "/admin/products?category=dijital-kodlar" },
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
            { label: "Hakkımızda", icon: Info, href: "/admin/content/about" },
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (window.innerWidth >= 768) {
            setIsSidebarOpen(true);
        }
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (pathname && user) {
            const activeGroup = menuGroups.find(group =>
                group.items.some(item => {
                    const itemPath = item.href.split("?")[0];
                    const currentPath = pathname.split("?")[0];
                    return currentPath === itemPath || currentPath.startsWith(itemPath + "/");
                })
            );
            if (activeGroup) {
                setOpenGroups(prev => ({
                    ...prev,
                    [activeGroup.title]: true
                }));
            }
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            }
        }
    }, [pathname, user]);

    const toggleGroup = (title: string) => {
        setOpenGroups(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    // Yetki Kontrolü
    const filteredMenuGroups = menuGroups.filter(group => {
        if (!user) return false;
        const role = user.adminRole || user.role;
        
        if (role === "Süper Admin") return true; // Her şeyi görür
        
        if (role === "Editör") {
            return ["GENEL", "KATALOG YÖNETİMİ", "SATIŞ & OPERASYON", "MÜŞTERİLER", "İÇERİK YÖNETİMİ"].includes(group.title);
        }
        
        if (role === "Moderatör") {
            return ["GENEL", "MÜŞTERİLER", "İÇERİK YÖNETİMİ"].includes(group.title);
        }
        
        if (role === "Destek") {
            return ["MÜŞTERİLER"].includes(group.title);
        }
        
        return false;
    });

    return (
        <html lang="en">
            <body className="antialiased">
                <ChatWindowProvider>
                <NotificationProvider>
                <Toaster position="top-right" />
                <div className="min-h-screen bg-slate-950 text-slate-200 flex">
                    {/* MOBILE SIDEBAR BACKDROP */}
                    {isSidebarOpen && (
                        <div 
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden animate-in fade-in duration-200"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}

                    {/* SIDEBAR */}
                    <aside className={cn(
                        "bg-[#020617] border-r border-white/10 transition-all duration-300 flex flex-col z-50",
                        "fixed inset-y-0 left-0 w-64 md:static md:translate-x-0",
                        isSidebarOpen ? "translate-x-0 md:w-64" : "-translate-x-full md:w-20"
                    )}>
                        {/* Logo Section */}
                        <div className="h-16 md:h-20 flex items-center px-6 border-b border-white/10 shrink-0">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-white">
                                P
                            </div>
                            {isSidebarOpen && (
                                <span className="ml-3 font-bold text-xl tracking-tight text-white">TUGER<span className="text-blue-500">.</span></span>
                            )}
                        </div>

                        {/* Nav Links */}
                        <nav className="flex-1 py-4 md:py-6 px-3 space-y-4 md:space-y-6 overflow-y-auto custom-scrollbar">
                            {filteredMenuGroups.map((group) => {
                                const isOpen = isSidebarOpen || !!openGroups[group.title];
                                return (
                                    <div key={group.title} className="space-y-2">
                                        {isSidebarOpen && (
                                            <button
                                                onClick={() => toggleGroup(group.title)}
                                                className="w-full flex items-center justify-between px-3 text-[10px] font-bold text-slate-500 hover:text-slate-200 uppercase tracking-widest transition-colors select-none text-left focus:outline-none group/btn"
                                            >
                                                <span>{group.title}</span>
                                                <ChevronDown
                                                    size={12}
                                                    className={cn(
                                                        "transition-transform duration-200 text-slate-600 group-hover/btn:text-slate-300",
                                                        isOpen ? "rotate-0" : "-rotate-90"
                                                    )}
                                                />
                                            </button>
                                        )}
                                        <div className={cn(
                                            "space-y-1 transition-all duration-300 ease-in-out overflow-hidden",
                                            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                                        )}>
                                            {group.items.map((item) => (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    className="flex items-center gap-3 px-3 py-1.5 md:py-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all group relative"
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
                                );
                            })}
                        </nav>

                        {/* Logout / Footer */}
                        <div className="p-4 border-t border-white/10 shrink-0">
                            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-all text-xs font-semibold">
                                <LogOut size={18} />
                                {isSidebarOpen && <span className="font-medium text-sm">Çıkış Yap</span>}
                            </button>
                        </div>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

                        {/* Header */}
                        <header className="h-16 md:h-20 bg-[#020617]/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-40">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-400"
                                    aria-label="Menü"
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

                            <div className="flex items-center gap-4 md:gap-6">
                                <NotificationBell />

                                <div className="flex items-center gap-2 md:gap-3 border-l border-white/10 pl-4 md:pl-6">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-bold text-white">
                                            {user?.name || "Yükleniyor..."}
                                        </p>
                                        <p className="text-xs text-slate-500">{user?.adminRole || "Yetkili Yönetici"}</p>
                                    </div>
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-900 border-2 border-[#020617] shadow-lg overflow-hidden shrink-0">
                                        {user?.image ? (
                                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-600/10 text-blue-400">
                                                <User size={16} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Content Area (Scrollable) */}
                        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950/50">
                            {children}
                        </main>
                    </div>
                </div>
                </NotificationProvider>
                <ChatWindowsContainer />
                </ChatWindowProvider>
            </body>
        </html>
    );
}

