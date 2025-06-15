"use client"
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useState, useEffect } from "react"

import { useCart } from "@/components/CartProvider";
import { orderFoods } from "@/lib/actions"



export default function CartDialog() {
    const { cart, removeFromCart } = useCart();
    
    const [total, setTotal] = useState(0);
    
    
    useEffect(() => {
        const sum = cart?.reduce((total, item) => total + (item.price * item.quantity), 0);
        setTotal(sum);
    }, [cart]);
    
    function deleteItemFromCart(id) {
        removeFromCart(id);
        const sum = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        setTotal(sum);
    }
    
    async function purchaseCartItems() {
        const formData = new FormData();
        formData.append("cart", JSON.stringify(cart));
        
        await orderFoods(formData)
    }
    
    function priceToFix(price) {
        if(!price) return 0;
        return  Number(price).toFixed(2)
    }
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <ShoppingCart />
                    Cart
                </Button>
            </DialogTrigger>
                
            <DialogContent className="sm:max-w-[425px]">
                
                <DialogHeader>
                    <DialogTitle>Cart</DialogTitle>
                    
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                
                <Table>
                    <TableCaption>a list of items inside the cart</TableCaption>
                    
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Name</TableHead>
                            <TableHead>Available</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                        {
                            cart.map(item => (
                                <TableRow key={item.id} >
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.available ? "true": "false"}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell className="text-right">${ priceToFix(item.price) }</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" onClick={() => deleteItemFromCart(item.id)} >delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                    
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell className="text-right">${priceToFix(total)}</TableCell>
                        </TableRow>
                    </TableFooter>
                    
                </Table>
                
                <DialogFooter className="flex flex-row gap-5 ml-[auto]" >
                    
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={purchaseCartItems}>Buy</Button>
                    
                </DialogFooter>
                
            </DialogContent>
        </Dialog>
    )
}
