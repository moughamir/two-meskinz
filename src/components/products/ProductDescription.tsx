import { AddToCart } from '@/components/cart/AddToCart';
import Price from '@/components/Price';
import { Product } from '@/lib/types';
import { VariantSelector } from './VariantSelector';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>

      <VariantSelector options={product.options || []} variants={product.variants} />

      {product.descriptionHtml ? (
        <div
          className="prose text-sm dark:text-white/[.8]"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      ) : null}

      <AddToCart variants={product.variants} availableForSale={product.availableForSale} />
    </>
  );
}
