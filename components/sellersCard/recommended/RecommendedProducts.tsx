"use client";

import { useEffect, useRef, useState } from "react";
import BestSellerCard from "../bestSellers/bestSellerCard";
import { getRecommendedProducts } from "@/lib/actions/product-actions";

export type Product = {
    id: string;
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    discount?: string | null;
    category?: string;
    slug: string;
};

export default function RecommendedProducts() {
    const [dbProducts, setDbProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoading(true);
            try {
                const visited = localStorage.getItem("visited_categories");
                const visitedCategories: string[] = visited ? JSON.parse(visited) : [];
                
                const data = await getRecommendedProducts(visitedCategories);
                const mapped = data.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    image: p.image || "/placeholder.png",
                    price: p.price.toString(),
                    oldPrice: p.oldPrice?.toString(),
                    discount: p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) + "%" : null,
                    category: p.category?.name || "Ürün",
                    slug: p.slug
                }));
                setDbProducts(mapped);
            } catch (error) {
                console.error("Failed to load recommended products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendations();
    }, []);

    useEffect(() => {
        if (loading || !sectionRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(sectionRef.current);

        return () => observer.disconnect();
    }, [loading]);

    if (loading) {
        return (
            <section className="space-y-10">
                <div className="space-y-2">
                    <div className="h-6 bg-white/5 w-48 rounded-md animate-pulse" />
                    <div className="h-4 bg-white/5 w-64 rounded-md animate-pulse" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-[4/5] bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </section>
        );
    }

    if (dbProducts.length === 0) return null;

    return (
        <section
            ref={sectionRef}
            className={`space-y-10 transition-all duration-1000 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        Önerilen Ürünler
                    </h2>
                    <p className="text-sm text-gray-400">
                        Ziyaret ettiğiniz kategorilere göre sizin için seçtiklerimiz.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {dbProducts.map(product => (
                    <BestSellerCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
