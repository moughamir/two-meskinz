"use client";

import { useEffect, useState } from "react";
import { moritotabi } from "@/lib/moritotabi";
import type { Product } from "@/types/shopify";
import { ProductCard } from "./ProductCard";

export default function ProductList() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				const response = await moritotabi.getProducts({ limit: 16 });
				// console.log("API Response:", response); // Debug log

				// Check if response.data exists and is an array
				const productsData = Array.isArray(response?.data)
					? response.data
					: Array.isArray(response)
						? response
						: [];

				// console.log("Products data:", productsData); // Debug log
				setProducts(productsData);
			} catch (err) {
				// console.error("Error fetching products:", err); // Debug log
				setError(
					err instanceof Error ? err.message : "Failed to fetch products",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	if (loading) return <div>Loading products...</div>;
	if (error) return <div>Error: {error}</div>;

	if (!products || products.length === 0) {
		return <div>No products found</div>;
	}

	return (
		<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
