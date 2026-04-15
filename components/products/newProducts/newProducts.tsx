import ProductsCard from "./newProductsCard";

export type Product = {
    id: number;
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    discount?: string | null;
    category?: string;
};

export const products: Product[] = [
    {
        id: 1,
        name: "PlayStation 5 Slim Standart Edition",
        image: "/products/ps5-slim.png",
        price: "18.999",
        discount: null,
        category: "Konsollar"
    },
    {
        id: 2,
        name: "God of War Ragnarök - PS5",
        image: "/products/gow-ragnarok.png",
        oldPrice: "1.499",
        price: "1.249",
        discount: "16%",
        category: "Oyunlar"
    },
    {
        id: 3,
        name: "DualSense Kablosuz Kontrolcü - Beyaz",
        image: "/products/dualsense-white.png",
        price: "2.899",
        discount: null,
        category: "Aksesuarlar"
    },
    {
        id: 4,
        name: "Marvel's Spider-Man 2 - PS5",
        image: "/products/spiderman-2.png",
        price: "1.499",
        discount: null,
        category: "Oyunlar"
    },
    {
        id: 5,
        name: "Pulse 3D Kablosuz Kulaklık",
        image: "/products/pulse-3d.png",
        oldPrice: "3.999",
        price: "3.499",
        discount: "12%",
        category: "Aksesuarlar"
    },
    {
        id: 6,
        name: "Elden Ring: Shadow of the Erdtree",
        image: "/products/elden-ring.png",
        price: "1.200",
        discount: null,
        category: "Oyunlar"
    },
    {
        id: 7,
        name: "DualSense Şarj İstasyonu",
        image: "/products/charging-station.png",
        price: "999",
        discount: null,
        category: "Aksesuarlar"
    },
    {
        id: 8,
        name: "PlayStation Plus 12 Aylık - Deluxe",
        image: "/products/ps-plus-card.png",
        price: "2.740",
        discount: null,
        category: "Üyelik"
    },
];

type ProductsProps = {
    limit?: number;
};

export default function Products({ limit }: ProductsProps) {
    const displayProducts = limit ? products.slice(0, limit) : products;

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        Yeni Ürünler
                    </h2>
                    <p className="text-sm text-gray-400">
                        Mart sonuna kadar güncel fırsatları kaçırmayın.
                    </p>
                </div>

                <a
                    href="/yeni-urunler"
                    className="cursor-pointer flex items-center gap-2 text-sm text-blue-400 border border-blue-400/40 px-4 py-1.5 rounded-full hover:bg-blue-400/10 transition"
                >
                    Tümünü Gör →
                </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {displayProducts.map((product, index) => (
                    <ProductsCard key={`${product.id}-${index}`} product={product} />
                ))}
            </div>
        </section>
    );
}
