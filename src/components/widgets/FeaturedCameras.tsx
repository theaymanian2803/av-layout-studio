import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export const FeaturedCameras = () => {
  const { data: products = [] } = useProducts();
  const featured = products.filter(p => p.category === "Cameras").slice(0, 4);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Featured Cameras</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {featured.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={`/product/${p.id}`} className="group block">
              <div className="aspect-square rounded-md overflow-hidden bg-muted mb-2">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <p className="text-sm font-medium truncate">{p.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-accent font-bold">${p.price.toLocaleString()}</span>
                {p.original_price && <span className="text-xs text-muted-foreground line-through">${p.original_price.toLocaleString()}</span>}
              </div>
              {!p.in_stock && <Badge variant="destructive" className="mt-1 text-xs">Out of Stock</Badge>}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
