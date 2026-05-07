import { db } from "./lib/db";
import { sql } from "drizzle-orm";

async function update() {
    try {
        console.log("Adding sender_image column...");
        await db.execute(sql`ALTER TABLE live_chat_messages ADD COLUMN sender_image VARCHAR(255) AFTER sender_name`);
        console.log("Column added successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error updating table:", err);
        process.exit(1);
    }
}

update();
