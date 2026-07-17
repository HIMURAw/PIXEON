"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, ShieldOff, Loader2, KeyRound } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import {
  getTwoFactorStatus,
  beginTwoFactorSetup,
  confirmTwoFactorSetup,
  disableTwoFactor,
} from "@/lib/actions/twofactor-actions";

type Step = "idle" | "setup" | "disable";

export default function TwoFactorSettings({ userId }: { userId: string }) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [step, setStep] = useState<Step>("idle");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    getTwoFactorStatus(userId).then((res) => setEnabled(res.enabled));
  }, [userId]);

  const startSetup = async () => {
    setIsBusy(true);
    const res = await beginTwoFactorSetup(userId);
    setIsBusy(false);
    if (res.success) {
      setQrDataUrl(res.qrDataUrl!);
      setSecret(res.secret!);
      setStep("setup");
    } else {
      toast.error(res.error || "Kurulum başlatılamadı.");
    }
  };

  const confirmSetup = async () => {
    setIsBusy(true);
    const res = await confirmTwoFactorSetup(userId, code);
    setIsBusy(false);
    if (res.success) {
      toast.success("İki faktörlü doğrulama etkinleştirildi.");
      setEnabled(true);
      setStep("idle");
      setCode("");
      setQrDataUrl(null);
      setSecret(null);
    } else {
      toast.error(res.error || "Doğrulama başarısız oldu.");
    }
  };

  const confirmDisable = async () => {
    setIsBusy(true);
    const res = await disableTwoFactor(userId, code);
    setIsBusy(false);
    if (res.success) {
      toast.success("İki faktörlü doğrulama devre dışı bırakıldı.");
      setEnabled(false);
      setStep("idle");
      setCode("");
    } else {
      toast.error(res.error || "İşlem başarısız oldu.");
    }
  };

  if (enabled === null) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin text-blue-500" size={28} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-950 border border-white/5 rounded-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center border",
            enabled ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-slate-900 border-white/5 text-slate-600"
          )}>
            {enabled ? <ShieldCheck size={22} /> : <ShieldOff size={22} />}
          </div>
          <div>
            <p className="text-sm font-black text-white">İki Faktörlü Doğrulama (2FA)</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-0.5">
              Kendi admin hesabınız için giriş yaparken ek bir kod istenir
            </p>
          </div>
        </div>
        {step === "idle" && (
          <button
            onClick={() => (enabled ? setStep("disable") : startSetup())}
            disabled={isBusy}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50",
              enabled ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-blue-600 text-white"
            )}
          >
            {isBusy ? <Loader2 className="animate-spin" size={14} /> : enabled ? "Devre Dışı Bırak" : "Etkinleştir"}
          </button>
        )}
      </div>

      {step === "setup" && qrDataUrl && (
        <div className="space-y-4 pt-4 border-t border-white/5">
          <p className="text-xs text-slate-400">
            Google Authenticator, Authy gibi bir uygulamayla aşağıdaki kodu tarayın, ardından uygulamanın gösterdiği 6 haneli kodu girin.
          </p>
          <div className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="2FA QR kodu" className="w-40 h-40 rounded-2xl border border-white/10 bg-white p-2" />
            {secret && (
              <p className="text-[10px] text-slate-500 font-mono tracking-widest text-center break-all">
                Manuel giriş: {secret}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <KeyRound className="text-slate-600" size={18} />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              inputMode="numeric"
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-center text-lg tracking-[0.4em] text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={confirmSetup}
              disabled={isBusy || code.length !== 6}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all"
            >
              {isBusy ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Onayla ve Etkinleştir"}
            </button>
            <button
              onClick={() => { setStep("idle"); setCode(""); setQrDataUrl(null); setSecret(null); }}
              className="px-5 py-3 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 font-bold transition-all"
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}

      {step === "disable" && (
        <div className="space-y-4 pt-4 border-t border-white/5">
          <p className="text-xs text-slate-400">
            Devre dışı bırakmak için kimlik doğrulama uygulamanızdaki güncel 6 haneli kodu girin.
          </p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            inputMode="numeric"
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-center text-lg tracking-[0.4em] text-white outline-none focus:border-red-500 transition-all"
          />
          <div className="flex gap-3">
            <button
              onClick={confirmDisable}
              disabled={isBusy || code.length !== 6}
              className="flex-1 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 text-red-400 border border-red-500/20 font-bold py-3 rounded-xl transition-all"
            >
              {isBusy ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Devre Dışı Bırak"}
            </button>
            <button
              onClick={() => { setStep("idle"); setCode(""); }}
              className="px-5 py-3 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 font-bold transition-all"
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
