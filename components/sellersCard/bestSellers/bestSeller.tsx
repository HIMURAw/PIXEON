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
        name: "Angie's Boomchickapop Sweet & Salty Kettle Corn",
        image: "/products/product-1.jpg",
        price: "7.99",
        discount: null,
        organic: false,
        select: true,
    },
    {
        id: 2,
        name: "Blue Diamond Almonds Lightly Salted",
        image: "/products/product-2.png",
        oldPrice: "11.68",
        price: "10.58",
        discount: "10%",
        organic: true,
        select: false,
    },
    {
        id: 3,
        name: "USDA Choice Angus Beef Stew Meat",
        image: "/products/product-1.jpg",
        oldPrice: "79.99",
        price: "49.99",
        discount: "38%",
        organic: false,
        select: false,
    },
    {
        id: 4,
        name: "Angie's Boomchickapop Sweet & Salty Kettle Corn",
        image: "/products/product-1.jpg",
        price: "7.99",
        discount: null,
        organic: false,
        select: true,
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
                        Best Sellers
                    </h2>
                    <p className="text-sm text-gray-400">
                        Do not miss the current offers until the end of March.
                    </p>
                </div>

                <button className="flex items-center gap-2 text-sm text-blue-400 border border-blue-400/40 px-4 py-1.5 rounded-full hover:bg-blue-400/10 transition">
                    View All →
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
