/** biome-ignore-all assist/source/organizeImports: <> */
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { moritotabi, type Product } from "@/lib/moritotabi";

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
    const search = searchParams.get("search") || undefined;
    const vendor = searchParams.get("vendor") || undefined;

    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, total } = await moritotabi.getProducts({
          page: currentPage,
          limit,
          search,
          vendor,
        });
        setProducts(data);
        setTotal(total);
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
            <div key={product.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                {product.images?.[0]?.src ? (
                  <Image
                    src={product.images[0].src}
                    alt={product.images[0].alt || product.title}
                    width={300}
                    height={400}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-100">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link href={`/products/${product.handle}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.vendor}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {product.price ? `$${product.price.toFixed(2)}` : 'Price not available'}
                </p>
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
