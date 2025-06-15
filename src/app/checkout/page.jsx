import { getOrders } from "@/lib/actions"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function CheckoutPage() {
    const orders = await getOrders();
    
    function priceToFix(price) {
        if(!price) return 0;
        return  Number(price).toFixed(2)
    }
    
    return (
        <div>
            <h1 className="font-bold text-2xl" >Checkout</h1>
            
            
            <Table>
                <TableCaption>checkout list</TableCaption>
                
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        <TableHead>status</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                </TableHeader>
                
                <TableBody>
                    {
                        orders.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell className="text-right">${ priceToFix(item.price) }</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
                
    
                
            </Table>
            
            {JSON.stringify()}
        </div>
    )
}