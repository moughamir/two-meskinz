import { notFound } from "next/navigation";
import { Suspense } from "react";

import type { Metadata } from "next";
import Grid from "@/components/common/Grid";
import Footer from "@/components/bloc/Footer";
import { ProductDescription } from "@/components/products/ProductDescription";
import { Gallery } from "@/components/products/Gallery";
import { HIDDEN_PRODUCT_TAG } from "@/lib/config";
import moritotabi from "@/lib/moritotabi";
import Link from "next/link";
import Image from "next/image";


import type { Product, ProductImage as ProductImageType } from "@/lib/types";

async function RelatedProducts({ product }: { product: any }) {
  const { data: relatedProducts } = await moritotabi.getProducts({
    vendor: product.vendor,
  });

  const filteredProducts = relatedProducts.filter(
    (p: any) => p.handle !== product.handle
  );

  if (!filteredProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <Grid className="grid-cols-2 lg:grid-cols-5">
        {filteredProducts.map((product: any) => (
          <Grid.Item key={product.handle} className="animate-fadeIn">
            <Link
              className="relative h-full w-full"
              href={`/product/${product.handle}`}
            >
              <Image
                alt={product.title}
                src={(product.images[0] as any)?.src}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                className="relative w-full h-full"
              />
            </Link>
          </Grid.Item>
        ))}
      </Grid>
    </div>
  );
}

async function ProductPage({
	params,
}: {
	params: { handle: string };
}) {
	const product: any = await moritotabi.getProductByHandle(params.handle);

	if (!product) return notFound();

	const productJsonLd = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.title,
		description: product.description,
		image: (product.images[0] as any)?.src || "",
		offers: {
			"@type": "AggregateOffer",
			availability: product.availableForSale
				? "https://schema.org/InStock"
				: "https://schema.org/OutOfStock",
			priceCurrency: product.priceRange.minVariantPrice.currencyCode,
			highPrice: product.priceRange.maxVariantPrice.amount,
			lowPrice: product.priceRange.minVariantPrice.amount,
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(productJsonLd),
				}}
			/>
			<div className="mx-auto px-4 max-w-screen-2xl">
				<div className="flex lg:flex-row flex-col lg:gap-8 bg-white dark:bg-black p-8 md:p-12 border border-neutral-200 dark:border-neutral-800 rounded-lg">
					<div className="w-full h-full basis-full lg:basis-4/6">
						<Gallery
							images={product.images.map((image: ProductImageType) => ({
								src: image.src,
								altText: image.alt,
							}))}
						/>
					</div>

					<div className="basis-full lg:basis-2/6">
						<ProductDescription product={product} />
					</div>
				</div>
				<Suspense>
					<RelatedProducts product={product} />
				</Suspense>
			</div>
			<Suspense>
				<Footer />
			</Suspense>
		</>
	);
}

export default ProductPage;

