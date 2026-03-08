import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, MapPin, CreditCard, Heart, Package, LogOut, LayoutGrid, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PersonalInfo from "@/components/account/PersonalInfo";
import ShippingAddresses from "@/components/account/ShippingAddresses";
import PaymentMethods from "@/components/account/PaymentMethods";
import WishlistSection from "@/components/account/WishlistSection";
import OrderHistory from "@/components/account/OrderHistory";

const STORAGE_KEY = "av-store-layout";

const tabs = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "orders", label: "Orders", icon: Package },
  { id: "layout", label: "Layout", icon: LayoutGrid },
];

const Account = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("Signed out");
  };

  const handleResetLayout = () => {
    localStorage.removeItem(STORAGE_KEY);
    if (user) {
      supabase.from("user_layout_preferences").delete().eq("user_id", user.id).then(() => toast.success("Layout reset to default!"));
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black">My Account</h1>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive hover:border-destructive">
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>

          <div className="grid lg:grid-cols-[240px_1fr] gap-6">
            {/* Sidebar navigation */}
            <nav className="space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Content area */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "personal" && <PersonalInfo />}
              {activeTab === "addresses" && <ShippingAddresses />}
              {activeTab === "payments" && <PaymentMethods />}
              {activeTab === "wishlist" && <WishlistSection />}
              {activeTab === "orders" && <OrderHistory />}
              {activeTab === "layout" && (
                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><LayoutGrid className="h-5 w-5" /> Homepage Layout</h3>
                    <p className="text-sm text-muted-foreground mb-4">Your custom homepage layout is saved automatically when you rearrange widgets. Reset it here.</p>
                    <Button variant="outline" onClick={handleResetLayout}>
                      <RotateCcw className="h-4 w-4 mr-2" /> Reset to Default Layout
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Account;
