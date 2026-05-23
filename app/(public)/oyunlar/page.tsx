import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import type { Metadata } from "next";
import FilteredProductsSection from "@/components/products/FilteredProductsSection";

export const metadata: Metadata = {
    title: "Oyunlar | PIXEON - Yetkili PlayStation Satış Merkezi",
    description: "PS5 ve PS4 oyunlarını en uygun fiyatlarla PIXEON'da satın al.",
};

export default function OyunlarPage() {
    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-12">
                {/* Başlık */}
                <div>
                    <h1 className="text-xl font-semibold text-white">PlayStation Oyunları</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        PS5 ve PS4 için en iyi PlayStation oyunlarını keşfedin.
                    </p>
                </div>

                {/* Dynamic Products with Filtering */}
                <FilteredProductsSection 
                    initialCategory="46ea5f63-0f4a-4366-bbc9-cd37a6fcd174" 
                    hideCategoryFilter={true} 
                    hideHeader={true} 
                />
            </div>
        </>
    );
}

