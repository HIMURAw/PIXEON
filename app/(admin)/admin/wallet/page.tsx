"use client";

import { useState } from "react";
import { Wallet, Search, Loader2, Plus, Minus } from "lucide-react";
import { toast } from "react-hot-toast";
import { findUserForWallet, adminAdjustWallet, getWalletTransactions } from "@/lib/actions/wallet-actions";

interface FoundUser {
    id: string;
    name: string;
    email: string;
    walletBalance: number;
}

export default function AdminWalletPage() {
    const [email, setEmail] = useState("");
    const [searching, setSearching] = useState(false);
    const [user, setUser] = useState<FoundUser | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSearching(true);
        setSearched(true);
        const found = await findUserForWallet(email.trim());
        setUser(found);
        if (found) {
            const txs = await getWalletTransactions(found.id);
            setTransactions(txs);
        } else {
            setTransactions([]);
        }
        setSearching(false);
    };

    const adjust = async (sign: 1 | -1) => {
        if (!user) return;
        const amt = parseFloat(amount);
        if (!amt || amt <= 0) {
            toast.error("Geçerli bir tutar girin.");
            return;
        }
        if (!reason.trim()) {
            toast.error("Bir açıklama/sebep girin.");
            return;
        }
        setSubmitting(true);
        const res = await adminAdjustWallet(user.id, amt * sign, reason.trim());
        setSubmitting(false);
        if (res.success) {
            toast.success("Bakiye güncellendi.");
            setUser({ ...user, walletBalance: user.walletBalance + amt * sign });
            const txs = await getWalletTransactions(user.id);
            setTransactions(txs);
            setAmount("");
            setReason("");
        } else {
            toast.error(res.error || "İşlem başarısız oldu.");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Cüzdan Yönetimi</h1>
                <p className="text-slate-500 mt-1 flex items-center gap-2">
                    <Wallet className="text-blue-400" size={14} />
                    Kullanıcı bakiyelerini manuel olarak düzenleyin (promosyon, iade, onaylanmış havale).
                </p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Kullanıcı e-postası ile ara..."
                        className="w-full bg-[#020617] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white outline-none focus:border-blue-500 transition-all"
                    />
                </div>
                <button
                    type="submit"
                    disabled={searching}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-6 py-3.5 rounded-2xl transition-all"
                >
                    {searching ? <Loader2 className="animate-spin" size={18} /> : "Ara"}
                </button>
            </form>

            {searched && !searching && !user && (
                <div className="p-8 text-center bg-slate-950/50 rounded-3xl border border-white/5 border-dashed">
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Bu e-postayla kayıtlı kullanıcı bulunamadı.</p>
                </div>
            )}

            {user && (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                    <div className="bg-[#020617] border border-white/10 rounded-3xl p-6 space-y-4">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">İşlem Geçmişi</h3>
                        {transactions.length === 0 ? (
                            <p className="text-xs text-slate-500 py-8 text-center">Henüz cüzdan hareketi yok.</p>
                        ) : (
                            <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                                        <div>
                                            <p className="text-slate-300 font-bold">{tx.description || tx.type}</p>
                                            <p className="text-slate-600 mt-0.5">{new Date(tx.createdAt).toLocaleString("tr-TR")}</p>
                                        </div>
                                        <span className={tx.amount >= 0 ? "text-emerald-400 font-black" : "text-red-400 font-black"}>
                                            {tx.amount >= 0 ? "+" : ""}₺{tx.amount.toLocaleString("tr-TR")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-[#020617] border border-white/10 rounded-3xl p-6 space-y-5 h-fit">
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{user.name}</p>
                            <p className="text-[10px] text-slate-600">{user.email}</p>
                            <p className="text-3xl font-black text-white mt-3">₺{user.walletBalance.toLocaleString("tr-TR")}</p>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/5">
                            <input
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Tutar (₺)"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all"
                            />
                            <input
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                type="text"
                                placeholder="Sebep (ör. Havale onayı, promosyon...)"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => adjust(1)}
                                    disabled={submitting}
                                    className="flex-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                                >
                                    <Plus size={16} /> Bakiye Ekle
                                </button>
                                <button
                                    onClick={() => adjust(-1)}
                                    disabled={submitting}
                                    className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                                >
                                    <Minus size={16} /> Bakiye Düş
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
