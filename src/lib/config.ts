export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';

import type {
  CacheConfig,
  DatabaseConfig,
  DataSourceConfig,
  PriceConfig,
  StoreConfig,
} from "./types";

// Environment-based configuration
export const CONFIG = {
  // Website branding configuration
  branding: {
    name: process.env.NEXT_PUBLIC_SITE_NAME || "Cosmopolitan",
    description:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
      "The next generation of e-commerce.",
    keywords:
      process.env.NEXT_PUBLIC_SITE_KEYWORDS ||
      "e-commerce, next generation, e-commerce platform",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://cosmopolitan.com",
    logo: process.env.NEXT_PUBLIC_SITE_LOGO || "/logo.png",
    favicon: process.env.NEXT_PUBLIC_SITE_FAVICON || "/favicon.ico",
    author: process.env.NEXT_PUBLIC_SITE_AUTHOR || "Cosmopolitan Team",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@cosmopolitan.com",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+1-555-0123",
    address: {
      street: process.env.NEXT_PUBLIC_ADDRESS_STREET || "123 Commerce St",
      city: process.env.NEXT_PUBLIC_ADDRESS_CITY || "New York",
      state: process.env.NEXT_PUBLIC_ADDRESS_STATE || "NY",
      zip: process.env.NEXT_PUBLIC_ADDRESS_ZIP || "10001",
      country: process.env.NEXT_PUBLIC_ADDRESS_COUNTRY || "US",
    },
    social: {
      twitter: process.env.NEXT_PUBLIC_TWITTER_URL,
      facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL,
      instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
      linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL,
    },
  },

  // Database configuration
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "cosmopolitan",
  } as DatabaseConfig,

  // Price processing configuration
  price: {
    DISCOUNT_PERCENTAGE: 50,
    MIN_PRICE: 300,
    MAX_PRICE: 10000,
    PRICE_CAP: 9999,
  } as PriceConfig,

  // Cache configuration
  cache: {
    revalidate: 3600, // 1 hour
  } as CacheConfig,

  // Store configurations
  stores: {
    dev: {
      name: "dev",
      url: "http://localhost:3000",
      keywords: "development, local",
      baseUrl: "http://localhost:3000",
      endpoints: {
        products: "/products.json",
        collections: "/c/{id}/products.json",
      },
    },
    pura: {
      name: "Pura",
      url: "https://pura.com",
      keywords: "pura, store, products",
      baseUrl: "https://pura.com",
      endpoints: {
        products: "/products.json",
        collections: "/collections/{id}/products.json",
      },
    },
    apluslift: {
      name: "APlusLift",
      url: "https://apluslift.com",
      keywords: "apluslift, store, products",
      baseUrl: "https://apluslift.com",
      endpoints: {
        products: "/products.json",
        collections: "/collections/{id}/products.json",
      },
    },
  } as Record<string, StoreConfig>,

  // Data source priority configuration
  dataSources: [
    {
      type: "database" as const,
      priority: 1,
      enabled: process.env.NODE_ENV === "production",
      config: {}, // Will use database config above
    },
    {
      type: "api" as const,
      priority: 2,
      enabled: true,
      config: {}, // Will use store configs above
    },
    {
      type: "file" as const,
      priority: 3,
      enabled: process.env.NODE_ENV === "development",
      config: { filePath: "src/lib/products.json" },
    },
  ] as DataSourceConfig[],

  // Performance settings
  performance: {
    maxConcurrentRequests: 10,
    requestTimeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    batchSize: 250,
    maxCacheSize: 1000,
  },

  // User agents for API requests
  userAgents: [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  ] as const,
} as const;

// Configuration getters with validation
export function getDatabaseConfig(): DatabaseConfig {
  return CONFIG.database;
}

export function getCacheConfig(): CacheConfig {
  return CONFIG.cache;
}

export function getPriceConfig(): PriceConfig {
  return CONFIG.price;
}

export function getStoreConfig(storeName: string): StoreConfig {
  const store = CONFIG.stores[storeName];
  if (!store) {
    throw new Error(`Unknown store: ${storeName}`);
  }
  return store;
}

export function getBrandingConfig() {
  return CONFIG.branding;
}

export function getAllStores(): Record<string, StoreConfig> {
  return CONFIG.stores;
}

export function getDataSources(): DataSourceConfig[] {
  return CONFIG.dataSources
    .filter((ds) => ds.enabled)
    .sort((a, b) => a.priority - b.priority);
}

export function getRandomUserAgent(): string {
  const agents = CONFIG.userAgents;
  return agents[Math.floor(Math.random() * agents.length)];
}

// Environment helpers
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

export function isTest(): boolean {
  return process.env.NODE_ENV === "test";
}

/**
 * Theme configuration system
 * Provides utilities for working with theme settings
 */
import { type ThemeSettings, themeSettings } from "./settings";

/**
 * Get the current theme settings
 * In a real Shopify-style system, this would load from a database or API
 */
export function getThemeSettings(): ThemeSettings {
  // In a real implementation, this would fetch from localStorage, API, etc.
  return themeSettings;
}

/**
 * Represents a generic section with common properties.
 */
interface Section {
  id: string;
  enabled?: boolean;
  [key: string]: unknown;
}

/**
 * Represents a page-like object that contains sections.
 */
interface PageWithSections {
  sections: Section[];
}

/**
 * Type guard to check if the provided settings object is a PageWithSections.
 * @param settings - The settings object to check.
 * @returns True if the object has a 'sections' array property.
 */
function isPageWithSections(settings: unknown): settings is PageWithSections {
  return (
    typeof settings === "object" &&
    settings !== null &&
    "sections" in settings &&
    Array.isArray((settings as { sections: unknown }).sections)
  );
}

/**
 * Get a specific section configuration by type and ID
 */
export function getSectionConfig(
  pageType: keyof ThemeSettings,
  sectionId: string,
) {
  const settings = getThemeSettings();
  const pageSettings = settings[pageType];

  if (!isPageWithSections(pageSettings)) {
    return null;
  }

  return (
    pageSettings.sections.find((section) => section.id === sectionId) || null
  );
}

/**
 * Get all enabled sections for a specific page type
 */
export function getPageSections(pageType: keyof ThemeSettings) {
  const settings = getThemeSettings();
  const pageSettings = settings[pageType];

  if (!isPageWithSections(pageSettings)) {
    return [];
  }

  return pageSettings.sections.filter((section) => section.enabled !== false);
}

/**
 * Get a theme color value
 */
export function getThemeColor(colorName: string): string {
  const settings = getThemeSettings();
  return (
    settings.colors[colorName as keyof typeof settings.colors]?.default || ""
  );
}

/**
 * Get current typography settings
 */
export function getTypographySettings() {
  const settings = getThemeSettings();
  return {
    bodyFont: settings.typography.bodyFont.default,
    headingFont: settings.typography.headingFont.default,
  };
}

/**
 * Get layout settings
 */
export function getLayoutSettings() {
  const settings = getThemeSettings();
  return {
    containerWidth: settings.layout.containerWidth.default,
    pageSpacing: settings.layout.pageSpacing.default,
  };
}
