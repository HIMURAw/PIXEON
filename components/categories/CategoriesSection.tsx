"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CategoriesButton from "../header/categoriesButton/categoriesButton";
import CategoriesMenu from "./CategoriesMenu";
import PromoSection from "../promo/promoSection";

export default function CategoriesSection() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(pathname === "/");
    }, [pathname]);

    return (
        <div className="relative">
            <CategoriesButton
                isOpen={open}
                onToggle={() => setOpen(v => !v)}
            />
            <CategoriesMenu isOpen={open} />
        </div>
    );
}