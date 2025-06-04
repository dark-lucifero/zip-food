"use server";

import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, or, like } from 'drizzle-orm';
import { FoodTable, restaurantTable, userTable } from '@/lib/schema';
import { getUser } from "@/lib/user";

import { auth } from "@/lib/auth"

const db = drizzle(process.env.DATABASE_URL);

export async function createUser(formData) {
    const body = {};
    for (const [key, value] of formData.entries()) {
        body[key] = value;
    }
    
    const db = drizzle(process.env.DATABASE_URL);
    const user = await getUser({ user: { email: body.email }});
    
    if(user) {
        return "successful"
    }
    
    const userData = {
        email: body.email,
        name: body.name,
        address: body.address,
        role: body.role || "customer"
    }
    
    await db.insert(userTable).values(userData);
    console.log('New user created!')
    
    return "successful"
    
}

export async function deleteFoodById(formData) {
    const session = await auth();
    if(!session) return "not authorized";
    
    const user = await getUser({ user: { email: session?.user?.email }});
    
    const foodId = await formData.get("foodId");
    
    const [foodOwner] = await db.select({
        restaurantId: FoodTable.restaurantId,
        ownerId: restaurantTable.ownerId
    })
    .from(FoodTable)
    .innerJoin(restaurantTable, eq(FoodTable.restaurantId, restaurantTable.id));
    
    if (foodOwner.ownerId, user.id) await db.delete(FoodTable).where(eq(FoodTable.id, foodId));
}

export async function getFoods() {
    const session = await auth();
    if(!session) return "not authorized";
    
    
    const foods = await db
    .select({
        id: FoodTable.id,
        name: FoodTable.name,
        description: FoodTable.description,
        price: FoodTable.price,
        available: FoodTable.available,
        imageUrl: FoodTable.imageUrl,
        restaurantNane: restaurantTable.name,
        restaurantAddress: restaurantTable.address
    })
    .from(FoodTable)
    .innerJoin(restaurantTable, eq(FoodTable.restaurantId, restaurantTable.id))
    .limit(20);
    
    return foods
}

export async function getFilteredFood(formData) {
    const session = await auth();
    if(!session) return "not authorized";
    
    const searchTerm = await formData.get("searchTerm");
    
    const foods = await db
    .select({
        id: FoodTable.id,
        name: FoodTable.name,
        description: FoodTable.description,
        price: FoodTable.price,
        available: FoodTable.available,
        imageUrl: FoodTable.imageUrl,
        restaurantNane: restaurantTable.name,
        restaurantAddress: restaurantTable.address
    })
    .from(FoodTable)
    .innerJoin(restaurantTable, eq(FoodTable.restaurantId, restaurantTable.id))
    .limit(20)
    .where(
      or(
        like(FoodTable.name, searchTerm),
        like(FoodTable.description, searchTerm)
      )
    );
    
    console.log(foods)
    
    return foods
}