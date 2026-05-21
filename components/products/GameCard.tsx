"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCartAnimation } from "@/context/CartAnimationContext";

export type Game = {
    id: number;
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    discount?: string | null;
    genre: string;
    category: string;
    rating: number;
};

function Stars({ count }: { count: number }) {
    return (
        <div className="flex items-center gap-0.5 text-yellow-400 text-xs my-2">
            {"★".repeat(count)}
            {count < 5 && <span className="text-white/40">{"★".repeat(5 - count)}</span>}
        </div>
    );
}

export default function GameCard({ g }: { g: Game }) {
    const { addToCart } = useCart();
    const { animateAddToCart } = useCartAnimation();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        animateAddToCart(e, () => {
            addToCart({
                id: `game_${g.id}`,
                name: g.name,
                slug: g.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                price: parseFloat(g.price.replace(/\./g, "")),
                oldPrice: g.oldPrice ? parseFloat(g.oldPrice.replace(/\./g, "")) : null,
                image: g.image,
                category: g.category
            });
        });
    };

    return (
        <div className="bg-[#0b1220] border border-white/10 rounded-xl p-4 hover:shadow-lg hover:border-blue-400/20 transition flex flex-col h-full">
            <div className="flex gap-2 mb-3 flex-wrap">
                {g.discount && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded font-bold">{g.discount} İNDİRİM</span>
                )}
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/5">{g.category}</span>
            </div>
            <div className="h-36 flex items-center justify-center mb-4">
                <img src={g.image} alt={g.name} className="max-h-full object-contain" />
            </div>
            <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">{g.genre}</span>
            <h3 className="text-sm text-white leading-snug mb-1 mt-0.5">{g.name}</h3>
            <span className="text-xs text-green-400 font-medium">Stokta Var</span>
            <Stars count={g.rating} />
            <div className="mb-3">
                {g.oldPrice && <span className="text-sm text-gray-400 line-through mr-2">{g.oldPrice} ₺</span>}
                <span className="text-lg font-bold text-red-500">{g.price} ₺</span>
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
