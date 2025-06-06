"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

import { deleteFoodById } from "@/lib/actions"
import { useRef } from "react"
import { useRouter } from 'next/navigation'

export default function FoodCard({ index, food, deleteBtn }) {
    
    const ref = useRef(null)
    const router = useRouter();
    
    async function handleDelete(foodId) {
        const formData = new FormData();
        formData.append("foodId", foodId)
        
        await deleteFoodById(formData)
        ref.current.remove();
    }
    
    async function handleOpenCard() {
        router.push(`/food/${food.id}`)
    }
    
    return (
        <div key={index} ref={ref} role="button" onClick={handleOpenCard} className="bg-stone-100 aspect-[4/4.8] rounded-xl relative rounded-2xl">
            <Image
                src={food.imageUrl}
                width={40} height={50}
                alt="food image"
                className="bg-amber-500 w-[100%] h-[100%] absolute rounded-2xl"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-amber-100 rounded-b-2xl h-20 pb-2 flex items-center" >
                <div className="flex-1 overflow-hidden">
                    <div className="font-black text-xl pl-2" >{food.name}</div>
                    <div className="opacity-80 text-sm pl-2" >{food.description}</div>
                </div>
                <div className="text-xl font-bold mr-2 flex-2 text-center" >${food.price}</div>
                {deleteBtn ? <Button onClick={() => { handleDelete(food.id) }} className="mr-2" >Delete</Button> : null }
                
            </div>
            
        </div>
    )
}