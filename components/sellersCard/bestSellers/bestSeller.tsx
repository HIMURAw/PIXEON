"use client";
import { useEffect, useRef, useState } from "react";
import BestSellerCard from "./bestSellerCard";

export type Product = {
    id: number;
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    discount?: string | null;
    organic?: boolean;
    select?: boolean;
};

export const products: Product[] = [
    {
        id: 1,
        name: "PS5 Slim + God of War Ragnarök Paketi",
        image: "/products/ps5-bundle.png",
        price: "21.499",
        discount: null,
        category: "Konsollar"
    },
    {
        id: 2,
        name: "DualSense Edge™ Kablosuz Kontrolcü",
        image: "/products/dualsense-edge.png",
        oldPrice: "9.999",
        price: "8.490",
        discount: "15%",
        category: "Aksesuarlar"
    },
    {
        id: 3,
        name: "Horizon Forbidden West - PS5",
        image: "/products/horizon.png",
        oldPrice: "1.299",
        price: "849",
        discount: "35%",
        category: "Oyunlar"
    },
    {
        id: 4,
        name: "Gran Turismo 7 - PS5",
        image: "/products/gt7.png",
        price: "1.199",
        discount: null,
        category: "Oyunlar"
    },
];

export default function BestSellers() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className={`space-y-10 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        En Çok Satanlar
                    </h2>
                    <p className="text-sm text-gray-400">
                        Mart sonuna kadar güncel fırsatları kaçırmayın.
                    </p>
                </div>

                <button className="cursor-pointer flex items-center gap-2 text-sm text-blue-400 border border-blue-400/40 px-4 py-1.5 rounded-full hover:bg-blue-400/10 transition">
                    Tümünü Gör →
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map(product => (
                    <BestSellerCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
