"use client";

import HeroSection from "@/components/bloc/HeroSection";

import ProductList from "@/components/ProductList";

export default function Home() {
	return (
		<div className="justify-items-center items-center gap-16 grid grid-rows-[20px_1fr_20px] p-8 sm:p-20 pb-20 min-h-screen font-sans">
			<main className="flex flex-col items-center sm:items-start gap-[32px] row-start-2">
				<HeroSection />

				<section className="mx-auto mt-16 w-full max-w-6xl">
					<h2 className="mb-8 font-bold text-3xl text-center">
						Featured Products
					</h2>

					<ProductList />
				</section>
			</main>
		</div>
	);
}
