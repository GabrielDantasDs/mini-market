"use client"

import { CartAction, cartReducer, Product } from "@/reducers/cartReducer"
import React, { createContext, ReactNode, useContext, useEffect, useReducer } from "react"

type CartContextType = {
    cart: Product[],
    dispatch: React.Dispatch<CartAction>
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: {children: ReactNode}) => {
    const [cart, dispatch] = useReducer(cartReducer, [], () => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("cart");
            return saved ? JSON.parse(saved) : []
        }
        return [];
    })

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    return (
        <CartContext.Provider value={{ cart, dispatch}}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");

    return context;
}