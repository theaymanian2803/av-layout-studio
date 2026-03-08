import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const PromoBanner = () => {
  const { data: products = [] } = useProducts();
  const deals = products.filter(p => p.original_price).slice(0, 2);

  if (deals.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="grid md:grid-cols-2 gap-4">
        {deals.map((deal, i) => {
          const discount = Math.round(((deal.original_price! - deal.price) / deal.original_price!) * 100);
          return (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/product/${deal.id}`}
                className="relative flex items-center gap-6 p-6 rounded-2xl border bg-gradient-to-r from-accent/10 to-card overflow-hidden group hover:border-accent/40 transition-all"
              >
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
                <div>
                  <Badge className="bg-accent text-accent-foreground mb-2">-{discount}% OFF</Badge>
                  <h3 className="text-lg md:text-xl font-bold">{deal.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{deal.brand}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-2xl font-bold text-accent">${deal.price.toLocaleString()}</span>
                    <span className="text-muted-foreground line-through">${deal.original_price!.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
