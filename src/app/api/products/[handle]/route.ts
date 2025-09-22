import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import type { Product, ProductsCollection } from "@/types/shopify"; // Import Product and Root

export async function GET(
  _request: Request,
  { params }: { params: { handle: string } }
) {
  const { handle } = params;

  try {
    const jsonDirectory = path.join(process.cwd(), "public");
    const fileContents = await fs.readFile(
      `${jsonDirectory}/products.json`,
      "utf8"
    );
    const { products } = JSON.parse(fileContents) as ProductsCollection; // Type assertion and destructuring

    const product: Product | undefined = products.find(
      (p) => p.handle === handle
    ); // Type product

    if (product) {
      return NextResponse.json(product);
    } else {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
