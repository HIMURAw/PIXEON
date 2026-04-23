import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dijital Kodlar | PIXEON - Yetkili PlayStation Satış Merkezi",
    description: "PS Plus abonelikleri, PSN hediye kartları ve dijital oyun kodları — anında e-posta teslimat.",
};

type DigitalProduct = {
    id: number;
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    discount?: string | null;
    cat: string;
    rating: number;
    tag?: string;
};

const digitalProducts: DigitalProduct[] = [
    // PS Plus
    { id: 1,  name: "PS Plus Essential – 1 Aylık",      image: "/products/ps5.png", price: "399",   discount: null,  cat: "PS Plus Essential", rating: 5, tag: "⚡ Anında Teslimat" },
    { id: 2,  name: "PS Plus Essential – 3 Aylık",      image: "/products/ps5.png", price: "999",   oldPrice: "1.197", discount: "16%", cat: "PS Plus Essential", rating: 5, tag: "⚡ Anında Teslimat" },
    { id: 3,  name: "PS Plus Extra – 1 Aylık",          image: "/products/ps5.png", price: "699",   discount: null,  cat: "PS Plus Extra", rating: 5, tag: "⚡ Anında Teslimat" },
    { id: 4,  name: "PS Plus Extra – 3 Aylık",          image: "/products/ps5.png", price: "1.799", oldPrice: "2.097", discount: "14%", cat: "PS Plus Extra", rating: 5, tag: "⚡ Anında Teslimat" },
    { id: 5,  name: "PS Plus Premium – 1 Aylık",        image: "/products/ps5.png", price: "899",   discount: null,  cat: "PS Plus Premium", rating: 5, tag: "⚡ Anında Teslimat" },
    { id: 6,  name: "PS Plus Premium – 12 Aylık",       image: "/products/ps5.png", price: "3.499", oldPrice: "4.788", discount: "27%", cat: "PS Plus Premium", rating: 5, tag: "⚡ Anında Teslimat" },
    // Hediye Kartları
    { id: 7,  name: "PSN Hediye Kartı – ₺100",          image: "/products/ps5.png", price: "110",   discount: null,  cat: "Hediye Kartı", rating: 4, tag: "⚡ Anında Teslimat" },
    { id: 8,  name: "PSN Hediye Kartı – ₺250",          image: "/products/ps5.png", price: "270",   discount: null,  cat: "Hediye Kartı", rating: 4, tag: "⚡ Anında Teslimat" },
    { id: 9,  name: "PSN Hediye Kartı – ₺500",          image: "/products/ps5.png", price: "540",   discount: null,  cat: "Hediye Kartı", rating: 5, tag: "⚡ Anında Teslimat" },
    { id: 10, name: "PSN Hediye Kartı – ₺1000",         image: "/products/ps5.png", price: "1.080", discount: null,  cat: "Hediye Kartı", rating: 5, tag: "⚡ Anında Teslimat" },
    // Dijital Oyunlar
    { id: 11, name: "EA FC 25 Ultimate Edition",         image: "/products/spiderman.jpg", price: "2.199", oldPrice: "2.699", discount: "19%", cat: "Dijital Oyun", rating: 4 },
    { id: 12, name: "NBA 2K25 MyTeam Paketi",            image: "/products/spiderman.jpg", price: "699",   oldPrice: "899",   discount: "22%", cat: "Dijital Oyun", rating: 4 },
    { id: 13, name: "Minecraft Legends – PS5 Kod",       image: "/products/spiderman.jpg", price: "899",   discount: null,  cat: "Dijital Oyun", rating: 4 },
    { id: 14, name: "PlayStation Stars Üyeliği",         image: "/products/ps5.png", price: "199",   discount: null,  cat: "Üyelik", rating: 4, tag: "⚡ Anında Teslimat" },
];

