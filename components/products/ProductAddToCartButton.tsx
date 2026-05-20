"use client";

import React, { useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductAddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    oldPrice?: number | null;
    image?: string | null;
    stock: number;
    category?: any;
  };
}

export default function ProductAddToCartButton({ product }: ProductAddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error("Error adding to cart button:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock || isAdding}
      className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-transparent text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 text-sm uppercase italic tracking-tighter cursor-pointer disabled:cursor-not-allowed"
    >
      {isAdding ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <ShoppingCart size={20} />
      )}
      {isOutOfStock ? "TÜKENDİ" : isAdding ? "SEPETE EKLENİYOR" : "SEPETE EKLE"}
    </button>
  );
}
