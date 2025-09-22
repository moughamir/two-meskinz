import Image from "next/image";
import { Button } from "@/components/ui/button";

const HeroSection: React.FC = () => {
  return (
    <section className="relative flex justify-center items-center bg-gray-100 w-full h-[60vh] text-center">
      <Image
        src="https://placehold.co/600x400/png"
        alt="Hero Banner"
        fill
        style={{ objectFit: "cover" }}
        className="z-0"
      />
      <div className="z-10 relative bg-black bg-opacity-40 p-8 rounded-lg text-white">
        <h1 className="mb-4 font-bold text-5xl">
          Discover Your Next Favorite Item
        </h1>
        <p className="mb-8 text-xl">
          Shop our exclusive collection of high-quality products.
        </p>
        <Button
          size="lg"
          className="bg-accent hover:bg-accent/90 px-8 py-4 text-white text-lg"
        >
          Shop Now
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
