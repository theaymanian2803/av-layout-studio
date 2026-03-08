import { HeroBanner } from "@/components/landing/HeroBanner";
import { CategoryBanner } from "@/components/landing/CategoryBanner";
import { ProductRow } from "@/components/landing/ProductRow";
import { BrandsStrip } from "@/components/landing/BrandsStrip";
import { FeaturedBrandSection } from "@/components/landing/FeaturedBrandSection";
import { PromoBanner } from "@/components/landing/PromoBanner";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroBanner />

      {/* Category Cards with Images */}
      <CategoryBanner />

      {/* Promo Deals Banner */}
      <PromoBanner />

      {/* Product Row: Cameras */}
      <ProductRow title="📷 Cameras" category="Cameras" />

      {/* Product Row: Audio */}
      <ProductRow title="🎙 Audio Gear" category="Audio" />

      {/* Brands Strip */}
      <BrandsStrip />

      {/* Shop by Brand with Tab Selector */}
      <FeaturedBrandSection />

      {/* Product Row: Lenses */}
      <ProductRow title="🔘 Lenses" category="Lenses" />

      {/* Product Row: Lighting */}
      <ProductRow title="💡 Lighting" category="Lighting" />

      {/* Product Row: Accessories */}
      <ProductRow title="🛠 Accessories" category="Accessories" />
    </div>
  );
};

export default Index;
