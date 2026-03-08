import { Link } from "react-router-dom";
import { categories } from "@/data/products";
import { Camera, Mic, Lightbulb, Wrench, CircleDot } from "lucide-react";
import { motion } from "framer-motion";

const icons: Record<string, React.ReactNode> = {
  Cameras: <Camera className="h-6 w-6" />,
  Lenses: <CircleDot className="h-6 w-6" />,
  Audio: <Mic className="h-6 w-6" />,
  Lighting: <Lightbulb className="h-6 w-6" />,
  Accessories: <Wrench className="h-6 w-6" />,
};

export const CategoryShowcase = () => (
  <div className="p-6">
    <h2 className="text-xl font-bold mb-4">Shop by Category</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {categories.map((cat, i) => (
        <motion.div key={cat.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
          <Link
            to={`/catalog?category=${cat.name}`}
            className="flex flex-col items-center gap-2 p-5 rounded-lg border hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <div className="text-muted-foreground group-hover:text-primary transition-colors">
              {icons[cat.name]}
            </div>
            <span className="text-sm font-medium">{cat.name}</span>
            <span className="text-xs text-muted-foreground">{cat.subcategories.length} types</span>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
);
