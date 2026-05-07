"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Star, Quote, Heart, Package, PenTool, ShieldCheck, X, Plus } from "lucide-react";
import ReviewForm from "./ReviewForm";
import ReviewLikeButton from "./ReviewLikeButton";
import { cn } from "@/lib/utils";

export default function ReviewSection({ 
    currentUser, 
    reviews: initialReviews 
}: { 
    currentUser: any, 
    reviews: any[] 
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
                    <div className="space-y-3 text-center md:text-left">
                        <h2 className="text-4xl font-bold text-white tracking-tight">Topluluk Görüşleri</h2>
                        <p className="text-slate-400 font-medium max-w-lg">
                            Pixeon kullanıcılarının deneyimlerini inceleyin.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 group text-sm"
                        >
                            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                            BİR YORUM BIRAKIN
                        </button>

                        <div className="flex items-center gap-6 bg-slate-900/50 border border-white/10 p-4 rounded-xl">
                            <div className="text-center px-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 leading-none">PUAN</p>
                                <span className="text-2xl font-bold text-white">4.9</span>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="text-center px-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 leading-none">MEMNUNİYET</p>
                                <p className="text-2xl font-bold text-blue-500">%98</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {initialReviews.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-slate-900/20 border border-dashed border-white/10 rounded-2xl">
                            <p className="text-slate-500 text-sm font-medium">Henüz bir yorum yapılmamış. İlk yorumu siz yapın!</p>
                        </div>
                    ) : (
                        initialReviews.map((rv: any) => (
                            <div 
                                key={rv.id} 
                                className="bg-slate-900/20 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-all flex flex-col group h-full"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={12} 
                                                className={cn(
                                                    i < rv.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-800"
                                                )} 
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-slate-600 font-medium">{new Date(rv.createdAt).toLocaleDateString('tr-TR')}</span>
                                </div>

                                <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1 italic">
                                    "{rv.comment}"
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center text-blue-400 font-bold text-xs border border-white/5">
                                            {rv.user.image ? (
                                                <Image src={rv.user.image} alt={rv.user.name} fill className="object-cover" />
                                            ) : (
                                                rv.user.name[0]
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-white">{rv.user.name}</h4>
                                            <span className="text-[9px] text-slate-600 font-bold uppercase">Doğrulanmış</span>
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

                {/* Review Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div 
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        ></div>
                        <div className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/50">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <PenTool size={18} className="text-blue-500" />
                                    Deneyiminizi Paylaşın
                                </h3>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6">
                                {currentUser ? (
                                    <ReviewForm
                                        userId={currentUser.id}
                                        userName={currentUser.name}
                                        userImage={currentUser.image ?? undefined}
                                    />
                                ) : (
                                    <div className="text-center py-10 space-y-6">
                                        <p className="text-slate-400 text-sm">Yorum yapabilmek için lütfen giriş yapın.</p>
                                        <Link 
                                            href="/login" 
                                            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition-all"
                                        >
                                            Giriş Yap
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
