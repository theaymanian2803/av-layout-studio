import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, CreditCard, Trash2, Star, Wallet, Banknote } from "lucide-react";

interface PaymentMethod {
  id: string;
  card_brand: string;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  cardholder_name: string;
  is_default: boolean;
}

const PaymentMethods = () => {
  const { user } = useAuth();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [methodType, setMethodType] = useState<"paypal" | "cod">("paypal");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [codName, setCodName] = useState("");
  const [isDefault, setIsDefault] = useState(false);

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

  const resetForm = () => {
    setMethodType("paypal");
    setPaypalEmail("");
    setCodName("");
    setIsDefault(false);
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (methodType === "paypal" && !paypalEmail) {
      toast.error("Please enter your PayPal email");
      return;
    }
    if (methodType === "cod" && !codName) {
      toast.error("Please enter a name for this method");
      return;
    }

    if (isDefault) {
      await supabase.from("payment_methods").update({ is_default: false }).eq("user_id", user.id);
    }

    const payload = {
      user_id: user.id,
      card_brand: methodType === "paypal" ? "PayPal" : "COD",
      last_four: methodType === "paypal" ? paypalEmail.slice(-4) : "0000",
      expiry_month: 12,
      expiry_year: 2099,
      cardholder_name: methodType === "paypal" ? paypalEmail : codName,
      is_default: isDefault,
    };

    const { error } = await supabase.from("payment_methods").insert(payload);

    if (error) toast.error("Failed to save payment method");
    else {
      toast.success("Payment method added!");
      setDialogOpen(false);
      resetForm();
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
            <CardDescription>Manage your payment options</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Method</Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <RadioGroup value={methodType} onValueChange={(v) => setMethodType(v as "paypal" | "cod")} className="space-y-3">
                  <label
                    htmlFor="paypal"
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      methodType === "paypal" ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-primary/30"
                    }`}
                  >
                    <RadioGroupItem value="paypal" id="paypal" />
                    <div className={`p-2 rounded-lg ${methodType === "paypal" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      <Wallet className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">PayPal</p>
                      <p className="text-xs text-muted-foreground">Link your PayPal account</p>
                    </div>
                  </label>
                  <label
                    htmlFor="cod"
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      methodType === "cod" ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-primary/30"
                    }`}
                  >
                    <RadioGroupItem value="cod" id="cod" />
                    <div className={`p-2 rounded-lg ${methodType === "cod" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      <Banknote className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Cash on Delivery</p>
                      <p className="text-xs text-muted-foreground">Pay when order arrives</p>
                    </div>
                  </label>
                </RadioGroup>

                {methodType === "paypal" && (
                  <div className="space-y-1">
                    <Label>PayPal Email</Label>
                    <Input type="email" value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                )}

                {methodType === "cod" && (
                  <div className="space-y-1">
                    <Label>Label / Name</Label>
                    <Input value={codName} onChange={e => setCodName(e.target.value)} placeholder="e.g. Home delivery" />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Switch checked={isDefault} onCheckedChange={setIsDefault} />
                  <Label>Set as default</Label>
                </div>
                <Button className="w-full" onClick={handleSubmit}>Save Method</Button>
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
              {methods.map(m => {
                const isPayPal = m.card_brand === "PayPal";
                const isCOD = m.card_brand === "COD";
                return (
                  <div key={m.id} className="border rounded-lg p-4 relative group hover:border-primary/30 transition-colors">
                    {m.is_default && (
                      <span className="absolute top-2 right-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="h-3 w-3" /> Default
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-muted">
                        {isPayPal ? <Wallet className="h-4 w-4" /> : <Banknote className="h-4 w-4" />}
                      </div>
                      <span className="font-semibold text-sm">{isPayPal ? "PayPal" : "Cash on Delivery"}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isPayPal ? m.cardholder_name : m.cardholder_name}
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(m.id)}>
                      <Trash2 className="h-3 w-3 mr-1" /> Remove
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethods;
