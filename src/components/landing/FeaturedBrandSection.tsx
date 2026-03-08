import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";
import { useBrandsAndCategories } from "@/hooks/useProducts";

export const FeaturedBrandSection = () => {
  const { brands } = useBrandsAndCategories();
  const { data: allProducts = [] } = useProducts();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const activeBrand = selectedBrand || (brands.length > 0 ? brands[0].name : "");
  const brandProducts = allProducts.filter(p => p.brand === activeBrand).slice(0, 6);

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Shop by Brand</h2>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-6">
        {brands.slice(0, 8).map((brand: any) => (
          <button
            key={brand.id}
            onClick={() => setSelectedBrand(brand.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${
              activeBrand === brand.name
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/30"
            }`}
          >
            {brand.name}
          </button>
        ))}
      </div>

      {brandProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {brandProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/product/${p.id}`}
                className="group block rounded-xl border bg-card overflow-hidden hover:border-primary/30 transition-all"
              >
                <div className="aspect-square bg-muted overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.subcategory}</p>
                  <p className="text-sm font-semibold truncate mt-0.5">{p.name}</p>
                  <span className="text-accent font-bold text-sm">${(p.price ?? 0).toLocaleString()}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">No products for this brand yet.</p>
      )}

      <div className="text-center mt-6">
        <Button variant="outline" asChild>
          <Link to={`/catalog?brand=${activeBrand}`}>View All {activeBrand} Products</Link>
        </Button>
      </div>
    </section>
  );
};
