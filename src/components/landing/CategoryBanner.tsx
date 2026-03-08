import { Link } from "react-router-dom";
import { useBrandsAndCategories } from "@/hooks/useProducts";
import { Camera, CircleDot, Mic, Lightbulb, Wrench, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

const categoryMeta: Record<string, { icon: React.ReactNode; gradient: string; image: string }> = {
  Cameras: {
    icon: <Camera className="h-8 w-8" />,
    gradient: "from-primary/80 to-primary/40",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=250&fit=crop",
  },
  Lenses: {
    icon: <CircleDot className="h-8 w-8" />,
    gradient: "from-emerald-600/80 to-emerald-500/40",
    image: "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=400&h=250&fit=crop",
  },
  Audio: {
    icon: <Mic className="h-8 w-8" />,
    gradient: "from-violet-600/80 to-violet-500/40",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=250&fit=crop",
  },
  Lighting: {
    icon: <Lightbulb className="h-8 w-8" />,
    gradient: "from-amber-600/80 to-amber-500/40",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=250&fit=crop",
  },
  Accessories: {
    icon: <Wrench className="h-8 w-8" />,
    gradient: "from-rose-600/80 to-rose-500/40",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=250&fit=crop",
  },
  Phones: {
    icon: <Smartphone className="h-8 w-8" />,
    gradient: "from-cyan-600/80 to-cyan-500/40",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=250&fit=crop",
  },
};

const defaultMeta = {
  icon: <Wrench className="h-8 w-8" />,
  gradient: "from-gray-600/80 to-gray-500/40",
  image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=250&fit=crop",
};

export const CategoryBanner = () => {
  const { categories } = useBrandsAndCategories();

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat: any, i: number) => {
          const meta = categoryMeta[cat.name] || defaultMeta;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={`/catalog?category=${cat.name}`}
                className="group relative block rounded-xl overflow-hidden aspect-[4/3] border hover:border-primary/50 transition-all"
              >
                <img
                  src={meta.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${meta.gradient} to-transparent`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  {meta.icon}
                  <span className="mt-2 text-sm font-bold uppercase tracking-wider text-center">{cat.name}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
