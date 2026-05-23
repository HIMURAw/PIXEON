import { db } from "@/lib/db";
import { products, reviews, users, categories, wishlist } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    Star,
    ShoppingCart,
    Heart,
    ShieldCheck,
    Truck,
    RotateCcw,
    ChevronRight,
    Home,
    Info,
    CheckCircle2
} from "lucide-react";
import MainBar from "@/components/header/MainBar";
import TopBar from "@/components/header/TopBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import ReviewSection from "@/components/reviews/ReviewSection";
import WishlistButton from "@/components/products/WishlistButton";
import ProductAddToCartButton from "@/components/products/ProductAddToCartButton";
import ProductViewTracker from "@/components/products/ProductViewTracker";
import { getSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const session = await getSession();
    const { slug } = await params;

    // 1. Fetch Product Data using standard leftJoin for better compatibility
    const results = await db.select({
        product: products,
        category: categories
    })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(eq(products.slug, slug))
        .limit(1);

    if (results.length === 0) notFound();

    const { product, category } = results[0];

    // 2. Fetch Product Reviews
    const productReviews = await db.query.liveChatMessages.findMany({
        // Note: Earlier we saw reviews table but let's check schema.
        // Actually schema.ts has a 'reviews' table.
    });

    // Re-fetch reviews properly
    const reviewsData = await db.select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        user: {
            id: users.id,
            name: users.name,
            image: users.image
        }
    })
        .from(reviews)
        .leftJoin(users, eq(reviews.userId, users.id))
        .where(and(
            eq(reviews.productId, product.id),
            eq(reviews.status, "APPROVED")
        ))
        .orderBy(desc(reviews.createdAt));

    // 3. Current User
    let currentUser = null;
    let isFavorited = false;
    if (session?.user) {
        currentUser = await db.query.users.findFirst({
            where: eq(users.id, session.user.id)
        });

        if (currentUser) {
            const fav = await db.query.wishlist.findFirst({
                where: and(
                    eq(wishlist.userId, currentUser.id),
                    eq(wishlist.productId, product.id)
                )
            });
            isFavorited = !!fav;
        }
    }

    // Calculate Average Rating
    const avgRating = reviewsData.length > 0
        ? (reviewsData.reduce((acc, curr) => acc + curr.rating, 0) / reviewsData.length).toFixed(1)
        : "5.0";

    return (
        <div className="min-h-screen bg-slate-950">
            <ProductViewTracker categorySlug={category?.slug} />
            <TopBar />
            <MainBar />
            <Head />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 mb-10">
                    <Link href="/" className="hover:text-blue-500 transition-colors flex items-center gap-1">
                        <Home size={12} /> ANA SAYFA
                    </Link>
                    <ChevronRight size={10} />
                    {category && (
                        <>
                            <Link href={`/category/${category.slug}`} className="hover:text-blue-500 transition-colors">
                                {category.name}
                            </Link>
                            <ChevronRight size={10} />
                        </>
                    )}
                    <span className="text-slate-300 truncate max-w-[200px]">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT: Image Gallery */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="aspect-square relative bg-white/[0.03] border border-white/5 rounded-[32px] overflow-hidden group shadow-2xl">
                            <Image
                                src={product.image || "/placeholder.png"}
                                alt={product.name}
                                fill
                                className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                            />
                            {product.stock > 0 && product.stock < 10 && (
                                <div className="absolute top-6 left-6 bg-amber-500 text-black text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter">
                                    SON {product.stock} ÜRÜN!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CENTER & RIGHT: Product Info */}
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-8">

                        {/* Center: Main Info */}
                        <div className="md:col-span-8 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    {category && (
                                        <span className="bg-blue-600/10 text-blue-400 text-[10px] font-black px-3 py-1 rounded-lg border border-blue-500/10 uppercase tracking-widest">
                                            {category.name}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                        <span className="text-[10px] font-bold text-white">{avgRating}</span>
                                        <span className="text-[10px] text-slate-500 ml-1">({reviewsData.length} Değerlendirme)</span>
                                    </div>
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight uppercase italic tracking-tighter">
                                    {product.name}
                                </h1>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl font-black text-white tracking-tighter">
                                        {product.price.toLocaleString('tr-TR')} TL
                                    </span>
                                    {product.oldPrice && (
                                        <span className="text-xl text-slate-600 line-through font-bold">
                                            {product.oldPrice.toLocaleString('tr-TR')} TL
                                        </span>
                                    )}
                                </div>

                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Info size={14} className="text-blue-500" /> Öne Çıkan Özellikler
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle2 size={16} className="text-blue-500" />
                                            <span>%100 Orijinal Ürün</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle2 size={16} className="text-blue-500" />
                                            <span>2 Yıl Garanti</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle2 size={16} className="text-blue-500" />
                                            <span>Hızlı Teslimat</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle2 size={16} className="text-blue-500" />
                                            <span>7/24 Destek</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Açıklama</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {product.description || "Bu ürün hakkında henüz detaylı bir açıklama girilmemiş."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="md:col-span-4 space-y-6">
                            <div className="p-8 bg-slate-900 border border-white/10 rounded-[32px] shadow-2xl space-y-6 sticky top-8">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Satıcı</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">P</div>
                                        <span className="text-sm font-bold text-white">PIXEON <span className="text-blue-500 font-black">9.9</span></span>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <ProductAddToCartButton product={product} />
                                    <WishlistButton 
                                        productId={product.id}
                                        userId={currentUser?.id ?? null}
                                        initialIsFavorited={isFavorited}
                                    />
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                                        <Truck size={16} className="text-blue-500" />
                                        <span>Ücretsiz Kargo</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                                        <ShieldCheck size={16} className="text-blue-500" />
                                        <span>Güvenli Ödeme</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                                        <RotateCcw size={16} className="text-blue-500" />
                                        <span>14 Gün İade</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* REVIEWS SECTION */}
                <div className="mt-24 pt-24 border-t border-white/5">
                    <ReviewSection
                        currentUser={currentUser}
                        reviews={reviewsData}
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
}
