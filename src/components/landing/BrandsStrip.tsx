import { Link } from "react-router-dom";
import { useBrandsAndCategories } from "@/hooks/useProducts";
import { motion } from "framer-motion";

export const BrandsStrip = () => {
  const { brands } = useBrandsAndCategories();

  return (
    <section className="border-y bg-card/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide pb-1">
          {brands.map((brand: any, i: number) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/catalog?brand=${brand.name}`}
                className="flex items-center justify-center min-w-[120px] h-14 px-6 rounded-lg border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all text-sm font-bold whitespace-nowrap"
              >
                {brand.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
