// db/schema.ts
import { mysqlTable, varchar, int, text } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
    id: int('id').primaryKey().autoincrement(),
    discordId: varchar('discord_id', { length: 255 }).notNull().unique(),
    username: varchar('username', { length: 255 }),
    email: varchar('email', { length: 255 }),
    avatar: varchar('avatar', { length: 255 }),
    roles: text('roles'),
});
