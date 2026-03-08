import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, CreditCard, Trash2, Star } from "lucide-react";

interface PaymentMethod {
  id: string;
  card_brand: string;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  cardholder_name: string;
  is_default: boolean;
}

const brandIcons: Record<string, string> = {
  Visa: "💳",
  Mastercard: "💳",
  Amex: "💳",
  Discover: "💳",
};

const PaymentMethods = () => {
  const { user } = useAuth();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    card_brand: "Visa",
    last_four: "",
    expiry_month: new Date().getMonth() + 1,
    expiry_year: new Date().getFullYear(),
    cardholder_name: "",
    is_default: false,
  });

  const fetchMethods = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });
    setMethods((data as PaymentMethod[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchMethods(); }, [user]);

  const handleSubmit = async () => {
    if (!user || !form.cardholder_name || form.last_four.length !== 4) {
      toast.error("Please fill in all fields correctly (last 4 digits only)");
      return;
    }

    if (form.is_default) {
      await supabase.from("payment_methods").update({ is_default: false }).eq("user_id", user.id);
    }

    const { error } = await supabase.from("payment_methods").insert({
      ...form,
      user_id: user.id,
    });

    if (error) toast.error("Failed to save payment method");
    else {
      toast.success("Payment method added!");
      setDialogOpen(false);
      setForm({ card_brand: "Visa", last_four: "", expiry_month: new Date().getMonth() + 1, expiry_year: new Date().getFullYear(), cardholder_name: "", is_default: false });
      fetchMethods();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("payment_methods").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Payment method removed"); fetchMethods(); }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Payment Methods</CardTitle>
            <CardDescription>Save payment methods for faster checkout</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Card</Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Card Brand</Label>
                  <Select value={form.card_brand} onValueChange={v => setForm(f => ({ ...f, card_brand: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Visa">Visa</SelectItem>
                      <SelectItem value="Mastercard">Mastercard</SelectItem>
                      <SelectItem value="Amex">American Express</SelectItem>
                      <SelectItem value="Discover">Discover</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Cardholder Name *</Label>
                  <Input value={form.cardholder_name} onChange={e => setForm(f => ({ ...f, cardholder_name: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Last 4 Digits *</Label>
                  <Input maxLength={4} value={form.last_four} onChange={e => setForm(f => ({ ...f, last_four: e.target.value.replace(/\D/g, "").slice(0, 4) }))} placeholder="1234" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Expiry Month</Label>
                    <Select value={String(form.expiry_month)} onValueChange={v => setForm(f => ({ ...f, expiry_month: Number(v) }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>{String(i + 1).padStart(2, "0")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Expiry Year</Label>
                    <Select value={String(form.expiry_year)} onValueChange={v => setForm(f => ({ ...f, expiry_year: Number(v) }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => {
                          const yr = new Date().getFullYear() + i;
                          return <SelectItem key={yr} value={String(yr)}>{yr}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_default} onCheckedChange={v => setForm(f => ({ ...f, is_default: v }))} />
                  <Label>Set as default</Label>
                </div>
                <Button className="w-full" onClick={handleSubmit}>Save Card</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : methods.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No payment methods saved yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {methods.map(m => (
                <div key={m.id} className="border rounded-lg p-4 relative group hover:border-primary/30 transition-colors">
                  {m.is_default && (
                    <span className="absolute top-2 right-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3" /> Default
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{brandIcons[m.card_brand] || "💳"}</span>
                    <span className="font-semibold text-sm">{m.card_brand}</span>
                  </div>
                  <p className="text-sm font-mono tracking-widest text-muted-foreground">•••• •••• •••• {m.last_four}</p>
                  <p className="text-xs text-muted-foreground mt-1">{m.cardholder_name} · Exp {String(m.expiry_month).padStart(2, "0")}/{m.expiry_year}</p>
                  <Button variant="ghost" size="sm" className="mt-2 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(m.id)}>
                    <Trash2 className="h-3 w-3 mr-1" /> Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethods;
