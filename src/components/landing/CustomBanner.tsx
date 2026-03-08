import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LandingSection } from "@/hooks/useLandingSections";

interface CustomBannerProps {
  section: LandingSection;
}

export const CustomBanner = ({ section }: CustomBannerProps) => {
  const config = section.config as Record<string, any>;
  const ctaText = config?.cta_text || "Shop Now";
  const ctaLink = config?.cta_link || "/catalog";
  const overlayOpacity = config?.overlay_opacity ?? 0.5;

  return (
    <section className="relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative min-h-[260px] md:min-h-[360px] flex items-center"
      >
        {/* Background image */}
        {section.image_url && (
          <img
            src={section.image_url}
            alt={section.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0 bg-background"
          style={{ opacity: overlayOpacity }}
        />

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-3">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-md">
                {section.subtitle}
              </p>
            )}
            <Button size="lg" asChild>
              <Link to={ctaLink}>{ctaText}</Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
