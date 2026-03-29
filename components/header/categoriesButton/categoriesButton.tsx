"use client";
import { Menu, ChevronDown } from "lucide-react";

interface CategoriesButtonProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function CategoriesButton({ isOpen, onToggle }: CategoriesButtonProps) {
    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className="w-60 flex items-center justify-between gap-3
                           bg-sky-400 text-white px-6 py-3 rounded-full font-bold
                           hover:bg-sky-500 transition-colors duration-200 cursor-pointer"
            >
                <Menu size={18} />
                ALL CATEGORIES
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Badge */}
            <span className="absolute left-1/2 -translate-x-1/2 -bottom-3
                             bg-slate-800 text-sky-400 text-[10px] font-extrabold
                             px-3 py-1 rounded-full whitespace-nowrap shadow-md">
                TOTAL 63 PRODUCTS
            </span>
        </div>
    );
}
