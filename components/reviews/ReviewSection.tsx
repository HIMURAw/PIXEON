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
        <section className="space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                        <MessageSquare size={12} />
                        Müşteri Deneyimleri
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tight">
                        Kullanıcı <span className="text-blue-500">Yorumları</span>
                    </h2>
                    <p className="text-slate-500 max-w-xl text-lg font-medium leading-relaxed">
                        PIXEON topluluğunun bir parçası olan kullanıcılarımızın deneyimlerine göz atın ve kendi görüşlerinizi paylaşın.
                    </p>
                </div>

                <div className="flex items-center gap-12 bg-slate-900/30 border border-white/5 p-6 rounded-[32px] backdrop-blur-sm">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Ortalama Puan</p>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-black text-white">4.9</span>
                            <Star size={20} className="text-yellow-400 fill-yellow-400" />
                        </div>
                    </div>
                    <div className="h-10 w-px bg-white/10"></div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Mutlu Müşteri</p>
                        <p className="text-3xl font-black text-white">1.2K+</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Review Form or Login Prompt */}
                <div className="lg:col-span-1">
                    {currentUser ? (
                        <ReviewForm
                            userId={currentUser.id}
                            userName={currentUser.name}
                            userImage={currentUser.image ?? undefined}
                        />
                    ) : (
                        <div className="bg-[#020617] border border-white/10 p-8 rounded-[32px] h-full flex flex-col items-center justify-center text-center space-y-6">
                            <div className="w-16 h-16 bg-slate-900 rounded-3xl border border-white/10 flex items-center justify-center text-slate-700">
                                <Quote size={32} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-black text-white">Fikriniz Bizim İçin Değerli</h4>
                                <p className="text-slate-500 text-sm font-medium">Yorum yapabilmek için lütfen önce giriş yapın veya hesap açın.</p>
                            </div>
                            <button className="bg-white text-slate-950 font-black px-8 py-3 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                                GİRİŞ YAP
                            </button>
                        </div>
                    )}
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.length === 0 ? (
                        <div className="col-span-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-900/20 border border-dashed border-white/5 rounded-[32px] p-12">
                            <MessageSquare size={48} className="opacity-20 mb-4" />
                            <p className="font-bold uppercase tracking-widest text-xs">Henüz yorum yapılmamış.</p>
                        </div>
                    ) : (
                        reviews.map((rv: any) => (
                            <div key={rv.id} className="bg-slate-900/30 border border-white/5 p-8 rounded-[32px] space-y-5 hover:border-white/10 transition-all group flex flex-col">
                                {/* Stars + Date */}
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={cn(i < rv.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-800")} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-slate-600 font-bold uppercase">{new Date(rv.createdAt).toLocaleDateString('tr-TR')}</span>
                                </div>

                                {/* Product badge */}
                                {rv.product?.name && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/10 w-fit">
                                        <Package size={10} />
                                        {rv.product.name}
                                    </div>
                                )}

                                {/* Comment */}
                                <p className="text-slate-300 text-sm font-medium italic leading-relaxed flex-1">"{rv.comment}"</p>

                                {/* User + Like */}
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-600/10 rounded-lg overflow-hidden flex items-center justify-center text-blue-400 font-black text-xs relative">
                                            {rv.user.image ? (
                                                <Image src={rv.user.image} alt={rv.user.name} fill className="object-cover" />
                                            ) : (
                                                rv.user.name[0]
                                            )}
                                        </div>
                                        <span className="text-xs font-black text-white uppercase tracking-wider">{rv.user.name}</span>
                                    </div>

                                    {/* Like button */}
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
        </section>
    );
}
