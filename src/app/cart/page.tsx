// src/app/cart/page.tsx
"use client";

// biome-ignore assist/source/organizeImports: <explanation>
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
	const { items, updateQuantity, removeFromCart, cartTotal, cartCount } =
		useCart();

	if (cartCount === 0) {
		return (
			<div className="mx-auto px-4 py-16 text-center container">
				<h1 className="mb-4 font-bold text-2xl">Your cart is empty</h1>
				<p className="mb-8 text-gray-600">
					Looks like you haven't added anything to your cart yet.
				</p>
				<Link href="/products">
					<Button>Continue Shopping</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="mx-auto px-4 py-8 container">
			<h1 className="mb-8 font-bold text-2xl">Your Cart ({cartCount})</h1>

			<div className="lg:gap-8 lg:grid lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2">
					{items.map((item) => (
						<div key={item.id} className="flex pb-6 border-b">
							<div className="relative flex-shrink-0 w-24 h-24">
								<Image
									src={item.image}
									alt={item.title}
									fill
									className="rounded object-cover"
								/>
							</div>

							<div className="flex-1 ml-4">
								<div className="flex justify-between">
									<h3 className="font-medium">{item.title}</h3>
									<p className="font-medium">
										$
										{(
											parseInt(item.price as string, 10) * item.quantity
										).toFixed(2)}
									</p>
								</div>

								{item.variant && (
									<p className="mt-1 text-gray-600 text-sm">
										{Object.entries(item.variant).map(([key, value]) => (
											<span key={key} className="mr-2">
												{key}: {String(value)}
											</span>
										))}
									</p>
								)}

								<div className="flex items-center mt-2">
									<input
										type="number"
										min="1"
										value={item.quantity}
										onChange={(e) =>
											updateQuantity(item.id, parseInt(e.target.value, 10))
										}
										className="p-1 border rounded w-16"
									/>
									<Button
										variant="ghost"
										size="sm"
										className="ml-2"
										onClick={() => removeFromCart(item.id)}
									>
										Remove
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="mt-8 lg:mt-0">
					<div className="bg-gray-50 p-6 rounded-lg">
						<h2 className="mb-4 font-medium text-lg">Order Summary</h2>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span>Subtotal</span>
								<span>${cartTotal.toFixed(2)}</span>
							</div>
							<div className="flex justify-between font-medium">
								<span>Total</span>
								<span>${cartTotal.toFixed(2)}</span>
							</div>
						</div>
						<Button className="mt-6 w-full" size="lg">
							Checkout
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
