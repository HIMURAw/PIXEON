// db/index.ts
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema/schema';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pxdevwebsitev3',
});

export const db = drizzle(pool);
