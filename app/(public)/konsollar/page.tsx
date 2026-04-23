import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Konsollar | PIXEON - Yetkili PlayStation Satış Merkezi",
    description: "PlayStation 5 ve PlayStation 4 konsollarını en uygun fiyatlarla PIXEON'da keşfedin.",
};

const consoles = [
    {
        name: "PS5 Slim + God of War Ragnarök Paketi",
        image: "/products/ps5-bundle.png",
        price: "21.499",
        oldPrice: null,
        discount: null,
        category: "PS5",
        badge: null,
        stock: true,
        rating: 5,
    },
    {
        name: "PlayStation 5 Dijital Edition",
        image: "/products/ps5-bundle.png",
        price: "18.999",
        oldPrice: "20.999",
        discount: "10%",
        category: "PS5",
        badge: "ÇOK SATAN",
        stock: true,
        rating: 5,
    },
    {
        name: "PlayStation 4 Pro 1TB",
        image: "/products/ps5-bundle.png",
        price: "12.499",
        oldPrice: null,
        discount: null,
        category: "PS4",
        badge: null,
        stock: true,
        rating: 4,
    },
    {
        name: "PlayStation 4 Slim 500GB",
        image: "/products/ps5-bundle.png",
        price: "9.999",
        oldPrice: "11.500",
        discount: "13%",
        category: "PS4",
        badge: "İNDİRİM",
        stock: true,
        rating: 4,
    },
    {
        name: "PS5 Slim Bundle - Spider-Man 2",
        image: "/products/ps5-bundle.png",
        price: "28.499",
        oldPrice: "30.999",
        discount: "8%",
        category: "PS5",
        badge: "BUNDLE",
        stock: true,
        rating: 5,
    },
    {
        name: "PS5 Bundle - FC 25 Edition",
        image: "/products/ps5-bundle.png",
        price: "26.999",
        oldPrice: null,
        discount: null,
        category: "PS5",
        badge: "YENİ",
        stock: true,
        rating: 4,
    },
];

function Stars({ count }: { count: number }) {
    return (
        <div className="flex items-center gap-0.5 text-yellow-400 text-xs my-2">
            {"★".repeat(count)}
            {count < 5 && <span className="text-white/40">{"★".repeat(5 - count)}</span>}
        </div>
    );
}

export default function KonsollarPage() {
    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-10">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-white">PlayStation Konsollar</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            PS5 ve PS4 konsollarını en uygun fiyatlarla keşfet
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {["Tümü", "PS5", "PS4"].map(f => (
                            <button key={f} className="cursor-pointer text-xs text-blue-400 border border-blue-400/40 px-3 py-1.5 rounded-full hover:bg-blue-400/10 transition">
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {consoles.map((item, i) => (
                        <div key={i} className="bg-[#0b1220] border border-white/10 rounded-xl p-4 hover:shadow-lg hover:border-blue-400/20 transition flex flex-col h-full">
                            <div className="flex gap-2 mb-3">
                                {item.discount && (
                                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded font-bold">
                                        {item.discount} İNDİRİM
                                    </span>
                                )}
                                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/5">
                                    {item.category}
                                </span>
                                {item.badge && !item.discount && (
                                    <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded">
                                        {item.badge}
                                    </span>
                                )}
                            </div>

                            <div className="h-36 flex items-center justify-center mb-4 bg-white/2 rounded-lg">
                                <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                            </div>

                            <h3 className="text-sm text-white leading-snug mb-1">{item.name}</h3>
                            <span className="text-xs text-green-400 font-medium">Stokta Var</span>
                            <Stars count={item.rating} />

                            <div className="mb-3">
                                {item.oldPrice && (
                                    <span className="text-sm text-gray-400 line-through mr-2">
                                        {item.oldPrice} ₺
                                    </span>
                                )}
                                <span className="text-lg font-bold text-red-500">
                                    {item.price} ₺
                                </span>
                            </div>

                            <button className="cursor-pointer mt-auto w-full border border-blue-400 text-blue-400 py-1.5 rounded-full text-sm hover:bg-blue-400 hover:text-white transition font-bold">
                                Sepete Ekle
                            </button>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center pt-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-blue-400 border border-blue-400/40 px-6 py-2 rounded-full hover:bg-blue-400/10 transition">
                        Tüm Ürünlere Gözat →
                    </Link>
                </div>
            </div>
        </>
    );
}
