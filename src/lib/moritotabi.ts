const API_BASE_URL = 'https://moritotabi.com/api';

type Product = {
  id: string | number;
  title: string;
  handle: string;
  vendor?: string;
  description?: string;
  price?: number;
  compare_at_price?: number;
  available?: boolean;
  images?: Array<{
    id: string | number;
    src: string;
    alt?: string;
  }>;
  variants?: Array<{
    id: string | number;
    title: string;
    price: string;
    compare_at_price?: string;
    available: boolean;
    sku?: string;
  }>;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
};

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

  private async fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getProducts(params?: GetProductsParams): Promise<PaginatedResponse<Product>> {
    const query = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, String(value));
        }
      });
    }

    return this.fetchJson<PaginatedResponse<Product>>(`/products?${query.toString()}`);
  }

  async getProductById(id: string | number): Promise<Product> {
    return this.fetchJson<Product>(`/products/${id}`);
  }

  async getProductByHandle(handle: string): Promise<Product> {
    return this.fetchJson<Product>(`/products/handle/${encodeURIComponent(handle)}`);
  }
}

// Create a singleton instance
export const moritotabi = new MoritotabiClient();

export type { Product, PaginatedResponse };

export default moritotabi;
