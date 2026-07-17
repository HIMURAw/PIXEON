// Dumps the full database (schema + data) to a timestamped .sql file under
// backups/, then deletes older backups beyond BACKUP_RETENTION_COUNT.
// Pure Node.js/mysql2 — doesn't depend on the mysqldump binary being
// installed, since that isn't guaranteed on every host.
//
// Usage: npx tsx scripts/backup-db.ts
// Schedule it with a real cron / Windows Task Scheduler entry in production —
// this script only performs one backup per run, it doesn't self-schedule.
import "dotenv/config";
import mysql from "mysql2/promise";
import fs from "fs/promises";
import path from "path";

const BACKUP_DIR = path.join(process.cwd(), "backups");
const RETENTION_COUNT = Number(process.env.BACKUP_RETENTION_COUNT) || 7;

function sqlEscapeValue(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return `'${value.toISOString().slice(0, 19).replace("T", " ")}'`;
  if (Buffer.isBuffer(value)) return `X'${value.toString("hex")}'`;
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);

  try {
    const [dbNameRow] = await connection.query<mysql.RowDataPacket[]>("SELECT DATABASE() AS name");
    const dbName = dbNameRow[0]?.name;

    const [tables] = await connection.query<mysql.RowDataPacket[]>("SHOW TABLES");
    const tableNames = tables.map((row) => Object.values(row)[0] as string);

    const lines: string[] = [
      `-- PIXEON database backup`,
      `-- Database: ${dbName}`,
      `-- Generated: ${new Date().toISOString()}`,
      `SET FOREIGN_KEY_CHECKS=0;`,
      "",
    ];

    for (const table of tableNames) {
      const [[createRow]] = await connection.query<mysql.RowDataPacket[]>(`SHOW CREATE TABLE \`${table}\``);
      const createStatement = createRow["Create Table"];

      lines.push(`-- Table: ${table}`, `DROP TABLE IF EXISTS \`${table}\`;`, `${createStatement};`, "");

      const [rows] = await connection.query<mysql.RowDataPacket[]>(`SELECT * FROM \`${table}\``);
      if (rows.length > 0) {
        const columns = Object.keys(rows[0]);
        const columnList = columns.map((c) => `\`${c}\``).join(", ");
        for (const row of rows) {
          const values = columns.map((c) => sqlEscapeValue(row[c])).join(", ");
          lines.push(`INSERT INTO \`${table}\` (${columnList}) VALUES (${values});`);
        }
        lines.push("");
      }
    }

    lines.push("SET FOREIGN_KEY_CHECKS=1;");

    await fs.mkdir(BACKUP_DIR, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filePath = path.join(BACKUP_DIR, `backup-${timestamp}.sql`);
    await fs.writeFile(filePath, lines.join("\n"), "utf-8");

    const stats = await fs.stat(filePath);
    console.log(`Backup written: ${filePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB, ${tableNames.length} tables)`);

    // Retention: keep only the newest RETENTION_COUNT backups
    const existing = (await fs.readdir(BACKUP_DIR)).filter((f) => f.startsWith("backup-") && f.endsWith(".sql")).sort();
    const toDelete = existing.slice(0, Math.max(0, existing.length - RETENTION_COUNT));
    for (const file of toDelete) {
      await fs.unlink(path.join(BACKUP_DIR, file));
      console.log(`Deleted old backup: ${file}`);
    }
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error("Backup failed:", error);
  process.exit(1);
});
