/** biome-ignore-all assist/source/organizeImports: <> */
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import Link from "next/link";
interface Product {
  handle: string;
  title: string;
  featured_image_url?: string;
  vendor: string;
  price?: number;
}

const PRODUCT_API_BASE_URL =
  process.env.NEXT_PUBLIC_PRODUCT_API_URL || "http://localhost:3000";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 25;

  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    setPage(currentPage);

    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(
          `${PRODUCT_API_BASE_URL}/api/products?page=${currentPage}&limit=${limit}`,
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setProducts(data.products);
        setTotal(data.total);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [searchParams]);

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="bg-gray-50 p-8 sm:p-12 md:p-24 min-h-screen text-gray-800">
      <h1 className="mb-12 font-bold text-4xl text-center">All Products</h1>

      {loading && <p className="text-center">Loading products...</p>}
      {error && <p className="text-red-500 text-center">Error: {error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-center">No products found.</p>
      )}

      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto max-w-7xl">
        {products.map((product) => (
          <Link href={`/products/${product.handle}`} key={product.handle}>
            <div className="bg-white shadow-md rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer transform">
              <div className="relative flex justify-center items-center bg-gray-200 w-full h-48">
                {product.featured_image_url ? (
                  <Image
                    src={product.featured_image_url}
                    alt={product.title}
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">No Image</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg truncate">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm">{product.vendor}</p>
                {product.price && (
                  <p className="mt-2 font-bold text-gray-800 text-md">
                    ${product.price.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-12">
          <Button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="bg-blue-500 disabled:opacity-50 px-4 py-2 rounded-md text-white disabled:cursor-not-allowed"
          >
            Previous
          </Button>
          <span className="font-semibold text-lg">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="bg-blue-500 disabled:opacity-50 px-4 py-2 rounded-md text-white disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center bg-gray-50 p-8 sm:p-12 md:p-24 min-h-screen text-gray-800">
          <p className="text-center">Loading...</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
