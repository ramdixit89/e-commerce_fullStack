import { createContext, useEffect, useState } from "react";
export const CartContext = createContext();
export const CartProvider = ({ children }) => {
    const [cartQuantity, setCartQuantity] = useState(0);

    const fetchCartItems = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`http://localhost:8000/api/get_cart/${userId}`);
            const data = await response.json();
            const totalQuantity = data.reduce((acc, item) => acc + item.quantity, 0);
            setCartQuantity(totalQuantity);
            // fetchCartItems();   
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };
    useEffect(() => {
        fetchCartItems();
    }, []);
    return (
        <CartContext.Provider value={{cartQuantity, fetchCartItems}}>
            {children}
        </CartContext.Provider>
    );
};
