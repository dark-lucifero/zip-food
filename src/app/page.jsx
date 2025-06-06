"use client"
import { Hero } from "@/components/Hero"
import FoodCard from "@/components/foodCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { signIn } from "@/lib/auth"
import { getFoods, getFilteredFood } from "@/lib/actions"

import { useState, useEffect } from "react"


export default function Home() {
    const [ foods, setFoods ] = useState([]);

    useEffect(() => {
        getFoods().then(fetchedFoods => {
            setFoods(fetchedFoods)
        })
        
    },[])
    
    async function handleSearch(e) {
        e.preventDefault();
        const searchTerm = e.target[0].value;
        
        if (searchTerm == "") {
            const foods = await getFoods();
            setFoods(foods)
            return
        }
        
        const formData = new FormData();
        formData.append("searchTerm", searchTerm)
        
        const filteredFood = await getFilteredFood(formData);
        setFoods(filteredFood)
    }
    
    
    return (
        <div>
            <Hero />
            
            <form onSubmit={handleSearch} className="p-4 flex items-center justify-center gap-2">
                <Input type="text" placeholder="search..." />
                <Button>Search</Button>
            </form>
            
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 py-6 gap-2" >
            {
                foods.map((food, index) => (
                    <FoodCard key={index} index={index} food={food} deleteBtn={false}/>
                ))
                
            }
            </div>
        </div>
    )
}