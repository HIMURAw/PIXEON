"use client";

import { useEffect, useState } from "react";
import ProductsCard from "./newProducts/newProductsCard";
import { getFilteredProducts } from "@/lib/actions/product-actions";
import { SlidersHorizontal, ArrowUpDown, CircleDollarSign } from "lucide-react";

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

const CATEGORIES = [
    { id: "all", name: "Tümü" },
    { id: "12492fc3-da7f-49cf-94ba-58d96acfae3f", name: "Konsollar" },
    { id: "37808224-0d28-4608-b8a3-d015f3822556", name: "Aksesuarlar" },
    { id: "46ea5f63-0f4a-4366-bbc9-cd37a6fcd174", name: "Oyunlar" },
    { id: "a5855599-55ee-4a9a-b544-0f3adcdcd7f1", name: "Dijital Kodlar" }
];

interface FilteredProductsSectionProps {
    initialCategory?: string;
    hideCategoryFilter?: boolean;
    hideHeader?: boolean;
    keywordFilter?: string;
}

export default function FilteredProductsSection({
    initialCategory = "all",
    hideCategoryFilter = false,
    hideHeader = false,
    keywordFilter,
}: FilteredProductsSectionProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filter states
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [stockOnly, setStockOnly] = useState(false);
    const [sortBy, setSortBy] = useState("newest");

    // Reset selected category if initialCategory changes
    useEffect(() => {
        setSelectedCategory(initialCategory);
    }, [initialCategory]);

    useEffect(() => {
        const fetchFiltered = async () => {
            setLoading(true);
            try {
                const min = minPrice ? parseFloat(minPrice) : undefined;
                const max = maxPrice ? parseFloat(maxPrice) : undefined;

                let data = await getFilteredProducts({
                    categoryId: selectedCategory,
                    minPrice: min,
                    maxPrice: max,
                    stockOnly: stockOnly,
                    sortBy: sortBy
                });

                if (keywordFilter) {
                    const kw = keywordFilter.toLowerCase();
                    data = data.filter((p: any) => 
                        p.name.toLowerCase().includes(kw) || 
                        p.sku?.toLowerCase().includes(kw) ||
                        p.slug?.toLowerCase().includes(kw)
                    );
                }

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
                setProducts(mapped);
            } catch (error) {
                console.error("Error loading filtered products:", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchFiltered();
        }, 300); // debounce input changes

        return () => clearTimeout(timer);
    }, [selectedCategory, minPrice, maxPrice, stockOnly, sortBy]);

    return (
        <section className="space-y-8">
            {/* Header */}
            {!hideHeader && (
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        Ürünlerimizi Keşfedin
                    </h2>
                    <p className="text-sm text-gray-400">
                        Kategorileri filtreleyerek dilediğiniz PlayStation ürününe anında ulaşın.
                    </p>
                </div>
            )}

            {/* Filter controls row */}
            <div className="bg-[#0b1220]/60 backdrop-blur-md border border-white/5 p-6 rounded-2xl space-y-6">
                <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
                    
                    {/* Category tabs */}
                    {!hideCategoryFilter && (
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                        selectedCategory === cat.id
                                            ? "bg-sky-500 text-white border-sky-400/30 shadow-lg shadow-sky-500/20"
                                            : "bg-slate-900/60 text-slate-400 border-white/5 hover:text-white hover:bg-slate-800"
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Quick Filters */}
                    <div className={`flex flex-wrap gap-4 items-center w-full justify-between ${
                        !hideCategoryFilter ? "xl:w-auto xl:justify-end" : ""
                    }`}>
                        {/* Stock Checkbox */}
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-white transition-colors">
                            <input
                                type="checkbox"
                                checked={stockOnly}
                                onChange={(e) => setStockOnly(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                            />
                            <span>Sadece Stoktakiler</span>
                        </label>

                        {/* Sort selector */}
                        <div className="flex items-center gap-2 bg-slate-900 border border-white/5 px-3 py-2 rounded-xl">
                            <ArrowUpDown size={14} className="text-slate-500" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-xs text-slate-300 font-bold outline-none cursor-pointer"
                            >
                                <option value="newest" className="bg-slate-900 text-slate-300">En Yeni Ürünler</option>
                                <option value="price-asc" className="bg-slate-900 text-slate-300">Fiyat: Düşükten Yükseğe</option>
                                <option value="price-desc" className="bg-slate-900 text-slate-300">Fiyat: Yüksekten Düşüğe</option>
                                <option value="sales-desc" className="bg-slate-900 text-slate-300">En Çok Satanlar</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Price range input strip */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5 font-semibold">
                        <CircleDollarSign size={14} className="text-sky-400" />
                        Fiyat Aralığı (₺):
                    </span>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-24 bg-slate-900/60 border border-white/5 px-3 py-1.5 rounded-lg text-xs text-white outline-none focus:border-sky-500/50"
                        />
                        <span className="text-slate-600">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-24 bg-slate-900/60 border border-white/5 px-3 py-1.5 rounded-lg text-xs text-white outline-none focus:border-sky-500/50"
                        />
                    </div>
                    {(minPrice || maxPrice) && (
                        <button
                            onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                            className="cursor-pointer text-[10px] uppercase tracking-widest font-black text-red-400 hover:text-red-300 transition-colors"
                        >
                            Temizle
                        </button>
                    )}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="aspect-[4/5] bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
                    Aranan kriterlere uygun ürün bulunamadı.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductsCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </section>
    );
}
