import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, MapPin, Trash2, Pencil, Star } from "lucide-react";

interface Address {
  id: string;
  label: string;
  full_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
}

const emptyForm = {
  label: "Home",
  full_name: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "US",
  phone: "",
  is_default: false,
};

const ShippingAddresses = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchAddresses = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("shipping_addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });
    setAddresses((data as Address[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchAddresses(); }, [user]);

  const handleSubmit = async () => {
    if (!user || !form.full_name || !form.address_line1 || !form.city || !form.state || !form.postal_code) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      ...form,
      address_line2: form.address_line2 || null,
      phone: form.phone || null,
      user_id: user.id,
    };

    if (form.is_default) {
      await supabase.from("shipping_addresses").update({ is_default: false }).eq("user_id", user.id);
    }

    let error;
    if (editingId) {
      ({ error } = await supabase.from("shipping_addresses").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("shipping_addresses").insert(payload));
    }

    if (error) toast.error("Failed to save address");
    else {
      toast.success(editingId ? "Address updated!" : "Address added!");
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchAddresses();
    }
  };

  const handleEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      label: addr.label,
      full_name: addr.full_name,
      address_line1: addr.address_line1,
      address_line2: addr.address_line2 || "",
      city: addr.city,
      state: addr.state,
      postal_code: addr.postal_code,
      country: addr.country,
      phone: addr.phone || "",
      is_default: addr.is_default,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("shipping_addresses").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Address removed"); fetchAddresses(); }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Shipping Addresses</CardTitle>
            <CardDescription>Manage your delivery addresses</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingId(null); setForm(emptyForm); } }}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Address</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Address" : "Add New Address"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Label</Label>
                    <Input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="Home, Work..." />
                  </div>
                  <div className="space-y-1">
                    <Label>Full Name *</Label>
                    <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Address Line 1 *</Label>
                  <Input value={form.address_line1} onChange={e => setForm(f => ({ ...f, address_line1: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Address Line 2</Label>
                  <Input value={form.address_line2} onChange={e => setForm(f => ({ ...f, address_line2: e.target.value }))} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label>City *</Label>
                    <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label>State *</Label>
                    <Input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label>Zip *</Label>
                    <Input value={form.postal_code} onChange={e => setForm(f => ({ ...f, postal_code: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_default} onCheckedChange={v => setForm(f => ({ ...f, is_default: v }))} />
                  <Label>Set as default address</Label>
                </div>
                <Button className="w-full" onClick={handleSubmit}>{editingId ? "Update Address" : "Save Address"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : addresses.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No addresses saved yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {addresses.map(addr => (
                <div key={addr.id} className="border rounded-lg p-4 relative group hover:border-primary/30 transition-colors">
                  {addr.is_default && (
                    <span className="absolute top-2 right-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3" /> Default
                    </span>
                  )}
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{addr.label}</p>
                  <p className="font-semibold text-sm">{addr.full_name}</p>
                  <p className="text-sm text-muted-foreground">{addr.address_line1}</p>
                  {addr.address_line2 && <p className="text-sm text-muted-foreground">{addr.address_line2}</p>}
                  <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.postal_code}</p>
                  {addr.phone && <p className="text-sm text-muted-foreground">{addr.phone}</p>}
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(addr)}>
                      <Pencil className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(addr.id)}>
                      <Trash2 className="h-3 w-3 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingAddresses;
