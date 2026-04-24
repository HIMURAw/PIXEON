import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PS5 Oyunları | PIXEON - Yetkili PlayStation Satış Merkezi",
    description: "En yeni PS5 oyunlarını en uygun fiyatlarla PIXEON'da satın al.",
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
    // PS5
    { id: 1,  name: "Marvel's Spider-Man 2", image: "/products/spiderman_2_hero.png", price: "1.699", oldPrice: "2.199", discount: "23%", genre: "Aksiyon", category: "PS5", rating: 5 },
    { id: 2,  name: "God of War: Ragnarök", image: "/products/spiderman.jpg", price: "1.499", oldPrice: "1.899", discount: "21%", genre: "Aksiyon-RPG", category: "PS5", rating: 5 },
    { id: 3,  name: "Elden Ring: Shadow of the Erdtree", image: "/products/spiderman.jpg", price: "1.200", discount: null, genre: "RPG", category: "PS5", rating: 5 },
    { id: 4,  name: "Hogwarts Legacy", image: "/products/spiderman.jpg", price: "1.699", discount: null, genre: "RPG", category: "PS5", rating: 5 },
    { id: 5,  name: "The Last of Us Part I", image: "/products/spiderman.jpg", price: "1.399", oldPrice: "1.899", discount: "26%", genre: "Aksiyon", category: "PS5", rating: 5 },
    { id: 6,  name: "EA FC 25", image: "/products/spiderman.jpg", price: "1.599", oldPrice: "1.999", discount: "20%", genre: "Spor", category: "PS5", rating: 4 },
    { id: 7,  name: "Ghost of Tsushima Director's Cut", image: "/products/spiderman.jpg", price: "1.299", discount: null, genre: "Aksiyon", category: "PS5", rating: 5 },
    { id: 8,  name: "Horizon Forbidden West", image: "/products/spiderman.jpg", price: "849", oldPrice: "1.299", discount: "35%", genre: "Aksiyon-RPG", category: "PS5", rating: 4 },
    { id: 9,  name: "Returnal", image: "/products/spiderman.jpg", price: "899", discount: null, genre: "Roguelite", category: "PS5", rating: 5 },
    { id: 10, name: "Ratchet & Clank: Rift Apart", image: "/products/spiderman.jpg", price: "999", discount: null, genre: "Platform", category: "PS5", rating: 5 },
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

export default function PS5OyunlarPage() {
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
                        <h1 className="text-xl font-semibold text-white">PS5 Oyunları</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            En yeni nesil oyunlar — {games.length} ürün listeleniyor
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

                {/* PS5 Oyunlar */}
                <section className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {games.map(g => <GameCard key={g.id} g={g} />)}
                    </div>
                </section>
            </div>
        </>
    );
}
