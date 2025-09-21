import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // Assuming Shadcn Button is available

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-[60vh] flex items-center justify-center text-center bg-gray-100">
      <Image
        src="/hero-banner.jpg" // Placeholder image
        alt="Hero Banner"
        fill
        style={{ objectFit: 'cover' }}
        className="z-0"
      />
      <div className="relative z-10 text-white p-8 bg-black bg-opacity-40 rounded-lg">
        <h1 className="text-5xl font-bold mb-4">Discover Your Next Favorite Item</h1>
        <p className="text-xl mb-8">Shop our exclusive collection of high-quality products.</p>
        <Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-4">
          Shop Now
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
