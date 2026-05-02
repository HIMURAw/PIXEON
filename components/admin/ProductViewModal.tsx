"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Package2, Tag, ShoppingCart, BarChart3, Clock, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

export default function ProductViewModal({ isOpen, onClose, product }: ProductViewModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isOpen || !product) return null;

    return createPortal(
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#020617] border border-white/10 w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in duration-500 flex flex-col md:flex-row">
                
                {/* Image Section */}
                <div className="w-full md:w-1/2 bg-white/[0.02] p-12 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-white/5">
                    <img 
                        src={product.image || "/placeholder.png"} 
                        alt={product.name} 
                        className="max-w-full max-h-[400px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-8 left-8 flex gap-2">
                        <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-500/20">
                            {product.category?.name || "Ürün"}
                        </span>
                        {product.stock === 0 && (
                            <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-red-500/20">
                                Tükendi
                            </span>
                        )}
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 p-12 flex flex-col relative">
                    <button 
                        onClick={onClose} 
                        className="absolute top-8 right-8 p-3 hover:bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all"
                    >
                        <X size={24} />
                    </button>

                    <div className="space-y-8 flex-1">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
                                {product.name}
                            </h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">SKU: {product.sku}</p>
                        </div>

                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-black text-white">{product.price.toLocaleString('tr-TR')} ₺</span>
                            {product.oldPrice && (
                                <span className="text-xl text-slate-600 line-through font-bold">{product.oldPrice.toLocaleString('tr-TR')} ₺</span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-3xl space-y-1">
                                <div className="flex items-center gap-2 text-blue-400">
                                    <BarChart3 size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Satış</span>
                                </div>
                                <p className="text-xl font-black text-white">{product.salesCount}</p>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-3xl space-y-1">
                                <div className={cn(
                                    "flex items-center gap-2",
                                    product.stock > 10 ? "text-emerald-400" : "text-amber-400"
                                )}>
                                    <Package2 size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Stok</span>
                                </div>
                                <p className="text-xl font-black text-white">{product.stock} Adet</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <Clock size={16} className="text-blue-400" />
                                <span>Eklenme: <b>{new Date(product.createdAt).toLocaleDateString('tr-TR')}</b></span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <ArrowUpRight size={16} className="text-blue-400" />
                                <span>Slug: <b className="text-slate-500">{product.slug}</b></span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex gap-4">
                         <a 
                            href={`/product/${product.slug}`} 
                            target="_blank"
                            className="flex-1 py-4 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            Sitede Görüntüle <ArrowUpRight size={16} />
                        </a>
                        <button 
                            onClick={onClose}
                            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
