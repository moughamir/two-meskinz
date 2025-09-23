// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export function Navbar() {
	const { cartCount } = useCart();

	return (
		<nav className="bg-white shadow-sm">
			<div className="flex justify-between items-center mx-auto px-4 py-3 container">
				<Link href="/" className="font-bold text-xl">
					My Store
				</Link>
				<div className="flex items-center space-x-4">
					<Link href="/search" className="hover:text-gray-600">
						Search
					</Link>
					<Link href="/cart" className="relative">
						🛒
						{cartCount > 0 && (
							<span className="-top-2 -right-2 absolute flex justify-center items-center bg-red-500 rounded-full w-5 h-5 text-white text-xs">
								{cartCount}
							</span>
						)}
					</Link>
				</div>
			</div>
		</nav>
	);
}
