"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getActiveBannersByPosition } from "@/lib/actions/banner-actions";
import { cn } from "@/lib/utils";

interface BannerSectionProps {
    position: string;
    className?: string;
}

interface Banner {
    id: string | number;
    image: string;
    link?: string | null;
    title?: string | null;
    subtitle?: string | null;
}

export default function BannerSection({ position, className }: BannerSectionProps) {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getActiveBannersByPosition(position).then(res => {
            if (res.success && res.banners) {
                setBanners(res.banners);
            }
            setLoading(false);
        });
    }, [position]);

    if (loading) {
        return (
            <div className={cn("animate-pulse bg-white/5 rounded-3xl", className)}>
                <div className="w-full h-full" />
            </div>
        );
    }

    if (banners.length === 0) return null;

    return (
        <div className={cn("space-y-4", className)}>
            {banners.map((banner) => (
                <Link 
                    key={banner.id} 
                    href={banner.link || "#"}
                    className="block group relative overflow-hidden rounded-[32px] border border-white/10 aspect-video lg:aspect-auto"
                >
                    <img 
                        src={banner.image} 
                        alt={banner.title || ""} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                    
                    {(banner.title || banner.subtitle) && (
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-8">
                            {banner.title && (
                                <h3 className="text-xl lg:text-2xl font-black text-white tracking-tight leading-tight">
                                    {banner.title}
                                </h3>
                            )}
                            {banner.subtitle && (
                                <p className="text-sm text-slate-300 mt-2 line-clamp-2 max-w-md">
                                    {banner.subtitle}
                                </p>
                            )}
                        </div>
                    )}
                </Link>
            ))}
        </div>
    );
}
