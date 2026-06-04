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

export default function PromoVerticalSmall() {
    const [banner, setBanner] = useState<Banner | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getActiveBannersByPosition("promo-vertical-small").then(res => {
            if (res.success && res.banners && res.banners.length > 0) {
                setBanner(res.banners[0]);
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="h-[160px] lg:h-[280px] bg-slate-900 animate-pulse rounded-xl border border-white/5" />;
    }

    if (!banner) {
        return (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-sm border border-white/5 h-[160px] lg:h-auto">
                <div className="flex flex-row lg:block h-full w-full">
                    <div className="flex-1 p-4 flex flex-col justify-center">
                        <span className="text-[10px] lg:text-xs text-blue-400 font-bold">
                            PlayStation Plus
                        </span>
                        <h3 className="text-sm lg:text-base font-semibold mt-0.5 lg:mt-1 text-white leading-tight">
                            Sınırsız Eğlenceyi <br className="hidden lg:block" />
                            <span className="font-bold"> Keşfet</span>
                        </h3>
                        <p className="hidden sm:block lg:block text-[10px] mt-2 text-gray-400 uppercase tracking-tighter">
                            Aylık Oyunlar ve Çok Oyunculu Mod
                        </p>
                        <span className="text-xs lg:text-xl font-bold text-white mt-1">
                            270 ₺&apos;den başlayan fiyatlarla
                        </span>
                    </div>
                    <div className="w-1/3 lg:w-full h-full relative flex items-center justify-center p-2">
                        <img
                            src="/products/psplus-card.png"
                            alt="PS Plus"
                            className="max-h-full max-w-full object-contain"
                            loading="lazy"
                        />
                        <button className="cursor-pointer absolute bottom-2 lg:bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] lg:text-xs px-3 py-1 lg:px-4 lg:py-1.5 rounded-full hover:bg-blue-700 transition font-bold whitespace-nowrap shadow-md">
                            Üye Ol
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Link 
            href={banner.link || "#"}
            className="block relative rounded-xl overflow-hidden group border border-white/5 bg-slate-900 h-[160px] lg:h-auto"
        >
            <div className="flex flex-row lg:block h-full w-full">
                <div className="flex-1 p-4 lg:p-5 flex flex-col justify-center lg:justify-start">
                    {banner.title && (
                        <span className="text-[10px] lg:text-xs text-blue-400 font-black uppercase tracking-widest">
                            {banner.title}
                        </span>
                    )}
                    {banner.subtitle && (
                        <h3 className="text-sm lg:text-lg font-black text-white mt-1 leading-tight line-clamp-2">
                            {banner.subtitle}
                        </h3>
                    )}
                </div>
                <div className="w-1/3 lg:w-full h-full lg:h-44 relative overflow-hidden">
                    <img
                        src={banner.image}
                        alt={banner.title || ""}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                </div>
            </div>
        </Link>
    );
}
