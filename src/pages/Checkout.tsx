import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, CheckCircle2, Loader2, Banknote, Wallet, MapPin, CreditCard, XCircle, Tag } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface SavedAddress {
  id: string;
  label: string;
  full_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

interface SavedPayment {
  id: string;
  card_brand: string;
  cardholder_name: string;
  is_default: boolean;
}

const checkoutPaymentOptions = [
  { id: "paypal", label: "PayPal", icon: <Wallet className="h-5 w-5" />, description: "Pay securely with your PayPal account" },
  { id: "cod", label: "Cash on Delivery", icon: <Banknote className="h-5 w-5" />, description: "Pay when your order arrives" },
];

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [placed, setPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount_type: string; discount_value: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const captureAttempted = useRef(false);

  const discount = appliedCoupon
    ? appliedCoupon.discount_type === "percentage"
      ? totalPrice * (appliedCoupon.discount_value / 100)
      : appliedCoupon.discount_value
    : 0;
  const finalPrice = Math.max(0, totalPrice - discount);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase().trim())
        .eq("active", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) { toast.error("Invalid coupon code"); return; }
      if (data.expires_at && new Date(data.expires_at) < new Date()) { toast.error("Coupon has expired"); return; }
      if (data.max_uses !== null && data.used_count >= data.max_uses) { toast.error("Coupon usage limit reached"); return; }
      if (data.min_order_amount && totalPrice < data.min_order_amount) { toast.error(`Minimum order $${data.min_order_amount} required`); return; }
      setAppliedCoupon({ code: data.code, discount_type: data.discount_type, discount_value: data.discount_value });
      toast.success(`Coupon "${data.code}" applied!`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  // Saved data
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [savedPayments, setSavedPayments] = useState<SavedPayment[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("new");

  const [form, setForm] = useState({
    fname: "", lname: "", address: "", city: "", state: "", zip: "",
  });

  const updateField = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }));

  // Handle PayPal return — capture the order
  useEffect(() => {
    const paypalToken = searchParams.get("token");
    const paypalStatus = searchParams.get("paypal");

    if (paypalStatus === "cancel") {
      toast.error("PayPal payment was cancelled.");
      return;
    }

    if (paypalToken && !captureAttempted.current) {
      captureAttempted.current = true;
      const pendingOrderId = sessionStorage.getItem("pending_order_id");

      const capturePayment = async () => {
        setSubmitting(true);
        try {
          const { data, error } = await supabase.functions.invoke("paypal", {
            body: { action: "capture-order", order_id: paypalToken },
          });

          if (error) throw new Error(error.message);

          if (data?.status === "COMPLETED") {
            // Update order status
            if (pendingOrderId) {
              await supabase.from("orders").update({ status: "paid" }).eq("id", pendingOrderId);
              // Send confirmation email (fire-and-forget)
              supabase.functions.invoke("send-order-email", {
                body: { order_id: pendingOrderId },
              }).catch(err => console.error("Email send error:", err));
            }
            setOrderId(pendingOrderId);
            setPlaced(true);
            clearCart();
            sessionStorage.removeItem("pending_order_id");
            sessionStorage.removeItem("pending_cart");
            toast.success("Payment successful!");
          } else {
            toast.error("Payment could not be completed. Please try again.");
          }
        } catch (err: any) {
          console.error("PayPal capture error:", err);
          toast.error(err.message || "Failed to capture PayPal payment.");
        } finally {
          setSubmitting(false);
        }
      };

      capturePayment();
    }
  }, [searchParams, clearCart]);

  // Fetch saved addresses & payment methods
  useEffect(() => {
    if (!user) return;

    const fetchSaved = async () => {
      const [addrRes, payRes] = await Promise.all([
        supabase.from("shipping_addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false }),
        supabase.from("payment_methods").select("*").eq("user_id", user.id).order("is_default", { ascending: false }),
      ]);

      const addresses = (addrRes.data as SavedAddress[]) || [];
      const payments = (payRes.data as SavedPayment[]) || [];

      setSavedAddresses(addresses);
      setSavedPayments(payments);

      const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        applyAddress(defaultAddr);
      }

      const defaultPay = payments.find(p => p.is_default) || payments[0];
      if (defaultPay) {
        setSelectedPaymentId(defaultPay.id);
        setPaymentMethod(defaultPay.card_brand === "PayPal" ? "paypal" : "cod");
      }
    };

    fetchSaved();
  }, [user]);

  const applyAddress = (addr: SavedAddress) => {
    const nameParts = addr.full_name.split(" ");
    setForm({
      fname: nameParts[0] || "",
      lname: nameParts.slice(1).join(" ") || "",
      address: addr.address_line1 + (addr.address_line2 ? `, ${addr.address_line2}` : ""),
      city: addr.city,
      state: addr.state,
      zip: addr.postal_code,
    });
  };

  const handleAddressChange = (value: string) => {
    setSelectedAddressId(value);
    if (value === "new") {
      setForm({ fname: "", lname: "", address: "", city: "", state: "", zip: "" });
    } else {
      const addr = savedAddresses.find(a => a.id === value);
      if (addr) applyAddress(addr);
    }
  };

  const handlePaymentChange = (value: string) => {
    setSelectedPaymentId(value);
    if (value !== "new") {
      const pay = savedPayments.find(p => p.id === value);
      if (pay) setPaymentMethod(pay.card_brand === "PayPal" ? "paypal" : "cod");
    }
  };

  const placeOrder = async () => {
    if (!user) {
      toast.error("Please sign in to place an order.");
      navigate("/auth");
      return;
    }

    const { fname, lname, address, city, state, zip } = form;
    if (!fname || !lname || !address || !city || !state || !zip) {
      toast.error("Please fill in all shipping fields.");
      return;
    }

    setSubmitting(true);
    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total: finalPrice,
          status: paymentMethod === "cod" ? "pending_cod" : "pending_paypal",
          shipping_address: { fname, lname, address, city, state, zip, payment_method: paymentMethod },
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      // Increment coupon usage
      if (appliedCoupon) {
        const { data: coupon } = await supabase.from("coupons").select("used_count").eq("code", appliedCoupon.code).maybeSingle();
        if (coupon) {
          await supabase.from("coupons").update({ used_count: coupon.used_count + 1 }).eq("code", appliedCoupon.code);
        }
      }

      // COD — done immediately
      if (paymentMethod === "cod") {
        setOrderId(order.id);
        setPlaced(true);
        clearCart();
        toast.success("Order placed successfully!");
        return;
      }

      // PayPal — create PayPal order and redirect
      const currentUrl = window.location.origin + "/checkout";
      const { data: paypalData, error: paypalError } = await supabase.functions.invoke("paypal", {
        body: {
          action: "create-order",
          amount: finalPrice.toFixed(2),
          return_url: `${currentUrl}?paypal=success`,
          cancel_url: `${currentUrl}?paypal=cancel`,
        },
      });

      if (paypalError) throw new Error(paypalError.message);

      if (paypalData?.approve_url) {
        // Save order id so we can update it after capture
        sessionStorage.setItem("pending_order_id", order.id);
        // Redirect to PayPal
        window.location.href = paypalData.approve_url;
      } else {
        toast.error("Could not get PayPal approval URL. Please try again.");
        // Revert order status
        await supabase.from("orders").update({ status: "payment_failed" }).eq("id", order.id);
      }
    } catch (err: any) {
      console.error("Order error:", err);
      toast.error(err.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state while capturing PayPal payment
  if (submitting && searchParams.get("token")) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
        <h1 className="text-2xl font-bold mb-2">Processing Payment...</h1>
        <p className="text-muted-foreground">Please wait while we confirm your PayPal payment.</p>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
        <p className="text-muted-foreground mb-1">
          {paymentMethod === "cod" ? "Your order will be delivered. Pay upon arrival." : "Your PayPal payment has been confirmed!"}
        </p>
        {orderId && <p className="text-xs text-muted-foreground mb-6 font-mono">Order ID: {orderId.slice(0, 8)}…</p>}
        <div className="flex gap-3 justify-center">
          <Button asChild><Link to="/">Continue Shopping</Link></Button>
          <Button variant="outline" asChild><Link to="/account">View Orders</Link></Button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !searchParams.get("token")) {
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

      {!user && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 mb-6">
          <p className="text-sm">
            <Link to="/auth" className="text-primary font-medium hover:underline">Sign in</Link> to place your order and track it later.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-6">
          {/* Shipping */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4" /> Shipping Address</h2>
              {savedAddresses.length > 0 && (
                <Link to="/account" className="text-xs text-primary hover:underline">Manage</Link>
              )}
            </div>

            {savedAddresses.length > 0 && (
              <Select value={selectedAddressId} onValueChange={handleAddressChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a saved address" />
                </SelectTrigger>
                <SelectContent>
                  {savedAddresses.map(addr => (
                    <SelectItem key={addr.id} value={addr.id}>
                      {addr.label} — {addr.full_name}, {addr.city}
                      {addr.is_default ? " ★" : ""}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">+ Enter new address</SelectItem>
                </SelectContent>
              </Select>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div><Label htmlFor="fname">First Name</Label><Input id="fname" placeholder="John" value={form.fname} onChange={e => updateField("fname", e.target.value)} /></div>
              <div><Label htmlFor="lname">Last Name</Label><Input id="lname" placeholder="Doe" value={form.lname} onChange={e => updateField("lname", e.target.value)} /></div>
            </div>
            <div><Label htmlFor="address">Address</Label><Input id="address" placeholder="123 Main St" value={form.address} onChange={e => updateField("address", e.target.value)} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label htmlFor="city">City</Label><Input id="city" placeholder="City" value={form.city} onChange={e => updateField("city", e.target.value)} /></div>
              <div><Label htmlFor="state">State</Label><Input id="state" placeholder="CA" value={form.state} onChange={e => updateField("state", e.target.value)} /></div>
              <div><Label htmlFor="zip">Zip</Label><Input id="zip" placeholder="90001" value={form.zip} onChange={e => updateField("zip", e.target.value)} /></div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment Method</h2>
              {savedPayments.length > 0 && (
                <Link to="/account" className="text-xs text-primary hover:underline">Manage</Link>
              )}
            </div>

            {savedPayments.length > 0 && (
              <Select value={selectedPaymentId} onValueChange={handlePaymentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a saved payment method" />
                </SelectTrigger>
                <SelectContent>
                  {savedPayments.map(pay => (
                    <SelectItem key={pay.id} value={pay.id}>
                      {pay.card_brand === "PayPal" ? "PayPal" : "Cash on Delivery"} — {pay.cardholder_name}
                      {pay.is_default ? " ★" : ""}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">+ Choose manually</SelectItem>
                </SelectContent>
              </Select>
            )}

            {(savedPayments.length === 0 || selectedPaymentId === "new") && (
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                {checkoutPaymentOptions.map(method => (
                  <label
                    key={method.id}
                    htmlFor={method.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className={`p-2 rounded-lg ${paymentMethod === method.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{method.label}</p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            )}

            {paymentMethod === "paypal" && (
              <div className="rounded-lg border border-dashed border-muted-foreground/30 p-4 text-center">
                <Wallet className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">You'll be redirected to PayPal to complete your payment securely.</p>
              </div>
            )}

            {paymentMethod === "cod" && (
              <div className="rounded-lg border border-dashed border-muted-foreground/30 p-4 text-center">
                <Banknote className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Pay with cash when your order is delivered to your door.</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-2">
          <div className="rounded-lg border bg-card p-5 sticky top-20">
            <h2 className="font-semibold mb-4">Your Items ({items.length})</h2>
            
            {/* Product cards with images */}
            <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-3 p-2 rounded-lg bg-muted/30">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                      <span className="text-sm font-semibold">${(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-3" />

            {/* Coupon Code */}
            <div className="mb-3">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-500/10 rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-500">{appliedCoupon.code}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setAppliedCoupon(null)}>Remove</Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input placeholder="Coupon code" value={couponCode} onChange={e => setCouponCode(e.target.value)} className="h-9 text-sm" />
                  <Button variant="outline" size="sm" onClick={applyCoupon} disabled={couponLoading} className="h-9 shrink-0">
                    {couponLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Apply"}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-between text-sm"><span>Subtotal</span><span>${totalPrice.toLocaleString()}</span></div>
            {appliedCoupon && (
              <div className="flex justify-between text-sm text-green-500">
                <span>Discount ({appliedCoupon.discount_type === "percentage" ? `${appliedCoupon.discount_value}%` : `$${appliedCoupon.discount_value}`})</span>
                <span>-${discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-muted-foreground"><span>Shipping</span><span>Free</span></div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Payment</span>
              <span className="capitalize">{paymentMethod === "cod" ? "Cash on Delivery" : "PayPal"}</span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-accent">${finalPrice.toLocaleString()}</span></div>
            <Button className="w-full mt-4" size="lg" onClick={placeOrder} disabled={submitting}>
              {submitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing…</>
              ) : paymentMethod === "paypal" ? (
                <><Wallet className="h-4 w-4 mr-2" /> Pay with PayPal</>
              ) : (
                "Place Order"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
