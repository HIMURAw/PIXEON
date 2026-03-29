"use client";
import {
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

interface CategoriesMenuProps {
    isOpen: boolean;
}

export default function CategoriesMenu({ isOpen }: CategoriesMenuProps) {
    return (
        <div
            className={`absolute top-14 w-79 border rounded-b-xl bg-slate-900 border-slate-700 shadow-xl z-50 overflow-hidden
            transition-all duration-300 ease-in-out origin-top ${isOpen
                    ? 'opacity-100 scale-y-100 translate-y-0'
                    : 'opacity-0 scale-y-0 -translate-y-4 pointer-events-none'
                }`}
        >
            {/* Categories */}
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

            {/* Extras */}
            <div className="border-t border-slate-700 mt-2">
                {["Value of the Day", "Top 100 Offers", "New Arrivals"].map((item) => (
                    <div
                        key={item}
                        className="px-4 py-6 text-slate-200 hover:bg-slate-800 hover:text-sky-400 cursor-pointer transition-colors"
                    >
                        {item}
                    </div>
                ))}
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
        <div className="flex items-center justify-between px-4 py-4.5
                        hover:bg-slate-800 hover:text-sky-400 cursor-pointer transition-colors group">
            <div className="flex items-center gap-3 text-slate-200 group-hover:text-sky-400">
                <span className="transition-transform group-hover:scale-110 text-sky-400">
                    {icon}
                </span>
                <span>{text}</span>
            </div>
            {arrow && (
                <ChevronRight
                    size={14}
                    className="text-slate-400 group-hover:text-sky-400 transition-transform group-hover:translate-x-1"
                />
            )}
        </div>
    );
}
