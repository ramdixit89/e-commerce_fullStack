import { createContext, useEffect, useState } from "react";
export const CartContext = createContext();
const BASE_URL = process.env.REACT_APP_BASE_URL;
export const CartProvider = ({ children }) => {
    const [cartQuantity, setCartQuantity] = useState(0);

    const fetchCartItems = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`${BASE_URL}/api/get_cart/${userId}`);
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
