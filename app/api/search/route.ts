import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, and, like, or } from "drizzle-orm";
import { meiliClient, MEILI_PRODUCTS_INDEX } from "@/lib/meilisearch";

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q");

    if (!q || q.trim().length < 2) {
        return NextResponse.json({ results: [] });
    }

    // 1. Try Meilisearch search
    try {
        const searchRes = await meiliClient.index(MEILI_PRODUCTS_INDEX).search(q.trim(), {
            limit: 8,
            filter: "status = ACTIVE",
        });

        interface MeiliProductHit {
            id: string;
            name: string;
            slug: string;
            price: number | string;
            oldPrice?: number | string | null;
            image?: string | null;
            categoryName?: string;
        }

        const results = searchRes.hits.map((hit: unknown) => {
            const h = hit as MeiliProductHit;
            return {
                id: h.id,
                name: h.name,
                slug: h.slug,
                price: String(h.price),
                oldPrice: h.oldPrice ? String(h.oldPrice) : null,
                image: h.image || null,
                category: { name: h.categoryName || "Genel" }
            };
        });

        return NextResponse.json({ results, provider: "meilisearch" });
    } catch (e) {
        console.warn("Meilisearch search failed, falling back to database query:", e);
    }

    // 2. Database Fallback (SQL Like match)
    try {
        const data = await db.select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            price: products.price,
            oldPrice: products.oldPrice,
            image: products.image,
            category: { name: categories.name }
        })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .where(
                and(
                    eq(products.status, "ACTIVE"),
                    or(
                        like(products.name, `%${q}%`),
                        like(products.sku, `%${q}%`)
                    )
                )
            )
            .limit(8);

        // Map price to string to match standard JSON format representation
        const results = data.map((item) => ({
            ...item,
            price: String(item.price),
            oldPrice: item.oldPrice ? String(item.oldPrice) : null,
        }));

        return NextResponse.json({ results, provider: "database" });
    } catch (error) {
        console.error("Search API DB fallback error:", error);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
