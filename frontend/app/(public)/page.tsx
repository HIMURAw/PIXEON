import MainBar from "@/components/header/MainBar";
import TopBar from "@/components/header/TopBar";
import Head from "@/components/header/Head";
import HeroCarousel from "@/components/hero/hero";
import PromoSection from "@/components/hero/promoSection";
// import BestSellers from "@/components/products/BestSellers";

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
                        {/* Categories */}
                    </aside>

                    <main className="flex-1">
                        <HeroCarousel />
                    </main>
                </div>

                {/* ALT SECTION */}
                <div className="flex gap-6">
                    {/* SOL REKLAM */}
                    <aside className="w-72 ml-30">
                        <PromoSection />
                    </aside>

                    {/* EN ÇOK SATANLAR */}
                    <main className="flex-1">
                        {/* <BestSellers /> */}
                    </main>
                </div>

            </div>
        </>
    );
}
