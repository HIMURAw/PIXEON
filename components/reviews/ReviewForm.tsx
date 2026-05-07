"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, Send, User, ChevronDown, Package, Search, CheckCircle } from "lucide-react";
import Image from "next/image";
import { createReview, getProductsForReview } from "@/lib/actions/review-actions";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
    userId: string;
    userName: string;
    userImage?: string;
}

const GENERAL_OPTION = { id: "general", name: "Genel Yorum (Mağaza Deneyimi)" };

export default function ReviewForm({ userId, userName, userImage }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [productId, setProductId] = useState<string>("general");
    const [selectedLabel, setSelectedLabel] = useState(GENERAL_OPTION.name);
    const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
    const [search, setSearch] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getProductsForReview().then(setProducts);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const allOptions = [GENERAL_OPTION, ...products];
    const filtered = allOptions.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (id: string, name: string) => {
        setProductId(id);
        setSelectedLabel(name);
        setDropdownOpen(false);
        setSearch("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setLoading(true);
        const result = await createReview({
            productId: productId === "general" ? null : productId,
            userId,
            rating,
            comment
        });

        setLoading(false);
        if (result.success) {
            setSubmitted(true);
            setComment("");
            setProductId("general");
            setSelectedLabel(GENERAL_OPTION.name);
            setRating(5);
        } else {
            alert(result.error);
        }
    };

    if (submitted) {
        return (
            <div className="bg-slate-900/50 border border-emerald-500/20 p-8 rounded-2xl text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mx-auto">
                    <CheckCircle size={32} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Teşekkürler!</h3>
                    <p className="text-slate-400 text-sm">Yorumunuz başarıyla alındı ve onay sürecine eklendi.</p>
                </div>
                <button
                    onClick={() => setSubmitted(false)}
                    className="w-full bg-slate-800 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-slate-700 transition-all border border-white/5"
                >
                    Yeni Yorum Yap
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl space-y-6 shadow-xl">
            {/* Rating + Comment Area First */}
            <div className="space-y-4">
                <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Puanınız</span>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                className="p-0.5 transition-transform hover:scale-110"
                            >
                                <Star
                                    size={18}
                                    className={cn(
                                        "transition-colors",
                                        (hover || rating) >= star ? "text-yellow-500 fill-yellow-500" : "text-slate-800"
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <textarea
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Deneyiminizi anlatın..."
                        className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 text-sm text-white outline-none focus:border-blue-500/30 transition-all min-h-[120px] resize-none"
                    ></textarea>
                </div>
            </div>

            {/* Product Dropdown */}
            <div className="relative z-20" ref={dropdownRef}>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1 block mb-2">
                    Yorum Konusu
                </label>

                <button
                    type="button"
                    onClick={() => { setDropdownOpen(prev => !prev); setSearch(""); }}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white flex items-center justify-between gap-3 hover:border-white/10 transition-all outline-none"
                >
                    <span className="flex items-center gap-2 truncate text-slate-300">
                        {productId === "general"
                            ? <><span className="text-base">🌐</span><span className="truncate">Genel Mağaza Deneyimi</span></>
                            : <><Package size={14} className="text-blue-500 shrink-0" /><span className="truncate">{selectedLabel}</span></>
                        }
                    </span>
                    <ChevronDown size={16} className={cn("text-slate-500 transition-transform duration-300", dropdownOpen && "rotate-180")} />
                </button>

                {dropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-2 border-b border-white/5">
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg px-3 py-2">
                                <Search size={14} className="text-slate-600" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Ara..."
                                    className="bg-transparent text-sm text-white outline-none w-full"
                                />
                            </div>
                        </div>

                        <div className="max-h-52 overflow-y-auto">
                            {filtered.map(p => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => handleSelect(p.id, p.name)}
                                    className={cn(
                                        "w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600/10 transition-colors",
                                        productId === p.id ? "text-blue-400" : "text-slate-400"
                                    )}
                                >
                                    {p.id === "general" ? "🌐" : <Package size={12} />}
                                    <span className="truncate">{p.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Comment */}
            <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1 block">
                    Yorumunuz
                </label>
                <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Deneyiminizi anlatın..."
                    className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 text-sm text-white outline-none focus:border-blue-500/30 transition-all min-h-[120px] resize-none"
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={loading || !comment.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-900 disabled:text-slate-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10 active:scale-[0.98] uppercase text-xs tracking-widest"
            >
                {loading ? "GÖNDERİLİYOR..." : "YORUMU YAYINLA"}
            </button>
        </form>
    );
}