const catGroups = [
    { key: "PS Plus Essential", title: "PS Plus Essential",  desc: "Aylık ücretsiz oyunlar ve çoklu oyun desteği" },
    { key: "PS Plus Extra",     title: "PS Plus Extra",       desc: "400+ oyun kataloğu ile genişletilmiş deneyim" },
    { key: "PS Plus Premium",   title: "PS Plus Premium",     desc: "Klasikler, bulut oyun ve deneme sürümleri" },
    { key: "Hediye Kartı",      title: "PSN Hediye Kartları", desc: "PlayStation Store'da kullanılabilir bakiye" },
    { key: "Dijital Oyun",      title: "Dijital Oyunlar",     desc: "Dijital oyun ve DLC kodları" },
    { key: "Üyelik",            title: "Üyelikler",           desc: "PlayStation Stars ve diğer üyelikler" },
];

function Stars({ count }: { count: number }) {
    return (
        <div className="flex items-center gap-0.5 text-yellow-400 text-xs my-2">
            {"★".repeat(count)}
            {count < 5 && <span className="text-white/40">{"★".repeat(5 - count)}</span>}
        </div>
    );
}

function Card({ d }: { d: DigitalProduct }) {
    return (
        <div className="bg-[#0b1220] border border-white/10 rounded-xl p-4 hover:shadow-lg hover:border-blue-400/20 transition flex flex-col h-full">
            <div className="flex gap-2 mb-3 flex-wrap">
                {d.discount && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded font-bold">{d.discount} İNDİRİM</span>
                )}
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/5">{d.cat}</span>
            </div>
            <div className="h-36 flex items-center justify-center mb-4">
                <img src={d.image} alt={d.name} className="max-h-full object-contain" />
            </div>
            <h3 className="text-sm text-white leading-snug mb-1">{d.name}</h3>
            <span className="text-xs text-green-400 font-medium">{d.tag ?? "Stokta Var"}</span>
            <Stars count={d.rating} />
            <div className="mb-3">
                {d.oldPrice && <span className="text-sm text-gray-400 line-through mr-2">{d.oldPrice} ₺</span>}
                <span className="text-lg font-bold text-red-500">{d.price} ₺</span>
            </div>
            <button className="cursor-pointer mt-auto w-full border border-blue-400 text-blue-400 py-1.5 rounded-full text-sm hover:bg-blue-400 hover:text-white transition font-bold">
                Satın Al
            </button>
        </div>
    );
}

export default function DijitalKodlarPage() {
    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-12">
                {/* Başlık */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-xl font-semibold text-white">Dijital Kodlar</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            PS Plus abonelikleri, hediye kartları ve dijital oyunlar — {digitalProducts.length} ürün
                        </p>
                    </div>
                    {/* Anında teslimat badge */}
                    <div className="flex items-center gap-2 bg-[#0b1220] border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400">
                        <span>⚡</span> Anında e-posta teslimat
                    </div>
                </div>

                {/* Bilgi çubuğu */}
                <div className="flex flex-wrap gap-4">
                    {[
                        { e: "⚡", t: "Satın aldıktan sonra anında e-posta ile teslim" },
                        { e: "🔒", t: "100% güvenli SSL şifreli ödeme" },
                        { e: "🎮", t: "Orijinal Sony lisanslı kodlar" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-[#0b1220] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400">
                            <span>{item.e}</span> {item.t}
                        </div>
                    ))}
                </div>

                {/* Kategoriye göre gruplar */}
                {catGroups.map(cg => {
                    const items = digitalProducts.filter(d => d.cat === cg.key);
                    if (!items.length) return null;
                    return (
                        <section key={cg.key} className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">{cg.title}</h2>
                                    <p className="text-sm text-gray-400">{cg.desc}</p>
                                </div>
                                <span className="text-xs text-blue-400 border border-blue-400/40 px-3 py-1 rounded-full">{items.length} ürün</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {items.map(d => <Card key={d.id} d={d} />)}
                            </div>
                            <div className="border-t border-white/5" />
                        </section>
                    );
                })}
            </div>
        </>
    );
}
