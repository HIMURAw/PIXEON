import { db } from "../lib/db";
import { products, categories } from "../lib/db/schema";
import { meiliClient, MEILI_PRODUCTS_INDEX } from "../lib/meilisearch";
import { eq } from "drizzle-orm";

async function sync() {
  console.log("Fetching products from MySQL database...");
  try {
    const data = await db.select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      sku: products.sku,
      description: products.description,
      price: products.price,
      oldPrice: products.oldPrice,
      image: products.image,
      status: products.status,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id));

    console.log(`Found ${data.length} products. Syncing to Meilisearch...`);

    const index = meiliClient.index(MEILI_PRODUCTS_INDEX);

    console.log("Configuring index settings...");
    await index.updateSettings({
      searchableAttributes: ["name", "sku", "description", "categoryName"],
      filterableAttributes: ["categoryName", "status"],
      sortableAttributes: ["price"],
    });

    const documents = data.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      sku: item.sku,
      description: item.description || "",
      price: item.price,
      oldPrice: item.oldPrice || null,
      image: item.image || "",
      status: item.status,
      categoryName: item.categoryName || "Genel",
    }));

    const response = await index.addDocuments(documents);
    console.log("Meilisearch sync triggered! Task details:", response);
    console.log("Waiting for index synchronization task to complete...");
    
    await meiliClient.waitForTask(response.taskUid);
    console.log("Meilisearch synchronization completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Synchronization error:", error);
    process.exit(1);
  }
}

sync();
