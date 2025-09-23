// src/app/search/page.tsx
/** biome-ignore-all assist/source/organizeImports: <explanation> */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { moritotabi } from "@/lib/moritotabi";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

const PAGE_SIZE = 12;

function SearchContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
	const { ref, inView } = useInView();

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useInfiniteQuery({
			queryKey: ["products", searchQuery],
			queryFn: async ({ pageParam = 1 }) => {
				const response = await moritotabi.getProducts({
					search: searchQuery,
					page: pageParam,
					limit: PAGE_SIZE,
				});
				return {
					products: response.data,
					nextPage:
						response.data.length === PAGE_SIZE ? pageParam + 1 : undefined,
				};
			},
			getNextPageParam: (lastPage) => lastPage.nextPage,
			initialPageParam: 1,
		});

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
	};

	const products = data?.pages.flatMap((page) => page.products) || [];

	return (
		<div className="mx-auto px-4 py-8 container">
			<form onSubmit={handleSearch} className="mb-8">
				<div className="flex gap-2">
					<Input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search products..."
						className="flex-1"
					/>
					<Button type="submit">Search</Button>
				</div>
			</form>

			{status === "pending" ? (
				<div>Loading...</div>
			) : status === "error" ? (
				<div>Error loading products</div>
			) : (
				<>
					{products.length === 0 ? (
						<div>No products found</div>
					) : (
						<div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{products.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					)}
					<div ref={ref} className="h-10" />
					{isFetchingNextPage && <div>Loading more...</div>}
				</>
			)}
		</div>
	);
}

export default function SearchPage() {
	return (
		<Suspense fallback={<div>Loading search...</div>}>
			<SearchContent />
		</Suspense>
	);
}
