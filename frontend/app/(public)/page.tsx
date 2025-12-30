import MainBar from "@/components/header/MainBar";
import TopBar from "@/components/header/TopBar";
import Head from "@/components/header/Head";
import HeroCarousel from "@/components/hero/hero";

export default function Home() {
    return (
        <>
            <TopBar />
            <MainBar />
            <Head />
            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-6">
                    {/* Sidebar kategoriler */}
                    <aside className="w-72">
                        {/* Kategorileriniz buraya */}
                    </aside>

                    <main className="flex-1">
                        <HeroCarousel />
                    </main>
                </div>
            </div>
        </>
    );
}
