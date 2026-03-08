import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, Navigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { DbProduct } from "@/hooks/useProducts";
import { motion } from "framer-motion";

const Favorites = () => {
  const { user } = useAuth();
  const { wishlistItems, isLoading, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Heart className="h-6 w-6 text-destructive" /> My Favorites
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border bg-card overflow-hidden">
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/20" />
          <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-6">Start browsing and save products you love</p>
          <Button asChild>
            <Link to="/catalog">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {wishlistItems.map((item: any, i: number) => {
            const product = item.products as DbProduct;
            if (!product) return null;
            const discount = product.original_price && product.price
              ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
              : 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group relative"
              >
                <Link
                  to={`/product/${product.id}`}
                  className="block rounded-xl border bg-card overflow-hidden hover:border-primary/30 transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {discount > 0 && (
                      <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px]">
                        -{discount}%
                      </Badge>
                    )}
                    {!product.in_stock && (
                      <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{product.brand}</p>
                    <p className="text-sm font-semibold truncate mt-0.5">{product.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-accent font-bold">${product.price.toLocaleString()}</span>
                      {product.original_price != null && (
                        <span className="text-xs text-muted-foreground line-through">${product.original_price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1 text-xs"
                    onClick={() => addItem(product)}
                    disabled={!product.in_stock}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" /> Add to Cart
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favorites;
