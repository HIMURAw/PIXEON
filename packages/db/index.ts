// db/index.ts
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { eq } from 'drizzle-orm';
import * as schema from './schema/schema';
import dotenv from 'dotenv';

// Environment variables'ları yükle
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pxdevwebsitev3',
});

export const db = drizzle(pool, { schema, mode: 'default' });
export { schema, eq };
