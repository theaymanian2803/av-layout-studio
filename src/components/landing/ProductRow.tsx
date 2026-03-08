import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { DbProduct } from "@/hooks/useProducts";
import { useRef, useState } from "react";

interface ProductRowProps {
  title: string;
  category?: string;
  filter?: (products: DbProduct[]) => DbProduct[];
  maxItems?: number;
}

export const ProductRow = ({ title, category, filter, maxItems = 6 }: ProductRowProps) => {
  const { data: allProducts = [] } = useProducts();
  const { addItem } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);

  let products = allProducts;
  if (category) products = products.filter(p => p.category === category);
  if (filter) products = filter(products);
  products = products.slice(0, maxItems);

  if (products.length === 0) return null;

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        {category && (
          <Link to={`/catalog?category=${category}`} className="text-sm text-primary hover:underline flex items-center gap-1">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <div className="relative group">
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory justify-center">
          {products.map((p, i) => {
            const discount = p.original_price && p.price
              ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
              : 0;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="min-w-[200px] max-w-[220px] flex-shrink-0 snap-start"
              >
                <Link
                  to={`/product/${p.id}`}
                  className="group/card block rounded-xl border bg-card overflow-hidden hover:border-primary/30 transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                    />
                    {discount > 0 && (
                      <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px]">
                        -{discount}%
                      </Badge>
                    )}
                    {!p.in_stock && (
                      <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{p.brand}</p>
                    <p className="text-sm font-semibold truncate mt-0.5">{p.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-accent font-bold">${(p.price ?? 0).toLocaleString()}</span>
                      {p.original_price != null && (
                        <span className="text-xs text-muted-foreground line-through">${p.original_price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full mt-2 text-xs"
                  onClick={() => addItem(p as any)}
                  disabled={!p.in_stock}
                >
                  <ShoppingCart className="h-3 w-3 mr-1" /> Add to Cart
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
