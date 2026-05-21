"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import {
    User,
    ShoppingBag,
    MapPin,
    Settings,
    LogOut,
    ChevronRight,
    Package,
    Clock,
    ShoppingCart,
    CreditCard,
    Heart,
    Star,
    Bell,
    ShieldCheck,
    Truck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { uploadProfilePicture, updateUserProfile, getUserAddresses, addAddress, deleteAddress, setDefaultAddress } from "@/lib/actions/user-actions";
import { Camera, Plus } from "lucide-react";
import { NotificationToast, ConfirmModal } from "@/components/ui/Feedback";
import type { NotificationType } from "@/components/ui/Feedback";
import { getWishlist, toggleWishlist } from "@/lib/actions/wishlist-actions";
import toast from "react-hot-toast";
import { getUserOrders } from "@/lib/actions/order-actions";

const getStatusInfo = (status: string) => {
    switch (status) {
        case "PENDING":
            return { 
                label: "Onay Bekliyor", 
                color: "text-amber-400", 
                bulletBg: "bg-amber-500 shadow-amber-500/20" 
            };
        case "PREPARING":
            return { 
                label: "Hazırlanıyor", 
                color: "text-blue-400", 
                bulletBg: "bg-blue-500 shadow-blue-500/20" 
            };
        case "SHIPPED":
            return { 
                label: "Kargoya Verildi", 
                color: "text-purple-400", 
                bulletBg: "bg-purple-500 shadow-purple-500/20" 
            };
        case "COMPLETED":
            return { 
                label: "Teslim Edildi", 
                color: "text-emerald-400", 
                bulletBg: "bg-emerald-500 shadow-emerald-500/20" 
            };
        case "CANCELLED":
            return { 
                label: "İptal Edildi", 
                color: "text-red-400", 
                bulletBg: "bg-red-500 shadow-red-500/20" 
            };
        default:
            return { 
                label: "Bilinmiyor", 
                color: "text-slate-400", 
                bulletBg: "bg-slate-500 shadow-slate-500/20" 
            };
    }
};

