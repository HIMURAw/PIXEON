"use client";
import { usePathname } from "next/navigation";
import CategoriesButton from "../header/categoriesButton/categoriesButton";
import CategoriesMenu from "./CategoriesMenu";
import { useCategoryMenu } from "@/context/CategoryMenuContext";

export default function CategoriesSection() {
    const pathname = usePathname();
    const { isOpen, toggle } = useCategoryMenu();

    return (
        <div className="relative">
            <CategoriesButton
                isOpen={isOpen}
                onToggle={toggle}
            />
            {/* Sadece sol tarafta statik menü barınmadığı sayfalarda açılır menüyü (dropdown) göster */}
            {pathname !== "/" && pathname !== "/yeni-urunler" && (
                <CategoriesMenu isOpen={isOpen} />
            )}
        </div>
    );
}