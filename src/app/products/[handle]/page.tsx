// src/app/products/[handle]/page.tsx
/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: <explanation> */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { moritotabi } from "@/lib/moritotabi";
import { useCart } from "@/contexts/CartContext";
import type { Product, ProductOption, ProductVariant } from "@/types/shopify";

export default function ProductDetailPage() {
	const { addToCart } = useCart();
	const router = useRouter();
	const params = useParams();
	const handle = params.handle as string;

	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [quantity, setQuantity] = useState(1);
	const [selectedVariant, setSelectedVariant] = useState<
		Product["variants"][number] | null
	>(null);

	useEffect(() => {
		async function fetchProduct() {
			try {
				setLoading(true);
				const productData = await moritotabi.getProductByHandle(handle);
				setProduct(productData);
				if (productData.variants?.[0]) {
					setSelectedVariant(productData.variants[0]);
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load product");
			} finally {
				setLoading(false);
			}
		}

		if (handle) {
			fetchProduct();
		}
	}, [handle]);

	const handleAddToCart = () => {
		if (!product) return;

		addToCart({
			id: product.id,
			title: product.title,
			price: product.variants[0].price || 0,
			image: product.images?.[0]?.src || "",
		});
	};

	const handleBuyNow = () => {
		handleAddToCart();
		router.push("/cart");
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!product) return <div>Product not found</div>;

	const mainImage = product.images?.[0]?.src;
	const hasVariants = product.variants && product.variants.length > 0;
	const price = product?.variants[0]?.price || 0;

	return (
		<div className="mx-auto px-4 py-8 container">
			<Button variant="outline" onClick={() => router.back()} className="mb-6">
				← Back to products
			</Button>

			<div className="lg:gap-8 lg:grid lg:grid-cols-2">
				{/* Product Images */}
				<div className="space-y-4">
					<div className="bg-gray-100 rounded-lg aspect-square overflow-hidden">
						{mainImage ? (
							<Image
								src={mainImage}
								alt={product.title}
								width={800}
								height={800}
								className="w-full h-full object-cover"
								priority
							/>
						) : (
							<div className="flex justify-center items-center bg-gray-100 w-full h-full">
								<span className="text-gray-400">No image available</span>
							</div>
						)}
					</div>
				</div>

				{/* Product Info */}
				<div className="mt-6 lg:mt-0">
					<h1 className="font-bold text-3xl">{product.title}</h1>

					{product.vendor && (
						<p className="mt-2 text-gray-600">Vendor: {product.vendor}</p>
					)}

					<div className="mt-4">
						<span className="font-bold text-2xl">
							${parseInt(price as string, 10).toFixed(2)}
						</span>
					</div>

					{hasVariants && (
						<div className="space-y-4 mt-6">
							{product.options?.map((option: ProductOption) => (
								<div key={option.name}>
									<label
										htmlFor={`option-${option.name}`} // Add htmlFor with unique ID
										className="block mb-1 font-medium text-sm"
									>
										{option.name}
									</label>
									<select
										id={`option-${option.name}`} // Add matching ID
										className="p-2 border rounded w-full"
										onChange={(e) => {
											const variant = product.variants?.find(
												(v: ProductVariant) => v.title === e.target.value,
											);
											if (variant) setSelectedVariant(variant);
										}}
									>
										{option.values.map((value) => (
											<option key={value} value={value}>
												{value}
											</option>
										))}
									</select>
								</div>
							))}
						</div>
					)}

					<div className="mt-6">
						<div className="flex items-center space-x-4">
							<div className="flex items-center border rounded-md overflow-hidden">
								<Button
									className="px-3 py-2"
									onClick={() => setQuantity((q) => Math.max(1, q - 1))}
								>
									-
								</Button>
								<span className="px-4">{quantity}</span>
								<Button
									className="px-3 py-2"
									onClick={() => setQuantity((q) => q + 1)}
								>
									+
								</Button>
							</div>
							<Button className="flex-1" onClick={handleAddToCart}>
								Add to Cart
							</Button>
							<Button
								variant="outline"
								className="flex-1"
								onClick={handleBuyNow}
							>
								Buy Now
							</Button>
						</div>
					</div>

					{product.body_html && (
						<div
							className="mt-8 prose"
							dangerouslySetInnerHTML={{ __html: product.body_html }}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
