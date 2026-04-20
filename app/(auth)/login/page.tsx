"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useRouter, useSearchParams } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const SearchParamHandler = ({ setSuccess }: { setSuccess: (val: string | null) => void }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("registered")) {
      setSuccess("Hesabınız başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.");
    }
  }, [searchParams, setSuccess]);

  return null;
};

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
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
        // Rolüne göre yönlendir
        if (result.user.role === "ADMIN") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
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
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-16 h-16 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-center justify-center mb-2 shadow-inner group transition-transform duration-500 hover:rotate-[360deg]">
          <ShieldCheck className="text-sky-400 w-8 h-8 group-hover:scale-110 transition-transform" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-1">
          TUGER<span className="text-sky-500 text-4xl">.</span>
        </h1>
        <p className="text-slate-400 text-sm font-medium max-w-[280px]">
          Yeni nesil oyun deneyimine kaldığın yerden devam et
        </p>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group/card">
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent pointer-events-none" />

        <Suspense fallback={null}>
          <SearchParamHandler setSuccess={setSuccess} />
        </Suspense>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] py-3 px-4 rounded-xl flex items-center gap-3 animate-in">
              <CheckCircle2 size={16} />
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl flex items-center gap-3 animate-in">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
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

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="relative group/input">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-sky-400 transition-colors" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Şifre"
                className="w-full bg-slate-950/50 border border-white/5 focus:border-sky-500/50 focus:ring-[6px] focus:ring-sky-500/5 rounded-2xl py-4 pl-11 pr-12 text-sm text-white placeholder-slate-600 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-[10px] font-medium ml-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative w-4 h-4 rounded-md border border-white/10 bg-slate-950/50 group-hover:border-sky-500/50 transition-all flex items-center justify-center">
                <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer" />
                <div className="w-2 h-2 rounded-sm bg-sky-500 scale-0 peer-checked:scale-100 transition-transform shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
              </div>
              <span className="text-xs text-slate-400 font-medium group-hover:text-slate-300">Beni Hatırla</span>
            </label>
            <Link href="#" className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors">
              Şifremi Unuttum?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group/btn overflow-hidden rounded-2xl p-px disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {/* Animated border/bg */}
            <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600 group-hover/btn:bg-sky-500" />

            <div className="relative bg-sky-600 group-hover/btn:bg-transparent py-4 flex items-center justify-center gap-2 font-black text-sm text-white transition-all uppercase tracking-widest">
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Giriş Yap
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>
        </form>

        <div className="mt-8 space-y-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Veya</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <button className="w-full bg-slate-950/50 hover:bg-slate-950 border border-white/5 hover:border-sky-500/20 text-slate-300 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all group shadow-sm">
            <FcGoogle size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm">Google Hesabı</span>
          </button>
        </div>
      </div>

      <p className="text-center text-slate-500 text-sm font-medium">
        Hesabın yok mu?{" "}
        <Link href="/register" className="text-sky-400 font-black hover:text-sky-300 transition-colors border-b border-sky-400/20 hover:border-sky-300">
          Kayıt Ol
        </Link>
      </p>

      {/* Back to Home Link */}
      <div className="flex justify-center pt-4">
        <Link href="/" className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] hover:text-sky-500 transition-colors flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
