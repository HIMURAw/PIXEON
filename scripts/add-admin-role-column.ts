import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function main() {
    try {
        console.log("Adding admin_role column to users table...");
        await db.execute(sql`ALTER TABLE users ADD COLUMN admin_role VARCHAR(255) AFTER role`);
        console.log("Column added successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error adding column:", err);
        process.exit(1);
    }
}

main();
