import { Product } from "./bestSeller";

type BestSellerCardProps = {
    product: Product;
};

export default function BestSellerCard({ product }: BestSellerCardProps) {
    return (
        <div className="bg-[#0b1220] border border-white/10 rounded-xl p-4 hover:shadow-lg transition">
            <div className="flex gap-2 mb-3">
                {product.discount && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                        {product.discount}
                    </span>
                )}
                {product.organic && (
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                        Organic
                    </span>
                )}
            </div>

            <div className="h-36 flex items-center justify-center mb-4">
                <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full object-contain"
                />
            </div>

            <h3 className="text-sm text-white leading-snug mb-1">
                {product.name}
            </h3>

            <span className="text-xs text-green-400 font-medium">
                In Stock
            </span>

            <div className="flex items-center gap-1 text-yellow-400 text-xs my-2">
                {"★".repeat(4)}
                <span className="text-white/40">★</span>
                <span className="text-white/40 ml-1">1</span>
            </div>

            <div className="mb-3">
                {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through mr-2">
                        ${product.oldPrice}
                    </span>
                )}
                <span className="text-lg font-bold text-red-500">
                    ${product.price}
                </span>
            </div>

            <button className="w-full border border-blue-400 text-blue-400 py-1.5 rounded-full text-sm hover:bg-blue-400 hover:text-white transition">
                {product.select ? "Select options" : "Add to cart"}
            </button>
        </div>
    );
}
