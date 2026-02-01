import { createContext, useEffect, useState } from "react";
export const CartContext = createContext();
const BASE_URL = process.env.REACT_APP_BASE_URL;
export const CartProvider = ({ children }) => {
    const [cartQuantity, setCartQuantity] = useState(0);

    const fetchCartItems = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            if (!userId || !token) {
                setCartQuantity(0);
                return;
            }

            const response = await fetch(`${BASE_URL}/api/get_cart/${userId}`, {
                headers: {
                    'Authorization': token
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const totalQuantity = data.reduce((acc, item) => acc + item.quantity, 0);
                setCartQuantity(totalQuantity);
            } else {
                setCartQuantity(0);
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
            setCartQuantity(0);
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
