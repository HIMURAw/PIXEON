"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Loader2, ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.message || "Giriş başarısız oldu");
      }
    } catch (err) {
      setError("Bir bağlantı hatası oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-1">Tekrar Hoş Geldin</h2>
        <p className="text-slate-400 text-sm">Devam etmek için hesabına giriş yap</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">E-Posta</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
              <Mail size={18} />
            </div>
            <input
              {...register("email")}
              type="email"
              placeholder="admin@TUGER.com"
              className="w-full bg-slate-800/50 border border-white/5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-slate-600 outline-none transition-all"
            />
          </div>
          {errors.email && <p className="text-red-400 text-[11px] ml-1 mt-1">{errors.email.message}</p>}
        </div>

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

        <div className="flex items-center justify-end">
          <Link href="#" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
            Şifremi Unuttum
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Giriş Yap
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#0f172a] px-2 text-slate-500 font-medium">Veya şununla devam et</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button className="w-full bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 font-medium py-3 rounded-2xl flex items-center justify-center gap-3 transition-all">
          <Github size={20} />
          GitHub ile Giriş
        </button>
      </div>

      <p className="text-center text-slate-400 text-sm mt-8">
        Hesabın yok mu?{" "}
        <Link href="/register" className="text-blue-400 font-bold hover:underline">
          Hemen Kayıt Ol
        </Link>
      </p>
    </div>
  );
}
