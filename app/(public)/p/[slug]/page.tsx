import React from "react";
import { getPageBySlug } from "@/lib/actions/cms-actions";
import { notFound } from "next/navigation";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";

export default async function CMSPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const res = await getPageBySlug(slug);

    if (!res.success || !res.page || res.page.status !== "PUBLISHED") {
        notFound();
    }

    const page = res.page;

    return (
        <>
            <TopBar />
            <MainBar />
            <Head />
            
            <div className="min-h-screen bg-[#020617] text-white py-20">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">
                        {page.title}
                    </h1>
                    
                    <div className="w-20 h-1 bg-blue-600 mb-12" />

                    <article 
                        className="prose prose-invert prose-blue max-w-none 
                        prose-headings:font-black prose-headings:tracking-tight
                        prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-lg
                        prose-strong:text-white prose-strong:font-bold
                        prose-ul:list-disc prose-li:text-slate-400
                        "
                        dangerouslySetInnerHTML={{ __html: page.content || "" }}
                    />
                </div>
            </div>

            <Footer />
        </>
    );
}
