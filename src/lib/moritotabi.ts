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
  }

  private async fetchJson<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch (e) {
          console.error(e);
        }

        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`,
          { cause: errorData }
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getProducts(
    params?: GetProductsParams
  ): Promise<PaginatedResponse<Product>> {
    try {
      const query = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            query.append(key, String(value));
          }
        });
      }

      const endpoint = `/products?${query.toString()}`;

      const response = await this.fetchJson<PaginatedResponse<Product>>(
        endpoint
      );

      // Handle different response structures
      if (
        response &&
        "products" in response &&
        Array.isArray(response.products)
      ) {
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
        return response as PaginatedResponse<Product>;
      } else if (Array.isArray(response)) {
        return {
          data: response,
          total: response.length,
          page: 1,
          limit: response.length,
          total_pages: 1,
        };
      } else {
        throw new Error("Unexpected response format from API");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getProductById(id: string | number): Promise<Product> {
    try {
      return await this.fetchJson<Product>(`/products/${id}`);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  async getProductByHandle(handle: string): Promise<Product> {
    try {
      return await this.fetchJson<Product>(
        `/products/handle/${encodeURIComponent(handle)}`
      );
    } catch (error) {
      console.error(`Error fetching product ${handle}:`, error);
      throw error;
    }
  }
}

// Create a singleton instance
export const moritotabi = new MoritotabiClient();

export type { PaginatedResponse };

export default moritotabi;
