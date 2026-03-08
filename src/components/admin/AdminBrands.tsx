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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const useBrands = () =>
  useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase.from("brands").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

export const AdminBrands = () => {
  const { data: brands = [], isLoading } = useBrands();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Count products per brand
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("brand");
      return data || [];
    },
  });

  const brandCounts = products.reduce((acc: Record<string, number>, p) => {
    acc[p.brand] = (acc[p.brand] || 0) + 1;
    return acc;
  }, {});

  const openNew = () => {
    setName("");
    setLogoUrl("");
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (brand: any) => {
    setName(brand.name);
    setLogoUrl(brand.logo_url || "");
    setEditingId(brand.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Brand name is required"); return; }
    setSaving(true);

    let error;
    if (editingId) {
      ({ error } = await supabase.from("brands").update({ name: name.trim(), logo_url: logoUrl || null }).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("brands").insert({ name: name.trim(), logo_url: logoUrl || null }));
    }

    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success(editingId ? "Brand updated!" : "Brand created!");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      setDialogOpen(false);
    }
  };

  const handleDelete = async (id: string, brandName: string) => {
    if (brandCounts[brandName]) {
      toast.error(`Cannot delete — ${brandCounts[brandName]} product(s) use this brand`);
      return;
    }
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Brand deleted");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Brands ({brands.length})</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add Brand</Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Brand" : "New Brand"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div><Label>Name *</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
              <div><Label>Logo URL</Label><Input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://..." /></div>
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
                <TableHead>Brand</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((b: any) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {b.logo_url && <img src={b.logo_url} alt="" className="w-6 h-6 rounded object-contain" />}
                      {b.name}
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{brandCounts[b.name] || 0}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(b)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(b.id, b.name)}><Trash2 className="h-3.5 w-3.5" /></Button>
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
