"use client";

import React, { useState, useEffect } from "react";
import { X, User, Mail, Shield, Lock, Loader2, Save, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getAllUsers } from "@/lib/actions/admin-actions";

const adminSchema = z.object({
  userId: z.string().optional(),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır").optional().or(z.literal("")),
  adminRole: z.string().min(1, "Lütfen bir yetki seviyesi seçiniz"),
});

type AdminFormValues = z.infer<typeof adminSchema>;

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  loading?: boolean;
}

export default function AdminModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}: AdminModalProps) {
  const isEditing = !!initialData;
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      password: "",
      adminRole: "Editör",
    },
  });

  const loadUsers = React.useCallback(async () => {
    try {
      setIsSearching(true);
      console.log("Loading users in modal...");
      const users = await getAllUsers();
      if (users) {
        console.log(`Loaded ${users.length} users in modal`);
        // Filter out users who are already admins
        setAllUsers(users.filter((u: any) => u.role !== "ADMIN"));
      } else {
        console.warn("getAllUsers returned null/undefined");
        setAllUsers([]);
      }
    } catch (error) {
      console.error("Error loading users in modal:", error);
      setAllUsers([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (!isEditing) {
        loadUsers();
      }
      reset(initialData || {
        name: "",
        email: "",
        password: "",
        adminRole: "Editör",
      });
      setSelectedUser(null);
      setSearchTerm("");
    }
  }, [isOpen, isEditing, initialData, reset, loadUsers]);

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 50);

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setValue("userId", user.id);
    setValue("name", user.name);
    setValue("email", user.email);
    setSearchTerm("");
  };

  const onFormSubmit = (data: AdminFormValues) => {
    onSubmit({ ...data, id: selectedUser?.id || initialData?.id });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-[#0c1022] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 max-h-[90vh] flex flex-col">
        <div className="p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400">
                {isEditing ? <Shield size={24} /> : <Plus size={24} />}
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  {isEditing ? "Yöneticiyi Düzenle" : "Yeni Yönetici Ekle"}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {isEditing ? "Yönetici bilgilerini güncelleyin." : "Hesap seçerek veya yeni oluşturarak yetki verin."}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {!isEditing && (
            <div className="mb-8 space-y-4">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">HESAP SEÇİN (OPSİYONEL)</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="İsim veya e-posta ile ara..."
                  className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none transition-all"
                />
              </div>

              <div className="bg-slate-950/50 border border-white/5 rounded-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300">
                <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                  {isSearching ? (
                    <div className="p-8 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="animate-spin text-blue-500" size={24} />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kullanıcılar Yükleniyor...</p>
                    </div>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectUser(user)}
                        className={cn(
                          "w-full px-4 py-3 flex items-center justify-between hover:bg-blue-600/10 transition-colors text-left border-b border-white/5 last:border-0",
                          selectedUser?.id === user.id && "bg-blue-600/10"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-blue-400 font-bold border border-white/10">
                            {user.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                            <p className="text-[10px] text-slate-500 mt-1">{user.email}</p>
                          </div>
                        </div>
                        {selectedUser?.id === user.id ? (
                          <Check size={16} className="text-blue-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-white/10" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-xs text-slate-500 font-medium italic">Seçilebilecek kullanıcı bulunamadı.</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedUser && (
                <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{selectedUser.name}</p>
                      <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">SEÇİLİ HESAP</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedUser(null); reset(); }}
                    className="text-[10px] font-black text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest"
                  >
                    KALDIR
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Name */}
              <div className={cn("space-y-2", selectedUser && "opacity-50 pointer-events-none")}>
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">AD SOYAD</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Ad Soyad"
                    className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none transition-all"
                  />
                </div>
                {errors.name && <p className="text-red-400 text-[10px] font-medium ml-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className={cn("space-y-2", selectedUser && "opacity-50 pointer-events-none")}>
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">E-POSTA</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="admin@pixeon.com"
                    className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none transition-all"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-[10px] font-medium ml-1">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Role */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">YETKİ SEVİYESİ</label>
                  <div className="relative group">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <select
                      {...register("adminRole")}
                      className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none appearance-none transition-all"
                    >
                      <option value="Süper Admin" className="bg-slate-900">Süper Admin</option>
                      <option value="Editör" className="bg-slate-900">Editör</option>
                      <option value="Moderatör" className="bg-slate-900">Moderatör</option>
                      <option value="Destek" className="bg-slate-900">Destek</option>
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div className={cn("space-y-2", (selectedUser || isEditing) && "opacity-50 pointer-events-none")}>
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">
                    {isEditing || selectedUser ? "ŞİFRE (GEREKMİYOR)" : "ŞİFRE"}
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      {...register("password")}
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none transition-all"
                    />
                  </div>
                  {errors.password && <p className="text-red-400 text-[10px] font-medium ml-1">{errors.password.message}</p>}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-4 rounded-2xl border border-white/5 transition-all"
              >
                İPTAL
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Save size={20} />
                    {isEditing ? "GÜNCELLE" : "YETKİ VER"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Plus({ size, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
