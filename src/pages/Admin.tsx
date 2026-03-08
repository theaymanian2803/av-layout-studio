import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useProducts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ShoppingBag, Star, Loader2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { AdminReviews } from "@/components/admin/AdminReviews";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          <Tabs defaultValue="products">
            <TabsList className="mb-6">
              <TabsTrigger value="products"><Package className="h-4 w-4 mr-2" /> Products</TabsTrigger>
              <TabsTrigger value="orders"><ShoppingBag className="h-4 w-4 mr-2" /> Orders</TabsTrigger>
              <TabsTrigger value="reviews"><Star className="h-4 w-4 mr-2" /> Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="products"><AdminProducts /></TabsContent>
            <TabsContent value="orders"><AdminOrders /></TabsContent>
            <TabsContent value="reviews"><AdminReviews /></TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
