import { db } from "./lib/db";
import { categories } from "./lib/db/schema";

async function listCategories() {
    const cats = await db.select().from(categories);
    console.log("Categories:", JSON.stringify(cats, null, 2));
    process.exit(0);
}

listCategories();
