import { db } from "./lib/db";
import { products, categories } from "./lib/db/schema";

async function check() {
  const p = await db.select().from(products);
  const c = await db.select().from(categories);
  console.log("Products Count:", p.length);
  console.log("Categories Count:", c.length);
  console.log("First Product:", p[0]);
  process.exit(0);
}
check();
