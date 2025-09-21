'use client';
import Image from "next/image";
import { useParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/shopify";

const ProductDetailPage: React.FC = () => {
  const { handle } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (handle) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/products/${handle}`);
          if (!response.ok) {
            throw new Error("Failed to fetch product");
          }
          const data = await response.json();
          setProduct(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [handle]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading product...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Product not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full h-96">
          <Image
            src={product.images[0]?.src || ""} // Access image from images array
            alt={product.title}
            fill
            style={{ objectFit: "contain" }}
            className="rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-primary mb-4">
            {product.title}
          </h1>
          <p className="text-2xl text-gray-800 mb-6">
            ${product.variants[0]?.price}
          </p>{" "}
          {/* Access price from variants array */}
          <div
            className="text-gray-700 mb-8"
            dangerouslySetInnerHTML={{ __html: product.body_html }}
          />{" "}
          {/* Render HTML description */}
          <Button className="w-full py-3 text-lg">Add to Cart</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
