"use client";
import {
    ChevronRight,
    Gamepad2,
    Disc,
    Gamepad,
    Headset,
    CreditCard,
    Zap
} from "lucide-react";

interface CategoriesMenuProps {
    isOpen: boolean;
}

export default function CategoriesMenu({ isOpen }: CategoriesMenuProps) {
    return (
        <div
            className={`absolute top-[85px] w-79 border rounded-b-xl bg-slate-900 border-slate-700 shadow-xl z-50 overflow-hidden
            transition-all duration-300 ease-in-out origin-top ${isOpen
                    ? 'opacity-100 scale-y-100 translate-y-0'
                    : 'opacity-0 scale-y-0 -translate-y-4 pointer-events-none'
                }`}
        >
            {/* Categories */}
            <div className="py-2">
                <CategoryItem icon={<Gamepad2 size={18} />} text="PlayStation Konsollar" arrow />
                <CategoryItem icon={<Disc size={18} />} text="PS5 Oyunları" />
                <CategoryItem icon={<Disc size={18} />} text="PS4 Oyunları" />
                <CategoryItem icon={<Gamepad size={18} />} text="DualSense & Kontrolcüler" arrow />
                <CategoryItem icon={<Headset size={18} />} text="Kulaklık & Ses" />
                <CategoryItem icon={<CreditCard size={18} />} text="PS Plus & Hediye Kartları" />
                <CategoryItem icon={<Zap size={18} />} text="Aksesuarlar" />
            </div>

            {/* Extras */}
            <div className="border-t border-slate-700 mt-2">
                {["Günün Fırsatı", "En Çok Satanlar", "Yeni Gelenler"].map((item) => (
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
