import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2, FolderPlus, X } from "lucide-react";
import { toast } from "sonner";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

export const useSubcategories = () =>
  useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subcategories").select("*, categories(name)").order("name");
      if (error) throw error;
      return data;
    },
  });

export const AdminCategories = () => {
  const { data: categories = [], isLoading } = useCategories();
  const { data: subcategories = [] } = useSubcategories();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Subcategory add state
  const [subName, setSubName] = useState("");
  const [subCatId, setSubCatId] = useState<string | null>(null);
  const [subDialogOpen, setSubDialogOpen] = useState(false);

  // Count products per category
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("category");
      return data || [];
    },
  });

  const catCounts = products.reduce((acc: Record<string, number>, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["subcategories"] });
  };

  const openNew = () => { setName(""); setEditingId(null); setDialogOpen(true); };
  const openEdit = (cat: any) => { setName(cat.name); setEditingId(cat.id); setDialogOpen(true); };

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Category name is required"); return; }
    setSaving(true);
    let error;
    if (editingId) {
      ({ error } = await supabase.from("categories").update({ name: name.trim() }).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("categories").insert({ name: name.trim() }));
    }
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success(editingId ? "Category updated!" : "Category created!"); invalidateAll(); setDialogOpen(false); }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (catCounts[catName]) {
      toast.error(`Cannot delete — ${catCounts[catName]} product(s) use this category`);
      return;
    }
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Category deleted"); invalidateAll(); }
  };

  const handleAddSub = async () => {
    if (!subName.trim() || !subCatId) return;
    const { error } = await supabase.from("subcategories").insert({ name: subName.trim(), category_id: subCatId });
    if (error) toast.error(error.message);
    else { toast.success("Subcategory added!"); invalidateAll(); setSubName(""); setSubDialogOpen(false); }
  };

  const handleDeleteSub = async (id: string) => {
    const { error } = await supabase.from("subcategories").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Subcategory deleted"); invalidateAll(); }
  };

  const getSubsForCategory = (catId: string) => subcategories.filter((s: any) => s.category_id === catId);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Categories ({categories.length})</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add Category</Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Category" : "New Category"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div><Label>Name *</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
              <Button className="w-full" onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingId ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Subcategories</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getSubsForCategory(c.id).map((s: any) => (
                        <Badge key={s.id} variant="secondary" className="gap-1">
                          {s.name}
                          <button onClick={() => handleDeleteSub(s.id)} className="hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{catCounts[c.name] || 0}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Dialog open={subDialogOpen && subCatId === c.id} onOpenChange={(v) => { setSubDialogOpen(v); if (v) setSubCatId(c.id); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSubCatId(c.id); setSubName(""); }}>
                            <FolderPlus className="h-3.5 w-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xs">
                          <DialogHeader><DialogTitle>Add Subcategory to {c.name}</DialogTitle></DialogHeader>
                          <div className="space-y-3">
                            <Input value={subName} onChange={e => setSubName(e.target.value)} placeholder="Subcategory name" />
                            <Button className="w-full" onClick={handleAddSub}>Add</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id, c.name)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
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
