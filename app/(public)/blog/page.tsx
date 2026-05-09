import React from "react";
import { getBlogPosts } from "@/lib/actions/blog-actions";
import Link from "next/link";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import { Calendar, Clock, ChevronRight } from "lucide-react";

export default async function BlogListPage() {
    const res = await getBlogPosts();
    const posts = res.success ? res.posts?.filter(p => p.status === "PUBLISHED") : [];

    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="min-h-screen bg-[#020617] text-white py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 text-center">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                            Blog & <span className="text-blue-500">Haberler</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                            Oyun dünyasından en son haberler, incelemeler ve PIXEON duyuruları burada.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts?.map((post) => (
                            <Link 
                                key={post.id} 
                                href={`/blog/${post.slug}`}
                                className="group bg-slate-900/50 border border-white/5 rounded-[32px] overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
                            >
                                <div className="aspect-video relative overflow-hidden">
                                    <img 
                                        src={post.image || "/placeholder.jpg"} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                                </div>
                                <div className="p-8 space-y-4">
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={12} className="text-blue-500" />
                                            {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={12} className="text-blue-500" />
                                            5 dk okuma
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                                        {post.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed font-medium">
                                        {post.excerpt}
                                    </p>
                                    <div className="pt-4 flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-widest group-hover:gap-3 transition-all">
                                        Devamını Oku
                                        <ChevronRight size={14} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {posts?.length === 0 && (
                        <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[48px]">
                            <p className="text-slate-500 font-bold">Henüz bir blog yazısı paylaşılmamış.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
