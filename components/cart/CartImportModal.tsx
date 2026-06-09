"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Loader2, ShoppingBag, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { getProductsByIds } from "@/lib/actions/product-actions";
import { toast } from "react-hot-toast";

interface SharedItem {
    i: string; // productId
    q: number; // quantity
}

interface ResolvedProduct {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    oldPrice: number | null;
    stock: number;
    image: string | null;
    status: "ACTIVE" | "OUT_OF_STOCK" | "DRAFT";
    category: string | null;
}

export default function CartImportModal() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { addToCart, clearCart } = useCart();

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);
    const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);
    const [resolvedProducts, setResolvedProducts] = useState<(ResolvedProduct & { sharedQty: number })[]>([]);

    const shareCode = searchParams.get("share");

    useEffect(() => {
        if (!shareCode) {
            setIsOpen(false);
            return;
        }

        const parseShareCode = async () => {
            setLoading(true);
            setIsOpen(true);
            try {
                const decodedJson = decodeURIComponent(escape(atob(shareCode)));
                const parsed = JSON.parse(decodedJson) as SharedItem[];
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setSharedItems(parsed);

                    // Fetch product details
                    const productIds = parsed.map(item => item.i);
                    const products = await getProductsByIds(productIds);

                    // Map quantity to products
                    const mapped = products.map((prod: ResolvedProduct) => {
                        const match = parsed.find(item => item.i === prod.id);
                        return {
                            ...prod,
                            sharedQty: match ? match.q : 1
                        };
                    });

                    setResolvedProducts(mapped);
                } else {
                    throw new Error("Invalid payload format");
                }
            } catch (err) {
                console.error("Failed to parse shared cart code:", err);
                toast.error("Geçersiz paylaşılan sepet bağlantısı.");
                handleClose();
            } finally {
                setLoading(false);
            }
        };

        parseShareCode();
    }, [shareCode]);

    const handleClose = () => {
        setIsOpen(false);
        // Remove share query parameter without page reload
        const params = new URLSearchParams(searchParams.toString());
        params.delete("share");
        router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
    };

    const handleImport = async (mode: "merge" | "replace") => {
        if (resolvedProducts.length === 0) return;
        setImporting(true);
        try {
            if (mode === "replace") {
                await clearCart();
            }

            // Loop and add to cart
            for (const item of resolvedProducts) {
                await addToCart({
                    id: item.id,
                    name: item.name,
                    slug: item.slug,
                    price: item.price,
                    oldPrice: item.oldPrice,
                    image: item.image,
                    stock: item.stock,
                    category: item.category
                }, item.sharedQty);
            }

            toast.success(mode === "replace" ? "Sepetiniz güncellendi!" : "Sepetler birleştirildi!");
            handleClose();
        } catch (error) {
            console.error("Cart import failed:", error);
            toast.error("Sepet yüklenirken hata oluştu.");
        } finally {
            setImporting(false);
        }
    };

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(price);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm"
                    />

                    {/* Dialog Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-[#0b1220] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden w-full max-w-lg z-10 relative flex flex-col max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600/10 text-blue-400 rounded-lg">
                                    <ShoppingBag size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white uppercase italic tracking-tighter">Paylaşılan Sepet Bulundu</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Sepet Yükleme Seçenekleri</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={importing}
                                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-all cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            {loading ? (
                                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500 font-bold uppercase tracking-wider text-xs">
                                    <Loader2 size={32} className="animate-spin text-blue-500" />
                                    <span>Sepet içeriği yükleniyor...</span>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        Bir arkadaşınız sizinle alışveriş sepetini paylaştı. Aşağıdaki ürünleri sepetinize ekleyebilir veya mevcut sepetinizi silip yerine bunları yükleyebilirsiniz.
                                    </p>

                                    {/* Products list */}
                                    <div className="bg-[#020617] border border-white/5 rounded-2xl p-4 divide-y divide-white/5 space-y-3 max-h-60 overflow-y-auto">
                                        {resolvedProducts.map(prod => (
                                            <div key={prod.id} className="flex items-center gap-4 pt-3 first:pt-0">
                                                <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center p-1.5 shrink-0">
                                                    <img src={prod.image || "/placeholder.png"} alt={prod.name} className="max-h-full max-w-full object-contain" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-white truncate">{prod.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                                                        {prod.category || "Ürün"} <span className="text-slate-700">|</span> Adet: {prod.sharedQty}
                                                    </p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-xs font-black text-sky-400">{formatPrice(prod.price * prod.sharedQty)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer Actions */}
                        {!loading && (
                            <div className="px-6 py-5 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => handleImport("merge")}
                                    disabled={importing || resolvedProducts.length === 0}
                                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {importing ? <Loader2 size={14} className="animate-spin" /> : null}
                                    Sepetleri Birleştir
                                </button>
                                <button
                                    onClick={() => handleImport("replace")}
                                    disabled={importing || resolvedProducts.length === 0}
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {importing ? <Loader2 size={14} className="animate-spin" /> : null}
                                    Mevcut Sepeti Sil ve Yükle
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
