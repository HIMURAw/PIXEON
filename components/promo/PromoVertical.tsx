"use client";

import React, { useEffect, useState } from "react";
import { getActiveBannersByPosition } from "@/lib/actions/banner-actions";
import Link from "next/link";

export default function PromoVertical() {
    const [banner, setBanner] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getActiveBannersByPosition("promo-vertical-2").then(res => {
            if (res.success && res.banners && res.banners.length > 0) {
                setBanner(res.banners[0]);
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="h-[200px] lg:h-[320px] bg-slate-900 animate-pulse rounded-xl border border-white/5" />;
    }

    if (!banner) {
        return (
            <div className="relative h-[200px] lg:h-[320px] rounded-xl overflow-hidden text-white bg-slate-900 border border-white/5">
                <div className="flex flex-row lg:block h-full w-full">
                    <div className="flex-1 p-5 flex flex-col justify-center lg:absolute lg:inset-0 lg:z-10 lg:p-6 lg:justify-start">
                        <span className="text-[10px] lg:text-xs uppercase font-bold text-blue-400">
                            KONTROLÜ ELİNE AL
                        </span>
                        <h3 className="text-sm lg:text-lg font-semibold mt-1 leading-tight lg:leading-snug text-white">
                            DualSense™ <br className="hidden lg:block" />
                            <span className="font-bold text-white"> Kablosuz Kontrolcü</span>
                        </h3>
                        <p className="hidden sm:block lg:block text-[10px] mt-1 lg:mt-2 text-gray-300">Haptik Geri Bildirim ve Uyarlanabilir Tetikler.</p>
                        <span className="text-lg lg:text-2xl font-bold text-white mt-1">
                            2.999 ₺
                        </span>
                        <button className="cursor-pointer mt-1.5 lg:mt-3 self-start bg-blue-600 hover:bg-blue-700 transition px-3 py-1 lg:px-4 lg:py-1.5 rounded-full text-[11px] lg:text-sm font-bold text-white">
                            Şimdi Al
                        </button>
                    </div>
                    <div className="w-1/3 lg:w-full h-full lg:absolute lg:inset-0 relative flex items-center justify-center p-2 lg:p-0">
                        <img
                            src="/products/dualsense.png"
                            alt="DualSense"
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Link 
            href={banner.link || "#"}
            className="block relative h-[200px] lg:h-[320px] rounded-xl overflow-hidden group border border-white/5"
        >
            <img
                src={banner.image}
                alt={banner.title || ""}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="relative z-10 p-5 lg:p-6 flex flex-col h-full justify-end">
                {banner.title && (
                    <span className="text-[10px] lg:text-xs uppercase font-black text-blue-400 mb-1">
                        {banner.title}
                    </span>
                )}
                {banner.subtitle && (
                    <h3 className="text-sm lg:text-lg font-black leading-tight text-white line-clamp-2">
                        {banner.subtitle}
                    </h3>
                )}
            </div>
        </Link>
    );
}