type TabType = "dashboard" | "orders" | "addresses" | "profile" | "favorites";

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState<TabType>("dashboard");
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);
    const router = useRouter();

    const showNotification = (message: string, type: NotificationType = "success") => {
        setNotification({ message, type });
    };

    const formatPhoneNumber = (value: string) => {
        const digits = value.replace(/\D/g, "");
        // Remove 90 if it exists at the start to handle it cleanly
        let core = digits;
        if (digits.startsWith("90")) core = digits.slice(2);

        // Limit to 10 digits (Turkish numbers are 10 digits after +90)
        core = core.slice(0, 10);

        let formatted = "+90";
        if (core.length > 0) formatted += " " + core.slice(0, 3);
        if (core.length > 3) formatted += " " + core.slice(3, 6);
        if (core.length > 6) formatted += " " + core.slice(6, 8);
        if (core.length > 8) formatted += " " + core.slice(8, 10);

        return formatted;
    };

    const fetchOrders = async (userId: string) => {
        setOrdersLoading(true);
        try {
            const res = await getUserOrders(userId);
            if (res.success && res.orders) {
                setOrders(res.orders);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setOrdersLoading(false);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                if (data.success) {
                    setUser(data.user);
                    fetchOrders(data.user.id);
                } else {
                    router.push("/login");
                }
            } catch (err) {
                console.error("User fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/");
            router.refresh();
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const menuItems = [
        { id: "dashboard", label: "Genel Bakış", icon: User },
        { id: "orders", label: "Siparişlerim", icon: ShoppingBag },
        { id: "addresses", label: "Adreslerim", icon: MapPin },
        { id: "favorites", label: "Favorilerim", icon: Heart },
        { id: "profile", label: "Profil Ayarları", icon: Settings },
    ];

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-400 font-black">YÜKLENİYOR...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <TopBar />
            <MainBar />
            <Head />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Hesabım</h1>
                        <p className="text-slate-500 mt-2 font-medium">Hoş geldin, <span className="text-blue-400">{user?.name}</span>. Buradan tüm işlemlerini yönetebilirsin.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* SIDEBAR */}
                    <aside className="w-full lg:w-80 shrink-0">
                        <div className="bg-[#0b1220]/50 backdrop-blur-xl border border-white/5 rounded-[40px] overflow-hidden sticky top-8 shadow-2xl">
                            {/* User Profile Card */}
                            <div className="p-8 border-b border-white/5 bg-gradient-to-br from-blue-600/10 to-transparent">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000"></div>
                                        <div className="relative w-20 h-20 bg-slate-950 rounded-full border-2 border-white/10 overflow-hidden flex items-center justify-center font-black text-white text-2xl uppercase">
                                            {user?.image ? (
                                                <Image src={user.image} alt={user.name} fill className="object-cover" />
                                            ) : (
                                                user?.name?.substring(0, 2) || "PX"
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl text-white tracking-tight">{user?.name}</h3>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Premium Üye</p>
                                    </div>
                                </div>
                            </div>

                            {/* Nav Items */}
                            <nav className="p-4 space-y-2">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id as TabType)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-6 py-4 rounded-3xl transition-all duration-300 group",
                                            activeTab === item.id
                                                ? "bg-blue-600 text-white font-black shadow-xl shadow-blue-600/20"
                                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <item.icon size={20} className={cn("transition-colors", activeTab === item.id ? "text-white" : "text-slate-600 group-hover:text-blue-400")} />
                                            <span className="text-sm tracking-tight">{item.label}</span>
                                        </div>
                                        <ChevronRight size={18} className={cn("transition-all", activeTab === item.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0")} />
                                    </button>
                                ))}

                                {user?.role === "ADMIN" && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="w-full flex items-center justify-between px-6 py-4 rounded-3xl transition-all duration-300 group text-amber-400 hover:bg-amber-400/10 mb-2"
                                    >
                                        <div className="flex items-center gap-4">
                                            <ShieldCheck size={20} className="text-amber-500" />
                                            <span className="text-sm font-black tracking-tight">Admin Paneli</span>
                                        </div>
                                        <ChevronRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                )}

                                <div className="mt-6 pt-6 border-t border-white/5">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-4 px-6 py-4 text-red-400 hover:bg-red-400/10 rounded-3xl transition-all font-bold group"
                                    >
                                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                                        <span className="text-sm">Güvenli Çıkış</span>
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-[#0b1220]/30 backdrop-blur-md border border-white/5 rounded-[48px] p-8 lg:p-12 min-h-[700px] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none"></div>

                            {activeTab === "dashboard" && (
                                <DashboardView 
                                    user={user} 
                                    orders={orders} 
                                    loading={ordersLoading} 
                                    setActiveTab={setActiveTab} 
                                />
                            )}
                            {activeTab === "orders" && (
                                <OrdersView 
                                    orders={orders} 
                                    loading={ordersLoading} 
                                />
                            )}
                            {activeTab === "addresses" && <AddressesView user={user} showNotification={showNotification} formatPhone={formatPhoneNumber} />}
                            {activeTab === "profile" && <ProfileView user={user} setUser={setUser} showNotification={showNotification} formatPhone={formatPhoneNumber} />}
                            {activeTab === "favorites" && <FavoritesView userId={user?.id} />}
                        </div>
                    </main>
                </div>
            </div>

            {notification && (
                <NotificationToast
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <Footer />
        </div>
    );
}

function DashboardView({ 
    user, 
    orders, 
    loading, 
    setActiveTab 
}: { 
    user: any; 
    orders: any[]; 
    loading: boolean; 
    setActiveTab: (tab: TabType) => void; 
}) {
    return (
        <div className="space-y-12 animate-in fade-in duration-700 relative z-10">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-3">Genel Bakış</h2>
                <p className="text-slate-500 font-medium leading-relaxed">Hesabındaki son aktiviteleri ve istatistiklerini buradan takip edebilirsin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: "Siparişler", value: loading ? "..." : orders.length.toString(), icon: Package, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { label: "Favoriler", value: user?.wishlistCount || "0", icon: Heart, color: "text-red-400", bg: "bg-red-400/10" },
                    { label: "Cüzdan", value: "₺250", icon: CreditCard, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                ].map((stat, i) => (
                    <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-[40px] hover:border-white/10 transition-all group">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500", stat.bg, stat.color)}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white tracking-tighter">{stat.value}</div>
                            <div className="text-xs text-slate-500 font-black uppercase tracking-widest mt-1">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-white tracking-tight">Son Siparişin</h2>
                    <button onClick={() => setActiveTab("orders")} className="text-blue-400 text-xs font-black uppercase tracking-widest hover:text-blue-300 transition-colors">Tümünü Gör →</button>
                </div>

                {loading ? (
                    <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[40px] text-center text-slate-400 font-bold uppercase tracking-wider text-xs">
                        Sipariş yükleniyor...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[40px] text-center text-slate-500 font-medium">
                        Henüz siparişiniz bulunmamaktadır.
                    </div>
                ) : (
                    (() => {
                        const lastOrder = orders[0];
                        const dateFormatted = new Date(lastOrder.createdAt).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        });
                        const totalFormatted = lastOrder.totalAmount.toLocaleString("tr-TR", {
                            style: "currency",
                            currency: "TRY"
                        });
                        const statusInfo = getStatusInfo(lastOrder.status);
                        
                        const firstItem = lastOrder.items?.[0];
                        const productImage = firstItem?.productImage || "/products/placeholder.png";
                        const productName = firstItem?.productName || "Sipariş Ögeleri";
                        const otherItemsCount = (lastOrder.items?.length || 1) - 1;
                        const displayName = otherItemsCount > 0 ? `${productName} (+${otherItemsCount} ürün)` : productName;

                        return (
                            <div className="group p-8 bg-white/[0.03] border border-white/5 rounded-[40px] hover:border-blue-500/30 transition-all duration-500 flex flex-col md:flex-row items-center gap-10">
                                <div className="w-32 h-32 bg-slate-950 rounded-[32px] overflow-hidden border border-white/5 flex items-center justify-center p-4 shadow-2xl group-hover:scale-105 transition-transform duration-500 relative">
                                    <img src={productImage} alt={productName} className="object-contain max-h-full max-w-full" />
                                </div>
                                <div className="flex-1 text-center md:text-left space-y-2">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                        <span className={cn("px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-widest", 
                                            lastOrder.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            lastOrder.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                            lastOrder.status === "PREPARING" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                            lastOrder.status === "SHIPPED" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                            "bg-red-500/10 text-red-400 border-red-500/20"
                                        )}>
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                    <h3 className="font-black text-xl text-white tracking-tight">{displayName}</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Sipariş No: #{lastOrder.orderNumber} • {dateFormatted}</p>
                                </div>
                                <div className="flex flex-col items-center md:items-end gap-2">
                                    <div className="text-2xl font-black text-white tracking-tighter">{totalFormatted}</div>
                                    <Link href={`/siparis-takibi?orderNumber=${lastOrder.orderNumber}`} className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline">
                                        Detayları Gör
                                    </Link>
                                </div>
                            </div>
                        );
                    })()
                )}
            </div>
        </div>
    );
}

