import { db } from "./lib/db";
import { products } from "./lib/db/schema";
import { randomUUID } from "crypto";

const KONSOL_ID = "12492fc3-da7f-49cf-94ba-58d96acfae3f";
const AKSESUAR_ID = "37808224-0d28-4608-b8a3-d015f3822556";
const OYUN_ID = "46ea5f63-0f4a-4366-bbc9-cd37a6fcd174";

const testProducts = [
    // OYUNLAR (Yeni ve Popüler)
    { name: "Final Fantasy VII Rebirth", price: 1999, salesCount: 150, categoryId: OYUN_ID, sku: "PS5-FF7R", createdAt: new Date() },
    { name: "Rise of the Ronin", price: 1799, salesCount: 85, categoryId: OYUN_ID, sku: "PS5-ROR", createdAt: new Date() },
    { name: "Stellar Blade", price: 1899, salesCount: 210, categoryId: OYUN_ID, sku: "PS5-STB", createdAt: new Date() },
    { name: "Helldivers 2", price: 1199, salesCount: 450, categoryId: OYUN_ID, sku: "PS5-HD2", createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    { name: "Dragon's Dogma 2", price: 1999, salesCount: 120, categoryId: OYUN_ID, sku: "PS5-DD2", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    
    // KONSOL (Eski ama Çok Satan)
    { name: "PlayStation 5 Slim Digital", price: 16999, salesCount: 1200, categoryId: KONSOL_ID, sku: "PS5-SLIM-DIG", createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    { name: "PlayStation 5 Pro (Test)", price: 24999, salesCount: 10, categoryId: KONSOL_ID, sku: "PS5-PRO-TEST", createdAt: new Date() },
    
    // AKSESUAR
    { name: "DualSense Edge", price: 6999, salesCount: 320, categoryId: AKSESUAR_ID, sku: "PS5-ACC-EDGE", createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000) },
    { name: "PS VR2", price: 21999, salesCount: 45, categoryId: AKSESUAR_ID, sku: "PS5-VR2", createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
    { name: "Pulse Explore Earbuds", price: 6499, salesCount: 75, categoryId: AKSESUAR_ID, sku: "PS5-PULSE-EXP", createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) }
];

// Generate more products to reach 30
for (let i = 1; i <= 20; i++) {
    testProducts.push({
        name: `Test Ürünü ${i}`,
        price: Math.floor(Math.random() * 2000) + 100,
        salesCount: Math.floor(Math.random() * 100),
        categoryId: i % 3 === 0 ? KONSOL_ID : (i % 3 === 1 ? OYUN_ID : AKSESUAR_ID),
        sku: `SKU-TEST-${i}-${Math.random().toString(36).substring(7)}`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 45) * 24 * 60 * 60 * 1000) // Randomly new or old
    });
}

async function seed() {
    console.log("Seeding products...");
    for (const p of testProducts) {
        const id = randomUUID();
        const slug = p.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") + "-" + Math.random().toString(36).substring(7);
        
        await db.insert(products).values({
            id,
            name: p.name,
            slug,
            sku: p.sku,
            price: p.price,
            stock: 50,
            salesCount: p.salesCount,
            categoryId: p.categoryId,
            status: "ACTIVE",
            createdAt: p.createdAt,
            updatedAt: p.createdAt
        });
    }
    console.log("Seed completed!");
    process.exit(0);
}

seed();
