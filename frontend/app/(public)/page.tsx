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

            <div className="container mx-auto px-4 py-8 space-y-10">
                {/* HERO */}
                <div className="flex gap-6">
                    <aside className="w-72">
                        {/* Categories buraya gelecek */}
                    </aside>
                    <main className="flex-1">
                        <HeroCarousel />
                    </main>
                </div>

                {/* ALT CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 ml-32">
                    {/* SOL TARAF */}
                    <aside className="space-y-6">
                        <PromoSection />
                        <PromoVertical />
                        <PromoVerticalSmall />
                    </aside>

                    {/* SAĞ TARAF */}
                    <main className="space-y-10">
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