import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
    id: varchar('id', { length: 255 }).primaryKey(),
    username: varchar('username', { length: 255 }),
    discordId: varchar('discord_id', { length: 255 }),
});
