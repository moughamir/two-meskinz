'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

interface Product {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  vendor: string;
  product_type: string;
  tags: string[];
  variants: Array<{
    id: number;
    title: string;
    price: string;
    compare_at_price?: string;
  }>;
  images: Array<{
    id: number;
    src: string;
    alt?: string;
  }>;
  options: Array<{
    id: number;
    name: string;
    values: string[];
  }>;
  featured_image_url?: string;
  price?: number;
  compare_at_price?: number;
  availability?: string;
}

const PRODUCT_API_BASE_URL =
  process.env.NEXT_PUBLIC_PRODUCT_API_URL || "http://localhost:3000";

export default function ProductDetailPage() {
  const params = useParams();
  const handle = params.handle as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!handle) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`${PRODUCT_API_BASE_URL}/api/products/${handle}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setProduct(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [handle]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading product details...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;
  }

  return (
    <div className="min-h-screen p-8 sm:p-12 md:p-24 bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
        <p className="text-gray-600 mb-6">By {product.vendor}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              product.images.map((image) => (
                <div key={image.id} className="relative w-full h-80 bg-gray-200 rounded-md overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt || product.title}
                    layout="fill"
                    objectFit="contain" // Use contain for product images
                  />
                </div>
              ))
            ) : (
              <div className="relative w-full h-80 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-500">No Images Available</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.price && (
              <p className="text-3xl font-bold text-blue-600 mb-4">
                ${product.price.toFixed(2)}
                {product.compare_at_price && (
                  <span className="text-lg text-gray-500 line-through ml-2">
                    ${product.compare_at_price.toFixed(2)}
                  </span>
                )}
              </p>
            )}

            <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: product.body_html }}></p>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800">Product Type:</h3>
              <p className="text-gray-700">{product.product_type}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800">Availability:</h3>
              <p className="text-gray-700">{product.availability || "N/A"}</p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.variants && product.variants.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800">Variants:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {product.variants.map((variant) => (
                    <li key={variant.id}>
                      {variant.title} - ${parseFloat(variant.price).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}