import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { userTable } from '@/lib/schema';

const db = drizzle(process.env.DATABASE_URL);

export async function getUser(auth) {
    if (!auth?.user?.email) return null
    
    const user = await db.select().from(userTable).where(eq(userTable.email, auth.user.email));
    
    return !user[0] ? null : user[0];
}