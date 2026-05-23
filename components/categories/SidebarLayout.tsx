"use client";

import React from "react";
import { useCategoryMenu } from "@/context/CategoryMenuContext";
import StaticCategoriesMenu from "./StaticCategoriesMenu";

interface SidebarLayoutProps {
    children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
    const { isOpen } = useCategoryMenu();

    return (
        <div className="flex gap-6 lg:gap-16">
            {isOpen && (
                <aside className="hidden lg:block w-72 shrink-0 animate-in fade-in duration-300">
                    <StaticCategoriesMenu />
                </aside>
            )}
            <main className="flex-1 min-w-0">
                {children}
            </main>
        </div>
    );
}