function OrdersView({ orders, loading }: { orders: any[]; loading: boolean }) {
    if (loading) {
        return (
            <div className="space-y-12 animate-in fade-in duration-700 relative z-10">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-3">Sipariş Geçmişi</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">Geçmişten bugüne tüm satın alımlarını buradan takip edebilirsin.</p>
                </div>
                <div className="text-center py-12 text-slate-400 font-bold uppercase tracking-wider text-xs">Siparişler yükleniyor...</div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="space-y-12 animate-in fade-in duration-700 relative z-10">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-3">Sipariş Geçmişi</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">Geçmişten bugüne tüm satın alımlarını buradan takip edebilirsin.</p>
                </div>
                <div className="py-20 text-center bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[48px] space-y-6">
                    <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-white/5 text-slate-700">
                        <ShoppingBag size={40} />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                        <h3 className="text-xl font-black text-white">Henüz Siparişiniz Yok</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">Harika oyun ve donanımları keşfetmek için hemen alışverişe başla!</p>
                    </div>
                    <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
                        Alışverişe Başla
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700 relative z-10">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-3">Sipariş Geçmişi</h2>
                <p className="text-slate-500 font-medium leading-relaxed">Geçmişten bugüne tüm satın alımlarını buradan takip edebilirsin.</p>
            </div>

            <div className="space-y-6">
                {orders.map((order) => {
                    const dateFormatted = new Date(order.createdAt).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    });
                    
                    const totalFormatted = order.totalAmount.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY"
                    });

                    const statusInfo = getStatusInfo(order.status);
                    const itemCount = (order.items || []).reduce((acc: number, item: any) => acc + item.quantity, 0);

                    return (
                        <div key={order.id} className="group p-8 bg-white/[0.02] border border-white/5 rounded-[40px] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-white/5 flex items-center justify-center text-slate-600 group-hover:text-blue-400 transition-colors shadow-2xl">
                                    <Package size={32} />
                                </div>
                                <div>
                                    <div className="text-lg font-black text-white tracking-tight">{order.orderNumber}</div>
                                    <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{dateFormatted}</div>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-12 lg:gap-20">
                                <div className="hidden sm:block">
                                    <div className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-2">Miktar</div>
                                    <div className="text-sm font-bold text-slate-300">{itemCount} Ürün</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-2">Durum</div>
                                    <div className={cn("flex items-center gap-2 text-xs font-black uppercase tracking-widest", statusInfo.color)}>
                                        <div className={cn("w-2 h-2 rounded-full animate-pulse shadow-lg", statusInfo.bulletBg)}></div>
                                        {statusInfo.label}
                                    </div>
                                </div>
                                <div className="md:text-right">
                                    <div className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-2">Toplam Tutar</div>
                                    <div className="text-xl font-black text-white tracking-tighter">{totalFormatted}</div>
                                </div>
                            </div>
                            <Link href={`/siparis-takibi?orderNumber=${order.orderNumber}`} className="p-3 bg-white/5 border border-white/5 rounded-2xl text-slate-500 hover:text-white hover:bg-blue-600 transition-all flex items-center justify-center">
                                <ChevronRight size={20} />
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function AddressesView({ user, showNotification, formatPhone }: { user: any, showNotification: (m: string, t?: any) => void, formatPhone: (v: string) => string }) {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [newAddress, setNewAddress] = useState({
        title: "",
        city: "",
        district: "",
        addressDetail: "",
        isDefault: false
    });

    const fetchAddresses = async () => {
        setLoading(true);
        const data = await getUserAddresses(user.id);
        setAddresses(data);
        setLoading(false);
    };

    useEffect(() => {
        if (user?.id) fetchAddresses();
    }, [user?.id]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await addAddress(user.id, newAddress);
        if (result.success) {
            setShowModal(false);
            setNewAddress({ title: "", city: "", district: "", addressDetail: "", isDefault: false });
            fetchAddresses();
            showNotification("Adres başarıyla eklendi.");
        } else {
            showNotification(result.error || "Hata oluştu", "error");
        }
    };

    const handleDelete = async (id: string) => {
        setConfirmDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!confirmDeleteId) return;
        const result = await deleteAddress(user.id, confirmDeleteId);
        setConfirmDeleteId(null);
        if (result.success) {
            fetchAddresses();
            showNotification("Adres silindi.");
        }
    };

    const handleSetDefault = async (id: string) => {
        const result = await setDefaultAddress(user.id, id);
        if (result.success) {
            fetchAddresses();
            showNotification("Varsayılan adres güncellendi.");
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-3">Teslimat Adresleri</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">Hızlı alışveriş için kayıtlı adreslerini yönet.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-8 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 text-xs flex items-center gap-2"
                >
                    <Plus size={18} />
                    Yeni Adres Ekle
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20 text-blue-400 font-black">YÜKLENİYOR...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className={cn(
                                "p-10 bg-white/[0.03] border-2 rounded-[48px] relative group overflow-hidden transition-all",
                                addr.isDefault ? "border-blue-500/20" : "border-white/5"
                            )}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[80px] rounded-full -mr-16 -mt-16"></div>
                            {addr.isDefault && (
                                <div className="absolute top-8 right-8 px-4 py-1.5 bg-blue-600 text-[10px] font-black text-white rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/20">Varsayılan</div>
                            )}

                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-blue-400">
                                    <MapPin size={24} />
                                    <h3 className="font-black text-xl text-white tracking-tight">{addr.title}</h3>
                                </div>
                                <div className="space-y-2 text-slate-400 text-sm font-medium leading-relaxed">
                                    <p className="text-white font-bold text-base">{addr.name || user.name}</p>
                                    <p>{addr.addressDetail}</p>
                                    <p>{addr.district} / {addr.city}</p>
                                    <p className="pt-2 flex items-center gap-2 text-slate-500">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                        {addr.phone || user.phone || "Telefon Belirtilmedi"}
                                    </p>
                                </div>
                                <div className="pt-8 flex gap-6">
                                    {!addr.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(addr.id)}
                                            className="text-emerald-400 text-xs font-black uppercase tracking-widest hover:text-emerald-300 transition-colors"
                                        >
                                            Varsayılan Yap
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        className="text-red-400 text-xs font-black uppercase tracking-widest hover:text-red-300 transition-colors"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => setShowModal(true)}
                        className="p-10 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[48px] hover:border-blue-500/30 hover:bg-white/[0.05] transition-all duration-500 flex flex-col items-center justify-center gap-4 group min-h-[300px]"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-slate-950 border border-white/5 flex items-center justify-center text-slate-700 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-500">
                            <Plus size={32} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black text-white tracking-tight">Yeni Adres Ekle</p>
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">İş veya alternatif adres</p>
                        </div>
                    </button>
                </div>
            )}

            {/* ADDRESS ADD MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setShowModal(false)} />
                    <div className="relative w-full max-w-2xl bg-[#0b1220] border border-white/10 rounded-[48px] shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        <div className="p-10 space-y-8 overflow-y-auto">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-white">Yeni Adres</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500"
                                >
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>

                            <form onSubmit={handleAdd} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2 col-span-full">
                                        <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest ml-1">Adres Başlığı (Ev, İş vb.)</label>
                                        <input required value={newAddress.title} onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })} type="text" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest ml-1">Şehir</label>
                                        <input required value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} type="text" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest ml-1">İlçe</label>
                                        <input required value={newAddress.district} onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })} type="text" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all text-white" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest ml-1">Adres Detayı</label>
                                    <textarea required value={newAddress.addressDetail} onChange={(e) => setNewAddress({ ...newAddress, addressDetail: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all text-white min-h-[100px]"></textarea>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" id="isDefault" checked={newAddress.isDefault} onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })} className="w-5 h-5 rounded border-white/10 bg-slate-950 text-blue-600" />
                                    <label htmlFor="isDefault" className="text-sm text-slate-400 font-medium">Varsayılan adres olarak ayarla</label>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95">
                                    Adresi Kaydet
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRM MODAL */}
            {confirmDeleteId && (
                <ConfirmModal
                    title="Adresi Sil"
                    description="Bu adresi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                    confirmLabel="Evet, Sil"
                    cancelLabel="İptal"
                    destructive
                    onConfirm={confirmDelete}
                    onCancel={() => setConfirmDeleteId(null)}
                />
            )}
        </div>
    );
}

