import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { DbProduct } from "@/hooks/useProducts";

const WishlistSection = () => {
  const { user } = useAuth();
  const { wishlistItems, isLoading, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5" /> Wishlist</CardTitle>
          <CardDescription>Products you've saved for later</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground text-sm mb-3">Your wishlist is empty</p>
              <Button variant="link" asChild>
                <Link to="/catalog">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {wishlistItems.map((item: any) => {
                const product = item.products as DbProduct;
                if (!product) return null;
                return (
                  <div key={item.id} className="border rounded-lg p-3 flex gap-3 hover:border-primary/30 transition-colors">
                    <Link to={`/product/${product.id}`} className="flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-16 h-16 rounded-md object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${product.id}`} className="text-sm font-semibold hover:text-primary transition-colors line-clamp-1">{product.name}</Link>
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                      <p className="text-sm font-bold text-accent">${product.price.toLocaleString()}</p>
                      <div className="flex gap-1.5 mt-1.5">
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => addItem(product)}>
                          <ShoppingCart className="h-3 w-3 mr-1" /> Add to Cart
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground hover:text-destructive" onClick={() => toggleWishlist(product.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WishlistSection;
