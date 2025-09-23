"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { moritotabi } from "@/lib/moritotabi";
import Image from "next/image";
import Link from "next/link";

interface Collection {
	id: string | number;
	title: string;
	handle: string;
	description?: string;
	image?: {
		src: string;
		alt?: string;
	};
	productsCount?: number;
}

export default function CollectionsPage() {
	const [collections, setCollections] = useState<Collection[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCollections = async () => {
			try {
				setLoading(true);
				// Note: The Moritotabi API might not have a direct collections endpoint
				// So we'll fetch products and group them by vendor as an example
				const { data: products } = await moritotabi.getProducts({ limit: 100, fields: 'vendor,images' });

				// Group products by vendor to create collections
				const vendors = new Map<string, Collection>();

				products.forEach((product) => {
					if (product.vendor) {
						if (!vendors.has(product.vendor)) {
							vendors.set(product.vendor, {
								id: product.vendor.toLowerCase().replace(/\s+/g, "-"),
								title: product.vendor,
								handle: product.vendor.toLowerCase().replace(/\s+/g, "-"),
								productsCount: 1,
								image: product.images?.[0],
							});
						} else {
							// biome-ignore lint/style/noNonNullAssertion: <explanation>
							const vendor = vendors.get(product.vendor)!;
							vendor.productsCount = (vendor.productsCount || 0) + 1;
						}
					}
				});

				setCollections(Array.from(vendors.values()));
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to fetch collections",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchCollections();
	}, []);

	if (loading)
		return (
			<div className="flex justify-center items-center min-h-screen">
				Loading collections...
			</div>
		);
	if (error)
		return (
			<div className="flex justify-center items-center min-h-screen">
				Error: {error}
			</div>
		);

	return (
		<div className="mx-auto px-4 py-8 max-w-7xl container">
			<h1 className="mb-8 font-bold text-gray-900 text-3xl">Collections</h1>

			<div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{collections.map((collection) => (
					<Link
						key={collection.id}
						href={`/collections/${collection.handle}`}
						className="group block relative bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-shadow"
					>
						<div className="relative w-full h-64 aspect-h-1 aspect-w-1 overflow-hidden">
							{collection.image?.src ? (
								<Image
									src={collection.image.src}
									alt={collection.image.alt || collection.title}
									fill
									className="object-cover group-hover:scale-105 transition-transform duration-300"
								/>
							) : (
								<div className="flex justify-center items-center bg-gray-100 h-full">
									<span className="text-gray-400">No image</span>
								</div>
							)}
							<div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity" />
						</div>
						<div className="p-4">
							<h2 className="font-semibold text-gray-900 text-lg">
								{collection.title}
							</h2>
							{collection.productsCount !== undefined && (
								<p className="mt-1 text-gray-600 text-sm">
									{collection.productsCount}{" "}
									{collection.productsCount === 1 ? "product" : "products"}
								</p>
							)}
						</div>
					</Link>
				))}
			</div>

			{collections.length === 0 && !loading && (
				<div className="py-12 text-center">
					<p className="text-gray-500">No collections found.</p>
				</div>
			)}
		</div>
	);
}
