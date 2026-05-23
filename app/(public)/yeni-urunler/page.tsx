import MainBar from "@/components/header/MainBar";
import TopBar from "@/components/header/TopBar";
import Head from "@/components/header/Head";
import Products from "@/components/products/newProducts/newProducts";
import SidebarLayout from "@/components/categories/SidebarLayout";

export default function YeniUrunlerPage() {
    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-10">
                <SidebarLayout>
                    <Products />
                </SidebarLayout>
            </div>
        </>
    );
}
