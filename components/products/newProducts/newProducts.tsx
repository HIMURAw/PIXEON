import ProductsCard from "./newProductsCard";

export type Product = {
    id: number;
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    discount?: string | null;
    organic?: boolean;
    select?: boolean;
};

export const products: Product[] = [
    {
        id: 1,
        name: "Angie's Boomchickapop Tatlı ve Tuzlu Mısır",
        image: "/products/product-1.jpg",
        price: "249.99",
        discount: null,
        organic: false,
        select: true,
    },
    {
        id: 2,
        name: "Blue Diamond Almonds Az Tuzlu Badem",
        image: "/products/product-2.png",
        oldPrice: "349.99",
        price: "299.99",
        discount: "10%",
        organic: true,
        select: false,
    },
    {
        id: 3,
        name: "Angus Dana Kuşbaşı Et",
        image: "/products/product-1.jpg",
        oldPrice: "899.99",
        price: "649.99",
        discount: "38%",
        organic: false,
        select: false,
    },
    {
        id: 4,
        name: "Angie's Boomchickapop Sweet & Salty Kettle Corn",
        image: "/products/product-1.jpg",
        price: "7.99",
        discount: null,
        organic: false,
        select: true,
    },
       {
        id: 4,
        name: "Angie's Boomchickapop Sweet & Salty Kettle Corn",
        image: "/products/product-1.jpg",
        price: "7.99",
        discount: null,
        organic: false,
        select: true,
    },
    {
        id: 5,
        name: "Blue Diamond Almonds Lightly Salted",
        image: "/products/product-2.png",
        oldPrice: "11.68",
        price: "10.58",
        discount: "10%",
        organic: true,
        select: false,
    },
    {
        id: 6,
        name: "USDA Choice Angus Beef Stew Meat",
        image: "/products/product-1.jpg",
        oldPrice: "79.99",
        price: "49.99",
        discount: "38%",
        organic: false,
        select: false,
    },
    {
        id: 7,
        name: "Angie's Boomchickapop Sweet & Salty Kettle Corn",
        image: "/products/product-1.jpg",
        price: "7.99",
        discount: null,
        organic: false,
        select: true,
    },
    {
        id: 8,
        name: "Himura'nın Özel Pembe ***** Tadında Kokusu",
        image: "/products/product-1.jpg",
        price: "ÜCRETSİZ",
        discount: null,
        organic: false,
        select: true,
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
