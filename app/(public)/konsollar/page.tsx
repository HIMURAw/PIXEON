import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Konsollar | PIXEON - Yetkili PlayStation Satış Merkezi",
    description: "PlayStation 5 ve PlayStation 4 konsollarını en uygun fiyatlarla PIXEON'da keşfedin.",
};

type Product = {
    id: number;
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    discount?: string | null;
    category: string;
    tag?: string;
    rating: number;
    stock: boolean;
};

const consoles: Product[] = [
    { id: 1, name: "PlayStation 5 Slim Standart Edition", image: "/products/ps5.png", price: "19.999", discount: null, category: "PS5", rating: 5, stock: true },
    { id: 2, name: "PlayStation 5 Pro", image: "/products/ps5_pro_hero.png", price: "28.499", discount: null, category: "PS5", rating: 5, stock: true },
    { id: 3, name: "PlayStation 5 Dijital Edition Slim", image: "/products/ps5.png", price: "17.499", oldPrice: "18.999", discount: "8%", category: "PS5", rating: 5, stock: true },
    { id: 4, name: "PS5 Bundle – God of War Ragnarök", image: "/products/ps5.png", price: "21.499", discount: null, category: "PS5", rating: 5, stock: true },
    { id: 5, name: "PS5 Bundle – Spider-Man 2", image: "/products/ps5.png", price: "22.499", oldPrice: "24.999", discount: "10%", category: "PS5", rating: 5, stock: true },
    { id: 6, name: "PS5 Bundle – FC 25 Edition", image: "/products/ps5.png", price: "20.999", discount: null, category: "PS5", rating: 4, stock: true },
    { id: 7, name: "PlayStation 4 Pro 1TB", image: "/products/ps5.png", price: "12.499", discount: null, category: "PS4", rating: 4, stock: true },
    { id: 8, name: "PlayStation 4 Slim 500GB", image: "/products/ps5.png", price: "9.999", oldPrice: "11.500", discount: "13%", category: "PS4", rating: 4, stock: true },
];

function Stars({ count }: { count: number }) {
    return (
        <div className="flex items-center gap-0.5 text-yellow-400 text-xs my-2">
            {"★".repeat(count)}
            {count < 5 && <span className="text-white/40">{"★".repeat(5 - count)}</span>}
        </div>
    );
}

function ProductCard({ p }: { p: Product }) {
    return (
        <div className="bg-[#0b1220] border border-white/10 rounded-xl p-4 hover:shadow-lg hover:border-blue-400/20 transition flex flex-col h-full">
            <div className="flex gap-2 mb-3 flex-wrap">
                {p.discount && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded font-bold">{p.discount} İNDİRİM</span>
                )}
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/5">{p.category}</span>
            </div>
            <div className="h-36 flex items-center justify-center mb-4">
                <img src={p.image} alt={p.name} className="max-h-full object-contain" />
            </div>
            <h3 className="text-sm text-white leading-snug mb-1">{p.name}</h3>
            <span className="text-xs text-green-400 font-medium">{p.stock ? "Stokta Var" : "Stok Yok"}</span>
            <Stars count={p.rating} />
            <div className="mb-3">
                {p.oldPrice && <span className="text-sm text-gray-400 line-through mr-2">{p.oldPrice} ₺</span>}
                <span className="text-lg font-bold text-red-500">{p.price} ₺</span>
            </div>
            <button className="cursor-pointer mt-auto w-full border border-blue-400 text-blue-400 py-1.5 rounded-full text-sm hover:bg-blue-400 hover:text-white transition font-bold">
                Sepete Ekle
            </button>
        </div>
    );
}

export default function KonsollarPage() {
    const ps5 = consoles.filter(p => p.category === "PS5");
    const ps4 = consoles.filter(p => p.category === "PS4");

    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-12">
                {/* Başlık */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-xl font-semibold text-white">PlayStation Konsollar</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            PS5 ve PS4 modellerini karşılaştır, en uygun fiyatla satın al
                        </p>
                    </div>
                    <span className="text-xs text-gray-500 border border-white/10 px-3 py-1.5 rounded-full">
                        {consoles.length} ürün
                    </span>
                </div>

                {/* PS5 */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-white">PlayStation 5</h2>
                            <p className="text-sm text-gray-400">Yeni nesil oyun deneyimi</p>
                        </div>
                        <span className="text-xs text-blue-400 border border-blue-400/40 px-3 py-1 rounded-full">{ps5.length} model</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {ps5.map(p => <ProductCard key={p.id} p={p} />)}
                    </div>
                </section>

                <div className="border-t border-white/5" />

                {/* PS4 */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-white">PlayStation 4</h2>
                            <p className="text-sm text-gray-400">Klasik favoriler, uygun fiyatlar</p>
                        </div>
                        <span className="text-xs text-blue-400 border border-blue-400/40 px-3 py-1 rounded-full">{ps4.length} model</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {ps4.map(p => <ProductCard key={p.id} p={p} />)}
                    </div>
                </section>
            </div>
        </>
    );
}
