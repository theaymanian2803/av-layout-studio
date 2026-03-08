import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [placed, setPlaced] = useState(false);

  if (placed) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
        <p className="text-muted-foreground mb-6">This is a mock checkout. No payment was processed.</p>
        <Button asChild><Link to="/">Continue Shopping</Link></Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Cart is empty</h1>
        <Button asChild><Link to="/catalog">Browse Products</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link to="/catalog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" /> Continue Shopping
      </Link>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-6">
          <div className="space-y-4">
            <h2 className="font-semibold">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><Label htmlFor="fname">First Name</Label><Input id="fname" placeholder="John" /></div>
              <div><Label htmlFor="lname">Last Name</Label><Input id="lname" placeholder="Doe" /></div>
            </div>
            <div><Label htmlFor="address">Address</Label><Input id="address" placeholder="123 Main St" /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label htmlFor="city">City</Label><Input id="city" placeholder="City" /></div>
              <div><Label htmlFor="state">State</Label><Input id="state" placeholder="CA" /></div>
              <div><Label htmlFor="zip">Zip</Label><Input id="zip" placeholder="90001" /></div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold">Payment (Mock)</h2>
            <div><Label htmlFor="card">Card Number</Label><Input id="card" placeholder="4242 4242 4242 4242" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label htmlFor="exp">Expiry</Label><Input id="exp" placeholder="12/28" /></div>
              <div><Label htmlFor="cvc">CVC</Label><Input id="cvc" placeholder="123" /></div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-lg border bg-card p-5 sticky top-20">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="truncate mr-2">{item.product.name} ×{item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>${totalPrice.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm text-muted-foreground"><span>Shipping</span><span>Free</span></div>
            <Separator className="my-3" />
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-accent">${totalPrice.toLocaleString()}</span></div>
            <Button className="w-full mt-4" size="lg" onClick={() => { setPlaced(true); clearCart(); }}>
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
