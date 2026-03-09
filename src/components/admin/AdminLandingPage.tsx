import { useState } from "react";
import {
  useLandingSections,
  useUpdateLandingSection,
  useAddLandingSection,
  useDeleteLandingSection,
  LandingSection,
} from "@/hooks/useLandingSections";
import { useBrandsAndCategories } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Eye, EyeOff, GripVertical, Pencil, Trash2, Plus, ArrowUp, ArrowDown,
  Image as ImageIcon, Type, LayoutDashboard, Loader2, Save,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sectionTypeLabels: Record<string, string> = {
  hero: "Hero Banner",
  categories: "Category Cards",
  promo: "Promo / Deals",
  product_row: "Product Row",
  brands_strip: "Brands Strip",
  featured_brand: "Featured Brand Tabs",
  custom_banner: "Custom Banner",
};

const sectionTypeIcons: Record<string, string> = {
  hero: "🎯",
  categories: "📂",
  promo: "🔥",
  product_row: "📦",
  brands_strip: "🏷️",
  featured_brand: "⭐",
  custom_banner: "🖼️",
};

export const AdminLandingPage = () => {
  const { data: sections = [], isLoading } = useLandingSections();
  const { categories } = useBrandsAndCategories();
  const updateMutation = useUpdateLandingSection();
  const addMutation = useAddLandingSection();
  const deleteMutation = useDeleteLandingSection();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<LandingSection>>({});
  const [addOpen, setAddOpen] = useState(false);
  const [deleteSection, setDeleteSection] = useState<LandingSection | null>(null);
  const [newSection, setNewSection] = useState({ title: "", type: "product_row", category: "", subtitle: "", image_url: "", cta_text: "", cta_link: "", headline: "", description: "", hero_image: "", product_ids: "" });

  const handleToggleVisibility = (section: LandingSection) => {
    updateMutation.mutate(
      { id: section.id, updates: { visible: !section.visible } },
      { onSuccess: () => toast.success(`${section.title} ${section.visible ? "hidden" : "shown"}`) }
    );
  };

  const handleMove = (section: LandingSection, direction: "up" | "down") => {
    const sorted = [...sections].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((s) => s.id === section.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const other = sorted[swapIdx];
    Promise.all([
      updateMutation.mutateAsync({ id: section.id, updates: { sort_order: other.sort_order } }),
      updateMutation.mutateAsync({ id: other.id, updates: { sort_order: section.sort_order } }),
    ]).then(() => toast.success("Order updated"));
  };

  const startEdit = (section: LandingSection) => {
    setEditingId(section.id);
    setEditForm({
      title: section.title,
      subtitle: section.subtitle,
      image_url: section.image_url,
      config: section.config,
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateMutation.mutate(
      { id: editingId, updates: editForm },
      {
        onSuccess: () => {
          toast.success("Section updated");
          setEditingId(null);
        },
      }
    );
  };

  const handleAdd = () => {
    const key = `${newSection.type}_${Date.now()}`;
    const config: Record<string, any> = { type: newSection.type };
    if (newSection.category) config.category = newSection.category;
    if (newSection.cta_text) config.cta_text = newSection.cta_text;
    if (newSection.cta_link) config.cta_link = newSection.cta_link;
    // Hero-specific config
    if (newSection.type === "hero") {
      if (newSection.headline) config.headline = newSection.headline;
      if (newSection.description) config.description = newSection.description;
      if (newSection.hero_image) config.hero_image = newSection.hero_image;
      if (newSection.product_ids) config.product_ids = newSection.product_ids;
    }

    addMutation.mutate(
      {
        section_key: key,
        title: newSection.title,
        subtitle: newSection.subtitle || "",
        image_url: newSection.image_url || "",
        sort_order: sections.length,
        visible: true,
        config,
      } as any,
      {
        onSuccess: () => {
          toast.success("Section added");
          setAddOpen(false);
          setNewSection({ title: "", type: "product_row", category: "", subtitle: "", image_url: "", cta_text: "", cta_link: "", headline: "", description: "", hero_image: "", product_ids: "" });
        },
      }
    );
  };

  const handleDelete = (section: LandingSection) => {
    setDeleteSection(section);
  };

  const confirmDelete = () => {
    if (!deleteSection) return;
    deleteMutation.mutate(deleteSection.id, {
      onSuccess: () => {
        toast.success("Section deleted");
        setDeleteSection(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hiddenTypes = ["promo_popup", "mega_menu"];
  const sorted = [...sections].filter(s => !hiddenTypes.includes((s.config as any)?.type)).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" /> Landing Page Sections
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Toggle visibility, edit titles/images, and reorder sections.
          </p>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Section</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Section Type</Label>
                <Select value={newSection.type} onValueChange={(v) => setNewSection((p) => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(sectionTypeLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Title</Label>
                <Input value={newSection.title} onChange={(e) => setNewSection((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. 📱 Smartphones" />
              </div>
              {newSection.type === "custom_banner" && (
                <>
                  <div>
                    <Label>Subtitle</Label>
                    <Input value={newSection.subtitle} onChange={(e) => setNewSection((p) => ({ ...p, subtitle: e.target.value }))} placeholder="Optional description text" />
                  </div>
                  <ImageUploadField
                    label="Background Image"
                    value={newSection.image_url}
                    onChange={(url) => setNewSection((p) => ({ ...p, image_url: url }))}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>CTA Button Text</Label>
                      <Input value={newSection.cta_text} onChange={(e) => setNewSection((p) => ({ ...p, cta_text: e.target.value }))} placeholder="Shop Now" />
                    </div>
                    <div>
                      <Label>CTA Link</Label>
                      <Input value={newSection.cta_link} onChange={(e) => setNewSection((p) => ({ ...p, cta_link: e.target.value }))} placeholder="/catalog" />
                    </div>
                  </div>
                </>
              )}
              {newSection.type === "hero" && (
                <>
                  <div>
                    <Label>Headline</Label>
                    <Input value={newSection.headline} onChange={(e) => setNewSection((p) => ({ ...p, headline: e.target.value }))} placeholder="e.g. Discover Amazing Gear" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input value={newSection.description} onChange={(e) => setNewSection((p) => ({ ...p, description: e.target.value }))} placeholder="Short description text" />
                  </div>
                  <ImageUploadField
                    label="Hero Image"
                    value={newSection.hero_image}
                    onChange={(url) => setNewSection((p) => ({ ...p, hero_image: url }))}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>CTA Button Text</Label>
                      <Input value={newSection.cta_text} onChange={(e) => setNewSection((p) => ({ ...p, cta_text: e.target.value }))} placeholder="Shop Now" />
                    </div>
                    <div>
                      <Label>CTA Link</Label>
                      <Input value={newSection.cta_link} onChange={(e) => setNewSection((p) => ({ ...p, cta_link: e.target.value }))} placeholder="/catalog" />
                    </div>
                  </div>
                  <div>
                    <Label>Featured Product IDs (comma-separated, optional)</Label>
                    <Input value={newSection.product_ids} onChange={(e) => setNewSection((p) => ({ ...p, product_ids: e.target.value }))} placeholder="prod-001, prod-002" />
                  </div>
                </>
              )}
              {newSection.type === "product_row" && (
                <div>
                  <Label>Category</Label>
                  <Select value={newSection.category} onValueChange={(v) => setNewSection((p) => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c: any) => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button onClick={handleAdd} disabled={!newSection.title} className="w-full">
                Add Section
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <AnimatePresence>
        {sorted.map((section, idx) => {
          const isEditing = editingId === section.id;
          const sectionType = (section.config as any)?.type || "unknown";

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: idx * 0.03 }}
            >
              <Card className={`transition-all ${!section.visible ? "opacity-50 border-dashed" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Drag Handle / Order */}
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <Button
                        variant="ghost" size="icon" className="h-6 w-6"
                        onClick={() => handleMove(section, "up")}
                        disabled={idx === 0}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-xs text-muted-foreground font-mono">{idx + 1}</span>
                      <Button
                        variant="ghost" size="icon" className="h-6 w-6"
                        onClick={() => handleMove(section, "down")}
                        disabled={idx === sorted.length - 1}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{sectionTypeIcons[sectionType] || "📄"}</span>
                        {isEditing ? (
                          <Input
                            value={editForm.title || ""}
                            onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                            className="h-8 text-sm font-semibold"
                          />
                        ) : (
                          <span className="font-semibold text-sm">{section.title}</span>
                        )}
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                          {sectionTypeLabels[sectionType] || sectionType}
                        </span>
                        {(section.config as any)?.category && (
                          <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {(section.config as any).category}
                          </span>
                        )}
                      </div>

                      {isEditing && (
                        <div className="mt-3 space-y-3 border-t pt-3">
                          <div>
                            <Label className="text-xs">Subtitle</Label>
                            <Input
                              value={editForm.subtitle || ""}
                              onChange={(e) => setEditForm((p) => ({ ...p, subtitle: e.target.value }))}
                              placeholder="Optional subtitle"
                              className="h-8 text-sm"
                            />
                          </div>
                          <ImageUploadField
                            label="Background Image"
                            value={editForm.image_url || ""}
                            onChange={(url) => setEditForm((p) => ({ ...p, image_url: url }))}
                          />
                          
                          {/* Hero-specific controls */}
                          {sectionType === "hero" && (
                            <>
                              <div>
                                <Label className="text-xs">Hero Headline</Label>
                                <Input
                                  value={(editForm.config as any)?.headline || ""}
                                  onChange={(e) => setEditForm((p) => ({ ...p, config: { ...(p.config || {}), type: "hero", headline: e.target.value } }))}
                                  placeholder="e.g. Discover Amazing Tech"
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Hero Description</Label>
                                <Input
                                  value={(editForm.config as any)?.description || ""}
                                  onChange={(e) => setEditForm((p) => ({ ...p, config: { ...(p.config || {}), type: "hero", description: e.target.value } }))}
                                  placeholder="Short description text"
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs">CTA Button Text</Label>
                                  <Input
                                    value={(editForm.config as any)?.cta_text || ""}
                                    onChange={(e) => setEditForm((p) => ({ ...p, config: { ...(p.config || {}), type: "hero", cta_text: e.target.value } }))}
                                    placeholder="Shop Now"
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">CTA Link URL</Label>
                                  <Input
                                    value={(editForm.config as any)?.cta_link || ""}
                                    onChange={(e) => setEditForm((p) => ({ ...p, config: { ...(p.config || {}), type: "hero", cta_link: e.target.value } }))}
                                    placeholder="/catalog"
                                    className="h-8 text-sm"
                                  />
                                </div>
                              </div>
                              <ImageUploadField
                                label="Hero Image (overrides product image)"
                                value={(editForm.config as any)?.hero_image || ""}
                                onChange={(url) => setEditForm((p) => ({ ...p, config: { ...(p.config || {}), type: "hero", hero_image: url } }))}
                                previewHeight="h-24"
                              />
                              <div>
                                <Label className="text-xs">Featured Product IDs (comma-separated, or leave empty for auto)</Label>
                                <Input
                                  value={(editForm.config as any)?.product_ids || ""}
                                  onChange={(e) => setEditForm((p) => ({ ...p, config: { ...(p.config || {}), type: "hero", product_ids: e.target.value } }))}
                                  placeholder="prod-001, prod-002"
                                  className="h-8 text-sm"
                                />
                              </div>
                            </>
                          )}
                          
                          {sectionType === "product_row" && (
                            <div>
                              <Label className="text-xs">Category Filter</Label>
                              <Select
                                value={(editForm.config as any)?.category || ""}
                                onValueChange={(v) => setEditForm((p) => ({ ...p, config: { ...p.config, category: v } }))}
                              >
                                <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {categories.map((c: any) => (
                                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          {sectionType === "custom_banner" && (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">CTA Button Text</Label>
                                <Input
                                  value={(editForm.config as any)?.cta_text || ""}
                                  onChange={(e) => setEditForm((p) => ({ ...p, config: { ...p.config, cta_text: e.target.value } }))}
                                  placeholder="Shop Now"
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">CTA Link URL</Label>
                                <Input
                                  value={(editForm.config as any)?.cta_link || ""}
                                  onChange={(e) => setEditForm((p) => ({ ...p, config: { ...p.config, cta_link: e.target.value } }))}
                                  placeholder="/catalog?brand=Sony"
                                  className="h-8 text-sm"
                                />
                              </div>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button size="sm" onClick={saveEdit}>
                              <Save className="h-3.5 w-3.5 mr-1" /> Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-2 mr-2">
                        <Switch
                          checked={section.visible}
                          onCheckedChange={() => handleToggleVisibility(section)}
                        />
                        {section.visible ? (
                          <Eye className="h-4 w-4 text-primary" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      {!isEditing && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(section)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(section)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {sorted.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No landing page sections configured. Click "Add Section" to get started.
        </div>
      )}
    </div>
  );
};
