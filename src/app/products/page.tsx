/** biome-ignore-all assist/source/organizeImports: <> */
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { moritotabi } from "@/lib/moritotabi";
import type { Product } from "@/types/shopify";

function ProductsContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const limit = 25;

	useEffect(() => {
		const currentPage = parseInt(searchParams.get("page") || "1", 10);
		setPage(currentPage);
		const search = searchParams.get("search") || undefined;
		const vendor = searchParams.get("vendor") || undefined;

		async function fetchProducts() {
			try {
				setLoading(true);
				const { data, total } = await moritotabi.getProducts({
					page: currentPage,
					limit,
					search,
					vendor,
				});
				setProducts(data);
				setTotal(total);
			} catch (e: any) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		}

		fetchProducts();
	}, [searchParams]);

	const totalPages = Math.ceil(total / limit);

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", newPage.toString());
		router.push(`/products?${params.toString()}`);
	};

	return (
		<div className="bg-gray-50 p-8 sm:p-12 md:p-24 min-h-screen text-gray-800">
			<h1 className="mb-12 font-bold text-4xl text-center">All Products</h1>

			{loading && <p className="text-center">Loading products...</p>}
			{error && <p className="text-red-500 text-center">Error: {error}</p>}
			{!loading && !error && products.length === 0 && (
				<p className="text-center">No products found.</p>
			)}

			<div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto max-w-7xl">
				{products.map((product) => (
					<Link href={`/products/${product.handle}`} key={product.handle}>
						<div key={product.id} className="group relative">
							<div className="bg-gray-200 group-hover:opacity-75 rounded-md w-full lg:h-80 aspect-h-1 aspect-w-1 lg:aspect-none overflow-hidden">
								<Image
									src={product.images[0].src}
									alt={product.title}
									loading="lazy"
									placeholder="blur"
									blurDataURL={product.images[0].src}
									width={300}
									height={400}
									className="w-full lg:w-full h-full lg:h-full object-center object-cover"
									priority
								/>
							</div>
							<div className="flex justify-between mt-4">
								<div>
									<h3 className="text-gray-700 text-sm">
										<Link href={`/products/${product.handle}`}>
											<span aria-hidden="true" className="absolute inset-0" />
											{product.title}
										</Link>
									</h3>
									<p className="mt-1 text-gray-500 text-sm">{product.vendor}</p>
								</div>
								<p className="font-medium text-gray-900 text-sm">
									{product.variants[0].price
										? `$${parseInt(product.variants[0].price, 10).toFixed(2)}`
										: "Price not available"}
								</p>
							</div>
						</div>
					</Link>
				))}
			</div>

			{/* Pagination Controls */}
			{!loading && !error && totalPages > 1 && (
				<div className="flex justify-center items-center space-x-4 mt-12">
					<Button
						onClick={() => handlePageChange(page - 1)}
						disabled={page <= 1}
						className="bg-blue-500 disabled:opacity-50 px-4 py-2 rounded-md text-white disabled:cursor-not-allowed"
					>
						Previous
					</Button>
					<span className="font-semibold text-lg">
						Page {page} of {totalPages}
					</span>
					<Button
						onClick={() => handlePageChange(page + 1)}
						disabled={page >= totalPages}
						className="bg-blue-500 disabled:opacity-50 px-4 py-2 rounded-md text-white disabled:cursor-not-allowed"
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
}

export default function ProductsPage() {
	return (
		<Suspense
			fallback={
				<div className="flex justify-center items-center bg-gray-50 p-8 sm:p-12 md:p-24 min-h-screen text-gray-800">
					<p className="text-center">Loading...</p>
				</div>
			}
		>
			<ProductsContent />
		</Suspense>
	);
}
