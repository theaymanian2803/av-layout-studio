import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  processing: "bg-primary/10 text-primary border-primary/30",
  shipped: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  delivered: "bg-green-500/10 text-green-500 border-green-500/30",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

export const AdminOrders = () => {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(name, image))")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) toast.error(error.message);
    else {
      toast.success(`Order status updated to ${status}`);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders ({orders.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : orders.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No orders yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-2 text-sm">
                          {item.products?.image && <img src={item.products.image} alt="" className="w-6 h-6 rounded object-cover" />}
                          <span className="truncate max-w-[150px]">{item.products?.name || "Unknown"}</span>
                          <span className="text-muted-foreground">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-accent">${order.total}</TableCell>
                  <TableCell>
                    <Select value={order.status} onValueChange={v => updateStatus(order.id, v)}>
                      <SelectTrigger className="w-32 h-8">
                        <Badge variant="outline" className={`text-xs ${statusColors[order.status] || ""}`}>
                          {order.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {["pending", "processing", "shipped", "delivered", "cancelled"].map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
