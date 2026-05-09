import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, and, like, or } from "drizzle-orm";

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q");

    if (!q || q.trim().length < 2) {
        return NextResponse.json({ results: [] });
    }

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

        return NextResponse.json({ results: JSON.parse(JSON.stringify(data)) });
    } catch (error) {
        console.error("Search API error:", error);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
