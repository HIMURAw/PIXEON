import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function main() {
    try {
        console.log("Creating site_settings table...");
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS site_settings (
                id VARCHAR(255) PRIMARY KEY,
                site_title VARCHAR(255) DEFAULT 'PIXEON',
                site_description TEXT,
                support_email VARCHAR(255),
                site_logo VARCHAR(255),
                iyzico_enabled BOOLEAN DEFAULT TRUE NOT NULL,
                bank_transfer_enabled BOOLEAN DEFAULT TRUE NOT NULL,
                crypto_enabled BOOLEAN DEFAULT FALSE NOT NULL,
                shipping_fee DOUBLE DEFAULT 0 NOT NULL,
                free_shipping_limit DOUBLE DEFAULT 0 NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        
        // Insert default settings if not exists
        await db.execute(sql`
            INSERT IGNORE INTO site_settings (id, site_title, support_email) 
            VALUES ('global', 'PIXEON', 'destek@pixeon.com')
        `);

        console.log("Table created and initialized successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error creating table:", err);
        process.exit(1);
    }
}

main();
