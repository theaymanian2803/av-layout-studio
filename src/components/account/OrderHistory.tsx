import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
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
          <CardDescription>View your past orders</CardDescription>
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
              {orders.map((order: any) => (
                <div key={order.id} className="border rounded-lg p-4 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(order.created_at), "MMM d, yyyy")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={statusColors[order.status] || ""}>
                        {order.status}
                      </Badge>
                      <span className="font-bold text-sm">${Number(order.total).toLocaleString()}</span>
                    </div>
                  </div>
                  {order.order_items && order.order_items.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistory;
