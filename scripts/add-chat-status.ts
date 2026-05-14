import mysql from "mysql2/promise";
import "dotenv/config";

async function run() {
    console.log("Detailed table inspection for live_chat_messages...");
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    
    try {
        const [columns]: any = await connection.execute("DESCRIBE live_chat_messages");
        console.log("Current columns:", columns.map((c: any) => c.Field).join(", "));
        
        const hasStatus = columns.some((col: any) => col.Field === 'status');
        
        if (!hasStatus) {
            console.log("Status column MISSING. Attempting to add...");
            await connection.execute(`ALTER TABLE live_chat_messages ADD status ENUM('ACTIVE', 'ARCHIVED') DEFAULT 'ACTIVE' NOT NULL`);
            console.log("Successfully added status column.");
        } else {
            console.log("Status column verified: it exists.");
        }
    } catch (error) {
        console.error("Critical Error during inspection:", error);
    } finally {
        await connection.end();
    }
}

run();
