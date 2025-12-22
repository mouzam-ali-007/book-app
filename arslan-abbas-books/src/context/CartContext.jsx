
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem("cartItems");
            return localData ? JSON.parse(localData) : [];
        } catch {
            return [];
        }
    });

    const [isBagOpen, setIsBagOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity) => {


        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.title === product.title);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.title === product.title
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity }];
            }
        });
        setIsBagOpen(true);
    };


    const removeFromCart = (title) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.title !== title));
    };

    const emptyCart = () => {
        setCartItems([])
    }

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const toggleBag = () => setIsBagOpen((prev) => !prev);

    const subtotal = cartItems.reduce((acc, item) => {
        // Assuming price is a string like "Rs. 1,000" or number
        const price = typeof item.price === 'string'
            ? parseInt(item.price.replace(/[^0-9]/g, ''), 10)
            : item.price;
        return acc + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                emptyCart,
                updateQuantity,
                isBagOpen,
                toggleBag,
                subtotal
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
