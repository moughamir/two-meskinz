// src/components/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/shopify";

export function ProductCard({ product }: { product: Product }) {
	const price = product.variants[0].price || 0;
	const comparePrice = product.variants[0].compare_at_price || 0;
	const hasDiscount = comparePrice > price;

	return (
		<Link href={`/products/${product.handle}`} className="group">
			<div className="bg-gray-100 rounded-lg aspect-square overflow-hidden">
				<Image
					key={product.id}
					crossOrigin="anonymous"
					loading="lazy"
					placeholder="blur"
					blurDataURL={product.images[0].src}
					src={encodeURI(product.images[0].src)}
					alt={product.title}
					width={400}
					height={400}
					className="group-hover:opacity-90 w-full h-full object-cover transition-opacity"
				/>
			</div>
			<div className="mt-3">
				<h3 className="font-medium text-gray-900">{product.title}</h3>
				<div className="mt-1">
					<span className="text-gray-900">${Number(price).toFixed(2)}</span>
					{hasDiscount && (
						<span className="ml-2 text-gray-500 text-sm line-through">
							${Number(comparePrice).toFixed(2)}
						</span>
					)}
				</div>
			</div>
		</Link>
	);
}
