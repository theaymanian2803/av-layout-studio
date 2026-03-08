import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingBag, Clock, Truck, CheckCircle2, XCircle, CreditCard, Wallet, Banknote, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface StatusConfig {
  label: string;
  color: string;
  icon: React.ReactNode;
  description: string;
}

const statusConfig: Record<string, StatusConfig> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    icon: <Clock className="h-3 w-3" />,
    description: "Order received, awaiting processing",
  },
  pending_cod: {
    label: "Awaiting Delivery",
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    icon: <Banknote className="h-3 w-3" />,
    description: "Cash on Delivery - pay when order arrives",
  },
  pending_paypal: {
    label: "Awaiting Payment",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    icon: <Wallet className="h-3 w-3" />,
    description: "Redirecting to PayPal for payment",
  },
  paid: {
    label: "Paid",
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    icon: <CreditCard className="h-3 w-3" />,
    description: "Payment confirmed successfully",
  },
  processing: {
    label: "Processing",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    icon: <Loader2 className="h-3 w-3" />,
    description: "Order is being prepared",
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    icon: <Truck className="h-3 w-3" />,
    description: "Order is on its way",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    icon: <CheckCircle2 className="h-3 w-3" />,
    description: "Order has been delivered",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-destructive/10 text-destructive border-destructive/20",
    icon: <XCircle className="h-3 w-3" />,
    description: "Order was cancelled",
  },
  payment_failed: {
    label: "Payment Failed",
    color: "bg-destructive/10 text-destructive border-destructive/20",
    icon: <XCircle className="h-3 w-3" />,
    description: "Payment could not be processed",
  },
};

const getStatusConfig = (status: string): StatusConfig => {
  return statusConfig[status] || {
    label: status,
    color: "bg-muted text-muted-foreground border-border",
    icon: <Clock className="h-3 w-3" />,
    description: "Status unknown",
  };
};

const OrderHistory = () => {
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["user-orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(name, image, brand))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Order History</CardTitle>
          <CardDescription>View your past orders and track their status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : !orders || orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground text-sm mb-3">No orders yet</p>
              <Button variant="link" asChild>
                <Link to="/catalog">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => {
                const config = getStatusConfig(order.status);
                const paymentMethod = order.shipping_address?.payment_method;
                
                return (
                  <div key={order.id} className="border rounded-lg p-4 hover:border-primary/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground font-mono">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={`${config.color} flex items-center gap-1.5`}>
                          {config.icon}
                          {config.label}
                        </Badge>
                        {paymentMethod && (
                          <Badge variant="secondary" className="text-xs">
                            {paymentMethod === "paypal" ? (
                              <><Wallet className="h-3 w-3 mr-1" /> PayPal</>
                            ) : (
                              <><Banknote className="h-3 w-3 mr-1" /> COD</>
                            )}
                          </Badge>
                        )}
                        <span className="font-bold text-sm">${Number(order.total).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {/* Status description */}
                    <p className="text-xs text-muted-foreground mb-3">{config.description}</p>
                    
                    {/* Order items */}
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {order.order_items.map((item: any) => (
                          <div key={item.id} className="flex-shrink-0 flex items-center gap-2 bg-muted/30 rounded-md p-2 pr-3">
                            {item.products?.image && (
                              <img src={item.products.image} alt="" className="w-8 h-8 rounded object-cover" />
                            )}
                            <div>
                              <p className="text-xs font-medium line-clamp-1">{item.products?.name || "Product"}</p>
                              <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Shipping address preview */}
                    {order.shipping_address && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">
                          Ship to: {order.shipping_address.fname} {order.shipping_address.lname}, {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                        </p>
                      </div>
                    )}
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

export default OrderHistory;
