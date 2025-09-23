"use client";

import { useEffect, useState } from "react";
import { moritotabi, type Product } from "@/lib/moritotabi";

export default function ProductList() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const { data } = await moritotabi.getProducts({ limit: 16 });
				setProducts(data);
			} catch (err) {
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

	return (
		<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			{products.map((product) => (
				<div key={product.id} className="p-4 border rounded-lg">
					<h3 className="font-semibold text-xl">{product.title}</h3>
					{product.vendor && <p className="text-gray-600">{product.vendor}</p>}
					{product.price && (
						<p className="mt-2 font-bold text-lg">${product.price}</p>
					)}
				</div>
			))}
		</div>
	);
}
