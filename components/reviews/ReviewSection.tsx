import React from "react";
import Image from "next/image";
import { MessageSquare, Star, Quote, Heart, Package } from "lucide-react";
import { getApprovedReviews } from "@/lib/actions/review-actions";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ReviewForm from "./ReviewForm";
import ReviewLikeButton from "./ReviewLikeButton";
import { cn } from "@/lib/utils";

export default async function ReviewSection() {
    const session = await getSession();
    
    let currentUser = null;
    if (session?.user) {
        currentUser = await db.query.users.findFirst({
            where: eq(users.id, session.user.id)
        });
    }

    const reviews = await getApprovedReviews(currentUser?.id);

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="space-y-16 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border border-blue-500/20 backdrop-blur-md">
                            <MessageSquare size={13} className="animate-bounce" />
                            PİXEON TOPLULUĞU
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
                                Gerçek <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Deneyimler</span>
                            </h2>
                            <p className="text-slate-400 max-w-xl text-lg font-medium leading-relaxed">
                                Oyuncuların ve teknoloji meraklılarının paylaştığı objektif görüşlerle PIXEON farkını keşfedin.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-10 bg-white/[0.03] border border-white/10 p-8 rounded-[40px] backdrop-blur-xl shadow-2xl relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="text-center relative z-10">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">GENEL PUAN</p>
                            <div className="flex items-center gap-3">
                                <span className="text-4xl font-black text-white leading-none">4.9</span>
                                <div className="flex flex-col">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-600 uppercase mt-1">1,248 Yorum</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-12 w-px bg-white/10 relative z-10"></div>
                        <div className="text-center relative z-10">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">MEMNUNİYET</p>
                            <p className="text-4xl font-black text-blue-500 leading-none">98%</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Form or Login */}
                    <div className="lg:col-span-4 sticky top-24">
                        {currentUser ? (
                            <div className="space-y-6">
                                <h3 className="text-lg font-black text-white px-4 uppercase tracking-widest flex items-center gap-2">
                                    <Quote size={18} className="text-blue-500" />
                                    Deneyiminizi Paylaşın
                                </h3>
                                <ReviewForm
                                    userId={currentUser.id}
                                    userName={currentUser.name}
                                    userImage={currentUser.image ?? undefined}
                                />
                            </div>
                        ) : (
                            <div className="bg-[#0b1220]/50 border border-white/10 p-10 rounded-[48px] backdrop-blur-xl flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent"></div>
                                <div className="w-24 h-24 bg-slate-900 rounded-[32px] border border-white/10 flex items-center justify-center text-slate-600 group-hover:text-blue-500 transition-colors duration-500 relative shadow-2xl">
                                    <Quote size={40} className="relative z-10" />
                                    <div className="absolute inset-0 bg-blue-500/20 rounded-[32px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <h4 className="text-2xl font-black text-white">Sizi Dinliyoruz</h4>
                                    <p className="text-slate-400 font-medium leading-relaxed">
                                        PIXEON deneyiminizi paylaşarak diğer kullanıcılara yol gösterin.
                                    </p>
                                </div>
                                <button className="relative z-10 w-full bg-white text-slate-950 font-black px-10 py-5 rounded-2xl hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-xl shadow-white/5 active:scale-95">
                                    GİRİŞ YAP / KAYIT OL
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Reviews Grid */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviews.length === 0 ? (
                                <div className="col-span-full h-[400px] flex flex-col items-center justify-center text-slate-600 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[48px] p-12 group">
                                    <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <MessageSquare size={32} className="opacity-20" />
                                    </div>
                                    <p className="font-black uppercase tracking-[0.2em] text-sm text-slate-500">Henüz bir yorum yapılmamış.</p>
                                    <p className="text-slate-600 text-xs mt-2 font-medium">İlk yorumu yapan siz olun!</p>
                                </div>
                            ) : (
                                reviews.map((rv: any) => (
                                    <div 
                                        key={rv.id} 
                                        className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px] space-y-6 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-500 group flex flex-col backdrop-blur-sm relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                            <Quote size={60} />
                                        </div>

                                        {/* Stars + Date */}
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        size={14} 
                                                        className={cn(
                                                            "transition-all duration-300",
                                                            i < rv.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-800"
                                                        )} 
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{new Date(rv.createdAt).toLocaleDateString('tr-TR')}</span>
                                        </div>

                                        {/* Product badge */}
                                        {rv.product?.name && (
                                            <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600/10 text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-500/10 w-fit group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                                <Package size={12} />
                                                {rv.product.name}
                                            </div>
                                        )}

                                        {/* Comment */}
                                        <p className="relative z-10 text-slate-300 text-[15px] font-medium italic leading-relaxed flex-1">
                                            "{rv.comment}"
                                        </p>

                                        {/* User + Like */}
                                        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden flex items-center justify-center text-blue-400 font-black text-sm relative border border-white/5 shadow-inner">
                                                    {rv.user.image ? (
                                                        <Image src={rv.user.image} alt={rv.user.name} fill className="object-cover" />
                                                    ) : (
                                                        rv.user.name[0]
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-white uppercase tracking-wider">{rv.user.name}</span>
                                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight">Doğrulanmış Müşteri</span>
                                                </div>
                                            </div>

                                            <ReviewLikeButton
                                                reviewId={rv.id}
                                                initialLikes={rv.likes}
                                                initialLiked={rv.likedByUser}
                                                userId={currentUser?.id ?? null}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
