import { Button } from "@/components/ui/button"
import { AddToMenu } from "@/components/addToMenu"

export default function RestaurantMenu({ restData }) {
    
    return (
        <div className="mt-5" >
            
            <div className="w-full flex justify-between items-center gap-2 px-4 md:px-8 py-2" >
                <span className="text-2xl font-semibold" >{restData?.name}</span>
                <AddToMenu restData={restData} />
            </div>
            
            <div></div>
            
        </div>
    )
}