"use client";

import React, { useState, useEffect } from "react";
import {
    ShieldCheck,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Pencil,
    Trash2,
    Key,
    Shield,
    User,
    Clock,
    AlertCircle,
    CheckCircle2,
    Lock,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAdmins, addAdmin, updateAdmin, deleteAdmin, promoteToAdmin } from "@/lib/actions/admin-actions";
import AdminModal from "@/components/admin/AdminModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { toast } from "react-hot-toast";

export default function AdminUsers() {
    const [admins, setAdmins] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setIsLoading(true);
        const data = await getAdmins();
        setAdmins(data);
        setIsLoading(false);
    };

    const handleAddOrEdit = async (data: any) => {
        setActionLoading(true);
        try {
            let result;
            if (selectedAdmin) {
                result = await updateAdmin(selectedAdmin.id, data);
            } else if (data.userId) {
                result = await promoteToAdmin(data.userId, data.adminRole);
            } else {
                result = await addAdmin(data);
            }

            if (result.success) {
                toast.success(selectedAdmin ? "Yönetici güncellendi." : "Yönetici yetkisi verildi.");
                setIsModalOpen(false);
                fetchAdmins();
            } else {
                toast.error(result.error || "Bir hata oluştu.");
            }
        } catch (error) {
            toast.error("İşlem başarısız.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedAdmin) return;
        setActionLoading(true);
        try {
            const result = await deleteAdmin(selectedAdmin.id);
            if (result.success) {
                toast.success("Yönetici silindi.");
                setIsDeleteModalOpen(false);
                fetchAdmins();
            } else {
                toast.error(result.error || "Silme işlemi başarısız.");
            }
        } catch (error) {
            toast.error("İşlem başarısız.");
        } finally {
            setActionLoading(false);
        }
    };

    const openEditModal = (admin: any) => {
        setSelectedAdmin(admin);
        setIsModalOpen(true);
    };

    const openDeleteModal = (admin: any) => {
        setSelectedAdmin(admin);
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Admin Kullanıcıları
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <ShieldCheck className="text-blue-400" size={14} />
                        Panel erişimi olan yöneticileri yönetin ve yetkilendirme ayarlarını yapın.
                    </p>
                </div>
                <button
                    onClick={() => { setSelectedAdmin(null); setIsModalOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    <Plus size={20} />
                    Yeni Admin Ekle
                </button>
            </div>

            {/* Admin List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {isLoading ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 gap-4">
                        <Loader2 className="animate-spin text-blue-500" size={48} />
                        <p className="font-bold tracking-widest uppercase text-xs">Yöneticiler Yükleniyor...</p>
                    </div>
                ) : admins.length > 0 ? (
                    admins.map((admin) => (
                        <div key={admin.id} className="bg-[#020617] border border-white/10 rounded-[40px] p-8 hover:border-blue-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none group-hover:bg-blue-500/10"></div>

                            <div className="relative z-10 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-sky-400/20 border border-white/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-500">
                                            <User size={32} />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-black text-white text-lg tracking-tight">{admin.name}</h3>
                                            <p className="text-xs text-slate-500 font-medium">{admin.email}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-slate-600 hover:text-white transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 py-4 border-y border-white/5">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Yetki Seviyesi</p>
                                        <div className="flex items-center gap-2">
                                            <Shield size={14} className="text-blue-500" />
                                            <span className="text-sm font-black text-white">{admin.adminRole || admin.role}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Durum</p>
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                                            "bg-emerald-500/10 text-emerald-400" // For now admins are always active in this view
                                        )}>Aktif</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <Clock size={14} />
                                        {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('tr-TR') : "Belirsiz"}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEditModal(admin)}
                                            className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-500 hover:text-white transition-all"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        {admin.adminRole !== "Süper Admin" && (
                                            <button
                                                onClick={() => openDeleteModal(admin)}
                                                className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-white/5 rounded-[40px]">
                        <ShieldCheck size={48} className="opacity-20 mb-4" />
                        <p className="font-bold tracking-widest uppercase text-xs">Henüz yönetici bulunmuyor.</p>
                    </div>
                )}

                {/* Invite Card */}
                <button
                    onClick={() => { setSelectedAdmin(null); setIsModalOpen(true); }}
                    className="bg-[#020617] border-2 border-dashed border-white/10 rounded-[40px] p-8 flex flex-col items-center justify-center gap-6 group hover:border-blue-500/30 hover:bg-white/[0.01] transition-all duration-500"
                >
                    <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-slate-600 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-500">
                        <Plus size={32} />
                    </div>
                    <div className="text-center space-y-2">
                        <h4 className="text-lg font-black text-white tracking-tight">Yeni Yönetici Ekle</h4>
                        <p className="text-xs text-slate-500 font-medium max-w-[200px]">Panel erişimi için yeni bir yönetici hesabı oluşturun.</p>
                    </div>
                </button>
            </div>

            {/* Security Alert Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[40px] p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-600/20">
                <div className="flex items-center gap-8 text-center lg:text-left">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[32px] flex items-center justify-center text-white shrink-0 shadow-inner">
                        <Lock size={40} />
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-black text-white tracking-tight">Güvenlik Önemlidir</h3>
                        <p className="text-blue-100 text-sm font-medium leading-relaxed max-w-2xl">
                            Admin panel erişimi olan kullanıcılarınızı düzenli olarak kontrol edin ve kullanılmayan hesapları pasif hale getirin.
                            Güçlü şifre politikası her zaman tavsiye edilir.
                        </p>
                    </div>
                </div>
                <Link 
                    href="/admin/settings/logs"
                    className="bg-white text-blue-600 font-black px-10 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest flex items-center gap-2"
                >
                    Güvenlik Günlüğü
                </Link>
            </div>

            {/* Modals */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddOrEdit}
                initialData={selectedAdmin}
                loading={actionLoading}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                loading={actionLoading}
                title="Yönetici Silinecek"
                description={`${selectedAdmin?.name} isimli yöneticinin erişimini kalıcı olarak kaldırmak istediğinize emin misiniz?`}
            />
        </div>
    );
}
