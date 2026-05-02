"use client";
import { useEffect, useState } from "react";
import ProductsCard from "./newProductsCard";
import { getNewProducts } from "@/lib/actions/product-actions";

export type Product = {
    id: string;
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    discount?: string | null;
    category?: string;
};

type ProductsProps = {
    limit?: number;
};

export default function Products({ limit }: ProductsProps) {
    const [dbProducts, setDbProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getNewProducts(limit);
            const mapped = data.map((p: any) => ({
                id: p.id,
                name: p.name,
                image: p.image || "/placeholder.png",
                price: p.price.toString(),
                oldPrice: p.oldPrice?.toString(),
                discount: p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) + "%" : null,
                category: "Yeni"
            }));
            setDbProducts(mapped);
            setLoading(false);
        };
        fetchProducts();
    }, [limit]);

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-[4/5] bg-white/5 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        Yeni Ürünler
                    </h2>
                    <p className="text-sm text-gray-400">
                        Son 1 ay içerisinde eklenen en yeni ürünler.
                    </p>
                </div>

                <a
                    href="/yeni-urunler"
                    className="cursor-pointer flex items-center gap-2 text-sm text-blue-400 border border-blue-400/40 px-4 py-1.5 rounded-full hover:bg-blue-400/10 transition"
                >
                    Tümünü Gör →
                </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {dbProducts.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500 font-bold uppercase tracking-widest bg-white/[0.02] border border-dashed border-white/5 rounded-3xl">
                        Yakın zamanda eklenen yeni ürün bulunamadı.
                    </div>
                ) : (
                    dbProducts.map((product) => (
                        <ProductsCard key={product.id} product={product} />
                    ))
                )}
            </div>
        </section>
    );
}
