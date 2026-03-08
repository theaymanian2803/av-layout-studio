import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { LandingSection } from "@/hooks/useLandingSections";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroConfig {
  type?: string;
  headline?: string;
  description?: string;
  cta_text?: string;
  cta_link?: string;
  hero_image?: string;
  product_ids?: string;
}

interface HeroBannerProps {
  section: LandingSection;
}

export const HeroBanner = ({ section }: HeroBannerProps) => {
  const { data: products = [] } = useProducts();
  const [current, setCurrent] = useState(0);

  const config = (section.config || {}) as HeroConfig;

  // Get featured products - use config product_ids if provided, otherwise top-rated
  let featured = products.filter(p => p.rating >= 4.7).slice(0, 3);
  
  if (config.product_ids) {
    const ids = config.product_ids.split(",").map(id => id.trim());
    const configProducts = ids
      .map(id => products.find(p => p.id === id))
      .filter(Boolean);
    if (configProducts.length > 0) {
      featured = configProducts as typeof featured;
    }
  }

  // If no products but we have a custom hero image, show that
  const hasCustomContent = config.headline || config.hero_image;
  
  if (featured.length === 0 && !hasCustomContent) return null;

  const product = featured[current] || featured[0];
  const discount = product?.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  // Use config values with fallbacks
  const headline = config.headline || product?.name || section.title;
  const description = config.description || product?.description || section.subtitle || "";
  const ctaText = config.cta_text || "Shop Now";
  const ctaLink = config.cta_link || (product ? `/product/${product.id}` : "/catalog");
  const heroImage = config.hero_image || product?.image || section.image_url || "";

  return (
    <section className="relative overflow-hidden bg-background min-h-[480px] md:min-h-[560px]">
      {/* Accent shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      <div className="absolute top-20 left-[10%] w-24 h-24 border-2 border-primary/20 rounded-full pointer-events-none" />
      <div className="absolute bottom-16 right-[15%] w-16 h-16 border-2 border-accent/20 rotate-45 pointer-events-none" />
      <div className="absolute top-1/2 left-[5%] w-2 h-2 rounded-full bg-primary/40 pointer-events-none" />
      <div className="absolute top-1/3 right-[8%] w-3 h-3 rounded-full bg-accent/40 pointer-events-none" />

      {/* Diagonal accent bar */}
      <div className="absolute -bottom-10 -right-10 w-[300px] h-[300px] bg-gradient-to-br from-primary/20 to-accent/20 rotate-12 rounded-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 py-12 md:py-20">
          {/* Text side */}
          <div className="flex-1 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={product?.id || section.id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.5 }}
              >
                {/* Brand tag */}
                {product && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{product.brand}</span>
                  </motion.div>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-4">
                  <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text">
                    {headline}
                  </span>
                </h1>

                {/* Description */}
                {description && (
                  <p className="text-muted-foreground max-w-lg mb-6 text-sm md:text-base leading-relaxed">
                    {description}
                  </p>
                )}

                {/* Rating - only show if product exists */}
                {product && (
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.round(product.rating) ? "text-accent fill-accent" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {product.rating} ({product.review_count} reviews)
                    </span>
                  </div>
                )}

                {/* Price block - only show if product exists */}
                {product && (
                  <div className="flex items-end gap-3 mb-8">
                    <span className="text-4xl md:text-5xl font-black text-foreground">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.original_price && (
                      <>
                        <span className="text-xl text-muted-foreground line-through mb-1">
                          ${product.original_price.toLocaleString()}
                        </span>
                        <span className="text-sm font-bold text-accent bg-accent/10 px-2 py-1 rounded-md mb-1">
                          -{discount}%
                        </span>
                      </>
                    )}
                  </div>
                )}

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="px-8 font-bold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow" asChild>
                    <Link to={ctaLink}>
                      <ShoppingCart className="h-5 w-5 mr-2" /> {ctaText}
                    </Link>
                  </Button>
                  {product && (
                    <Button size="lg" variant="outline" className="px-8 font-bold text-base border-2" asChild>
                      <Link to={`/product/${product.id}`}>View Details</Link>
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Image side — triangle clip design */}
          <div className="flex-1 flex justify-center items-center relative min-h-[360px] md:min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={product?.id || section.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="relative w-[340px] h-[400px] md:w-[480px] md:h-[540px]"
              >
                {/* Main image — diagonal triangle cut */}
                {heroImage && (
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: "polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)" }}
                  >
                    <img
                      src={heroImage}
                      alt={headline}
                      className="w-full h-full object-cover scale-105"
                    />
                  </div>
                )}

                {/* Accent triangle — top-left corner */}
                <div
                  className="absolute -top-2 -left-2 w-[120px] h-[120px] md:w-[160px] md:h-[160px] bg-gradient-to-br from-primary to-primary/60"
                  style={{ clipPath: "polygon(0% 0%, 100% 0%, 0% 100%)" }}
                />

                {/* Accent triangle — bottom-right corner */}
                <div
                  className="absolute -bottom-2 -right-2 w-[100px] h-[100px] md:w-[140px] md:h-[140px] bg-gradient-to-tl from-accent to-accent/60"
                  style={{ clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)" }}
                />

                {/* Thin border outline offset */}
                <div
                  className="absolute top-2 left-2 right-[-4px] bottom-[-4px] border-2 border-primary/15 pointer-events-none"
                  style={{ clipPath: "polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)" }}
                />

                {/* Floating badge */}
                {product && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="absolute bottom-6 left-6 bg-accent text-accent-foreground px-4 py-2 rounded-xl font-black text-sm shadow-lg shadow-accent/30 z-10"
                  >
                    {product.in_stock ? "IN STOCK" : "SOLD OUT"}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation dots and arrows - only show if multiple products */}
        {featured.length > 1 && (
          <div className="flex items-center justify-center gap-4 pb-8 relative z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-all"
              onClick={() => setCurrent(prev => (prev - 1 + featured.length) % featured.length)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              {featured.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-10 bg-gradient-to-r from-primary to-accent"
                      : "w-2.5 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-all"
              onClick={() => setCurrent(prev => (prev + 1) % featured.length)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
