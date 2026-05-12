import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function main() {
    try {
        console.log("Creating admin_logs table...");
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS admin_logs (
                id VARCHAR(255) PRIMARY KEY,
                admin_id VARCHAR(255) NOT NULL,
                admin_name VARCHAR(255) NOT NULL,
                action VARCHAR(255) NOT NULL,
                details TEXT,
                ip_address VARCHAR(45),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log("Table created successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error creating table:", err);
        process.exit(1);
    }
}

main();
