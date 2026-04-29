"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Download,
    ArrowUpDown,
    LayoutGrid,
    List,
    AlertCircle,
    Package2
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { getProducts, deleteProduct } from "@/lib/actions/product-actions";
import ProductModal from "@/components/admin/ProductModal";

export default function AdminProducts() {
    const searchParams = useSearchParams();
    const categoryFilter = searchParams.get("category");
    type Product = {
        id: number;
        name: string;
        price: number;

        image?: string;
        sku?: string;

        stock: number;
        salesCount: number;

        category?: {
            name: string;
            slug: string;
        };
    };

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
            const result = await deleteProduct(id.toString());
            if (result.success) {
                fetchProducts();
            } else {
                alert("Ürün silinemedi.");
            }
        }
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const filteredProducts = categoryFilter
        ? products.filter(p => p.category?.slug === categoryFilter)
        : products;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <ProductModal
                isOpen={isModalOpen}
                product={selectedProduct}
                onClose={() => {
                    setIsModalOpen(false);
                    fetchProducts();
                }}
            />

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Ürün Yönetimi
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <Package2 className="text-blue-400" size={14} />
                        Katalogdaki ürünlerin stok, fiyat ve durumlarını yönetin.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-slate-900 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                        <Download size={18} />
                        Dışa Aktar
                    </button>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        <Plus size={20} />
                        Yeni Ürün Ekle
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Toplam Ürün", value: products.length.toString(), icon: Package2, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { label: "Düşük Stok", value: products.filter(p => p.stock < 10).length.toString(), icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-400/10" },
                    { label: "Aktif Kategoriler", value: "8", icon: LayoutGrid, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#020617] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                        <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-white mt-0.5">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#020617] border border-white/10 p-4 rounded-3xl flex flex-col lg:flex-row items-center gap-4 shadow-xl">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Ürün adı, SKU veya kategori ara..."
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-12 py-3 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="flex bg-slate-900/50 border border-white/5 p-1 rounded-xl">
                        <button className="p-2 rounded-lg bg-blue-600 text-white"><List size={18} /></button>
                        <button className="p-2 rounded-lg text-slate-500 hover:text-white"><LayoutGrid size={18} /></button>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-white/5 rounded-2xl text-sm font-bold text-slate-400 hover:text-white transition-all">
                        <Filter size={18} />
                        Filtrele
                    </button>
                    <select className="bg-slate-900 border border-white/5 rounded-2xl px-5 py-3 text-sm font-bold text-slate-400 outline-none focus:border-blue-500/50 transition-all cursor-pointer min-w-[160px]">
                        <option>Tüm Kategoriler</option>
                        <option>Konsollar</option>
                        <option>Oyunlar</option>
                        <option>Aksesuarlar</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#020617] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative min-h-[400px]">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#020617]/50 backdrop-blur-sm z-10">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : null}

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-white/[0.01] text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                <th className="px-8 py-5">
                                    <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                        Ürün <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-8 py-5">Kategori</th>
                                <th className="px-8 py-5 text-center">Satış</th>
                                <th className="px-8 py-5">Fiyat</th>
                                <th className="px-8 py-5">Stok Durumu</th>
                                <th className="px-8 py-5 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-500">
                                            <Package2 size={48} className="opacity-20" />
                                            <p className="text-sm font-bold uppercase tracking-widest">Henüz ürün bulunamadı.</p>
                                            <button onClick={handleAdd} className="text-blue-400 text-xs font-black uppercase tracking-widest hover:underline mt-2">İLK ÜRÜNÜNÜZÜ EKLEYİN</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-white/[0.01] transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-slate-900 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center p-2 group-hover:border-blue-500/30 transition-all">
                                                    <img src={product.image || "/placeholder.png"} alt="" className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="font-black text-white group-hover:text-blue-400 transition-colors text-sm">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">SKU: {product.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-500/20">
                                                {product.category?.name || "Belirsiz"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="font-bold text-slate-400">{product.salesCount}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-black text-white text-base">{product.price.toLocaleString('tr-TR')} ₺</div>
                                            <p className="text-[10px] text-slate-600 font-bold">+ 18% KDV Dahil</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-[10px] font-bold">
                                                    <span className={cn(
                                                        product.stock === 0 ? "text-red-400" :
                                                            product.stock < 10 ? "text-amber-400" : "text-emerald-400"
                                                    )}>
                                                        {product.stock === 0 ? "Stok Bitti" : `${product.stock} Adet`}
                                                    </span>
                                                    <span className="text-slate-600">{Math.min(product.stock, 100)}%</span>
                                                </div>
                                                <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        style={{ width: `${Math.min(product.stock, 100)}%` }}
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-1000",
                                                            product.stock === 0 ? "bg-red-500" :
                                                                product.stock < 10 ? "bg-amber-500" : "bg-emerald-500"
                                                        )}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2.5 hover:bg-blue-500/10 rounded-xl text-slate-500 hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/20"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2.5 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all border border-transparent hover:border-white/10">
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{products.length} üründen {filteredProducts.length} tanesi gösteriliyor.</p>
                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-50 transition-all" disabled>
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4].map(i => (
                                <button key={i} className={cn(
                                    "w-10 h-10 rounded-xl text-xs font-black transition-all border border-transparent",
                                    i === 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:bg-white/5 hover:border-white/10"
                                )}>{i}</button>
                            ))}
                        </div>
                        <button className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


