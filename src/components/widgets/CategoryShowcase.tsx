import { Link } from "react-router-dom";
import { useBrandsAndCategories } from "@/hooks/useProducts";
import { Camera, Mic, Lightbulb, Wrench, CircleDot, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const icons: Record<string, React.ReactNode> = {
  Cameras: <Camera className="h-6 w-6" />,
  Lenses: <CircleDot className="h-6 w-6" />,
  Audio: <Mic className="h-6 w-6" />,
  Lighting: <Lightbulb className="h-6 w-6" />,
  Accessories: <Wrench className="h-6 w-6" />,
  Phones: <Smartphone className="h-6 w-6" />,
};

export const CategoryShowcase = () => {
  const { categories, subcategories, isLoading } = useBrandsAndCategories();

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const getSubCount = (catId: string) => subcategories.filter((s: any) => s.category_id === catId).length;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {categories.map((cat: any, i: number) => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link
              to={`/catalog?category=${cat.name}`}
              className="flex flex-col items-center gap-2 p-5 rounded-lg border hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <div className="text-muted-foreground group-hover:text-primary transition-colors">
                {icons[cat.name] || <Wrench className="h-6 w-6" />}
              </div>
              <span className="text-sm font-medium">{cat.name}</span>
              <span className="text-xs text-muted-foreground">{getSubCount(cat.id)} types</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
