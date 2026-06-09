"use client";
import { useEffect, useRef, useState } from "react";
import BestSellerCard from "./bestSellerCard";
import { getBestSellers } from "@/lib/actions/product-actions";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function BestSellers() {
    const [dbProducts, setDbProducts] = useState<Product[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getBestSellers();
            // Map DB products to the local Product type if needed
            const mapped = data.map((p: any) => ({
                id: p.id,
                name: p.name,
                image: p.image || "/placeholder.png",
                price: p.price.toString(),
                oldPrice: p.oldPrice?.toString(),
                discount: p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) + "%" : null,
                category: "Ürün",
                slug: p.slug
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

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const productsPerPage = isMobile ? 4 : 8;
    const totalPages = Math.ceil(dbProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const displayedProducts = dbProducts.slice(startIndex, startIndex + productsPerPage);

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
                {displayedProducts.map(product => (
                    <BestSellerCard key={product.id} product={product} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-6 border-t border-white/5">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2.5 bg-slate-900 border border-white/5 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <div className="flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => {
                                    setCurrentPage(i + 1);
                                    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                                }}
                                className={cn(
                                    "w-9 h-9 rounded-xl font-bold text-xs transition-all",
                                    currentPage === i + 1 
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                                        : "bg-slate-900 text-slate-500 border border-white/5 hover:text-white"
                                )}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2.5 bg-slate-900 border border-white/5 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </section>
    );
}
