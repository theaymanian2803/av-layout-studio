import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { User, LayoutGrid, LogOut, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const STORAGE_KEY = "av-store-layout";

const DEFAULT_LAYOUT = [
  { id: "featured-cameras", label: "Featured Cameras" },
  { id: "category-showcase", label: "Shop by Category" },
  { id: "current-deals", label: "Current Deals" },
  { id: "new-audio", label: "New Audio Gear" },
  { id: "top-brands", label: "Top Brands" },
];

const Profile = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.display_name) setDisplayName(data.display_name);
        });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) toast.error("Failed to update profile");
    else toast.success("Profile updated!");
  };

  const handleResetLayout = () => {
    localStorage.removeItem(STORAGE_KEY);
    if (user) {
      supabase
        .from("user_layout_preferences")
        .delete()
        .eq("user_id", user.id)
        .then(() => toast.success("Layout reset to default!"));
    } else {
      toast.success("Layout reset to default!");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("Signed out");
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-8">My Account</h1>

          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" /> Profile</TabsTrigger>
              <TabsTrigger value="layout"><LayoutGrid className="h-4 w-4 mr-2" /> Layout</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader><CardTitle>Profile Settings</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input value={user.email || ""} disabled />
                  </div>
                  <div>
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input id="display-name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleSaveProfile} disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="destructive" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layout">
              <Card>
                <CardHeader><CardTitle>Homepage Layout</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Your custom homepage layout is saved automatically when you rearrange widgets on the home page. You can reset it to the default layout here.
                  </p>
                  <Button variant="outline" onClick={handleResetLayout}>
                    <RotateCcw className="h-4 w-4 mr-2" /> Reset to Default Layout
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
