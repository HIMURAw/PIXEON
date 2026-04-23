import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Aksesuarlar | PIXEON - Yetkili PlayStation Satış Merkezi",
    description: "DualSense kontrolcüler, kulaklıklar, standlar ve tüm PlayStation aksesuarları.",
};

type Accessory = {
    id: number;
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    discount?: string | null;
    cat: string;
    rating: number;
};

const accessories: Accessory[] = [
    // Kontrolcüler
    { id: 1,  name: "DualSense Kablosuz Kontrolcü - Beyaz",          image: "/products/dualsense.png",           price: "2.899", discount: null,  cat: "Kontrolcü", rating: 5 },
    { id: 2,  name: "DualSense Edge™ Kontrolcü",                     image: "/products/dualsense_edge_hero.png", price: "6.999", oldPrice: "7.499", discount: "7%", cat: "Kontrolcü", rating: 5 },
    { id: 3,  name: "DualSense - Volcanic Red",                      image: "/products/dualsense.png",           price: "3.699", discount: null,  cat: "Kontrolcü", rating: 4 },
    { id: 4,  name: "DualSense - Cobalt Blue",                       image: "/products/dualsense.png",           price: "3.699", discount: null,  cat: "Kontrolcü", rating: 4 },
    { id: 5,  name: "DualSense - Midnight Black",                    image: "/products/dualsense.png",           price: "3.499", oldPrice: "3.899", discount: "10%", cat: "Kontrolcü", rating: 5 },
    // Kulaklıklar
    { id: 6,  name: "PS5 Pulse 3D Kablosuz Kulaklık",               image: "/products/dual-sense.jpg",          price: "3.499", oldPrice: "3.999", discount: "12%", cat: "Kulaklık", rating: 4 },
    { id: 7,  name: "Sony Pulse Explore Kulaklık",                   image: "/products/dual-sense.jpg",          price: "5.999", oldPrice: "7.199", discount: "17%", cat: "Kulaklık", rating: 5 },
    { id: 8,  name: "Sony Pulse Elite Kulaklık",                     image: "/products/dual-sense.jpg",          price: "4.499", discount: null,  cat: "Kulaklık", rating: 5 },
    // Diğer
    { id: 9,  name: "PS5 HD Kamera",                                 image: "/products/dual-sense.jpg",          price: "1.899", discount: null,  cat: "Kamera",    rating: 4 },
    { id: 10, name: "PlayStation Media Remote",                      image: "/products/dual-sense.jpg",          price: "899",   oldPrice: "1.099", discount: "18%", cat: "Remote",   rating: 4 },
    { id: 11, name: "DualSense Şarj İstasyonu",                     image: "/products/dual-sense.jpg",          price: "999",   discount: null,  cat: "Şarj",      rating: 5 },
    { id: 12, name: "PS5 Slim Dikey Stand",                         image: "/products/dual-sense.jpg",          price: "799",   discount: null,  cat: "Stand",     rating: 4 },
];

const catGroups = [
    { key: "Kontrolcü", title: "Kontrolcüler",           desc: "DualSense ve DualSense Edge modelleri" },
    { key: "Kulaklık",  title: "Kulaklıklar & Ses",      desc: "Pulse serisi kablosuz kulaklıklar" },
    { key: "Kamera",    title: "Kamera",                  desc: "PS5 HD kamera" },
    { key: "Remote",    title: "Media Remote",            desc: "PS5 medya kumandası" },
    { key: "Şarj",      title: "Şarj İstasyonları",      desc: "DualSense şarj çözümleri" },
    { key: "Stand",     title: "Stand & Tutucu",          desc: "Konsol stand ve aksesuarları" },
];

function Stars({ count }: { count: number }) {
    return (
        <div className="flex items-center gap-0.5 text-yellow-400 text-xs my-2">
            {"★".repeat(count)}
            {count < 5 && <span className="text-white/40">{"★".repeat(5 - count)}</span>}
        </div>
    );
}

function Card({ a }: { a: Accessory }) {
    return (
        <div className="bg-[#0b1220] border border-white/10 rounded-xl p-4 hover:shadow-lg hover:border-blue-400/20 transition flex flex-col h-full">
            <div className="flex gap-2 mb-3 flex-wrap">
                {a.discount && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded font-bold">{a.discount} İNDİRİM</span>
                )}
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/5">{a.cat}</span>
            </div>
            <div className="h-36 flex items-center justify-center mb-4">
                <img src={a.image} alt={a.name} className="max-h-full object-contain" />
            </div>
            <h3 className="text-sm text-white leading-snug mb-1">{a.name}</h3>
            <span className="text-xs text-green-400 font-medium">Stokta Var</span>
            <Stars count={a.rating} />
            <div className="mb-3">
                {a.oldPrice && <span className="text-sm text-gray-400 line-through mr-2">{a.oldPrice} ₺</span>}
                <span className="text-lg font-bold text-red-500">{a.price} ₺</span>
            </div>
            <button className="cursor-pointer mt-auto w-full border border-blue-400 text-blue-400 py-1.5 rounded-full text-sm hover:bg-blue-400 hover:text-white transition font-bold">
                Sepete Ekle
            </button>
        </div>
    );
}

export default function AksesuarlarPage() {
    return (
        <>
            <TopBar />
            <MainBar />
            <Head />

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-12">
                {/* Başlık */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-xl font-semibold text-white">PlayStation Aksesuarları</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            Kontrolcüler, kulaklıklar, standlar — {accessories.length} ürün listeleniyor
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {catGroups.map(cg => (
                            <button key={cg.key} className="cursor-pointer text-xs text-blue-400 border border-blue-400/40 px-3 py-1.5 rounded-full hover:bg-blue-400/10 transition">
                                {cg.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Kategoriye göre gruplar */}
                {catGroups.map(cg => {
                    const items = accessories.filter(a => a.cat === cg.key);
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
                                {items.map(a => <Card key={a.id} a={a} />)}
                            </div>
                            <div className="border-t border-white/5" />
                        </section>
                    );
                })}
            </div>
        </>
    );
}
