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

export default function Home() {
    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full px-4 sm:px-6 lg:px-8 py-12 space-y-24">
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
                        <PromoSection />
                        <PromoVertical />
                        <PromoVerticalSmall />
                    </aside>

                    {/* SAĞ TARAF */}
                    <main className="space-y-24">
                        <BestSellers />
                        <InfoBanner />
                        <HotDeal />
                        <PromoBanner />
                    </main>
                </div>
            </div>
        </>
    );
}