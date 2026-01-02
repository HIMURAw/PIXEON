"use client";
import { useState } from "react";
import CategoriesButton from "../header/categoriesButton/categoriesButton";
import CategoriesMenu from "./CategoriesMenu";
import PromoSection from "../hero/promoSection";

export default function CategoriesSection() {
    const [open, setOpen] = useState(true);

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