import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { motion } from "framer-motion";

export const NewAudioGear = () => {
  const { data: products = [] } = useProducts();
  const audio = products.filter(p => p.category === "Audio");

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">New Audio Gear</h2>
      <div className="space-y-3">
        {audio.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={`/product/${p.id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors group">
              <img src={p.image} alt={p.name} className="w-16 h-16 rounded-md object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.brand} · {p.subcategory}</p>
              </div>
              <span className="text-accent font-bold text-sm">${p.price}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
