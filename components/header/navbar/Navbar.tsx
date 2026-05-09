"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getBlogPosts } from "@/lib/actions/blog-actions";
import { ChevronDown, BookOpen, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const [posts, setPosts] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        getBlogPosts().then(res => {
            if (res.success && res.posts) {
                setPosts(res.posts.filter(p => p.status === "PUBLISHED").slice(0, 4));
            }
        });
    }, []);

    return (
        <div className="hidden md:flex items-center gap-4">
            <Link href="/hakkimizda" className="hover:text-blue-400 text-[#696e7f] text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap">Hakkımızda</Link>
            <Link href="/hesabim" className="hover:text-blue-400 text-[#696e7f] text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap">Hesabım</Link>
            <Link href="/istek-listesi" className="hover:text-blue-400 text-[#696e7f] text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap">İstek Listesi</Link>
            <Link href="/siparis-takibi" className="hover:text-blue-400 text-[#696e7f] text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap">Sipariş Takibi</Link>
            <Link href="/support/my-tickets" className="hover:text-blue-400 text-[#696e7f] text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap">Destek Taleplerim</Link>
            
            {/* Bloglar Dropdown */}
            <div 
                className="relative group"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <Link 
                    href="/blog" 
                    className={cn(
                        "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap",
                        isOpen ? "text-blue-400" : "text-[#696e7f] hover:text-blue-400"
                    )}
                >
                    Bloglar
                    <ChevronDown size={14} className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
                </Link>

                {/* Dropdown Menu */}
                <div className={cn(
                    "absolute top-full -left-20 mt-4 w-80 bg-[#020617] border border-white/10 rounded-2xl shadow-2xl p-4 transition-all duration-300 z-[100]",
                    isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                )}>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Son Paylaşılanlar</span>
                            <Link href="/blog" className="text-[9px] font-bold text-slate-500 hover:text-white uppercase transition-colors">Tümünü Gör</Link>
                        </div>
                        
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <Link 
                                    key={post.id} 
                                    href={`/blog/${post.slug}`}
                                    className="flex items-center gap-3 group/item p-2 rounded-xl hover:bg-white/5 transition-all"
                                >
                                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/5">
                                        <img src={post.image || "/placeholder.jpg"} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-xs font-bold text-slate-200 group-hover/item:text-blue-400 transition-colors truncate">{post.title}</h4>
                                        <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-500 font-bold uppercase">
                                            <Clock size={10} />
                                            {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="py-4 text-center">
                                <p className="text-[10px] text-slate-600 font-bold uppercase">Yazı bulunamadı.</p>
                            </div>
                        )}
                        
                        <Link 
                            href="/blog"
                            className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/20"
                        >
                            <BookOpen size={14} />
                            BLOG SAYFASINA GİT
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
