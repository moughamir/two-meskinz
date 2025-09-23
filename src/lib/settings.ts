/**
 * Theme settings configuration - Shopify-style
 * Similar to Shopify's settings_schema.json
 */

export const themeSettings = {
  // Theme colors
  colors: {
    primary: {
      label: "Primary Color",
      default: "#000000",
    },
    accent: {
      label: "Accent Color",
      default: "#6366f1",
    },
    secondary: {
      label: "Secondary Color",
      default: "#ffffff",
    },
    muted: {
      label: "Muted Color",
      default: "#f3f4f6",
    },
  },

  // Typography settings
  typography: {
    bodyFont: {
      label: "Body Font",
      default: "Inter",
      options: ["Inter", "Roboto", "Open Sans"],
    },
    headingFont: {
      label: "Heading Font",
      default: "Inter",
      options: ["Inter", "Playfair Display", "Montserrat"],
    },
  },

  // Layout settings
  layout: {
    containerWidth: {
      label: "Container Width",
      default: "1280px",
      options: ["1024px", "1280px", "1440px"],
    },
    pageSpacing: {
      label: "Page Spacing",
      default: "md",
      options: ["sm", "md", "lg"],
    },
  },

  // Configurable sections for templates
  homepage: {
    sections: [
      {
        type: "hero",
        id: "hero-1",
        label: "Hero Section",
        enabled: true,
        settings: {
          image: "/brand/cover.png",
          heading: "Welcome to Cosmopolitan",
          subheading: "Discover premium products",
          button_text: "Shop Now",
          button_link: "/products",
        },
      },
      {
        type: "value_props",
        id: "value-props-1",
        label: "Value Propositions",
        enabled: true,
        settings: {},
      },
      {
        type: "featured_products",
        id: "featured-1",
        label: "Featured Products",
        enabled: true,
        settings: {
          title: "Featured Items",
          product_count: 8,
          columns_desktop: 4,
          columns_mobile: 2,
        },
      },
      {
        type: "testimonials",
        id: "testimonials-1",
        label: "Testimonials",
        enabled: true,
        settings: {},
      },
      {
        type: "newsletter",
        id: "newsletter-1",
        label: "Newsletter Signup",
        enabled: true,
        settings: {},
      },
    ],
  },
};

// Theme sections registry
export type ThemeSectionType =
  | "hero"
  | "featured_products"
  | "collection_list"
  | "testimonials"
  | "rich_text"
  | "value_props"
  | "newsletter";

// Block types that can be used within sections
export type ThemeBlockType =
  | "product_card"
  | "image"
  | "text"
  | "button"
  | "video";

// Theme settings type
export type ThemeSettings = typeof themeSettings;
