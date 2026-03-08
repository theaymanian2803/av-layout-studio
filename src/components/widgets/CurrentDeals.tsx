import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const deals = products.filter(p => p.originalPrice);

export const CurrentDeals = () => (
  <div className="p-6">
    <h2 className="text-xl font-bold mb-4">🔥 Current Deals</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {deals.map((p, i) => {
        const discount = Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100);
        return (
          <motion.div key={p.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
            <Link to={`/product/${p.id}`} className="flex gap-4 p-4 rounded-lg border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors">
              <img src={p.image} alt={p.name} className="w-20 h-20 rounded-md object-cover" />
              <div>
                <p className="font-medium text-sm">{p.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-accent font-bold">${p.price.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground line-through">${p.originalPrice!.toLocaleString()}</span>
                  <Badge className="bg-accent text-accent-foreground text-xs">-{discount}%</Badge>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  </div>
);
