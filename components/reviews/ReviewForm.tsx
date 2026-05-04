"use client";

import React, { useState } from "react";
import { Star, Send, User } from "lucide-react";
import Image from "next/image";
import { createReview } from "@/lib/actions/review-actions";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
    userId: string;
    userName: string;
    userImage?: string;
}

export default function ReviewForm({ userId, userName, userImage }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setLoading(true);
        const result = await createReview({
            productId: null as any, // Site-wide review
            userId,
            rating,
            comment
        });

        setLoading(false);
        if (result.success) {
            setSubmitted(true);
            setComment("");
        } else {
            alert(result.error);
        }
    };

    if (submitted) {
        return (
            <div className="bg-slate-900/50 border border-emerald-500/20 p-8 rounded-[32px] text-center space-y-4 animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <Star size={32} fill="currentColor" />
                </div>
                <h3 className="text-xl font-black text-white">Teşekkürler!</h3>
                <p className="text-slate-400 text-sm">Yorumunuz başarıyla gönderildi ve onaylandıktan sonra yayına alınacaktır.</p>
                <button 
                    onClick={() => setSubmitted(false)}
                    className="text-blue-400 text-xs font-black uppercase tracking-widest hover:underline"
                >
                    YENİ BİR YORUM YAP
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-[#020617] border border-white/10 p-8 rounded-[32px] space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center text-slate-500 relative">
                        {userImage ? (
                            <Image src={userImage} alt={userName} fill className="object-cover" />
                        ) : (
                            <User size={20} />
                        )}
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white">{userName}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Görüşlerinizi Paylaşın</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="p-1 transition-all hover:scale-110"
                        >
                            <Star 
                                size={20} 
                                className={cn(
                                    "transition-colors",
                                    (hover || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-slate-700"
                                )} 
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative z-10">
                <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Deneyiminizi anlatın..."
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all min-h-[120px] resize-none placeholder:text-slate-700"
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={loading || !comment.trim()}
                className="relative z-10 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <>
                        <Send size={18} />
                        YORUMU GÖNDER
                    </>
                )}
            </button>
        </form>
    );
}
