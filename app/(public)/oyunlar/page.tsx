import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import type { Metadata } from "next";
import GameCard from "@/components/products/GameCard";
import type { Game } from "@/components/products/GameCard";

export const metadata: Metadata = {
    title: "Oyunlar | PIXEON - Yetkili PlayStation Satış Merkezi",
    description: "PS5 ve PS4 oyunlarını en uygun fiyatlarla PIXEON'da satın al.",
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
    // PS4
    { id: 11, name: "GTA V", image: "/products/spiderman.jpg", price: "799", oldPrice: "1.199", discount: "33%", genre: "Açık Dünya", category: "PS4", rating: 4 },
    { id: 12, name: "Red Dead Redemption 2", image: "/products/spiderman.jpg", price: "999", discount: null, genre: "Açık Dünya", category: "PS4", rating: 5 },
    { id: 13, name: "The Last of Us Remastered", image: "/products/spiderman.jpg", price: "499", oldPrice: "799", discount: "38%", genre: "Aksiyon", category: "PS4", rating: 5 },
    { id: 14, name: "God of War (2018)", image: "/products/spiderman.jpg", price: "649", discount: null, genre: "Aksiyon-RPG", category: "PS4", rating: 5 },
    { id: 15, name: "Uncharted 4", image: "/products/spiderman.jpg", price: "399", oldPrice: "599", discount: "33%", genre: "Macera", category: "PS4", rating: 5 },
    { id: 16, name: "FIFA 23", image: "/products/spiderman.jpg", price: "499", oldPrice: "899", discount: "44%", genre: "Spor", category: "PS4", rating: 4 },
];

export default function OyunlarPage() {
    const genres = [...new Set(games.map(g => g.genre))];
    const ps5Games = games.filter(g => g.category === "PS5");
    const ps4Games = games.filter(g => g.category === "PS4");

    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-12">
                {/* Başlık + Filtreler */}
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-xl font-semibold text-white">PlayStation Oyunları</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            PS5 ve PS4 için tüm oyunlar — {games.length} ürün listeleniyor
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
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-white">PS5 Oyunları</h2>
                            <p className="text-sm text-gray-400">En yeni nesil oyunlar</p>
                        </div>
                        <span className="text-xs text-blue-400 border border-blue-400/40 px-3 py-1 rounded-full">{ps5Games.length} oyun</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {ps5Games.map(g => <GameCard key={g.id} g={g} />)}
                    </div>
                </section>

                <div className="border-t border-white/5" />

                {/* PS4 Oyunlar */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-white">PS4 Oyunları</h2>
                            <p className="text-sm text-gray-400">Efsane oyunları uygun fiyatla keşfet</p>
                        </div>
                        <span className="text-xs text-blue-400 border border-blue-400/40 px-3 py-1 rounded-full">{ps4Games.length} oyun</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {ps4Games.map(g => <GameCard key={g.id} g={g} />)}
                    </div>
                </section>
            </div>
        </>
    );
}
