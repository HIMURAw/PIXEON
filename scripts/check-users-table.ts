import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function main() {
    try {
        const result = await db.execute(sql`DESCRIBE users`);
        console.log(result);
        process.exit(0);
    } catch (err) {
        console.error("Error describing users table:", err);
        process.exit(1);
    }
}

main();
