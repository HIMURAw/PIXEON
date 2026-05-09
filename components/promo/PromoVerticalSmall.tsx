"use client";

import React, { useEffect, useState } from "react";
import { getActiveBannersByPosition } from "@/lib/actions/banner-actions";
import Link from "next/link";

export default function PromoVerticalSmall() {
    const [banner, setBanner] = useState<any>(null);
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
        return <div className="h-[280px] bg-slate-900 animate-pulse rounded-xl border border-white/5" />;
    }

    if (!banner) {
        return (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-sm border border-white/5">
                <div className="p-4">
                    <span className="text-xs text-blue-400 font-bold">
                        PlayStation Plus
                    </span>
                    <h3 className="text-base font-semibold mt-1 text-white">
                        Sınırsız Eğlenceyi <br />
                        <span className="font-bold">Keşfet</span>
                    </h3>
                    <p className="text-[10px] mt-2 text-gray-400 uppercase tracking-tighter">
                        Aylık Oyunlar ve Çok Oyunculu Mod
                    </p>
                    <span className="text-xl font-bold text-white">
                        270 ₺'den başlayan fiyatlarla
                    </span>
                </div>
                <div className="relative">
                    <img
                        src="/products/psplus-card.png"
                        alt="PS Plus"
                        className="w-full h-40 object-contain bg-slate-900"
                    />
                    <button className="cursor-pointer absolute bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1.5 rounded-full hover:bg-blue-700 transition font-bold">
                        Üye Ol
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Link 
            href={banner.link || "#"}
            className="block relative rounded-xl overflow-hidden group border border-white/5 bg-slate-900"
        >
            <div className="p-5">
                {banner.title && (
                    <span className="text-xs text-blue-400 font-black uppercase tracking-widest">
                        {banner.title}
                    </span>
                )}
                {banner.subtitle && (
                    <h3 className="text-lg font-black text-white mt-1 leading-tight line-clamp-2">
                        {banner.subtitle}
                    </h3>
                )}
            </div>
            <div className="relative h-44 overflow-hidden">
                <img
                    src={banner.image}
                    alt={banner.title || ""}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>
        </Link>
    );
}
