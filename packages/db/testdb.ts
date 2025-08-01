// test-db.ts
import { db } from './';
import { users } from './schema/schema';

async function main() {
    try {
        // INSERT
        await db.insert(users).values({ name: 'Umut', email: 'umut@example.com' });
        console.log('Kullanıcı eklendi.');

        // SELECT
        const allUsers = await db.select().from(users);
        console.log('Tüm kullanıcılar:', allUsers);

    } catch (error) {
        console.error('Hata oluştu:', error);
    } finally {
        process.exit(0); // işlem bittiğinde çık
    }
}

main();
