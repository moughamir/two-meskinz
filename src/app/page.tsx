'use client';

import HeroSection from "@/components/bloc/HeroSection";
import { useState, useEffect } from "react";
import Image from "next/image"; // Assuming next/image is available and configured

interface Product {
  handle: string;
  title: string;
  featured_image_url?: string;
  vendor: string;
  price?: number;
}

const PRODUCT_API_BASE_URL =
  process.env.NEXT_PUBLIC_PRODUCT_API_URL || "http://localhost:3000";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(`${PRODUCT_API_BASE_URL}/api/products?limit=8`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setProducts(data.products);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="justify-items-center items-center gap-16 grid grid-rows-[20px_1fr_20px] p-8 sm:p-20 pb-20 min-h-screen font-sans">
      <main className="flex flex-col items-center sm:items-start gap-[32px] row-start-2">
        <HeroSection />

        <section className="w-full max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          {loading && <p className="text-center">Loading products...</p>}
          {error && <p className="text-center text-red-500">Error: {error}</p>}
          {!loading && !error && products.length === 0 && (
            <p className="text-center">No products found.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.handle}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105"
              >
                <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                  {product.featured_image_url ? (
                    <Image
                      src={product.featured_image_url}
                      alt={product.title}
                      layout="fill" // Use layout="fill" for responsive images
                      objectFit="cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">No Image</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">{product.title}</h3>
                  <p className="text-sm text-gray-600">{product.vendor}</p>
                  {product.price && (
                    <p className="text-md font-bold text-gray-800 mt-2">
                      ${product.price.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}