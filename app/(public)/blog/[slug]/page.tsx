import React from "react";
import { getBlogPostBySlug } from "@/lib/actions/blog-actions";
import { notFound } from "next/navigation";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import { Calendar, User, Clock, Share2 } from "lucide-react";
import Script from "next/script";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const res = await getBlogPostBySlug(slug);
    const post = res.post;

    if (!post) return { title: "Blog Yazısı Bulunamadı" };

    return {
        title: `${post.title} | Blog`,
        description: post.excerpt || `${post.title} hakkında detaylı bilgiler ve oyun dünyasından haberler.`,
        openGraph: {
            title: post.title,
            description: post.excerpt || "",
            images: post.image ? [{ url: post.image }] : [],
            type: "article",
            publishedTime: post.createdAt.toString(),
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt || "",
            images: post.image ? [post.image] : [],
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const res = await getBlogPostBySlug(slug);

    if (!res.success || !res.post || res.post.status !== "PUBLISHED") {
        notFound();
    }

    const post = res.post;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.image,
        "datePublished": post.createdAt.toISOString(),
        "author": [{
            "@type": "Person",
            "name": "PIXEON Editor",
            "url": "https://pixeon.com"
        }],
        "description": post.excerpt
    };

    return (
        <>
            <Script
                id="blog-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <TopBar />
            <MainBar />
            <Head />

            <div className="min-h-screen bg-[#020617] text-white">
                {/* Hero Section */}
                <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
                    <img
                        src={post.image || "/placeholder.jpg"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-20">
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div className="flex flex-wrap items-center gap-6 text-[10px] md:text-xs font-black uppercase tracking-widest text-blue-400">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                                </div>
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    EDİTÖR
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    5 DK OKUMA
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[0.9]">
                                {post.title}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-4xl mx-auto px-6 py-20">
                    <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed mb-16 border-l-4 border-blue-600 pl-8">
                        {post.excerpt}
                    </p>

                    <article
                        className="prose prose-invert prose-blue max-w-none 
                        prose-headings:font-black prose-headings:tracking-tight
                        prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-lg
                        prose-strong:text-white prose-strong:font-bold
                        prose-ul:list-disc prose-li:text-slate-400
                        prose-img:rounded-[32px] prose-img:border prose-img:border-white/5
                        "
                        dangerouslySetInnerHTML={{ __html: post.content || "" }}
                    />
                </div>
            </div>

            <Footer />
        </>
    );
}
