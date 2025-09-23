// src/lib/moritotabi.ts
import type { Product } from "@/types/shopify";

const API_BASE_URL = "https://moritotabi.com/api";

type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};

type GetProductsParams = {
  limit?: number;
  page?: number;
  search?: string;
  vendor?: string;
  fields?: string;
};

class MoritotabiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    console.log(`Initialized MoritotabiClient with base URL: ${this.baseUrl}`);
  }

  private async fetchJson<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`Fetching from: ${url}`); // Debug log

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      console.log(`Response status: ${response.status} ${response.statusText}`); // Debug log

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
          console.error("Error response data:", errorData); // Debug log
        } catch (e) {
          console.error("Could not parse error response as JSON");
        }

        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`,
          { cause: errorData }
        );
      }

      const data = await response.json();
      console.log("Response data:", data); // Debug log
      return data;
    } catch (error) {
      console.error("Fetch error:", error); // Debug log
      throw error;
    }
  }

  async getProducts(
    params?: GetProductsParams
  ): Promise<PaginatedResponse<Product>> {
    try {
      console.log("getProducts called with params:", params); // Debug log

      const query = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            query.append(key, String(value));
          }
        });
      }

      const endpoint = `/products?${query.toString()}`;
      console.log("Sending request to endpoint:", endpoint); // Debug log

      const response = await this.fetchJson<PaginatedResponse<Product>>(
        endpoint
      );

      // Handle different response structures
      if (
        response &&
        "products" in response &&
        Array.isArray(response.products)
      ) {
        console.log("Found products in response.products"); // Debug log
        return {
          data: response.products,
          total: response.products.length,
          page: 1,
          limit: params?.limit || response.products.length,
          total_pages: 1,
        };
      } else if (
        response &&
        "data" in response &&
        Array.isArray(response.data)
      ) {
        console.log("Found products in response.data"); // Debug log
        return response as PaginatedResponse<Product>;
      } else if (Array.isArray(response)) {
        console.log("Response is an array of products"); // Debug log
        return {
          data: response,
          total: response.length,
          page: 1,
          limit: response.length,
          total_pages: 1,
        };
      } else {
        console.error("Unexpected response format:", response); // Debug log
        throw new Error("Unexpected response format from API");
      }
    } catch (error) {
      console.error("Error in getProducts:", error); // Debug log
      throw error;
    }
  }

  async getProductById(id: string | number): Promise<Product> {
    try {
      console.log(`Fetching product with ID: ${id}`); // Debug log
      return await this.fetchJson<Product>(`/products/${id}`);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error); // Debug log
      throw error;
    }
  }

  async getProductByHandle(handle: string): Promise<Product> {
    try {
      console.log(`Fetching product with handle: ${handle}`); // Debug log
      return await this.fetchJson<Product>(
        `/products/handle/${encodeURIComponent(handle)}`
      );
    } catch (error) {
      console.error(`Error fetching product ${handle}:`, error); // Debug log
      throw error;
    }
  }
}

// Create a singleton instance
export const moritotabi = new MoritotabiClient();

export type { PaginatedResponse };

export default moritotabi;
