import { getFoodById } from "@/lib/actions";
import FoodPage  from "@/components/FoodPage"

export default async function Food({ params }) {
    
    const { id: foodId } = await params;
    
    const formData = new FormData();
    formData.append("foodId", foodId)
    
    const food = await getFoodById(formData);
    
    return (
        <>
            <FoodPage food={food} />
        </>
    )
}