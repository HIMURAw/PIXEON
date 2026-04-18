"use client";

import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import { Heart, ShoppingCart, X } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
    const wishlistItems = [
        {
            id: 1,
            name: "Marvel's Spider-Man 2 - PS5",
            price: "1.499",
            image: "/products/spiderman-2.png",
            category: "Oyunlar",
            discount: null,
            inStock: true
        },
        {
            id: 2,
            name: "DualSense Kablosuz Kontrolcü - Beyaz",
            price: "2.899",
            image: "/products/dualsense-white.png",
            category: "Aksesuarlar",
            discount: null,
            inStock: true
        },
        {
            id: 3,
            name: "Pulse 3D Kablosuz Kulaklık",
            price: "3.499",
            oldPrice: "3.999",
            image: "/products/pulse-3d.png",
            category: "Aksesuarlar",
            discount: "12%",
            inStock: false
        },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200">
            <TopBar />
            <MainBar />
            <Head />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Header Section */}
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                    <div>
                        <h1 className="text-xl font-semibold text-white">İstek Listem</h1>
                        <p className="text-sm text-gray-400">Favori ürünlerinizi buradan takip edebilirsiniz.</p>
                    </div>

                    <div className="text-sm text-gray-400">
                        Toplam <span className="text-white font-bold">{wishlistItems.length}</span> ürün
                    </div>
                </div>

                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlistItems.map((product) => (
                            <div key={product.id} className="bg-[#0b1220] border border-white/10 rounded-xl p-4 hover:shadow-lg transition group relative">
                                {/* Remove Button */}
                                <button className="absolute top-2 right-2 z-10 p-1.5 bg-slate-900/80 text-slate-400 hover:text-red-500 rounded-full transition-colors border border-white/5 opacity-0 group-hover:opacity-100">
                                    <X size={14} />
                                </button>

                                <div className="flex gap-2 mb-3">
                                    {product.discount && (
                                        <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded font-bold">
                                            {product.discount} İNDİRİM
                                        </span>
                                    )}
                                    {product.category && (
                                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/5">
                                            {product.category}
                                        </span>
                                    )}
                                </div>

                                <div className="h-40 flex items-center justify-center mb-4">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                <h3 className="text-sm text-white leading-snug mb-1 h-10 line-clamp-2">
                                    {product.name}
                                </h3>

                                <span className={`text-[10px] font-medium ${product.inStock ? 'text-green-400' : 'text-gray-500'}`}>
                                    {product.inStock ? 'Stokta Var' : 'Stokta Yok'}
                                </span>

                                <div className="flex items-center gap-1 text-yellow-400 text-[10px] my-2">
                                    {"★".repeat(5)}
                                    <span className="text-white/40 ml-1">(1)</span>
                                </div>

                                <div className="mb-4">
                                    {product.oldPrice && (
                                        <span className="text-xs text-gray-400 line-through mr-2">
                                            {product.oldPrice} ₺
                                        </span>
                                    )}
                                    <span className="text-lg font-bold text-red-500">
                                        {product.price} ₺
                                    </span>
                                </div>

                                <button
                                    disabled={!product.inStock}
                                    className={`cursor-pointer w-full border py-1.5 rounded-full text-sm transition flex items-center justify-center gap-2 ${product.inStock
                                            ? "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                                            : "border-gray-700 text-gray-600 cursor-not-allowed"
                                        }`}
                                >
                                    <ShoppingCart size={14} />
                                    Sepete Ekle
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[#0b1220] border border-white/10 rounded-xl">
                        <div className="w-16 h-16 bg-slate-900 text-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart size={32} />
                        </div>
                        <h2 className="text-lg font-bold text-white mb-2">İstek listeniz henüz boş</h2>
                        <p className="text-sm text-gray-400 mb-6">Henüz bir ürün eklemediniz.</p>
                        <Link href="/" className="inline-block border border-blue-400 text-blue-400 px-8 py-2 rounded-full text-sm hover:bg-blue-400 hover:text-white transition">
                            Alışverişe Başla
                        </Link>
                    </div>
                )}
            </div>

            {/* Simple Footer/Info */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-white/5">
                    <div className="p-6 bg-[#0b1220] border border-white/10 rounded-xl">
                        <h3 className="text-sm font-bold text-white mb-2">Fiyat Takibi</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Listenizdeki ürünlerin fiyatları düştüğünde size özel bildirimler gönderiyoruz. Böylece en iyi fırsatı asla kaçırmazsınız.
                        </p>
                    </div>
                    <div className="p-6 bg-[#0b1220] border border-white/10 rounded-xl">
                        <h3 className="text-sm font-bold text-white mb-2">Stok Bildirimi</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Şu an stokta olmayan bir ürünü listenize eklerseniz, ürün tekrar stoklarımıza girdiğinde ilk sizin haberiniz olur.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
