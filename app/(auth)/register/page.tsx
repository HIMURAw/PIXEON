"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
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
    
    // Mock registration delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would call an API here
    // For now, let's just show a success message or redirect to login
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-1">Hesap Oluştur</h2>
        <p className="text-slate-400 text-sm">PIXEON dünyasına adımını at</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Ad Soyad</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
              <User size={18} />
            </div>
            <input
              {...register("name")}
              type="text"
              placeholder="John Doe"
              className="w-full bg-slate-800/50 border border-white/5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-slate-600 outline-none transition-all"
            />
          </div>
          {errors.name && <p className="text-red-400 text-[11px] ml-1 mt-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">E-Posta</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
              <Mail size={18} />
            </div>
            <input
              {...register("email")}
              type="email"
              placeholder="email@example.com"
              className="w-full bg-slate-800/50 border border-white/5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-slate-600 outline-none transition-all"
            />
          </div>
          {errors.email && <p className="text-red-400 text-[11px] ml-1 mt-1">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Şifre</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-800/50 border border-white/5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-slate-600 outline-none transition-all"
              />
            </div>
            {errors.password && <p className="text-red-400 text-[11px] ml-1 mt-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Tekrar</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-800/50 border border-white/5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-slate-600 outline-none transition-all"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-[11px] ml-1 mt-1">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] mt-4"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Kayıt Ol
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-slate-400 text-sm mt-8">
        Zaten bir hesabın var mı?{" "}
        <Link href="/login" className="text-blue-400 font-bold hover:underline">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
}
