import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dijital Kodlar | PIXEON - Yetkili PlayStation Satış Merkezi",
    description: "PS Plus abonelikleri, PSN hediye kartları ve dijital oyun kodlarını PIXEON'da satın al.",
};

const digitalProducts = [
    { name: "PS Plus Essential - 1 Aylık", image: "/products/ps5-bundle.png", price: "399", oldPrice: null, discount: null, category: "PS Plus Essential", rating: 5 },
    { name: "PS Plus Extra - 3 Aylık", image: "/products/ps5-bundle.png", price: "999", oldPrice: "1.197", discount: "16%", category: "PS Plus Extra", rating: 5 },
    { name: "PS Plus Premium - 12 Aylık", image: "/products/ps5-bundle.png", price: "3.499", oldPrice: "4.788", discount: "27%", category: "PS Plus Premium", rating: 5 },
    { name: "PSN Hediye Kartı - ₺100", image: "/products/ps5-bundle.png", price: "110", oldPrice: null, discount: null, category: "Hediye Kartı", rating: 4 },
    { name: "PSN Hediye Kartı - ₺250", image: "/products/ps5-bundle.png", price: "270", oldPrice: null, discount: null, category: "Hediye Kartı", rating: 4 },
    { name: "PSN Hediye Kartı - ₺500", image: "/products/ps5-bundle.png", price: "540", oldPrice: null, discount: null, category: "Hediye Kartı", rating: 5 },
    { name: "EA FC 25 Ultimate Edition Kodu", image: "/products/horizon.png", price: "2.199", oldPrice: "2.699", discount: "19%", category: "Dijital Oyun", rating: 4 },
    { name: "NBA 2K25 MyTeam Paket Kodu", image: "/products/horizon.png", price: "699", oldPrice: "899", discount: "22%", category: "DLC / Paket", rating: 4 },
];

function Stars({ count }: { count: number }) {
    return (
        <div className="flex items-center gap-0.5 text-yellow-400 text-xs my-2">
            {"★".repeat(count)}
            {count < 5 && <span className="text-white/40">{"★".repeat(5 - count)}</span>}
        </div>
    );
}

export default function DijitalKodlarPage() {
    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-10">
                {/* Page Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-xl font-semibold text-white">Dijital Kodlar</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            PS Plus abonelikleri, hediye kartları ve dijital oyun kodları — anında e-posta teslimat
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {["Tümü", "PS Plus", "Hediye Kartı", "Dijital Oyun"].map(f => (
                            <button key={f} className="cursor-pointer text-xs text-blue-400 border border-blue-400/40 px-3 py-1.5 rounded-full hover:bg-blue-400/10 transition">
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info Strip */}
                <div className="flex flex-wrap gap-4">
                    {[
                        { emoji: "⚡", text: "Satın aldıktan sonra anında e-posta ile teslim" },
                        { emoji: "🔒", text: "100% güvenli SSL şifreli ödeme" },
                        { emoji: "🎮", text: "Orijinal Sony lisanslı kodlar" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-[#0b1220] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400">
                            <span className="text-base">{item.emoji}</span>
                            {item.text}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {digitalProducts.map((item, i) => (
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

                            <h3 className="text-sm text-white leading-snug mb-1">{item.name}</h3>
                            <span className="text-xs text-green-400 font-medium">⚡ Anında Teslimat</span>
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
                                Satın Al
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
