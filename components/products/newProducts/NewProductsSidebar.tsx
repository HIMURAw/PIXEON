"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getActiveBannersByPosition } from "@/lib/actions/banner-actions";

export default function NewProductsSidebar() {
    const [banner, setBanner] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getActiveBannersByPosition("promo-vertical-3").then(res => {
            if (res.success && res.banners && res.banners.length > 0) {
                setBanner(res.banners[0]);
            }
            setLoading(false);
        });
    }, []);

    return (
        <div className="space-y-5">
            {/* Günün Fırsatı Kartı */}
            {loading ? (
                <div className="w-full h-[260px] bg-slate-900 animate-pulse rounded-xl border border-white/5" />
            ) : banner ? (
                <Link href={banner.link || "#"} className="block relative rounded-xl overflow-hidden group cursor-pointer border border-white/5">
                    <img
                        src={banner.image}
                        alt={banner.title || ""}
                        className="w-full h-[260px] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        {banner.title && (
                            <span className="inline-block text-[10px] uppercase tracking-widest text-blue-300 font-black mb-1">
                                {banner.title}
                            </span>
                        )}
                        {banner.subtitle && (
                            <h4 className="text-white text-sm font-black leading-tight line-clamp-2">
                                {banner.subtitle}
                            </h4>
                        )}
                    </div>
                </Link>
            ) : (
                <div className="relative rounded-xl overflow-hidden group cursor-pointer">
                    <img
                        src="/products/ps5-pro-sidebar.png"
                        alt="Günün Fırsatı"
                        className="w-full h-[260px] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="inline-block text-[10px] uppercase tracking-widest text-blue-300 font-semibold mb-1">
                            Geleceğin Gücü
                        </span>
                        <h4 className="text-white text-sm font-bold leading-tight">
                            PlayStation 5 Pro <br />
                            <span className="text-blue-400">Şimdi Stoklarımızda</span>
                        </h4>
                        <button className="cursor-pointer mt-3 bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-1.5 rounded-full transition-colors font-bold">
                            Hemen İncele
                        </button>
                    </div>
                </div>
            )}

            {/* Hızlı Kategoriler */}
            <div className="bg-[#0b1220] border border-white/10 rounded-xl p-4">
                <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full inline-block"></span>
                    Popüler Kategoriler
                </h4>
                <div className="space-y-2">
                    {[
                        { icon: "🎮", label: "Konsollar", count: 12 },
                        { icon: "💿", label: "PS5 Oyunları", count: 124 },
                        { icon: "🕹️", label: "Kontrolcüler", count: 28 },
                        { icon: "🎧", label: "Kulaklıklar", count: 14 },
                        { icon: "💳", label: "Hediye Kartları", count: 42 },
                    ].map((cat) => (
                        <div
                            key={cat.label}
                            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{cat.icon}</span>
                                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                    {cat.label}
                                </span>
                            </div>
                            <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                                {cat.count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ücretsiz Kargo Bilgisi */}
            <div className="bg-[#0b1220] border border-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🚚</div>
                <h4 className="text-white text-sm font-bold">
                    Ücretsiz Kargo
                </h4>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                    10.000 ₺ ve üzeri alışverişlerde <br />
                    kargo tamamen ücretsiz!
                </p>
                <div className="mt-3 flex items-center justify-center gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                    <span className="text-blue-400 text-[11px] font-medium">Aktif Kampanya</span>
                </div>
            </div>
        </div>
    );
}
