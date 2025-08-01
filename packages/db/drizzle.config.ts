// drizzle.config.ts
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
    schema: './schema/schema.ts',
    out: './drizzle',
    driver: 'mysql2',
    dbCredentials: {
        connectionString: 'mysql://root@localhost:3306/pxdevwebsitev3',
    },
} satisfies Config;
