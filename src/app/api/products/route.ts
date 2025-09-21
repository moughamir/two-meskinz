import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import type { Product, Root } from "@/types/shopify"; // Import Product and Root

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  try {
    // Construct the path to your products.json file in the public directory
    const jsonDirectory = path.join(process.cwd(), "public");
    const fileContents = await fs.readFile(
      `${jsonDirectory}/products.json`,
      "utf8",
    );
    const { products } = JSON.parse(fileContents) as Root; // Type assertion and destructuring

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedProducts: Product[] = products.slice(startIndex, endIndex); // Explicitly type

    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
