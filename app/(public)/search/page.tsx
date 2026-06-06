"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import SidebarLayout from "@/components/categories/SidebarLayout";
import NewProductsSidebar from "@/components/products/newProducts/NewProductsSidebar";
import ProductsCard from "@/components/products/newProducts/newProductsCard";
import { Search, Loader2 } from "lucide-react";
import Footer from "@/components/footer/Footer";

interface SearchProduct {
    id: string;
    name: string;
    slug: string;
    price: string;
    oldPrice: string | null;
    image: string | null;
    category: { name: string } | null;
}

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState<SearchProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState("");

    useEffect(() => {
        if (!query || query.trim().length < 2) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
                const data = await res.json();
                if (data.results) {
                    setResults(data.results);
                    setProvider(data.provider || "database");
                }
            } catch (error) {
                console.error("Search fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    // Map to Product shape expected by ProductsCard
    const mappedProducts = results.map((p) => {
        const priceNum = parseFloat(p.price);
        const oldPriceNum = p.oldPrice ? parseFloat(p.oldPrice) : null;
        const discountStr = oldPriceNum && oldPriceNum > priceNum
            ? Math.round((1 - priceNum / oldPriceNum) * 100) + "%"
            : null;

        return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            sku: "",
            description: "",
            price: p.price,
            oldPrice: p.oldPrice,
            stock: 1,
            categoryId: null,
            image: p.image || "/placeholder.png",
            status: "ACTIVE" as const,
            category: p.category?.name || "Ürün",
            discount: discountStr
        };
    });

    return (
        <div className="space-y-12">
            {/* Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <Search className="text-sky-400" size={20} />
                        Arama Sonuçları: <span className="text-sky-400 font-extrabold">&ldquo;{query}&rdquo;</span>
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        {loading ? "Arama yapılıyor..." : `${results.length} eşleşen ürün bulundu.`}
                    </p>
                </div>
                
                {!loading && provider && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full self-start md:self-center">
                        Arama Motoru: {provider === "meilisearch" ? "Meilisearch (Akıllı)" : "Veritabanı"}
                    </span>
                )}
            </div>

            {/* Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-16">
                <aside className="order-2 lg:order-1">
                    <NewProductsSidebar />
                </aside>

                <div className="order-1 lg:order-2 min-w-0">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500 font-bold uppercase tracking-widest">
                            <Loader2 className="animate-spin text-sky-400" size={36} />
                            <span>Arama yapılıyor...</span>
                        </div>
                    ) : mappedProducts.length === 0 ? (
                        <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
                            Aradığınız kriterlere uygun ürün bulunamadı.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {mappedProducts.map((prod) => (
                                <ProductsCard key={prod.id} product={prod} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 pb-16">
                <SidebarLayout>
                    <Suspense fallback={
                        <div className="py-20 flex items-center justify-center">
                            <Loader2 className="animate-spin text-sky-400" size={36} />
                        </div>
                    }>
                        <SearchContent />
                    </Suspense>
                </SidebarLayout>
            </div>
            <Footer />
        </>
    );
}
