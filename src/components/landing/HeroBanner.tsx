import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const HeroBanner = () => {
  const { data: products = [] } = useProducts();
  const featured = products.filter(p => p.rating >= 4.7).slice(0, 3);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % featured.length), 5000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const product = featured[current];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 py-10 md:py-16 min-h-[320px]">
          <div className="flex-1 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">{product.brand}</p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-3">{product.name}</h2>
                <p className="text-muted-foreground max-w-md mb-4 text-sm md:text-base">{product.description}</p>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-2xl md:text-3xl font-bold text-accent">${product.price.toLocaleString()}</span>
                  {product.original_price && (
                    <span className="text-lg text-muted-foreground line-through">${product.original_price.toLocaleString()}</span>
                  )}
                </div>
                <Button size="lg" asChild>
                  <Link to={`/product/${product.id}`}>Shop Now</Link>
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex-1 flex justify-center relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={product.id}
                src={product.image}
                alt={product.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-2xl shadow-2xl"
              />
            </AnimatePresence>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setCurrent(prev => (prev - 1 + featured.length) % featured.length)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-1.5">
              {featured.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setCurrent(prev => (prev + 1) % featured.length)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
