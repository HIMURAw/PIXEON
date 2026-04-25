"use client";
import { useEffect, useRef, useState } from "react";
import BestSellerCard from "./bestSellerCard";
import { getBestSellers } from "@/lib/actions/product-actions";

export type Product = {
    id: string;
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    discount?: string | null;
    category?: string;
};

export default function BestSellers() {
    const [dbProducts, setDbProducts] = useState<Product[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getBestSellers();
            // Map DB products to the local Product type if needed
            const mapped = data.map(p => ({
                id: p.id,
                name: p.name,
                image: p.image || "/placeholder.png",
                price: p.price.toString(),
                oldPrice: p.oldPrice?.toString(),
                discount: p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) + "%" : null,
                category: "Ürün" // This can be expanded later to fetch category name
            }));
            setDbProducts(mapped);
        };
        fetchProducts();
    }, []);

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
                {dbProducts.map(product => (
                    <BestSellerCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
