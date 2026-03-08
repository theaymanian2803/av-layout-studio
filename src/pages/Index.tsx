import { HeroBanner } from "@/components/landing/HeroBanner";
import { CategoryBanner } from "@/components/landing/CategoryBanner";
import { ProductRow } from "@/components/landing/ProductRow";
import { BrandsStrip } from "@/components/landing/BrandsStrip";
import { FeaturedBrandSection } from "@/components/landing/FeaturedBrandSection";
import { PromoBanner } from "@/components/landing/PromoBanner";
import { CustomBanner } from "@/components/landing/CustomBanner";
import { useLandingSections, LandingSection } from "@/hooks/useLandingSections";
import { Loader2 } from "lucide-react";

const SectionRenderer = ({ section }: { section: LandingSection }) => {
  const type = (section.config as any)?.type;
  const category = (section.config as any)?.category;

  switch (type) {
    case "hero":
      return <HeroBanner section={section} />;
    case "categories":
      return <CategoryBanner />;
    case "promo":
      return <PromoBanner />;
    case "product_row":
      return <ProductRow title={section.title} category={category} />;
    case "brands_strip":
      return <BrandsStrip />;
    case "featured_brand":
      return <FeaturedBrandSection />;
    case "custom_banner":
      return <CustomBanner section={section} />;
    default:
      return null;
  }
};

const Index = () => {
  const { data: sections = [], isLoading } = useLandingSections();

  const hiddenTypes = ["promo_popup", "mega_menu"];
  const visibleSections = sections
    .filter((s) => s.visible && !hiddenTypes.includes((s.config as any)?.type))
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        visibleSections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))
      )}
    </div>
  );
};

export default Index;
