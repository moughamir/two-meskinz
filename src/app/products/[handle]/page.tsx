/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: <explanation> */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { moritotabi, type Product } from "@/lib/moritotabi";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define the Option type since it's not exported from moritotabi
type Option = {
	id: string | number;
	name: string;
	values: string[];
};

export default function ProductDetailPage() {
	const params = useParams();
	const router = useRouter();
	const handle = params.handle as string;
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchProduct() {
			try {
				setLoading(true);
				const productData = await moritotabi.getProductByHandle(handle);
				setProduct(productData);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to fetch product",
				);
				console.error("Error fetching product:", err);
			} finally {
				setLoading(false);
			}
		}

		if (handle) {
			fetchProduct();
		}
	}, [handle]);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				Loading product...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				Error: {error}
			</div>
		);
	}

	if (!product) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				Product not found
			</div>
		);
	}

	const mainImage = product.images?.[0]?.src;
	const hasVariants = product.variants && product.variants.length > 1;
	const price =
		product.price ||
		(product.variants?.[0]?.price ? parseFloat(product.variants[0].price) : 0);
	const comparePrice =
		product.compare_at_price ||
		(product.variants?.[0]?.compare_at_price
			? parseFloat(product.variants[0].compare_at_price)
			: undefined);

	// Safely get tags or default to empty array
	const tags = product.tags || [];
	const description = (product as any).body_html || "No description available";
	const options = (product as any).options || [];

	return (
		<div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
			<Button variant="outline" onClick={() => router.back()} className="mb-6">
				← Back to products
			</Button>

			<div className="lg:gap-x-8 lg:grid lg:grid-cols-2">
				{/* Product Images */}
				<div className="space-y-4">
					<div className="bg-gray-100 rounded-lg aspect-h-4 aspect-w-3 overflow-hidden">
						{mainImage ? (
							<Image
								src={mainImage}
								alt={product.title}
								width={800}
								height={800}
								className="w-full h-full object-center object-cover"
								priority
							/>
						) : (
							<div className="flex justify-center items-center h-full">
								<span className="text-gray-400">No image available</span>
							</div>
						)}
					</div>
					{product.images && product.images.length > 1 && (
						<div className="gap-4 grid grid-cols-4">
							{product.images.map((image) => (
								<div
									key={image.id}
									className="bg-gray-100 rounded-lg aspect-h-2 aspect-w-3 overflow-hidden"
								>
									<Image
										src={image.src}
										alt={image.alt || product.title}
										width={200}
										height={200}
										className="w-full h-full object-center object-cover"
									/>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Product Info */}
				<div className="mt-10 sm:mt-16 lg:mt-0 px-4 sm:px-0">
					<h1 className="font-bold text-gray-900 text-3xl tracking-tight">
						{product.title}
					</h1>

					{product.vendor && (
						<p className="mt-2 text-gray-500 text-sm">
							Vendor: <span className="font-medium">{product.vendor}</span>
						</p>
					)}

					<div className="mt-6">
						<h2 className="sr-only">Product information</h2>
						<div className="flex items-center">
							<p className="font-bold text-gray-900 text-3xl tracking-tight">
								${price.toFixed(2)}
							</p>
							{comparePrice && comparePrice > price && (
								<span className="ml-2 text-gray-500 text-sm line-through">
									${comparePrice.toFixed(2)}
								</span>
							)}
						</div>

						{tags.length > 0 && (
							<div className="flex flex-wrap gap-2 mt-2">
								{tags.map((tag) => (
									<span
										key={tag}
										className="bg-blue-100 px-2.5 py-0.5 rounded-full font-medium text-blue-800 text-xs"
									>
										{tag}
									</span>
								))}
							</div>
						)}
					</div>

					{hasVariants && options.length > 0 && (
						<div className="mt-6">
							<h3 className="font-medium text-gray-900 text-sm">Options</h3>
							<div className="space-y-2 mt-2">
								{options.map((option: Option) => (
									<div key={option.id}>
										<label
											htmlFor={`option-${option.id}`}
											className="block font-medium text-gray-700 text-sm"
										>
											{option.name}
										</label>
										<select
											id={`option-${option.id}`}
											className="block mt-1 py-2 pr-10 pl-3 border-gray-300 focus:border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-500 w-full sm:text-sm text-base"
											defaultValue={option.values[0]}
											aria-label={`Select ${option.name}`}
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
						</div>
					)}

					<div className="mt-6">
						<h3 className="sr-only">Description</h3>
						<div
							className="max-w-none text-gray-500 prose prose-sm"
							dangerouslySetInnerHTML={{ __html: description }}
						/>
					</div>

					<div className="flex space-x-4 mt-10">
						<Button className="flex-1 py-6 text-base">Add to cart</Button>
						<Button variant="outline" className="flex-1 py-6 text-base">
							Buy now
						</Button>
					</div>

					{tags.length > 0 && (
						<div className="mt-8 pt-8 border-gray-200 border-t">
							<h3 className="font-medium text-gray-900 text-sm">Tags</h3>
							<div className="flex flex-wrap gap-2 mt-2">
								{tags.map((tag) => (
									<Link
										key={tag}
										href={`/search?q=${encodeURIComponent(tag)}`}
										className="inline-flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full font-medium text-gray-600 text-xs"
									>
										{tag}
									</Link>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
