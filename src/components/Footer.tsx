import Link from "next/link";
import type React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul>
              <li>
                <Link href="/shop" className="hover:text-secondary">
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/new-arrivals"
                  className="hover:text-secondary"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/collections/sale" className="hover:text-secondary">
                  Sale
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <ul>
              <li>
                <Link href="/about" className="hover:text-secondary">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-secondary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-secondary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul>
              <li>
                <Link href="/shipping" className="hover:text-secondary">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-secondary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-secondary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8">
          <p>&copy; {new Date().getFullYear()} MyStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
