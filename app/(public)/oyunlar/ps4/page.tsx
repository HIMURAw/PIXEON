import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PS4 Oyunları | PIXEON - Yetkili PlayStation Satış Merkezi",
    description: "En sevilen PS4 oyunlarını en uygun fiyatlarla PIXEON'da satın al.",
};

type Game = {
    id: number;
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    discount?: string | null;
    genre: string;
    category: string;
    rating: number;
};

const games: Game[] = [
    // PS4
    { id: 11, name: "GTA V", image: "/products/spiderman.jpg", price: "799", oldPrice: "1.199", discount: "33%", genre: "Açık Dünya", category: "PS4", rating: 4 },
    { id: 12, name: "Red Dead Redemption 2", image: "/products/spiderman.jpg", price: "999", discount: null, genre: "Açık Dünya", category: "PS4", rating: 5 },
    { id: 13, name: "The Last of Us Remastered", image: "/products/spiderman.jpg", price: "499", oldPrice: "799", discount: "38%", genre: "Aksiyon", category: "PS4", rating: 5 },
    { id: 14, name: "God of War (2018)", image: "/products/spiderman.jpg", price: "649", discount: null, genre: "Aksiyon-RPG", category: "PS4", rating: 5 },
    { id: 15, name: "Uncharted 4", image: "/products/spiderman.jpg", price: "399", oldPrice: "599", discount: "33%", genre: "Macera", category: "PS4", rating: 5 },
    { id: 16, name: "FIFA 23", image: "/products/spiderman.jpg", price: "499", oldPrice: "899", discount: "44%", genre: "Spor", category: "PS4", rating: 4 },
];

function Stars({ count }: { count: number }) {
    return (
        <div className="flex items-center gap-0.5 text-yellow-400 text-xs my-2">
            {"★".repeat(count)}
            {count < 5 && <span className="text-white/40">{"★".repeat(5 - count)}</span>}
        </div>
    );
}

function GameCard({ g }: { g: Game }) {
    return (
        <div className="bg-[#0b1220] border border-white/10 rounded-xl p-4 hover:shadow-lg hover:border-blue-400/20 transition flex flex-col h-full">
            <div className="flex gap-2 mb-3 flex-wrap">
                {g.discount && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded font-bold">{g.discount} İNDİRİM</span>
                )}
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/5">{g.category}</span>
            </div>
            <div className="h-36 flex items-center justify-center mb-4">
                <img src={g.image} alt={g.name} className="max-h-full object-contain" />
            </div>
            <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">{g.genre}</span>
            <h3 className="text-sm text-white leading-snug mb-1 mt-0.5">{g.name}</h3>
            <span className="text-xs text-green-400 font-medium">Stokta Var</span>
            <Stars count={g.rating} />
            <div className="mb-3">
                {g.oldPrice && <span className="text-sm text-gray-400 line-through mr-2">{g.oldPrice} ₺</span>}
                <span className="text-lg font-bold text-red-500">{g.price} ₺</span>
            </div>
            <button className="cursor-pointer mt-auto w-full border border-blue-400 text-blue-400 py-1.5 rounded-full text-sm hover:bg-blue-400 hover:text-white transition font-bold">
                Sepete Ekle
            </button>
        </div>
    );
}

export default function PS4OyunlarPage() {
    const genres = [...new Set(games.map(g => g.genre))];

    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-12">
                {/* Başlık + Filtreler */}
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-xl font-semibold text-white">PS4 Oyunları</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            Klasikleşmiş efsane oyunlar — {games.length} ürün listeleniyor
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {["Tümü", ...genres].map(f => (
                            <button key={f} className="cursor-pointer text-xs text-blue-400 border border-blue-400/40 px-3 py-1.5 rounded-full hover:bg-blue-400/10 transition">
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* PS4 Oyunlar */}
                <section className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {games.map(g => <GameCard key={g.id} g={g} />)}
                    </div>
                </section>
            </div>
        </>
    );
}
