import MainBar from "@/components/header/MainBar";
import TopBar from "@/components/header/TopBar";
import Head from "@/components/header/Head";
import HeroCarousel from "@/components/hero/hero";
import PromoSection from "@/components/promo/promoSection";
import BestSellers from "@/components/sellersCard/bestSellers/bestSeller";
import RecommendedProducts from "@/components/sellersCard/recommended/RecommendedProducts";
import InfoBanner from "@/components/hero/InfoBanner";
import HotDeal from "@/components/sellersCard/hotDeals/HotDeal";
import PromoVertical from "@/components/promo/PromoVertical";
import PromoVerticalSmall from "@/components/promo/PromoVerticalSmall";
import PromoBanner from "@/components/promo/PromoBanner";
import FilteredProductsSection from "@/components/products/FilteredProductsSection";
import NewProductsSidebar from "@/components/products/newProducts/NewProductsSidebar";
import ReviewSection from "@/components/reviews/ReviewSection";
import Footer from "@/components/footer/Footer";
import BannerSection from "@/components/promo/BannerSection";
import StaticCategoriesMenu from "@/components/categories/StaticCategoriesMenu";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getApprovedReviews } from "@/lib/actions/review-actions";

export default async function Home() {
    const session = await getSession();

    let currentUser = null;
    if (session?.user) {
        currentUser = await db.query.users.findFirst({
            where: eq(users.id, session.user.id)
        });
    }

    const reviews = await getApprovedReviews(currentUser?.id);

    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-10 space-y-24">
                {/* HERO */}
                <div className="flex gap-16">
                    <aside className="hidden lg:block w-72 shrink-0">
                        <StaticCategoriesMenu />
                    </aside>
                    <main className="flex-1 min-w-0">
                        <HeroCarousel />
                    </main>
                </div>

                {/* ALT CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16">
                    {/* SOL TARAF */}
                    <aside className="space-y-6 order-2 lg:order-1">
                        <BannerSection position="home-top" />
                        <PromoSection />
                        <BannerSection position="products-sidebar" />
                        <PromoVertical />
                        <PromoVerticalSmall />
                    </aside>

                    {/* SAĞ TARAF */}
                    <main className="space-y-24 order-1 lg:order-2 min-w-0">
                        <RecommendedProducts />
                        <BannerSection position="home-middle" className="h-64" />
                        <InfoBanner />
                        <HotDeal />
                        <PromoBanner />
                        <BestSellers />
                        <BannerSection position="home-bottom" />
                    </main>
                </div>

                {/* ÜRÜNLER / FİLTRELEME BÖLÜMÜ */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 !-mt-14">
                    <aside className="order-2 lg:order-1">
                        <NewProductsSidebar />
                    </aside>
                    <main className="order-1 lg:order-2 min-w-0">
                        <FilteredProductsSection />
                    </main>
                </div>

                {/* YORUMLAR BÖLÜMÜ */}
                <div className="pt-20 border-t border-white/5">
                    <ReviewSection currentUser={currentUser} reviews={reviews} />
                </div>
            </div>
            <Footer />
        </>
    );
}