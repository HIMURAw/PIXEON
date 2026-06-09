"use client";

import { useEffect } from "react";

type ProductViewTrackerProps = {
    categorySlug?: string | null;
    productId?: string | null;
};

export default function ProductViewTracker({ categorySlug, productId }: ProductViewTrackerProps) {
    useEffect(() => {
        // Track Category
        if (categorySlug) {
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
        }

        // Track Product
        if (productId) {
            try {
                const visitedProds = localStorage.getItem("visited_products");
                let productsList: string[] = visitedProds ? JSON.parse(visitedProds) : [];
                
                // Remove the id if it already exists, then unshift to make it the most recent
                productsList = productsList.filter((id) => id !== productId);
                productsList.unshift(productId);
                
                // Keep only the 5 most recently visited products
                if (productsList.length > 5) {
                    productsList = productsList.slice(0, 5);
                }
                
                localStorage.setItem("visited_products", JSON.stringify(productsList));
            } catch (e) {
                console.error("Failed to track visited product:", e);
            }
        }
    }, [categorySlug, productId]);

    return null;
}
