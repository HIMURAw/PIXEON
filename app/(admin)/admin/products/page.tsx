"use client";

import React, { useState, useEffect, Suspense } from "react";
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
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getProducts, deleteProduct } from "@/lib/actions/product-actions";
import { getCategories } from "@/lib/actions/category-actions";
import ProductModal from "@/components/admin/ProductModal";
import ProductViewModal from "@/components/admin/ProductViewModal";
import { AdminNotificationContainer, NotificationType } from "@/components/admin/AdminNotification";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";

function AdminProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const categoryFilter = searchParams.get("category");
    type Product = {
        id: number;
        name: string;
        price: number;

        image?: string;
        sku?: string;

        stock: number;
        salesCount: number;
        createdAt: Date | string;

        category?: {
            name: string;
            slug: string;
        };
    };

    const [products, setProducts] = useState<Product[]>([]);
    const [dbCategories, setDbCategories] = useState<any[]>([]);
    const currentCategory = dbCategories.find(c => c.slug === categoryFilter);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [viewProduct, setViewProduct] = useState<Product | null>(null);
    const [notifications, setNotifications] = useState<{ id: string; type: NotificationType; message: string }[]>([]);
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { }
    });

    // Search and Pagination States
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [stockFilter, setStockFilter] = useState<"all" | "in_stock" | "low_stock" | "out_of_stock">("all");
    const [sortOrder, setSortOrder] = useState<"newest" | "price_asc" | "price_desc" | "sales_desc">("newest");
    const itemsPerPage = 10;

    const resetFilters = () => {
        setSearchQuery("");
        setStockFilter("all");
        setSortOrder("newest");
        handleCategoryChange("all");
    };

    const addNotification = (type: NotificationType, message: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications(prev => [...prev, { id, type, message }]);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const fetchData = async () => {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
            getProducts(),
            getCategories()
        ]);
        setProducts(productsData);
        setDbCategories(categoriesData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCategoryChange = (slug: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (slug === "all") {
            params.delete("category");
        } else {
            params.set("category", slug);
        }
        router.push(`/admin/products?${params.toString()}`);
    };

    const handleDelete = (id: number) => {
        setConfirmModal({
            isOpen: true,
            title: "Ürünü Sil",
            message: "Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve ürün kalıcı olarak kaldırılır.",
            onConfirm: async () => {
                const result = await deleteProduct(id.toString());
                if (result.success) {
                    addNotification("success", "Ürün başarıyla silindi.");
                    fetchData();
                } else {
                    addNotification("error", "Ürün silinirken bir hata oluştu.");
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleView = (product: Product) => {
        setViewProduct(product);
        setIsViewOpen(true);
    };

    const handleExport = () => {
        if (filteredProducts.length === 0) {
            addNotification("error", "Dışa aktarılacak ürün bulunamadı.");
            return;
        }

        // CSV Headers
        const headers = ["ID", "Ürün Adı", "SKU", "Kategori", "Fiyat", "Stok", "Satış Sayısı", "Eklenme Tarihi"];
        
        // CSV Rows
        const rows = filteredProducts.map(p => [
            p.id,
            `"${p.name.replace(/"/g, '""')}"`, // Escape quotes
            p.sku || "",
            p.category?.name || "",
            p.price,
            p.stock,
            p.salesCount,
            new Date(p.createdAt).toLocaleDateString('tr-TR')
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        // Download logic
        const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `pixeon_urunler_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        addNotification("success", `${filteredProducts.length} ürün dışa aktarıldı.`);
    };

    // Advanced Filtering (Category + Search + Stock)
    const filteredProducts = products
        .filter(p => {
            const matchesCategory = !categoryFilter || p.category?.slug === categoryFilter;

            const search = searchQuery.toLowerCase();
            const matchesSearch =
                p.name.toLowerCase().includes(search) ||
                (p.sku?.toLowerCase() || "").includes(search) ||
                (p.category?.name?.toLowerCase() || "").includes(search);

            const matchesStock = 
                stockFilter === "all" ? true :
                stockFilter === "in_stock" ? p.stock > 10 :
                stockFilter === "low_stock" ? p.stock > 0 && p.stock <= 10 :
                stockFilter === "out_of_stock" ? p.stock === 0 : true;

            return matchesCategory && matchesSearch && matchesStock;
        })
        .sort((a, b) => {
            if (sortOrder === "newest") return 0; // Default is newest from fetch
            if (sortOrder === "price_asc") return a.price - b.price;
            if (sortOrder === "price_desc") return b.price - a.price;
            if (sortOrder === "sales_desc") return b.salesCount - a.salesCount;
            return 0;
        });

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to page 1 when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, categoryFilter, stockFilter, sortOrder]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <ProductModal
                isOpen={isModalOpen}
                product={selectedProduct}
                onClose={(success?: boolean) => {
                    setIsModalOpen(false);
                    if (success) {
                        addNotification("success", selectedProduct ? "Ürün başarıyla güncellendi." : "Yeni ürün başarıyla eklendi.");
                        fetchData();
                    }
                }}
            />

            <AdminConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                variant="danger"
            />

            <AdminNotificationContainer
                notifications={notifications}
                onClose={removeNotification}
            />

            <ProductViewModal 
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                product={viewProduct}
            />

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        {currentCategory ? `${currentCategory.name} Yönetimi` : "Ürün Yönetimi"}
                    </h1>
                    <p className="text-xs sm:text-slate-500 mt-1 flex items-center gap-2">
                        <Package2 className="text-blue-400 shrink-0" size={14} />
                        <span className="truncate sm:not-truncate">
                            {currentCategory 
                                ? `${currentCategory.name} kategorisindeki ürünlerin stok, fiyat ve durumlarını yönetin.`
                                : "Katalogdaki ürünlerin stok, fiyat ve durumlarını yönetin."}
                        </span>
                    </p>
                </div>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
                    <button 
                        onClick={handleExport}
                        className="bg-slate-900 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold flex-1 sm:flex-initial flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
                    >
                        <Download size={18} />
                        Dışa Aktar
                    </button>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex-1 sm:flex-initial flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        <Plus size={20} />
                        Yeni Ürün Ekle
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:grid-cols-3 md:gap-6">
                {[
                    { 
                        label: currentCategory ? `${currentCategory.name} Sayısı` : "Toplam Ürün", 
                        value: filteredProducts.length.toString(), 
                        icon: Package2, 
                        color: "text-blue-400", 
                        bg: "bg-blue-400/10" 
                    },
                    { 
                        label: "Düşük Stok", 
                        value: filteredProducts.filter(p => p.stock < 10).length.toString(), 
                        icon: AlertCircle, 
                        color: "text-amber-400", 
                        bg: "bg-amber-400/10" 
                    },
                    { 
                        label: "Aktif Kategoriler", 
                        value: dbCategories.length.toString(), 
                        icon: LayoutGrid, 
                        color: "text-emerald-400", 
                        bg: "bg-emerald-400/10" 
                    },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#020617] border border-white/10 p-4 sm:p-6 rounded-2xl flex items-center gap-4">
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ürün adı, SKU veya kategori ara..."
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-12 py-3 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <div className="flex bg-slate-900/50 border border-white/5 p-1 rounded-xl shrink-0">
                        <button
                            onClick={() => setViewMode("list")}
                            className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white")}
                        >
                            <List size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white")}
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-2xl text-sm font-bold transition-all border flex-1 sm:flex-initial",
                            showFilters ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20" : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
                        )}
                    >
                        <Filter size={18} />
                        Filtrele
                    </button>
                    {(searchQuery || categoryFilter || stockFilter !== "all" || sortOrder !== "newest") && (
                        <button 
                            onClick={resetFilters}
                            className="px-4 sm:px-5 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95 flex-1 sm:flex-initial"
                        >
                            Sıfırla
                        </button>
                    )}
                    <select
                        value={categoryFilter || "all"}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="bg-slate-900 border border-white/5 rounded-2xl px-4 py-3 text-sm font-bold text-slate-400 outline-none focus:border-blue-500/50 transition-all cursor-pointer flex-1 lg:flex-initial min-w-[140px]"
                    >
                        <option value="all">Tüm Kategoriler</option>
                        {dbCategories.map(cat => (
                            <option key={cat.id} value={cat.slug}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Filter Panel (Collapsible) */}
            {showFilters && (
                <div className="bg-[#020617] border border-white/10 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Stok Durumu</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: "all", label: "Tümü" },
                                { id: "in_stock", label: "Stokta Var" },
                                { id: "low_stock", label: "Düşük Stok" },
                                { id: "out_of_stock", label: "Tükendi" }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setStockFilter(item.id as any)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                                        stockFilter === item.id ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-950 border-white/5 text-slate-500 hover:border-white/20"
                                    )}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sıralama</label>
                        <select 
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as any)}
                            className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 outline-none focus:border-blue-500/50 transition-all"
                        >
                            <option value="newest">En Yeni</option>
                            <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
                            <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
                            <option value="sales_desc">En Çok Satanlar</option>
                        </select>
                    </div>

                    <div className="flex items-end pb-1">
                        <p className="text-[10px] text-slate-600 font-bold uppercase leading-relaxed">
                            Seçtiğiniz kriterlere göre <span className="text-blue-400">{filteredProducts.length}</span> ürün bulundu. Filtreler anlık olarak uygulanmaktadır.
                        </p>
                    </div>
                </div>
            )}

            {/* Products Content */}
            <div className={cn(
                "relative min-h-[400px]",
                viewMode === "list" ? "bg-[#020617] border border-white/10 rounded-3xl overflow-hidden shadow-2xl" : ""
            )}>
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#020617]/50 backdrop-blur-sm z-10 rounded-3xl">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : null}

                {viewMode === "list" ? (
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-sm min-w-[800px]">
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
                                {paginatedProducts.length === 0 ? (
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
                                    paginatedProducts.map((product) => (
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
                                                    <button 
                                                        onClick={() => handleView(product)}
                                                        className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                                                    >
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
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedProducts.length === 0 ? (
                            <div className="col-span-full py-20 bg-[#020617] border border-white/10 rounded-3xl flex flex-col items-center gap-3 text-slate-500 shadow-2xl">
                                <Package2 size={48} className="opacity-20" />
                                <p className="text-sm font-bold uppercase tracking-widest">Henüz ürün bulunamadı.</p>
                                <button onClick={handleAdd} className="text-blue-400 text-xs font-black uppercase tracking-widest hover:underline mt-2">İLK ÜRÜNÜNÜZÜ EKLEYİN</button>
                            </div>
                        ) : (
                            paginatedProducts.map((product) => (
                                <div key={product.id} className="bg-[#020617] border border-white/10 rounded-3xl p-6 group hover:border-blue-500/30 transition-all shadow-xl relative overflow-hidden flex flex-col">
                                    <div className="h-48 bg-slate-900 rounded-2xl overflow-hidden mb-6 flex items-center justify-center p-4 relative">
                                        <img src={product.image || "/placeholder.png"} alt="" className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(product)} className="p-2 bg-slate-950/80 backdrop-blur-md rounded-xl text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
                                                <Pencil size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 bg-slate-950/80 backdrop-blur-md rounded-xl text-red-400 hover:bg-red-600 hover:text-white transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md text-[9px] font-black uppercase tracking-wider border border-blue-500/20">
                                            {product.category?.name || "Belirsiz"}
                                        </span>
                                        <h3 className="font-black text-white group-hover:text-blue-400 transition-colors line-clamp-1">{product.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="text-xl font-black text-white">{product.price.toLocaleString('tr-TR')} ₺</div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase">Stok: {product.stock}</div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">Satış: {product.salesCount}</div>
                                        <button 
                                            onClick={() => handleView(product)}
                                            className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                                        >
                                            Detay <Eye size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Pagination Controls moved outside the list container to stay fixed at bottom */}
                <div className={cn(
                    "p-4 sm:p-8 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
                    viewMode === "list" ? "border-t border-white/5" : "bg-[#020617] border border-white/10 rounded-3xl shadow-2xl"
                )}>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {filteredProducts.length} üründen {paginatedProducts.length} tanesi gösteriliyor. (Sayfa {currentPage}/{totalPages || 1})
                    </p>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 sm:p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide max-w-[180px] sm:max-w-none py-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(i => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={cn(
                                        "w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-xs font-black transition-all border border-transparent shrink-0",
                                        i === currentPage ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:bg-white/5 hover:border-white/10"
                                    )}
                                >
                                    {i}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 sm:p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminProducts() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <AdminProductsContent />
        </Suspense>
    );
}



