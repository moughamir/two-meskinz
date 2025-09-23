// src/contexts/CartContext.tsx
"use client";

import type { ProductVariant } from "@/types/shopify";
import { createContext, useContext, useState } from "react";

type CartItem = {
	id: string | number;
	title: string;
	price: number | string;
	image: string;
	quantity: number;
	variant?: ProductVariant;
};

type CartContextType = {
	items: CartItem[];
	addToCart: (item: Omit<CartItem, "quantity">) => void;
	updateQuantity: (id: string | number, quantity: number) => void;
	removeFromCart: (id: string | number) => void;
	cartCount: number;
	cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);

	const addToCart = (item: Omit<CartItem, "quantity">) => {
		setItems((prev) => {
			const existing = prev.find((i) => i.id === item.id);
			if (existing) {
				return prev.map((i) =>
					i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
				);
			}
			return [...prev, { ...item, quantity: 1 }];
		});
	};

	const updateQuantity = (id: string | number, quantity: number) => {
		setItems((prev) =>
			prev
				.map((item) => (item.id === id ? { ...item, quantity } : item))
				.filter((item) => item.quantity > 0),
		);
	};

	const removeFromCart = (id: string | number) => {
		setItems((prev) => prev.filter((item) => item.id !== id));
	};

	const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
	const cartTotal = items.reduce(
		(sum, item) => sum + parseInt(item.price as string, 10) * item.quantity,
		0,
	);

	return (
		<CartContext.Provider
			value={{
				items,
				addToCart,
				updateQuantity,
				removeFromCart,
				cartCount,
				cartTotal,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) throw new Error("useCart must be used within a CartProvider");
	return context;
}
