import { useProducts } from "@/hooks/useProducts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Package, Users, TrendingUp, AlertTriangle, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(210,100%,50%)", "hsl(25,95%,55%)", "hsl(150,60%,45%)", "hsl(280,60%,55%)", "hsl(45,90%,50%)", "hsl(0,70%,55%)"];

export const AdminDashboard = () => {
  const { data: products = [] } = useProducts();

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: userCount = 0 } = useQuery({
    queryKey: ["admin-user-count"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id", { count: "exact", head: true });
      if (error) throw error;
      return (data as any)?.length ?? 0;
    },
  });

  const { data: profileCount = 0 } = useQuery({
    queryKey: ["admin-profile-count"],
    queryFn: async () => {
      const { count, error } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  const totalRevenue = orders.filter(o => o.status === "paid" || o.status === "pending_cod").reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrders = orders.length;
  const lowStockProducts = products.filter(p => p.in_stock && p.stock_count <= 5);

  // Top products by order count (from order_items would be better, but approximate with price)
  const categoryData = products.reduce((acc: Record<string, number>, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  // Revenue by order status
  const statusData = orders.reduce((acc: Record<string, number>, o) => {
    const label = o.status === "paid" ? "Paid" : o.status === "pending_cod" ? "COD" : o.status === "pending_paypal" ? "Pending" : o.status;
    acc[label] = (acc[label] || 0) + Number(o.total);
    return acc;
  }, {});
  const barData = Object.entries(statusData).map(([name, revenue]) => ({ name, revenue }));

  // Top products by rating
  const topProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-500" },
    { label: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "text-primary" },
    { label: "Total Products", value: products.length, icon: Package, color: "text-accent" },
    { label: "Total Users", value: profileCount, icon: Users, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border bg-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{s.label}</span>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold text-amber-500">Low Stock Alert ({lowStockProducts.length})</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.brand}</p>
                </div>
                <span className={`text-sm font-bold ${p.stock_count <= 2 ? "text-destructive" : "text-amber-500"}`}>
                  {p.stock_count} left
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold mb-4">Revenue by Status</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-12">No orders yet</p>
          )}
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold mb-4">Products by Category</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-12">No products yet</p>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Top Rated Products</h3>
        <div className="space-y-3">
          {topProducts.map((p, i) => (
            <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <span className="text-lg font-bold text-muted-foreground w-6 text-center">#{i + 1}</span>
              <img src={p.image} alt={p.name} className="w-12 h-12 rounded-md object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.brand} · {p.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-accent">${(p.price ?? 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">⭐ {p.rating} ({p.review_count})</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
