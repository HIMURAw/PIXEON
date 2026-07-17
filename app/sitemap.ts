import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { products, blogPosts, cmsPages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const STATIC_ROUTES = [
  "", "konsollar", "oyunlar", "oyunlar/ps4", "oyunlar/ps5", "aksesuarlar",
  "dijital-kodlar", "yeni-urunler", "blog", "hakkimizda", "iletisim", "search",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [activeProducts, publishedPosts, publishedPages] = await Promise.all([
    db.select({ slug: products.slug, updatedAt: products.updatedAt }).from(products).where(eq(products.status, "ACTIVE")),
    db.select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt }).from(blogPosts).where(eq(blogPosts.status, "PUBLISHED")),
    db.select({ slug: cmsPages.slug, updatedAt: cmsPages.updatedAt }).from(cmsPages).where(eq(cmsPages.status, "PUBLISHED")),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteUrl}/${path}`,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = activeProducts.map((p) => ({
    url: `${siteUrl}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const blogEntries: MetadataRoute.Sitemap = publishedPosts.map((b) => ({
    url: `${siteUrl}/blog/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const pageEntries: MetadataRoute.Sitemap = publishedPages.map((p) => ({
    url: `${siteUrl}/p/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...staticEntries, ...productEntries, ...blogEntries, ...pageEntries];
}
