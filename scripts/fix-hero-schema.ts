import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

async function fix() {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    console.log("Connected to database.");

    try {
        console.log("Adding columns to hero_slides...");
        await connection.query("ALTER TABLE hero_slides ADD COLUMN model_path VARCHAR(255)");
        await connection.query("ALTER TABLE hero_slides ADD COLUMN badge VARCHAR(100)");
        await connection.query("ALTER TABLE hero_slides ADD COLUMN badge_color VARCHAR(100)");
        await connection.query("ALTER TABLE hero_slides MODIFY COLUMN image VARCHAR(255) NULL");
        console.log("Columns added successfully.");
    } catch (error: any) {
        if (error.code === 'ER_DUP_COLUMN_NAME') {
            console.log("Columns already exist.");
        } else {
            console.error("Error fixing table:", error);
        }
    }

    await connection.end();
    process.exit();
}

fix();
