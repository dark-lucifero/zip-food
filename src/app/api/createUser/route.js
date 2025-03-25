import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { userTable } from '@/lib/schema';
import { getUser } from "@/lib/user"

export async function POST(req) {
    const body = await req.json();
    
    const db = drizzle(process.env.DATABASE_URL);
    const user = await getUser({ user: { email: body.email }});
    
    if(user) {
        return Response.json({
            message: "successful"
        });
    }
    
    const userData = {
        email: body.email,
        name: body.name,
        address: body.address,
        role: body.role || "customer"
    }
    
    await db.insert(userTable).values(userData);
    console.log('New user created!')
    
    return Response.json({
        message: "successful"
    });
}