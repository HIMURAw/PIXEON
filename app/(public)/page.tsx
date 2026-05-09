import MainBar from "@/components/header/MainBar";
import TopBar from "@/components/header/TopBar";
import Head from "@/components/header/Head";
import HeroCarousel from "@/components/hero/hero";
import PromoSection from "@/components/promo/promoSection";
import BestSellers from "@/components/sellersCard/bestSellers/bestSeller";
import InfoBanner from "@/components/hero/InfoBanner";
import HotDeal from "@/components/sellersCard/hotDeals/HotDeal";
import PromoVertical from "@/components/promo/PromoVertical";
import PromoVerticalSmall from "@/components/promo/PromoVerticalSmall";
import PromoBanner from "@/components/promo/PromoBanner";
import Products from "@/components/products/newProducts/newProducts";
import NewProductsSidebar from "@/components/products/newProducts/NewProductsSidebar";
import ReviewSection from "@/components/reviews/ReviewSection";
import Footer from "@/components/footer/Footer";
import BannerSection from "@/components/promo/BannerSection";
import BlogHomepageSection from "@/components/blog/BlogHomepageSection";

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

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-1 pb-10 space-y-24">
                {/* HERO */}
                <div className="flex gap-16">
                    <aside className="hidden lg:block w-72 shrink-0">
                        {/* Categories buraya gelecek */}
                    </aside>
                    <main className="flex-1">
                        <HeroCarousel />
                    </main>
                </div>

                {/* ALT CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16">
                    {/* SOL TARAF */}
                    <aside className="space-y-6">
                        <BannerSection position="home-top" />
                        <PromoSection />
                        <BannerSection position="products-sidebar" />
                        <PromoVertical />
                        <PromoVerticalSmall />
                    </aside>

                    {/* SAĞ TARAF */}
                    <main className="space-y-24">
                        <BestSellers />
                        <BannerSection position="home-middle" className="h-64" />
                        <InfoBanner />
                        <HotDeal />
                        <PromoBanner />
                        <BannerSection position="home-bottom" />
                    </main>
                </div>

                {/* YENİ ÜRÜNLER BÖLÜMÜ */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 !-mt-14">
                    <aside>
                        <NewProductsSidebar />
                    </aside>
                    <main>
                        <Products limit={6} />
                    </main>
                </div>

                {/* YORUMLAR BÖLÜMÜ */}
                <div className="pt-20 border-t border-white/5">
                    <ReviewSection currentUser={currentUser} reviews={reviews} />
                </div>

                {/* BLOG BÖLÜMÜ */}
                <div className="pt-20 border-t border-white/5">
                    <BlogHomepageSection />
                </div>
            </div>
            <Footer />
        </>
    );
}