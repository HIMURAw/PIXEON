"use client";
import { useState } from "react";
import {
    Menu,
    ChevronDown,
    ChevronRight,
    Apple,
    Drumstick,
    Egg,
    Coffee,
    Croissant,
    Snowflake,
    Candy,
    Leaf
} from "lucide-react";

export default function CategoriesButton() {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                className="w-60 flex items-center justify-between gap-3 bg-sky-400 text-white px-6 py-3 rounded-full font-bold hover:bg-sky-500 transition"
            >
                <Menu size={18} />
                ALL CATEGORIES
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            <span className="w-39 text-align-center absolute left-1/2 -translate-x-1/2 -bottom-3 bg-white text-gray-600 text-[10px] font-extrabold px-3 py-1 rounded-full">
                TOTAL 63 PRODUCTS
            </span>

            {/* Dropdown Menu with Animation */}
            <div
                className={`absolute top-8 mt-6 w-72 border rounded-b-lg border-gray-200 shadow-lg z-50 overflow-hidden transition-all duration-300 ease-in-out origin-top ${open
                    ? 'opacity-100 scale-y-100 translate-y-0'
                    : 'opacity-0 scale-y-0 -translate-y-4 pointer-events-none'
                    }`}
            >
                <div className="py-2">
                    <CategoryItem icon={<Apple size={18} />} text="Fruits & Vegetables" arrow />
                    <CategoryItem icon={<Drumstick size={18} />} text="Meats & Seafood" />
                    <CategoryItem icon={<Egg size={18} />} text="Breakfast & Dairy" />
                    <CategoryItem icon={<Coffee size={18} />} text="Beverages" arrow />
                    <CategoryItem icon={<Croissant size={18} />} text="Breads & Bakery" />
                    <CategoryItem icon={<Snowflake size={18} />} text="Frozen Foods" />
                    <CategoryItem icon={<Candy size={18} />} text="Biscuits & Snacks" />
                    <CategoryItem icon={<Leaf size={18} />} text="Grocery & Staples" />
                </div>
                <div className="border-t border-gray-200 mt-2">
                    <div className="px-4 py-3 hover:bg-gray-800 cursor-pointer text-gray-700 transition-colors">
                        Value of the Day
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-800 cursor-pointer text-gray-700 transition-colors">
                        Top 100 Offers
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-800 cursor-pointer text-gray-700 transition-colors">
                        New Arrivals
                    </div>
                </div>
            </div>
        </div>
    );
}

function CategoryItem({
    icon,
    text,
    arrow
}: {
    icon: React.ReactNode;
    text: string;
    arrow?: boolean;
}) {
    return (
        <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-800 cursor-pointer transition-colors group">
            <div className="flex items-center gap-3 text-gray-700">
                <span className="transition-transform group-hover:scale-110">
                    {icon}
                </span>
                <span>{text}</span>
            </div>
            {arrow && (
                <ChevronRight
                    size={14}
                    className="text-gray-400 transition-transform group-hover:translate-x-1"
                />
            )}
        </div>
    );
}