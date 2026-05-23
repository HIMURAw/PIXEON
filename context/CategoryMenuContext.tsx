"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface CategoryMenuContextType {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
    toggle: () => void;
}

const CategoryMenuContext = createContext<CategoryMenuContextType | undefined>(undefined);

export function CategoryMenuProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Default state: open on homepage, closed on other pages
    useEffect(() => {
        if (pathname === "/") {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [pathname]);

    const toggle = () => setIsOpen((prev) => !prev);

    return (
        <CategoryMenuContext.Provider value={{ isOpen, setIsOpen, toggle }}>
            {children}
        </CategoryMenuContext.Provider>
    );
}

export function useCategoryMenu() {
    const context = useContext(CategoryMenuContext);
    if (!context) {
        throw new Error("useCategoryMenu must be used within a CategoryMenuProvider");
    }
    return context;
}