function ProfileView({ user, setUser, showNotification, formatPhone }: { user: any, setUser: any, showNotification: (m: string, t?: any) => void, formatPhone: (v: string) => string }) {
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone || "+90 ");
    const [loading, setLoading] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const result = await updateUserProfile(user.id, { name, phone });
        setLoading(false);
        if (result.success) {
            // Update local user state to reflect changes without reload
            setUser((prev: any) => ({ ...prev, name, phone }));
            showNotification("Profil başarıyla güncellendi.");
        } else {
            showNotification(result.error || "Hata oluştu", "error");
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700 relative z-10">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-3">Profil Ayarları</h2>
                <p className="text-slate-500 font-medium leading-relaxed">Kişisel bilgilerini ve şifre güvenliğini buradan yönet.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 p-8 bg-white/[0.03] border border-white/5 rounded-[40px]">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full blur opacity-40"></div>
                    <div className="relative w-32 h-32 bg-slate-950 rounded-full border-2 border-white/10 overflow-hidden flex items-center justify-center font-black text-white text-4xl uppercase shadow-2xl">
                        {user?.image ? (
                            <Image src={user.image} alt={user.name} fill className="object-cover" />
                        ) : (
                            user?.name?.substring(0, 2) || "PX"
                        )}
                    </div>
                </div>
                <div className="space-y-4 text-center md:text-left">
                    <div>
                        <h4 className="text-lg font-black text-white tracking-tight">Profil Fotoğrafı</h4>
                        <p className="text-sm text-slate-500 font-medium">PNG, JPG veya WEBP (Max. 2MB)</p>
                    </div>
                    <label className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black text-white hover:bg-blue-600 hover:border-blue-600 transition-all cursor-pointer uppercase tracking-widest active:scale-95 shadow-lg shadow-black/20">
                        <Camera size={16} />
                        FOTOĞRAF YÜKLE
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const formData = new FormData();
                                formData.append("file", file);

                                const result = await uploadProfilePicture(user.id, formData);
                                if (result.success) {
                                    window.location.reload();
                                } else {
                                    alert(result.error);
                                }
                            }}
                        />
                    </label>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-10 max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest ml-1">Tam Ad Soyad</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all text-sm font-medium text-white" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest ml-1">E-posta Adresi</label>
                        <input type="email" disabled defaultValue={user?.email} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 outline-none opacity-50 cursor-not-allowed text-sm font-medium text-white" title="E-posta adresi değiştirilemez." />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest ml-1">Telefon Numarası</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        placeholder="+90 5XX XXX XX XX"
                        className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all text-sm font-medium text-white"
                    />
                </div>

                <div className="pt-10 space-y-8 border-t border-white/5">
                    <div className="flex items-center gap-4 text-white">
                        <div className="p-3 bg-blue-600/10 text-blue-400 rounded-xl"><ShieldCheck size={20} /></div>
                        <h3 className="text-xl font-black tracking-tight">Güvenlik & Şifre</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest ml-1">Yeni Şifre</label>
                            <input type="password" placeholder="••••••••" className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all text-sm" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest ml-1">Şifre Tekrar</label>
                            <input type="password" placeholder="••••••••" className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all text-sm" />
                        </div>
                    </div>
                </div>

                <div className="pt-8">
                    <button type="submit" disabled={loading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-12 py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 text-sm disabled:opacity-50">
                        {loading ? "GÜNCELLENİYOR..." : "Ayarları Kaydet"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function FavoritesView({ userId }: { userId: string }) {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        if (!userId) return;
        setLoading(true);
        const data = await getWishlist(userId);
        setFavorites(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchFavorites();
    }, [userId]);

    const handleRemove = async (productId: string) => {
        const res = await toggleWishlist(userId, productId);
        if (res.success) {
            toast.success("Ürün favorilerden çıkarıldı.");
            fetchFavorites();
        }
    };

    if (loading) return <div className="flex justify-center py-20 text-blue-400 font-black">YÜKLENİYOR...</div>;

    return (
        <div className="space-y-12 animate-in fade-in duration-700 relative z-10">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-3">Favorilerim</h2>
                <p className="text-slate-500 font-medium leading-relaxed">En sevdiğin ürünleri buradan hızlıca sepete ekleyebilirsin.</p>
            </div>

            {favorites.length === 0 ? (
                <div className="py-20 text-center bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[48px] space-y-6">
                    <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-white/5 text-slate-700">
                        <Heart size={40} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xl font-black text-white">Favori listen boş</p>
                        <p className="text-slate-500 font-medium">Beğendiğin ürünleri kalp ikonuna tıklayarak buraya ekleyebilirsin.</p>
                    </div>
                    <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-8 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 text-xs">
                        ALIŞVERİŞE BAŞLA
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {favorites.map((product) => (
                        <div key={product.id} className="group p-6 bg-white/[0.03] border border-white/5 rounded-[40px] hover:border-blue-500/30 transition-all duration-500 relative flex flex-col h-full">
                            <div className="relative aspect-square bg-slate-950 rounded-[32px] mb-6 p-6 flex items-center justify-center overflow-hidden border border-white/5 shadow-2xl">
                                <Link href={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center">
                                    <Image
                                        src={product.image || "/placeholder.png"}
                                        alt={product.name}
                                        width={180}
                                        height={180}
                                        className="object-contain group-hover:scale-110 transition-transform duration-700"
                                    />
                                </Link>
                                <button
                                    onClick={() => handleRemove(product.id)}
                                    className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/20 hover:scale-110 transition-all"
                                    title="Favorilerden Çıkar"
                                >
                                    <Heart size={18} fill="currentColor" />
                                </button>
                            </div>
                            <div className="space-y-1 mb-6">
                                <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{product.category?.name || "Ürün"}</span>
                                <Link href={`/product/${product.slug}`}>
                                    <h3 className="font-black text-lg text-white tracking-tight leading-tight hover:text-blue-400 transition-colors line-clamp-2">{product.name}</h3>
                                </Link>
                            </div>
                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="text-xl font-black text-white tracking-tighter">{product.price.toLocaleString('tr-TR')} ₺</div>
                                <button className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                                    <ShoppingCart size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
