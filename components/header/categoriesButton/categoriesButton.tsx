"use client";
import React from "react";
import { Menu, ChevronDown } from "lucide-react";
import { getDatabaseProductCount } from "@/lib/actions/product-actions";

interface CategoriesButtonProps {
    isOpen: boolean;
    onToggle: () => void;
}


export default function CategoriesButton({ isOpen, onToggle }: CategoriesButtonProps) {
    const [dbProductCount, setDbProductCount] = React.useState<number>(0);

    React.useEffect(() => {
        async function fetchCount() {
            try {
                const count = await getDatabaseProductCount();
                setDbProductCount(count);
            } catch (error) {
                console.error("Error loading product count:", error);
            }
        }
        fetchCount();
    }, []);
    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className="w-60 flex items-center justify-between gap-3
                           bg-sky-400 text-white px-6 py-3 rounded-full font-bold
                           hover:bg-sky-500 transition-colors duration-200 cursor-pointer"
            >
                <Menu size={18} />
                TÜM KATEGORİLER
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
 
            {/* Badge */}
            <span className="absolute left-1/2 -translate-x-1/2 -bottom-3
                             bg-slate-800 text-sky-400 text-[10px] font-extrabold
                             px-3 py-1 rounded-full whitespace-nowrap shadow-md">
                TOPLAM {dbProductCount} ÜRÜN
            </span>
        </div>
    );
}
