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
        return <div className="h-[320px] bg-slate-900 animate-pulse rounded-xl border border-white/5" />;
    }

    if (!banner) {
        return (
            <div className="relative h-[320px] rounded-xl overflow-hidden text-white">
                <img
                    src="/products/dualsense.png"
                    alt="DualSense"
                    className="absolute inset-0 w-full h-full object-contain bg-slate-900"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 p-6 flex flex-col h-full">
                    <span className="text-xs uppercase font-bold text-blue-400">
                        KONTROLÜ ELİNE AL
                    </span>
                    <h3 className="text-lg font-semibold mt-2 leading-snug text-white">
                        DualSense™ <br />
                        <span className="font-bold text-white">Kablosuz Kontrolcü</span>
                    </h3>
                    <p className="text-[10px] mt-2 text-gray-300">Haptik Geri Bildirim ve Uyarlanabilir Tetikler.</p>
                    <span className="text-2xl font-bold text-white mt-1">
                        2.999 ₺
                    </span>
                    <div className="flex-1" />
                    <button className="cursor-pointer self-start bg-blue-600 hover:bg-blue-700 transition px-4 py-1.5 rounded-full text-sm font-bold text-white">
                        Şimdi Al
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Link 
            href={banner.link || "#"}
            className="block relative h-[320px] rounded-xl overflow-hidden group border border-white/5"
        >
            <img
                src={banner.image}
                alt={banner.title || ""}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="relative z-10 p-6 flex flex-col h-full justify-end">
                {banner.title && (
                    <span className="text-xs uppercase font-black text-blue-400 mb-1">
                        {banner.title}
                    </span>
                )}
                {banner.subtitle && (
                    <h3 className="text-lg font-black leading-tight text-white line-clamp-2">
                        {banner.subtitle}
                    </h3>
                )}
            </div>
        </Link>
    );
}
