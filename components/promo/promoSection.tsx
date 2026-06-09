"use client";

import React, { useEffect, useState } from "react";
import { getActiveBannersByPosition } from "@/lib/actions/banner-actions";
import Link from "next/link";

interface Banner {
    id: string | number;
    image: string;
    link?: string | null;
    title?: string | null;
    subtitle?: string | null;
}

export default function PromoSection() {
    const [banner, setBanner] = useState<Banner | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getActiveBannersByPosition("promo-vertical").then(res => {
            if (res.success && res.banners && res.banners.length > 0) {
                setBanner(res.banners[0]); // Get the latest one
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="w-full h-[280px] lg:h-[680px] bg-slate-900 animate-pulse rounded-2xl border border-white/5" />;
    }

    // Fallback if no dynamic banner is found
    if (!banner) {
        return (
            <div className="w-full h-[280px] lg:h-[680px] px-2 py-1 mt-3 rounded-md overflow-hidden shadow cursor-pointer hover:shadow-md transition-shadow relative">
                <img
                    src="/products/ps-vr2.png"
                    alt="PS VR2"
                    className="w-full h-full object-cover rounded-md"
                    loading="lazy"
                />

                <div className="absolute inset-0 bg-black/45 flex flex-col justify-end p-6 rounded-md">
                    <span className="text-[10px] lg:text-xs uppercase tracking-wider text-blue-400 font-bold">
                        YENİ DÜNYALARI KEŞFET
                    </span>

                    <span className="text-white font-bold text-xl lg:text-2xl leading-tight mt-1 lg:mt-2">
                        PlayStation VR2 Deneyimi
                    </span>

                    <p className="hidden sm:block lg:block text-white/90 text-xs lg:text-sm leading-snug mt-2 lg:mt-3">
                        4K HDR görseller ve duyusal özelliklerle yeni nesil VR oyunlarını keşfedin.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Link 
            href={banner.link || "#"}
            className="block w-full h-[280px] lg:h-[680px] mt-3 rounded-3xl overflow-hidden shadow-2xl relative group border border-white/10"
        >
            <img
                src={banner.image}
                alt={banner.title || ""}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-6 lg:p-8">
                {banner.title && (
                    <span className="text-[10px] lg:text-xs uppercase tracking-widest text-blue-400 font-black mb-1 lg:mb-2">
                        {banner.title}
                    </span>
                )}

                {banner.subtitle && (
                    <span className="text-white font-black text-lg lg:text-2xl leading-tight">
                        {banner.subtitle}
                    </span>
                )}
            </div>
        </Link>
    );
}
