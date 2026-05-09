"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getBlogPosts } from "@/lib/actions/blog-actions";
import { Calendar, ChevronRight, BookOpen } from "lucide-react";

export default function BlogHomepageSection() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBlogPosts().then(res => {
            if (res.success && res.posts) {
                setPosts(res.posts.filter(p => p.status === "PUBLISHED").slice(0, 3));
            }
            setLoading(false);
        });
    }, []);

    if (!loading && posts.length === 0) return null;

    return (
        <section className="py-20">
            <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
                        <BookOpen className="text-blue-500" size={32} />
                        Blog & Haberler
                    </h2>
                    <p className="text-slate-500 font-medium">Oyun dünyasındaki en son gelişmeleri takip edin.</p>
                </div>
                <Link 
                    href="/blog" 
                    className="group flex items-center gap-2 text-xs font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest"
                >
                    Tümünü Gör
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="aspect-[4/3] bg-white/5 animate-pulse rounded-[32px]" />
                    ))
                ) : (
                    posts.map(post => (
                        <Link 
                            key={post.id} 
                            href={`/blog/${post.slug}`}
                            className="group bg-slate-900/40 border border-white/5 rounded-[32px] overflow-hidden hover:border-blue-500/30 transition-all duration-500"
                        >
                            <div className="aspect-video relative overflow-hidden">
                                <img 
                                    src={post.image || "/placeholder.jpg"} 
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                            </div>
                            <div className="p-8 space-y-4">
                                <div className="flex items-center gap-3 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                                    <Calendar size={12} />
                                    {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                                    {post.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </section>
    );
}
