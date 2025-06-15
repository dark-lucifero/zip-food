import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { restaurantTable, FoodTable } from '@/lib/schema';

import { uploadFile } from "@/lib/actions";

const db = drizzle(process.env.DATABASE_URL);

export function AddToMenu({ restData }) {
    
    async function handleAddItem(formData) {
        "use server"
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        console.log(data)
        
        const newFormData = new FormData();
        newFormData.append("file", data.file)
        
        const fileUrl = await uploadFile(newFormData)
        
        
        await db.insert(FoodTable).values({
            restaurantId: restData.id,
            name: data.name,
            description: data.description,
            price: data.price,
            available: true,
            imageUrl: fileUrl
        });
        
        console.log('New item created!');
    }
    
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Food To Menu</Button>
            </DialogTrigger>
      
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    
                    <DialogTitle>Add Food To Your Menu</DialogTitle>
                    
                    <DialogDescription>
                        you can add as many food as you want it in here.
                    </DialogDescription>
                </DialogHeader>
                
                <form className="flex gap-3 flex-col" action={handleAddItem} >
                    <div className="flex gap-2 flex-col" >
                        <Label htmlFor="name" >Food Name</Label>
                        <Input type="text" placeholder="(e.g) pizza" id="name" name="name" />
                    </div>
                    
                    <div className="flex gap-2 flex-col" >
                        <Label htmlFor="description" >Food Description</Label>
                        <Input type="text" placeholder="(e.g) a delicious pizza with chicken" id="description" name="description" />
                   </div>
                   
                   <div className="flex gap-2 flex-col" >
                        <Label htmlFor="price" >Food Price</Label>
                        <Input type="number" placeholder="(e.g) 6.99" id="price" name="price" step="0.01" />
                    </div>
                    
                    <div className="flex gap-2 flex-col" >
                        <Label htmlFor="image" >Food image</Label>
                        <Input type="file"  id="file" name="file" />
                    </div>
                    
                    <Button type="submit">Add</Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Close</Button>
                    </DialogClose>
                </form>
                
                <DialogFooter>
                    <div className="hidden" >footer</div>
                </DialogFooter>
                
            </DialogContent>
        </Dialog>
    )
}
