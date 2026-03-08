import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ChevronLeft, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
        <Button asChild>
          <Link to="/catalog">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link to="/catalog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4 mr-1" /> Continue Shopping
      </Link>

      <h1 className="text-3xl font-black mb-8">Shopping Cart <span className="text-muted-foreground font-medium text-lg">({totalItems} {totalItems === 1 ? "item" : "items"})</span></h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header row */}
          <div className="hidden md:grid grid-cols-12 gap-4 text-xs uppercase tracking-wider text-muted-foreground font-bold px-4 pb-2">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <Separator />

          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-12 gap-4 items-center p-4 rounded-xl border bg-card hover:border-primary/20 transition-all"
              >
                {/* Product info */}
                <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                  <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">{item.product.brand}</p>
                    <Link to={`/product/${item.product.id}`} className="text-sm font-semibold hover:text-primary transition-colors line-clamp-2">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.product.category}</p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-span-4 md:col-span-2 flex items-center justify-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Unit price */}
                <div className="col-span-4 md:col-span-2 text-right">
                  <span className="text-sm text-muted-foreground">${(item.product.price ?? 0).toLocaleString()}</span>
                </div>

                {/* Line total + remove */}
                <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-2">
                  <span className="text-sm font-bold text-accent">${((item.product.price ?? 0) * item.quantity).toLocaleString()}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex justify-end pt-2">
            <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear Cart
            </Button>
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-card p-6 sticky top-24 space-y-5">
            <h2 className="text-lg font-bold">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                <span className="font-medium">${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-primary">Free</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-black">
              <span>Total</span>
              <span className="text-accent">${totalPrice.toLocaleString()}</span>
            </div>

            <Button className="w-full font-bold shadow-lg shadow-primary/25" size="lg" asChild>
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>

            {/* Trust badges */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Free shipping on orders over $99</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Secure checkout & payment</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <RotateCcw className="h-4 w-4 text-primary flex-shrink-0" />
                <span>30-day hassle-free returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
