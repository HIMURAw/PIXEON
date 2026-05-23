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

import ReviewSection from "@/components/reviews/ReviewSection";
import Footer from "@/components/footer/Footer";
import BannerSection from "@/components/promo/BannerSection";
import SidebarLayout from "@/components/categories/SidebarLayout";

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

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-1 pb-10 space-y-8 md:space-y-24 mt-1">
                {/* HERO */}
                <SidebarLayout>
                    <HeroCarousel />
                </SidebarLayout>

                {/* ALT CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-16">
                    {/* SOL TARAF */}
                    <aside className="space-y-6 order-2 lg:order-1">
                        <BannerSection position="home-top" />
                        <PromoSection />
                        <BannerSection position="products-sidebar" />
                        <PromoVertical />
                        <PromoVerticalSmall />
                    </aside>

                    {/* SAĞ TARAF */}
                    <main className="space-y-8 md:space-y-24 order-1 lg:order-2 min-w-0">
                        <RecommendedProducts />
                        <BannerSection position="home-middle" className="h-64" />
                        <InfoBanner />
                        <HotDeal />
                    </main>
                </div>

                <PromoBanner />
                <BestSellers />
                <BannerSection position="home-bottom" />



                {/* YORUMLAR BÖLÜMÜ */}
                <div className="pt-20 border-t border-white/5">
                    <ReviewSection currentUser={currentUser} reviews={reviews} />
                </div>
            </div>
            <Footer />
        </>
    );
}