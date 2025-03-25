import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { restaurantTable, userTable } from '@/lib/schema';
import { auth } from "@/lib/auth"
import { getUser } from "@/lib/user"

export const POST = auth(async function POST(req) {
    if (!req.auth) {
        return Response.json({
            message: "not authenticated"
        }, { status: 401 });  
    }
    
    const body = await req.json();
    
    const db = drizzle(process.env.DATABASE_URL);
       
    const restaurant = await db.select().from(restaurantTable).where(eq(restaurantTable.email, body.email));
    const user = await getUser(req.auth);
    
    
    if(restaurant[0]) {
        return Response.json({
            message: "successful"
        });
    }
    
    if(!user) {
        return Response.json({
            message: "user not found"
        }, { status: 404 });
    }
    
    
    const restaurantData = {
        email: body.email,
        name: body.name,
        address: body.address,
        ownerId: user?.id
    }
    
    await db.insert(restaurantTable).values(restaurantData);
    console.log('New user created!')
    
    return Response.json({
        message: "successful"
    });
    
})
