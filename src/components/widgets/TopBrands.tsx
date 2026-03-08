import { Link } from "react-router-dom";
import { useBrandsAndCategories } from "@/hooks/useProducts";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const TopBrands = () => {
  const { brands, isLoading } = useBrandsAndCategories();

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Top Brands</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {brands.slice(0, 6).map((brand: any, i: number) => (
          <motion.div key={brand.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link
              to={`/catalog?brand=${brand.name}`}
              className="flex items-center justify-center h-16 rounded-lg border bg-secondary/50 hover:bg-primary/10 hover:border-primary/30 transition-all text-sm font-semibold"
            >
              {brand.name}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
