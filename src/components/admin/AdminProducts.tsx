import { useState } from "react";
import { useProducts, useBrandsAndCategories } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProductForm {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: string;
  original_price: string;
  image: string;
  description: string;
  in_stock: boolean;
  stock_count: string;
}

const emptyForm: ProductForm = {
  id: "", name: "", brand: "", category: "", subcategory: "",
  price: "", original_price: "", image: "", description: "",
  in_stock: true, stock_count: "0",
};

export const AdminProducts = () => {
  const { data: products = [], isLoading } = useProducts();
  const { brands, categories, subcategories } = useBrandsAndCategories();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setForm(emptyForm);
    setEditing(false);
    setDialogOpen(true);
  };

  const openEdit = (p: any) => {
    setForm({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      subcategory: p.subcategory,
      price: String(p.price),
      original_price: p.original_price ? String(p.original_price) : "",
      image: p.image,
      description: p.description,
      in_stock: p.in_stock,
      stock_count: String(p.stock_count),
    });
    setEditing(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.brand || !form.category || !form.price || !form.image) {
      toast.error("Fill in all required fields");
      return;
    }
    setSaving(true);
    const payload = {
      id: form.id || form.name.toLowerCase().replace(/\s+/g, "-").slice(0, 20) + "-" + Date.now(),
      name: form.name,
      brand: form.brand,
      category: form.category,
      subcategory: form.subcategory,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      image: form.image,
      images: [form.image],
      description: form.description,
      in_stock: form.in_stock,
      stock_count: parseInt(form.stock_count) || 0,
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from("products").update(payload).eq("id", form.id));
    } else {
      ({ error } = await supabase.from("products").insert(payload as any));
    }

    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(editing ? "Product updated!" : "Product created!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Product deleted");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  };

  const selectedCat = categories.find((c: any) => c.name === form.category);
  const selectedCatSubs = selectedCat ? subcategories.filter((s: any) => s.category_id === selectedCat.id) : [];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Products ({products.length})</CardTitle>
        <div className="flex gap-2">
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-48" />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Product" : "New Product"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Brand *</Label>
                    <Select value={form.brand} onValueChange={v => setForm({ ...form, brand: v })}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category *</Label>
                    <Select value={form.category} onValueChange={v => setForm({ ...form, category: v, subcategory: "" })}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{categories.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                {selectedCat && (
                  <div>
                    <Label>Subcategory</Label>
                    <Select value={form.subcategory} onValueChange={v => setForm({ ...form, subcategory: v })}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{selectedCat.subcategories.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Price *</Label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
                  <div><Label>Original Price</Label><Input type="number" value={form.original_price} onChange={e => setForm({ ...form, original_price: e.target.value })} /></div>
                </div>
                <div><Label>Image URL *</Label><Input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} /></div>
                <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Stock Count</Label><Input type="number" value={form.stock_count} onChange={e => setForm({ ...form, stock_count: e.target.value })} /></div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch checked={form.in_stock} onCheckedChange={v => setForm({ ...form, in_stock: v })} />
                    <Label>In Stock</Label>
                  </div>
                </div>
                <Button className="w-full" onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editing ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="w-10 h-10 rounded object-cover" />
                      <div>
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.brand}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{p.category}</TableCell>
                  <TableCell className="text-sm font-medium text-accent">${p.price}</TableCell>
                  <TableCell>
                    {p.in_stock ? (
                      <Badge variant="outline" className="text-xs">{p.stock_count}</Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">Out</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
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
