// API
export enum ProductsApiRequestAction {
  FETCH = "fetch",
  PROCESS = "process",
  FETCH_AND_PROCESS = "fetch-and-process",
}
export interface ProductsApiRequest {
  baseUrl?: string;
  discountPercentage?: number;
  minPrice?: number;
  maxPrice?: number;
  priceCap?: number;
  action?: ProductsApiRequestAction;
  saveToFile?: boolean;
  filename?: string;
}

export interface ProductsResponse {
  products: Product[];
  hasMore: boolean;
  nextPage?: number;
  currentPage: number;
  total?: number;
}

export interface ProductsApiResponse {
  success: boolean;
  message: string;
  data?: ProductsApiResponseData;
  error?: string;
}
export interface ProductsApiResponseData {
  rawProducts?: number;
  processedProducts?: number;
  products?: IProduct[];
  filename?: string;
}

export type CartItem = {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
};

export interface Products {
  products: Product[];
}

// Enhanced types for optimized architecture
export interface FetchProductsOptions {
  limit?: number;
  page?: number;
  category?: string;
  vendor?: string;
  search?: string;
  price_min?: number;
  price_max?: number;
  sort?: string;
  order?: "asc" | "desc";
  since_id?: number;
  updated_at_min?: string;
  title?: string;
  product_type?: string;
  collection_id?: string;
  status?: string;
}

/**
 * Configuration for product price processing
 */
export interface IPriceConfig {
  readonly MIN_PRICE: number;
  readonly MAX_PRICE: number;
  readonly PRICE_CAP: number;
  readonly DISCOUNT_PERCENTAGE: number;
}

/**
 * Product variant with price and additional properties
 */
export interface IVariant {
  price: string;
  [key: string]: unknown;
}

/**
 * Product with variants and additional properties
 */
export interface IProduct {
  variants: IVariant[];
  [key: string]: unknown;
}

/**
 * API response structure for products
 */
export interface IProductsResponse {
  products: IProduct[];
}

/**
 * Logger interface for consistent logging
 */
export interface ILogger {
  info: (message: string) => void;
  error: (message: string, error?: unknown) => void;
  success: (message: string) => void;
}

/**
 * Main interface for ProductAggregator
 */
export interface IProductsAggregator {
  readonly baseUrl: string;
  readonly priceConfig: IPriceConfig;
  readonly products: readonly IProduct[];
  readonly rawProducts: readonly IProduct[];
  fetchProducts: () => Promise<IProduct[]>;
  processProducts: (products?: IProduct[]) => IProduct[];
  fetchAndProcessProducts: () => Promise<void>;
  saveProducts: (filename?: string) => Promise<void>;
}

// ---- from core
// Unified types for the entire product system

export interface FetchProductsOptions {
  limit?: number;
  page?: number;
  since_id?: number;
  status?: string;
  updated_at_min?: string;
  title?: string;
  vendor?: string;
  product_type?: string;
  collection_id?: string;
  category?: string;
  price_min?: number;
  price_max?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  featured?: boolean;
}

export interface CacheConfig {
  revalidate: number;
}

export interface DataSourceConfig {
  type: "database" | "api" | "file";
  priority: number;
  enabled: boolean;
  config: Record<string, unknown>;
}

export interface StoreConfig {
  name: string;
  url: string;
  keywords: string;
  endpoints: {
    products: string;
    collections: string;
  };
}

export interface DatabaseConfig {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
}

export interface PriceConfig {
  DISCOUNT_PERCENTAGE: number;
  MIN_PRICE: number;
  MAX_PRICE: number;
  PRICE_CAP: number;
}

export interface Logger {
  info(message: string): void;
  error(message: string, error?: unknown): void;
  success(message: string): void;
  warn(message: string): void;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
export interface Product {
  availability?: string;
  barcode?: string;
  body_html: string;
  brand: string;
  category: string;
  compare_at_price?: number;
  condition?: string;
  created_at: string;
  description: string;
  dimensions?: ProductDimensions;
  featured_image_url?: string;
  googleCategory: string;
  gtin: string;
  handle: string;
  id: number;
  images_count?: number;
  images: ProductImage[];
  inStock?: boolean;
  mpn?: string;
  name: string;
  options?: ProductOption[];
  price?: number;
  product_type?: string;
  published_at?: string;
  rating?: ProductRating;
  review_count?: number;
  slug?: string;
  status?: string;
  tags: string[];
  title?: string;
  updated_at: string;
  updatedAt: string;
  variants: ProductVariant[];
  vendor?: string;
  weight?: number;
  featuredImage: ProductImage;
  seo: {
    title: string;
    description: string;
  };
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  descriptionHtml: string;
}
export interface ProductRating {
  average: number;
  count: number;
}
export interface ProductDimensions {
  height?: number;
  length?: number;
  weight?: number;
  width?: number;
}
export interface ProductVariant {
  available?: boolean;
  barcode?: string;
  compare_at_price: string | null;
  created_at: string;
  featured_image?: ProductImage | null;
  grams?: number;
  gtin?: string;
  id: string;
  inventory_quantity?: number;
  mpn?: string;
  option1?: string | null;
  option2?: string | null;
  option3?: string | null;
  position: number;
  price: {
    amount: string;
    currencyCode: string;
  };
  requires_shipping: boolean;
  sku?: string;
  taxable: boolean;
  title: string;
  updated_at: string;
  weight?: number;
  image?: ProductImage;
}

export interface ProductImage {
  alt?: string;
  created_at: string;
  height?: number;
  id: number;
  position: number;
  product_id: number;
  src: string;
  updated_at: string;
  variant_ids?: number[];
  width?: number;
}
export interface ProductOption {
  id: string;
  name: string;
  position: number;
  values: string[];
}
