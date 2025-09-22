'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface Product {
  handle: string;
  title: string;
  featured_image_url?: string;
  vendor: string;
  price?: number;
}

const PRODUCT_API_BASE_URL =
  process.env.NEXT_PUBLIC_PRODUCT_API_URL || "http://localhost:3000";

export default function ProductsPage() {
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
          `${PRODUCT_API_BASE_URL}/api/products?page=${currentPage}&limit=${limit}`
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
    <div className="min-h-screen p-8 sm:p-12 md:p-24 bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-12">All Products</h1>

      {loading && <p className="text-center">Loading products...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-center">No products found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {products.map((product) => (
          <Link href={`/products/${product.handle}`} key={product.handle}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105 cursor-pointer">
              <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
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
                <h3 className="text-lg font-semibold truncate">{product.title}</h3>
                <p className="text-sm text-gray-600">{product.vendor}</p>
                {product.price && (
                  <p className="text-md font-bold text-gray-800 mt-2">
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
        <div className="flex justify-center items-center mt-12 space-x-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-lg font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
