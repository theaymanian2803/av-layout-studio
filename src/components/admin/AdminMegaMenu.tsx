import { useState, useEffect } from "react";
import {
  useLandingSections,
  useUpdateLandingSection,
  useAddLandingSection,
} from "@/hooks/useLandingSections";
import { useBrandsAndCategories, useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Menu, Save, Loader2, Megaphone, Star, Tag } from "lucide-react";

export const AdminMegaMenu = () => {
  const { data: sections = [], isLoading } = useLandingSections();
  const updateMutation = useUpdateLandingSection();
  const { brands, categories } = useBrandsAndCategories();
  const { data: products = [] } = useProducts();

  const menuSection = sections.find(
    (s) => (s.config as any)?.type === "mega_menu"
  );

  const [form, setForm] = useState({
    mega_enabled: true,
    announcement_enabled: true,
    announcement_text: "🚚 Free Shipping on orders over $99 — Use code AVFREE at checkout",
    announcement_link: "",
    top_brand_ids: [] as string[],
    featured_product_ids: {} as Record<string, string[]>,
  });

  const [activeCategory, setActiveCategory] = useState<string>("");

  useEffect(() => {
    if (menuSection) {
      const config = menuSection.config as any;
      setForm({
        mega_enabled: config?.mega_enabled ?? true,
        announcement_enabled: config?.announcement_enabled ?? true,
        announcement_text: config?.announcement_text || "",
        announcement_link: config?.announcement_link || "",
        top_brand_ids: config?.top_brand_ids || [],
        featured_product_ids: config?.featured_product_ids || {},
      });
    }
  }, [menuSection]);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].name);
    }
  }, [categories, activeCategory]);

  const handleSave = () => {
    if (!menuSection) return;
    updateMutation.mutate(
      {
        id: menuSection.id,
        updates: {
          config: {
            type: "mega_menu",
            ...form,
          },
        },
      },
      { onSuccess: () => toast.success("Mega menu settings saved") }
    );
  };

  const toggleBrand = (brandId: string) => {
    setForm((p) => ({
      ...p,
      top_brand_ids: p.top_brand_ids.includes(brandId)
        ? p.top_brand_ids.filter((id) => id !== brandId)
        : [...p.top_brand_ids, brandId],
    }));
  };

  const toggleFeaturedProduct = (category: string, productId: string) => {
    setForm((p) => {
      const current = p.featured_product_ids[category] || [];
      const updated = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : current.length < 3
        ? [...current, productId]
        : current;
      return {
        ...p,
        featured_product_ids: { ...p.featured_product_ids, [category]: updated },
      };
    });
  };

  const categoryProducts = products.filter((p) => p.category === activeCategory);
  const selectedFeatured = form.featured_product_ids[activeCategory] || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Menu className="h-5 w-5" /> Mega Menu Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Control the navigation mega menu, announcement bar, featured products, and top brands.
        </p>
      </div>

      {/* Global Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            Mega Menu
            <div className="flex items-center gap-2">
              <Label className="text-sm font-normal text-muted-foreground">
                {form.mega_enabled ? "Enabled" : "Disabled"}
              </Label>
              <Switch
                checked={form.mega_enabled}
                onCheckedChange={(v) => setForm((p) => ({ ...p, mega_enabled: v }))}
              />
            </div>
          </CardTitle>
          <CardDescription>Toggle the Shop mega dropdown in the navigation</CardDescription>
        </CardHeader>
      </Card>

      {/* Announcement Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Megaphone className="h-4 w-4" /> Announcement Bar
            <div className="ml-auto flex items-center gap-2">
              <Label className="text-sm font-normal text-muted-foreground">
                {form.announcement_enabled ? "Visible" : "Hidden"}
              </Label>
              <Switch
                checked={form.announcement_enabled}
                onCheckedChange={(v) => setForm((p) => ({ ...p, announcement_enabled: v }))}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Announcement Text</Label>
            <Input
              value={form.announcement_text}
              onChange={(e) => setForm((p) => ({ ...p, announcement_text: e.target.value }))}
              placeholder="e.g. 🚚 Free shipping on orders over $99"
            />
          </div>
          <div>
            <Label>Link URL (optional)</Label>
            <Input
              value={form.announcement_link}
              onChange={(e) => setForm((p) => ({ ...p, announcement_link: e.target.value }))}
              placeholder="e.g. /catalog?sale=true"
            />
          </div>
        </CardContent>
      </Card>

      {/* Top Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="h-4 w-4" /> Top Brands in Mega Menu
          </CardTitle>
          <CardDescription>
            Select which brands appear as quick links. If none are selected, the first 6 are shown by default.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {brands.map((brand: any) => (
              <label
                key={brand.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm ${
                  form.top_brand_ids.includes(brand.id)
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "border-border hover:bg-secondary/50"
                }`}
              >
                <Checkbox
                  checked={form.top_brand_ids.includes(brand.id)}
                  onCheckedChange={() => toggleBrand(brand.id)}
                />
                {brand.name}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Products per Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4" /> Featured Products per Category
          </CardTitle>
          <CardDescription>
            Pick up to 3 products per category to display in the mega menu. If none are selected, top-rated products are shown automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat: any) => {
              const count = (form.featured_product_ids[cat.name] || []).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === cat.name
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.name}
                  {count > 0 && (
                    <span className="ml-1.5 text-xs opacity-70">({count})</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Product list */}
          <div className="max-h-[300px] overflow-y-auto space-y-1 border rounded-lg p-2">
            {categoryProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No products in this category</p>
            ) : (
              categoryProducts.map((product) => {
                const isSelected = selectedFeatured.includes(product.id);
                const atLimit = selectedFeatured.length >= 3 && !isSelected;
                return (
                  <label
                    key={product.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary/10 border border-primary/20"
                        : atLimit
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-secondary/50"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={atLimit}
                      onCheckedChange={() => toggleFeaturedProduct(activeCategory, product.id)}
                    />
                    <div className="w-8 h-8 rounded overflow-hidden bg-muted flex-shrink-0">
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.brand} · ${product.price}</p>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateMutation.isPending} size="lg">
        <Save className="h-4 w-4 mr-2" />
        Save Mega Menu Settings
      </Button>
    </div>
  );
};
