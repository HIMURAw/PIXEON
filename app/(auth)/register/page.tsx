"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, User, Loader2, ArrowRight, UserPlus, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Kayıt başarılı, login sayfasına yönlendir
        router.push("/login?registered=true");
      } else {
        setError(result.message || "Kayıt sırasında bir hata oluştu");
      }
    } catch (err) {
      setError("Bağlantı hatası oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-16 h-16 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-center justify-center mb-2 shadow-inner group transition-transform duration-500 hover:rotate-[360deg]">
          <UserPlus className="text-sky-400 w-8 h-8 group-hover:scale-110 transition-transform" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-1">
          TUGER<span className="text-sky-500 text-4xl">.</span>
        </h1>
        <p className="text-slate-400 text-sm font-medium max-w-[280px]">
          TUGER topluluğuna katıl ve ayrıcalıkları keşfet
        </p>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent pointer-events-none" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl flex items-center gap-3 animate-in">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              {error}
            </div>
          )}

          {/* Name Input */}
          <div className="space-y-1">
            <div className="relative group/input">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-sky-400 transition-colors" />
              <input
                {...register("name")}
                type="text"
                placeholder="Ad Soyad"
                className="w-full bg-slate-950/50 border border-white/5 focus:border-sky-500/50 focus:ring-[6px] focus:ring-sky-500/5 rounded-2xl py-4 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all"
              />
            </div>
            {errors.name && <p className="text-red-400 text-[10px] font-medium ml-1">{errors.name.message}</p>}
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <div className="relative group/input">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-sky-400 transition-colors" />
              <input
                {...register("email")}
                type="email"
                placeholder="E-posta Adresi"
                className="w-full bg-slate-950/50 border border-white/5 focus:border-sky-500/50 focus:ring-[6px] focus:ring-sky-500/5 rounded-2xl py-4 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all"
              />
            </div>
            {errors.email && <p className="text-red-400 text-[10px] font-medium ml-1">{errors.email.message}</p>}
          </div>

          {/* Password Inputs Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-sky-400 transition-colors" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifre"
                  className="w-full bg-slate-950/50 border border-white/5 focus:border-sky-500/50 focus:ring-[6px] focus:ring-sky-500/5 rounded-2xl py-4 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-sky-400 transition-colors" />
                <input
                  {...register("confirmPassword")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Tekrar"
                  className="w-full bg-slate-950/50 border border-white/5 focus:border-sky-500/50 focus:ring-[6px] focus:ring-sky-500/5 rounded-2xl py-4 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center px-1">
            {(errors.password || errors.confirmPassword) && (
              <p className="text-red-400 text-[10px] font-medium">
                {errors.password?.message || errors.confirmPassword?.message}
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-sky-400 transition-colors ml-auto flex items-center gap-2"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              Şifreyi {showPassword ? "Gizle" : "Göster"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group/btn overflow-hidden rounded-2xl p-px disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] mt-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600 group-hover/btn:bg-sky-500" />

            <div className="relative bg-sky-600 group-hover/btn:bg-transparent py-4 flex items-center justify-center gap-2 font-black text-sm text-white transition-all uppercase tracking-widest">
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Hesap Oluştur
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>
        </form>
      </div>

      <p className="text-center text-slate-500 text-sm font-medium">
        Zaten bir hesabın var mı?{" "}
        <Link href="/login" className="text-sky-400 font-black hover:text-sky-300 transition-colors border-b border-sky-400/20 hover:border-sky-300">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
}
