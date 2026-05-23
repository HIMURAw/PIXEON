"use client";

import { useEffect } from "react";

type ProductViewTrackerProps = {
    categorySlug?: string | null;
};

export default function ProductViewTracker({ categorySlug }: ProductViewTrackerProps) {
    useEffect(() => {
        if (!categorySlug) return;
        try {
            const visited = localStorage.getItem("visited_categories");
            let categoriesList: string[] = visited ? JSON.parse(visited) : [];
            
            // Remove the slug if it already exists, then unshift to make it the most recent
            categoriesList = categoriesList.filter((slug) => slug !== categorySlug);
            categoriesList.unshift(categorySlug);
            
            // Keep only the 5 most recently visited categories
            if (categoriesList.length > 5) {
                categoriesList = categoriesList.slice(0, 5);
            }
            
            localStorage.setItem("visited_categories", JSON.stringify(categoriesList));
        } catch (e) {
            console.error("Failed to track visited category:", e);
        }
    }, [categorySlug]);

    return null;
}
