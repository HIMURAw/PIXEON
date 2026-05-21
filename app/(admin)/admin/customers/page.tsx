"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    ChevronLeft,
    ChevronRight,
    Download,
    Users,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Star,
    ShieldCheck,
    Trash2,
    Loader2,
    X,
    Lock,
    Shield,
    Check,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
    getAdminCustomers, 
    deleteUser, 
    getCustomerDetails, 
    resetUserPassword, 
    getVerificationSettings, 
    updateVerificationSettings, 
    toggleUserRole 
} from "@/lib/actions/admin-actions";
import toast from "react-hot-toast";

export default function AdminCustomers() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalMatching, setTotalMatching] = useState(0);
    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        loyal: 0
    });

    // Modals & User Operations State
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [customerDetails, setCustomerDetails] = useState<any>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [verificationSettings, setVerificationSettings] = useState({
        emailVerificationRequired: false,
        phoneVerificationRequired: false,
        allowNewRegistrations: true,
    });
    const [settingsSaving, setSettingsSaving] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchCustomers = async () => {
        setLoading(true);
        const res = await getAdminCustomers({
            search: debouncedSearch,
            page,
            limit: 10
        });
        if (res.success) {
            setCustomers(res.customers || []);
            setStats({
                total: res.totalCustomers || 0,
                new: res.newCustomersThisMonth || 0,
                loyal: res.loyalCustomers || 0
            });
            setTotalMatching(res.totalMatching || 0);
            setTotalPages(res.totalPages || 1);
        } else {
            toast.error(res.error || "Müşteriler yüklenemedi.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCustomers();
    }, [debouncedSearch, page]);

    const handleOpenVerificationSettings = async () => {
        setIsVerificationModalOpen(true);
        const settings = await getVerificationSettings();
        setVerificationSettings(settings);
    };

    const handleSaveVerificationSettings = async () => {
        setSettingsSaving(true);
        const res = await updateVerificationSettings(verificationSettings);
        if (res.success) {
            toast.success("Doğrulama ayarları başarıyla güncellendi.");
            setIsVerificationModalOpen(false);
        } else {
            toast.error(res.error || "Ayarlar kaydedilemedi.");
        }
        setSettingsSaving(false);
    };

    const handleOpenDetails = async (userId: string) => {
        setSelectedCustomerId(userId);
        setDetailsLoading(true);
        const res = await getCustomerDetails(userId);
        if (res.success) {
            setCustomerDetails(res);
        } else {
            toast.error(res.error || "Müşteri detayları yüklenemedi.");
            setSelectedCustomerId(null);
        }
        setDetailsLoading(false);
    };

    const handleResetPassword = async () => {
        if (!selectedCustomerId || !customerDetails?.user) return;
        if (!confirm(`"${customerDetails.user.name}" adlı kullanıcının şifresini sıfırlamak istediğinize emin misiniz?`)) {
            return;
        }
        const res = await resetUserPassword(selectedCustomerId);
        if (res.success) {
            toast.success(res.message || "Şifre başarıyla sıfırlandı.");
        } else {
            toast.error(res.error || "Şifre sıfırlanamadı.");
        }
    };

    const handleToggleRole = async (makeAdmin: boolean) => {
        if (!selectedCustomerId || !customerDetails?.user) return;
        
        let adminRole = "Editor";
        if (makeAdmin) {
            const roleInput = prompt("Yönetici rolünü girin (örn: Editor, Admin, Manager):", "Editor");
            if (roleInput === null) return; // cancelled
            if (roleInput.trim()) adminRole = roleInput.trim();
        } else {
            if (!confirm(`"${customerDetails.user.name}" adlı yöneticinin yetkilerini kaldırmak istediğinize emin misiniz?`)) {
                return;
            }
        }

        const res = await toggleUserRole(selectedCustomerId, makeAdmin, adminRole);
        if (res.success) {
            toast.success(makeAdmin ? "Kullanıcı yönetici yapıldı." : "Yönetici yetkileri kaldırıldı.");
            fetchCustomers();
            handleOpenDetails(selectedCustomerId);
        } else {
            toast.error(res.error || "İşlem başarısız.");
        }
    };

    const handleDeleteFromModal = async () => {
        if (!selectedCustomerId || !customerDetails?.user) return;
        const name = customerDetails.user.name;
        if (!confirm(`"${name}" adlı müşteriyi silmek istediğinize emin misiniz?`)) {
            return;
        }
        const res = await deleteUser(selectedCustomerId);
        if (res.success) {
            toast.success("Müşteri başarıyla silindi.");
            setSelectedCustomerId(null);
            setCustomerDetails(null);
            fetchCustomers();
        } else {
            toast.error(res.error || "Müşteri silinemedi.");
        }
    };

    const handleDeleteCustomer = async (userId: string, name: string) => {
        if (!confirm(`"${name}" adlı müşteriyi silmek istediğinize emin misiniz?`)) {
            return;
        }
        const res = await deleteUser(userId);
        if (res.success) {
            toast.success("Müşteri başarıyla silindi.");
            fetchCustomers();
        } else {
            toast.error(res.error || "Müşteri silinemedi.");
        }
    };

    const renderPageButtons = () => {
        const buttons = [];
        
        buttons.push(1);
        
        if (page > 3) {
            buttons.push("...");
        }
        
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            if (!buttons.includes(i)) {
                buttons.push(i);
            }
        }
        
        if (page < totalPages - 2) {
            buttons.push("...");
        }
        
        if (totalPages > 1 && !buttons.includes(totalPages)) {
            buttons.push(totalPages);
        }
        
        return buttons.map((p, idx) => {
            if (p === "...") {
                return (
                    <span key={`dots-${idx}`} className="w-10 h-10 flex items-center justify-center text-slate-600 font-bold">
                        ...
                    </span>
                );
            }
            return (
                <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={cn(
                        "w-10 h-10 rounded-xl text-xs font-black transition-all border border-transparent",
                        page === p 
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                            : "text-slate-500 hover:bg-white/5 hover:border-white/10"
                    )}
                >
                    {p}
                </button>
            );
        });
    };

    const TableSkeleton = () => (
        <>
            {[...Array(5)].map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-slate-900 rounded w-28"></div>
                                <div className="h-3 bg-slate-900 rounded w-20"></div>
                            </div>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="space-y-2">
                            <div className="h-3 bg-slate-900 rounded w-36"></div>
                            <div className="h-3 bg-slate-900 rounded w-28"></div>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="h-3 bg-slate-900 rounded w-24"></div>
                    </td>
                    <td className="px-8 py-6 text-center">
                        <div className="h-4 bg-slate-900 rounded w-8 mx-auto"></div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="h-4 bg-slate-900 rounded w-16"></div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="h-5 bg-slate-900 rounded-full w-14"></div>
                    </td>
                    <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-900"></div>
                            <div className="w-8 h-8 rounded-lg bg-slate-900"></div>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Müşteri Yönetimi
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <Users className="text-blue-400" size={14} />
                        Kayıtlı müşterilerinizi yönetin, harcama verilerini ve sipariş geçmişlerini inceleyin.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-slate-900 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                        <Download size={18} />
                        Dışa Aktar
                    </button>
                    <button 
                        onClick={handleOpenVerificationSettings}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        <ShieldCheck size={20} />
                        Doğrulama Ayarları
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Toplam Müşteri", value: stats.total.toLocaleString("tr-TR"), icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { label: "Yeni (Bu Ay)", value: stats.new.toLocaleString("tr-TR"), icon: Star, color: "text-amber-400", bg: "bg-amber-400/10" },
                    { label: "Sadık Müşteriler", value: stats.loyal.toLocaleString("tr-TR"), icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#020617] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                        <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-white mt-0.5">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#020617] border border-white/10 p-4 rounded-3xl flex flex-col lg:flex-row items-center gap-4 shadow-xl">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Müşteri adı, e-posta veya telefon ara..."
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-12 py-3 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-white/5 rounded-2xl text-sm font-bold text-slate-400 hover:text-white transition-all">
                        <Filter size={18} />
                        Filtrele
                    </button>
                    <select className="bg-slate-900 border border-white/5 rounded-2xl px-5 py-3 text-sm font-bold text-slate-400 outline-none focus:border-blue-500/50 transition-all cursor-pointer min-w-[160px]">
                        <option>Tüm Durumlar</option>
                        <option>Aktif</option>
                        <option>Pasif</option>
                        <option>VIP</option>
                    </select>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-[#020617] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto font-sans">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-white/[0.01] text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                <th className="px-8 py-5">Müşteri</th>
                                <th className="px-8 py-5">İletişim</th>
                                <th className="px-8 py-5">Konum</th>
                                <th className="px-8 py-5 text-center">Sipariş</th>
                                <th className="px-8 py-5">Toplam Harcama</th>
                                <th className="px-8 py-5">Durum</th>
                                <th className="px-8 py-5 text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <TableSkeleton />
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-12 text-center text-slate-500">
                                        <Users className="mx-auto mb-3 text-slate-600" size={36} />
                                        Aradığınız kriterlere uygun müşteri bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-white/[0.01] transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-black text-blue-400 text-sm group-hover:scale-105 transition-all">
                                                    {customer.initial}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{customer.name}</div>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold uppercase mt-0.5">
                                                        <Calendar size={10} />
                                                        Katılım: {customer.joined}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-400 text-xs">
                                                    <Mail size={12} className="text-slate-600" />
                                                    {customer.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400 text-xs">
                                                    <Phone size={12} className="text-slate-600" />
                                                    {customer.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                                <MapPin size={12} className="text-slate-600" />
                                                {customer.location}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="font-black text-slate-300">{customer.orders}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-black text-white text-base">₺{customer.spent.toLocaleString("tr-TR")}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                customer.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                                            )}>
                                                {customer.status === "Active" ? "AKTİF" : "PASİF"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button 
                                                    onClick={() => handleOpenDetails(customer.id)}
                                                    className="p-2.5 hover:bg-blue-500/10 rounded-xl text-slate-500 hover:text-blue-400 transition-all"
                                                    title="Müşteri Detayları"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                                                    className="p-2.5 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-400 transition-all"
                                                    title="Müşteriyi Sil"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            {totalMatching} müşteriden {Math.min(totalMatching, (page - 1) * 10 + 1)}-{Math.min(totalMatching, page * 10)} arası gösteriliyor.
                        </p>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-50 transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="flex items-center gap-1">
                                {renderPageButtons()}
                            </div>
                            <button 
                                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={page === totalPages}
                                className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-50 transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Doğrulama Ayarları Modalı */}
            {isVerificationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#020617] border border-white/10 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in scale-in duration-300">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-white text-lg leading-tight">Doğrulama Ayarları</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Kullanıcı kayıt ve aktivasyon parametreleri</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsVerificationModalOpen(false)}
                                className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {/* Modal Content */}
                        <div className="p-6 space-y-4">
                            {/* Toggle 1: E-posta */}
                            <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-white/10 transition-all">
                                <div>
                                    <p className="font-bold text-white text-sm">E-posta Doğrulaması</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Kayıt sonrası e-posta doğrulama linki gönderilir.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setVerificationSettings(prev => ({ ...prev, emailVerificationRequired: !prev.emailVerificationRequired }))}
                                    className={cn(
                                        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none",
                                        verificationSettings.emailVerificationRequired ? "bg-blue-600" : "bg-slate-800"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                            verificationSettings.emailVerificationRequired ? "translate-x-5" : "translate-x-0"
                                        )}
                                    />
                                </button>
                            </div>

                            {/* Toggle 2: Telefon */}
                            <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-white/10 transition-all">
                                <div>
                                    <p className="font-bold text-white text-sm">Telefon Doğrulaması</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Müşteri işlemlerinde SMS/Telefon kodu istenir.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setVerificationSettings(prev => ({ ...prev, phoneVerificationRequired: !prev.phoneVerificationRequired }))}
                                    className={cn(
                                        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none",
                                        verificationSettings.phoneVerificationRequired ? "bg-blue-600" : "bg-slate-800"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                            verificationSettings.phoneVerificationRequired ? "translate-x-5" : "translate-x-0"
                                        )}
                                    />
                                </button>
                            </div>

                            {/* Toggle 3: Yeni Kayıt */}
                            <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-white/10 transition-all">
                                <div>
                                    <p className="font-bold text-white text-sm">Yeni Kayıtlara İzin Ver</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Sisteme yeni kullanıcı kaydını açar/kapatır.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setVerificationSettings(prev => ({ ...prev, allowNewRegistrations: !prev.allowNewRegistrations }))}
                                    className={cn(
                                        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none",
                                        verificationSettings.allowNewRegistrations ? "bg-blue-600" : "bg-slate-800"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                            verificationSettings.allowNewRegistrations ? "translate-x-5" : "translate-x-0"
                                        )}
                                    />
                                </button>
                            </div>
                        </div>
                        {/* Modal Footer */}
                        <div className="p-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setIsVerificationModalOpen(false)}
                                className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-all"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSaveVerificationSettings}
                                disabled={settingsSaving}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-500/10 active:scale-95"
                            >
                                {settingsSaving && <Loader2 size={16} className="animate-spin" />}
                                Ayarları Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Müşteri Detay Modalı */}
            {selectedCustomerId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#020617] border border-white/10 rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in scale-in duration-300">
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 flex items-center justify-center font-black text-blue-400 text-lg">
                                    {customerDetails?.user?.name ? (
                                        customerDetails.user.name.split(" ").length > 1 
                                            ? (customerDetails.user.name.split(" ")[0][0] + customerDetails.user.name.split(" ").slice(-1)[0][0]).toUpperCase()
                                            : customerDetails.user.name.substring(0, 2).toUpperCase()
                                    ) : "M"}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2.5">
                                        <h3 className="font-extrabold text-white text-xl leading-tight">
                                            {detailsLoading ? "Müşteri Bilgileri Yükleniyor..." : customerDetails?.user?.name}
                                        </h3>
                                        {customerDetails?.user?.role === "ADMIN" ? (
                                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                {customerDetails?.user?.adminRole || "YÖNETİCİ"}
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                MÜŞTERİ
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        <Calendar size={12} className="text-slate-600" />
                                        Katılım Tarihi: {customerDetails?.user?.createdAt ? new Date(customerDetails.user.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : ""}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => { setSelectedCustomerId(null); setCustomerDetails(null); }}
                                className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        {detailsLoading ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
                                <Loader2 size={36} className="text-blue-500 animate-spin" />
                                <p className="text-slate-500 text-sm font-medium">Bilgiler veri tabanından getiriliyor...</p>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Sol Kolon - Bilgiler ve İşlemler (5/12) */}
                                <div className="lg:col-span-5 space-y-6">
                                    {/* Müşteri Profil Bilgileri */}
                                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-3.5">
                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Profil Bilgileri</h4>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center gap-3">
                                                <Mail size={16} className="text-slate-500 flex-shrink-0" />
                                                <span className="text-slate-300 break-all">{customerDetails?.user?.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone size={16} className="text-slate-500 flex-shrink-0" />
                                                <span className="text-slate-300">{customerDetails?.user?.phone || "Belirtilmemiş"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Adres Bilgileri */}
                                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-4">
                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Adres Defteri</h4>
                                        {customerDetails?.addresses?.length === 0 ? (
                                            <p className="text-xs text-slate-500 py-2">Kayıtlı adres bulunamadı.</p>
                                        ) : (
                                            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                                                {customerDetails?.addresses?.map((address: any) => (
                                                    <div key={address.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all text-xs space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold text-white uppercase tracking-wider">{address.title}</span>
                                                            {address.isDefault && (
                                                                <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-black uppercase">Varsayılan</span>
                                                            )}
                                                        </div>
                                                        <p className="text-slate-400 font-medium">{address.name} - {address.phone}</p>
                                                        <p className="text-slate-500 leading-normal">{address.addressDetail}</p>
                                                        <p className="text-slate-400 font-bold uppercase mt-0.5">{address.district} / {address.city}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Kullanıcı İşlemleri */}
                                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-4">
                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Yönetici Yetkilendirmeleri</h4>
                                        
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            {customerDetails?.user?.role === "ADMIN" ? (
                                                <button
                                                    onClick={() => handleToggleRole(false)}
                                                    className="flex-1 px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all text-center"
                                                >
                                                    Yetkileri Geri Al
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggleRole(true)}
                                                    className="flex-1 px-4 py-2.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600/20 rounded-xl text-xs font-bold transition-all text-center"
                                                >
                                                    Yönetici Yap
                                                </button>
                                            )}
                                            
                                            <button
                                                onClick={handleResetPassword}
                                                className="flex-1 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <Lock size={12} />
                                                Şifreyi Sıfırla
                                            </button>
                                        </div>

                                        <button
                                            onClick={handleDeleteFromModal}
                                            className="w-full px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                        >
                                            <Trash2 size={12} />
                                            Kullanıcıyı Tamamen Sil
                                        </button>
                                    </div>
                                </div>

                                {/* Sağ Kolon - Sipariş Geçmişi (7/12) */}
                                <div className="lg:col-span-7 flex flex-col min-h-0">
                                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 flex-1 flex flex-col min-h-0">
                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-3">Sipariş Geçmişi ({customerDetails?.orders?.length || 0})</h4>
                                        
                                        {customerDetails?.orders?.length === 0 ? (
                                            <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-500 text-center">
                                                <Users size={32} className="text-slate-700 mb-2" />
                                                <p className="text-sm font-semibold">Henüz sipariş vermemiş.</p>
                                                <p className="text-xs text-slate-600 mt-1">Bu müşteriye ait kayıtlı alışveriş işlemi bulunmuyor.</p>
                                            </div>
                                        ) : (
                                            <div className="flex-1 overflow-y-auto space-y-4 mt-4 pr-1 max-h-[460px]">
                                                {customerDetails?.orders?.map((order: any) => (
                                                    <div key={order.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-all space-y-3">
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-black text-white">{order.orderNumber}</span>
                                                                <span className="text-slate-600 font-bold">|</span>
                                                                <span className="text-slate-500 font-medium">
                                                                    {new Date(order.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={cn(
                                                                    "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                                    order.status === "COMPLETED" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                                                                    order.status === "PENDING" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                                                                    order.status === "PREPARING" && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                                                                    order.status === "SHIPPED" && "bg-purple-500/10 text-purple-400 border-purple-500/20",
                                                                    order.status === "CANCELLED" && "bg-red-500/10 text-red-400 border-red-500/20"
                                                                )}>
                                                                    {order.status === "COMPLETED" && "TAMAMLANDI"}
                                                                    {order.status === "PENDING" && "BEKLEMEDE"}
                                                                    {order.status === "PREPARING" && "HAZIRLANIYOR"}
                                                                    {order.status === "SHIPPED" && "KARGOYA VERİLDİ"}
                                                                    {order.status === "CANCELLED" && "İPTAL EDİLDİ"}
                                                                </span>
                                                                <span className={cn(
                                                                    "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                                                                    order.paymentStatus === "PAID" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                                                                )}>
                                                                    {order.paymentStatus === "PAID" ? "ÖDENDİ" : "BEKLİYOR"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Items */}
                                                        <div className="divide-y divide-white/5 border-t border-b border-white/5 py-2">
                                                            {order.items?.map((item: any) => (
                                                                <div key={item.id} className="flex items-center justify-between text-xs py-1.5">
                                                                    <div className="flex items-center gap-2 text-slate-300">
                                                                        <span className="font-semibold">{item.productName}</span>
                                                                        <span className="text-slate-600">x</span>
                                                                        <span className="font-black text-blue-400">{item.quantity}</span>
                                                                    </div>
                                                                    <span className="font-bold text-slate-400">₺{item.price.toLocaleString("tr-TR")}</span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="flex items-center justify-between text-xs pt-1">
                                                            <span className="text-slate-500 font-bold">Toplam Tutar:</span>
                                                            <span className="text-sm font-black text-white">₺{order.totalAmount.toLocaleString("tr-TR")}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="p-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-end">
                            <button
                                onClick={() => { setSelectedCustomerId(null); setCustomerDetails(null); }}
                                className="px-5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm font-bold text-slate-300 hover:text-white transition-all shadow-lg active:scale-95"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
