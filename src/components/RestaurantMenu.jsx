import { Button } from "@/components/ui/button"
import { AddToMenu } from "@/components/addToMenu"

import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { restaurantTable, FoodTable } from '@/lib/schema';

import FoodCard from "@/components/foodCard"

const db = drizzle(process.env.DATABASE_URL);

export default async function RestaurantMenu({ restData }) {
    
    const foods = await db.select().from(FoodTable).where(eq(FoodTable.restaurantId, restData.id));
    return (
        <div className="mt-5" >
            
            <div className="w-full flex justify-between items-center gap-2 px-4 md:px-8 py-2" >
                <span className="text-2xl font-semibold" >{restData?.name}</span>
                <AddToMenu restData={restData} />
            </div>
            
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 gap-2" >
            {
                foods.map((food, index) => (
                    <FoodCard key={index} index={index} food={food} deleteBtn={true}/>
                ))
                
            }
            </div>
            
        </div>
    )
}