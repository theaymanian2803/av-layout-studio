import { Link } from "react-router-dom";
import { brands } from "@/data/products";
import { motion } from "framer-motion";

export const TopBrands = () => (
  <div className="p-6">
    <h2 className="text-xl font-bold mb-4">Top Brands</h2>
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {brands.slice(0, 6).map((brand, i) => (
        <motion.div key={brand} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Link
            to={`/catalog?brand=${brand}`}
            className="flex items-center justify-center h-16 rounded-lg border bg-secondary/50 hover:bg-primary/10 hover:border-primary/30 transition-all text-sm font-semibold"
          >
            {brand}
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
);
