import Image from "next/image";
import Link from "next/link";
import type React from "react";
import type { Product } from "@/types/shopify";

// Assuming Shadcn Card component is not yet added, using plain div with Tailwind for now.
// If Shadcn Card is desired, it would need to be added via `npx shadcn@latest add card`

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="border rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow duration-200">
      <Link href={`/products/${product.handle}`}>
        <div className="relative w-full h-60 bg-gray-100 flex items-center justify-center">
          <Image
            src={product.images[0]?.src || ""} // Access image from images array
            alt={product.title}
            width={300}
            height={300}
            className="object-contain max-h-full max-w-full"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {product.title}
          </h3>
          <p className="text-gray-600 mt-1">${product.variants[0]?.price}</p>{" "}
          {/* Access price from variants array */}
          {/* Optional: Add a button here, e.g., "Quick Add" */}
          {/* <Button className="mt-3 w-full">View Product</Button> */}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
