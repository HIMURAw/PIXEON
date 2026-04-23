import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Oyunlar | PIXEON - Yetkili PlayStation Satış Merkezi",
    description: "PS5 ve PS4 oyunlarını en uygun fiyatlarla PIXEON'da satın al.",
};

const games = [
    { name: "Spider-Man 2 - PS5", image: "/products/horizon.png", price: "2.299", oldPrice: "2.799", discount: "18%", category: "PS5", genre: "Aksiyon", rating: 5 },
    { name: "God of War: Ragnarök - PS5", image: "/products/horizon.png", price: "1.899", oldPrice: null, discount: null, category: "PS5", genre: "Aksiyon-RPG", rating: 5 },
    { name: "EA FC 25 - PS5", image: "/products/horizon.png", price: "1.799", oldPrice: "2.199", discount: "18%", category: "PS5", genre: "Spor", rating: 4 },
    { name: "Hogwarts Legacy - PS5", image: "/products/horizon.png", price: "1.699", oldPrice: null, discount: null, category: "PS5", genre: "RPG", rating: 5 },
    { name: "The Last of Us Part I - PS5", image: "/products/horizon.png", price: "1.599", oldPrice: "1.999", discount: "20%", category: "PS5", genre: "Aksiyon", rating: 5 },
    { name: "Elden Ring - PS5", image: "/products/horizon.png", price: "1.849", oldPrice: null, discount: null, category: "PS5", genre: "RPG", rating: 5 },
    { name: "GTA V - PS4", image: "/products/horizon.png", price: "799", oldPrice: "1.199", discount: "33%", category: "PS4", genre: "Açık Dünya", rating: 4 },
    { name: "Red Dead Redemption 2 - PS4", image: "/products/horizon.png", price: "999", oldPrice: null, discount: null, category: "PS4", genre: "Açık Dünya", rating: 5 },
];

function Stars({ count }: { count: number }) {
    return (
        <div className="flex items-center gap-0.5 text-yellow-400 text-xs my-2">
            {"★".repeat(count)}
            {count < 5 && <span className="text-white/40">{"★".repeat(5 - count)}</span>}
        </div>
    );
}

export default function OyunlarPage() {
    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-10">
                {/* Page Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-xl font-semibold text-white">PlayStation Oyunları</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            PS5 ve PS4 için en yeni ve en çok satılan oyunlar
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {["Tümü", "PS5", "PS4", "Aksiyon", "RPG", "Spor"].map(f => (
                            <button key={f} className="cursor-pointer text-xs text-blue-400 border border-blue-400/40 px-3 py-1.5 rounded-full hover:bg-blue-400/10 transition">
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {games.map((item, i) => (
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
                            </div>

                            <div className="h-36 flex items-center justify-center mb-4">
                                <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                            </div>

                            <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">{item.genre}</span>
                            <h3 className="text-sm text-white leading-snug mb-1 mt-0.5">{item.name}</h3>
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

                <div className="text-center pt-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-blue-400 border border-blue-400/40 px-6 py-2 rounded-full hover:bg-blue-400/10 transition">
                        Tüm Ürünlere Gözat →
                    </Link>
                </div>
            </div>
        </>
    );
}
