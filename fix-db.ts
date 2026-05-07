import { db } from "./lib/db";
import { sql } from "drizzle-orm";

async function fix() {
    try {
        console.log("Checking tables...");
        const [tables] = await db.execute(sql`SHOW TABLES`);
        console.log("Current tables:", tables);

        console.log("Creating live_chat_messages table...");
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS live_chat_messages (
                id VARCHAR(255) PRIMARY KEY,
                session_id VARCHAR(255) NOT NULL,
                sender_name VARCHAR(255),
                sender_role ENUM('USER', 'ADMIN') DEFAULT 'USER' NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
            )
        `);
        console.log("Table created successfully (or already exists).");
        process.exit(0);
    } catch (err) {
        console.error("Error fixing DB:", err);
        process.exit(1);
    }
}

fix();
