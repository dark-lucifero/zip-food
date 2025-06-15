"use server";

import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, or, like, inArray } from 'drizzle-orm';
import { FoodTable, restaurantTable, userTable, orderTable } from '@/lib/schema';
import { getUser } from "@/lib/user";

import { auth } from "@/lib/auth"

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


const db = drizzle(process.env.DATABASE_URL);

export async function createUser(formData) {
    const body = {};
    for (const [key, value] of formData.entries()) {
        body[key] = value;
    }
    
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
    
    const [ foodOwner ] = await db.select({
        restaurantId: FoodTable.restaurantId,
        ownerId: restaurantTable.ownerId,
        imageUrl: FoodTable.imageUrl, 
    })
    .from(FoodTable)
    .innerJoin(restaurantTable, eq(FoodTable.restaurantId, restaurantTable.id))
    .where(eq(FoodTable.id, foodId));
    
    if (foodOwner.ownerId == user.id) {
        await db.delete(FoodTable).where(eq(FoodTable.id, foodId));
        
        const bucket = "zipfood"
        const path = foodOwner.imageUrl.split(`/object/public/${bucket}/`)[1];
        console.log(path)
        const { error } = await supabase.storage.from(bucket).remove([path]);
        if(error) console.log(error.message)
    }
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

export async function getFoodById(formData) {
    const session = await auth();
    if(!session) return "not authorized";
    
    const foodId = await formData.get("foodId")
    
    const food = await db
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
    .where(eq(FoodTable.id, foodId));
    return food[0];
}


export async function uploadFile(formData) {
    const session = await auth();
    if(!session) return "not authorized";
    
    
    const file = await formData.get("file");
    if (!file) return "fil not found";
    
    const filePath = `public/${Date.now()}-${file.name}`;

    try {
        const { data, error } = await supabase.storage
        .from('zipfood')
        .upload(filePath, file, {
            cacheControl: '3600', 
            upsert: false // Optional: set to true to overwrite if file exists
        });

        if (error) {
            return `error at supabase: ${error.message}`;
        }
        
        // Get the public URL
        const { data: publicUrlData } = supabase.storage
        .from('zipfood')
        .getPublicUrl(filePath);
        
        const fileUrl = publicUrlData.publicUrl;
        console.log(fileUrl)
        return fileUrl;
        
    } catch (error) {
        console.error('Error uploading file:', error.message);
    }
}

export async function getFoodWithinArray(formData) {
    const session = await auth();
    if(!session) return "not authorized";
    
    
    let myCart = await formData.get("myCart");
    myCart = JSON.parse(myCart);
    
    const ids = myCart.map((item) => item.id);
    
    
    let result = await db
    .select({
        id: FoodTable.id,
        name: FoodTable.name,
        price: FoodTable.price,
        available: FoodTable.available
    })
    .from(FoodTable)
    .where(inArray(FoodTable.id, ids));
    
    result = result.map((item, i) => {
        return {...item, quantity: myCart[i]. quantity}
    });
    
    console.log(result)
    return result;
}


export async function orderFoods(formData) {
    const session = await auth();
    if(!session) return "not authorized";
    
    const data = await formData.get("cart");
    const cart = JSON.parse(data);
    
    const user = await getUser({ user: { email: session?.user?.email }});
    
    cart.forEach( async (item) => {
        const orderData = {
            userId: user.id,
            foodId: item.id,
            quantity: item.quantity,
        }
        
        await db.insert(orderTable).values(orderData);
        
    });
    
    console.log("items were orderd successfully");
    return true
}

export async function getOrders() {
    const session = await auth();
    if(!session) return "not authorized";
    
    const user = await getUser({ user: { email: session?.user?.email }});
    
    
    const orders = await db
    .select({
        id: orderTable.id,
        foodId: FoodTable.id,
        userId: userTable.id,
        name: FoodTable.name,
        quantity: orderTable.quantity,
        price: FoodTable.price,
        status: orderTable.status,
        createdAt: orderTable.createdAt,
    })
    .from(orderTable)
    .innerJoin(userTable, eq(orderTable.userId, userTable.id))
    .innerJoin(FoodTable, eq(orderTable.foodId, FoodTable.id));
    
    
    return orders
    
}