"use client";

import { Product } from "./bestSeller";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

type BestSellerCardProps = {
    product: Product;
};

export default function BestSellerCard({ product }: BestSellerCardProps) {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: parseFloat(product.price),
            oldPrice: product.oldPrice ? parseFloat(product.oldPrice) : null,
            image: product.image,
            category: product.category
        });
    };

    return (
        <div className="bg-[#0b1220] border border-white/10 rounded-xl p-4 hover:shadow-lg transition flex flex-col h-full group">
            <div className="flex gap-2 mb-3">
                {product.discount && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded font-bold">
                        {product.discount} İNDİRİM
                    </span>
                )}
                {product.category && (
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/5">
                        {product.category}
                    </span>
                )}
            </div>

            <Link href={`/product/${product.slug}`} className="h-36 flex items-center justify-center mb-4">
                <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
            </Link>

            <Link href={`/product/${product.slug}`}>
                <h3 className="text-sm text-white font-bold leading-snug mb-1 hover:text-blue-400 transition-colors">
                    {product.name}
                </h3>
            </Link>

            <span className="text-xs text-green-400 font-medium">
                Stokta Var
            </span>

            <div className="flex items-center gap-1 text-yellow-400 text-xs my-2">
                {"★".repeat(4)}
                <span className="text-white/40">★</span>
                <span className="text-white/40 ml-1">1</span>
            </div>

            <div className="mb-3">
                {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through mr-2">
                        {product.oldPrice} ₺
                    </span>
                )}
                <span className="text-lg font-bold text-red-500">
                    {product.price} ₺
                </span>
            </div>

            <button 
                onClick={handleAddToCart}
                className="cursor-pointer mt-auto w-full border border-blue-400 text-blue-400 py-1.5 rounded-full text-sm hover:bg-blue-400 hover:text-white transition font-bold"
            >
                Sepete Ekle
            </button>
        </div>
    );
}

