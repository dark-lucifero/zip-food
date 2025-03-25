import RestaurantForm from "@/components/RestaurantForm";
import RestaurantMenu from "@/components/RestaurantMenu"

import { auth } from "@/lib/auth"
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { restaurantTable } from '@/lib/schema';
import { getUser } from "@/lib/user";

const db = drizzle(process.env.DATABASE_URL);

export default async function RestaurantPage() {
    const session = await auth();
    if(!session.user) return <div>please logIn</div>
    
    const user = await getUser(session);
    const restaurant = await db.select().from(restaurantTable).where(eq(restaurantTable.ownerId, user.id));
    
    
    return (
        <div>
            { restaurant[0] ? <RestaurantMenu restData={restaurant[0]} /> : <RestaurantForm user={session?.user} /> }
        </div>
    )
}