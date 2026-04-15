import MainBar from "@/components/header/MainBar";
import TopBar from "@/components/header/TopBar";
import Head from "@/components/header/Head";
import Products from "@/components/products/newProducts/newProducts";

export default function YeniUrunlerPage() {
    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-10">
                <div className="ml-0 lg:ml-[calc(280px+4rem)]">
                    <Products />
                </div>
            </div>
        </>
    );
}
