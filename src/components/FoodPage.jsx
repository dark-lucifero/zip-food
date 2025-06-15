"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartProvider";

export default function FoodPage({ food }) {
    const { cart, setCart, addToCart } = useCart();

    return (
        <div className="flex flex-col items-center">
            <Image
                src={food.imageUrl}
                width={40}
                height={48}
                alt="food image"
                className="aspect-[4/4.8] w-[90%] rounded-2xl bg-amber-500 object-cover"
            />
            
        <div className="flex w-full px-4 justify-between items-center">
            <div className="w-[90%] font-bold text-2xl py-4 px-2">{food.name}</div>
            <div className="font-semibold text-md">${food.price}</div>
        </div>
        
            <div className="w-[90%] font-bold text-sm py-2 opacity-80">{food.description}</div>
            <Button onClick={() => addToCart(food)}>Add To Cart</Button>
        </div>
    );
}