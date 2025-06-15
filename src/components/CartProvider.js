"use client"; 
import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";

const CartContext = createContext();

export function MyCartProvider({ children }) {
    const [ cart, setCart ] = useState([]);
    
    useEffect(() => {
        const stored = localStorage.getItem("myCart");
        if (stored) {
            setCart(JSON.parse(stored));
        }
    },[]);
    
    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("myCart", JSON.stringify(cart));
    }, [cart]);
    
    function addToCart(item)  {
        console.log(item)
        setCart(prev => {
            const exists = prev.find(i => i.id === item.id);
            
            if (exists) {
                return prev.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            
            return [...prev, { id: item.id, quantity: 1, available: item.available, price: item.price, name: item.name }];
        });
    };
    
    function removeFromCart(id) {
        setCart(prev => prev.filter(item => item.id !== id));
    };
    
    function updateQuantity (id, quantity) {
        setCart(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };
    
    
    return (
        <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}

