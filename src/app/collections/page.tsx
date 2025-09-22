"use client";

import type React from "react";
import { useEffect, useState } from "react";
import ProductCard from "@/components/bloc/ProductCard";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/shopify";
import type { StorePagination } from "@/types/store";

const CollectionsPage: React.FC = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [pagination, setPagination] = useState<StorePagination | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 6;

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await fetch(
					`/api/products?page=${currentPage}&limit=${itemsPerPage}`,
				);
				if (!response.ok) {
					throw new Error("Failed to fetch products");
				}
				const data = await response.json();
				setProducts(data.products);
				setPagination(data.pagination);
			} catch (error) {
				console.error("Error fetching products:", error);
			}
		};

		fetchProducts();
	}, [currentPage]);

	const handlePreviousPage = () => {
		if (pagination && currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (pagination && currentPage < pagination.totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	return (
		<div className="mx-auto px-4 py-8 container">
			<h1 className="mb-8 font-bold text-primary text-3xl">All Products</h1>

			<div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			{pagination && (
				<div className="flex justify-center items-center space-x-4 mt-8">
					<Button onClick={handlePreviousPage} disabled={currentPage === 1}>
						Previous
					</Button>
					<span className="text-gray-700">
						Page {currentPage} of {pagination.totalPages}
					</span>
					<Button
						onClick={handleNextPage}
						disabled={currentPage === pagination.totalPages}
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
};

export default CollectionsPage;
