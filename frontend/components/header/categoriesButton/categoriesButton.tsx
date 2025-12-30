import { ChevronDown, Menu } from "lucide-react";

export default function CategoriesButton() {
    return (
        <div className="relative inline-flex flex-col items-center">
            <button className="w-60 flex items-center gap-3 bg-sky-400 text-white px-6 py-3 rounded-full font-bold hover:bg-sky-500 transition">
                <Menu size={18} />
                ALL CATEGORIES
                <ChevronDown size={16} />
            </button>

            <span className="absolute -bottom-3 bg-white text-gray-600 text-[10px] font-semibold px-3 py-1 rounded-full font-extrabold">
                TOTAL 63 PRODUCTS
            </span>
        </div>
    );
}
