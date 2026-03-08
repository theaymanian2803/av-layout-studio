import { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useProducts";
import { Loader2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { AdminReviews } from "@/components/admin/AdminReviews";
import { AdminBrands } from "@/components/admin/AdminBrands";
import { AdminCategories } from "@/components/admin/AdminCategories";
import { AdminLandingPage } from "@/components/admin/AdminLandingPage";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminCoupons } from "@/components/admin/AdminCoupons";
import { AdminBulkImport } from "@/components/admin/AdminBulkImport";
import { AdminPromoPopup } from "@/components/admin/AdminPromoPopup";
import { AdminMegaMenu } from "@/components/admin/AdminMegaMenu";

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
    <SidebarProvider>
      <div className="min-h-[calc(100vh-4rem)] flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b px-4 gap-3">
            <SidebarTrigger />
            <h1 className="text-lg font-bold">Admin</h1>
          </header>
          <main className="flex-1 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="landing" element={<AdminLandingPage />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="brands" element={<AdminBrands />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="import" element={<AdminBulkImport />} />
                <Route path="popup" element={<AdminPromoPopup />} />
                <Route path="megamenu" element={<AdminMegaMenu />} />
              </Routes>
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
