"use client";

import Link from "next/link";
import type React from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "../ui/button";

const Header: React.FC = () => {
	const { cartCount } = useCart();
	return (
		<header className="top-0 z-50 sticky bg-white/80 shadow-sm backdrop-blur-sm">
			<div className="flex justify-between items-center mx-auto px-4 py-4 container">
				<Link href="/" className="font-bold text-primary text-2xl">
					Two Meskinz
				</Link>

				{/* Navigation Links */}
				<nav className="hidden md:flex space-x-6">
					<Link href="/" className="text-gray-600 hover:text-primary">
						Home
					</Link>
					<Link
						href="/collections"
						className="text-gray-600 hover:text-primary"
					>
						Collections
					</Link>
					<Link href="/about" className="text-gray-600 hover:text-primary">
						About
					</Link>
					<Link href="/contact" className="text-gray-600 hover:text-primary">
						Contact
					</Link>
				</nav>

				{/* Icons: Search, Cart, Account */}
				<div className="flex items-center space-x-4">
					{/* Search Icon */}
					<Button className="text-gray-600 hover:text-primary">
						<svg
							aria-label="Search"
							aria-hidden="true"
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							></path>
						</svg>
					</Button>
					{/* Cart Icon */}
					<Button className="text-gray-600 hover:text-primary">
						<Link href="/cart" className="relative">
							<svg
								aria-label="Cart"
								aria-hidden="true"
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
								></path>
								{cartCount > 0 && (
									<span className="-top-2 -right-2 absolute flex justify-center items-center bg-red-500 rounded-full w-5 h-5 text-white text-xs">
										{cartCount}
									</span>
								)}
							</svg>
						</Link>
					</Button>
					{/* Account Icon */}
					<Button className="text-gray-600 hover:text-primary">
						<svg
							aria-label="Account"
							aria-hidden="true"
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							></path>
						</svg>
					</Button>
				</div>
			</div>
		</header>
	);
};

export default Header;
