import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/bloc/AnnouncementBar";
import Footer from "@/components/bloc/Footer";
import Header from "@/components/bloc/Header";
import { CartProvider } from "@/contexts/CartContext";
import { Navbar } from "@/components/Navbar";
import { Providers } from "./providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Two Meskinz",
	description: "Two Meskinz Supa Store",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<CartProvider>
						{/* <AnnouncementBar />
					<Header /> */}
						<Navbar />

						<main className="min-h-screen">{children}</main>
						{/* <Footer /> */}
					</CartProvider>
				</Providers>
			</body>
		</html>
	);
}
