import { useState, useEffect } from "react";
import {
  useLandingSections,
  useUpdateLandingSection,
  useAddLandingSection,
} from "@/hooks/useLandingSections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Gift, Loader2, Save } from "lucide-react";

export const AdminPromoPopup = () => {
  const { data: sections = [], isLoading } = useLandingSections();
  const updateMutation = useUpdateLandingSection();
  const addMutation = useAddLandingSection();

  const popupSection = sections.find(
    (s) => (s.config as any)?.type === "promo_popup"
  );

  const [form, setForm] = useState({
    enabled: false,
    title: "🎁 Special Offer!",
    subtitle: "Use this coupon for an exclusive discount on your order",
    coupon_code: "SAVE10",
    delay_seconds: 10,
  });

  useEffect(() => {
    if (popupSection) {
      const config = popupSection.config as any;
      setForm({
        enabled: popupSection.visible,
        title: popupSection.title || "🎁 Special Offer!",
        subtitle: popupSection.subtitle || "",
        coupon_code: config?.coupon_code || "SAVE10",
        delay_seconds: config?.delay_seconds ?? 10,
      });
    }
  }, [popupSection]);

  const handleSave = () => {
    const updates = {
      title: form.title,
      subtitle: form.subtitle,
      visible: form.enabled,
      config: {
        type: "promo_popup",
        coupon_code: form.coupon_code,
        delay_seconds: form.delay_seconds,
      },
    };

    if (popupSection) {
      updateMutation.mutate(
        { id: popupSection.id, updates },
        { onSuccess: () => toast.success("Promo popup updated") }
      );
    } else {
      addMutation.mutate(
        {
          section_key: "promo_popup",
          sort_order: 999,
          ...updates,
        } as any,
        { onSuccess: () => toast.success("Promo popup created") }
      );
    }
  };

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
          <Gift className="h-5 w-5" /> Promo Popup
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure the promotional popup that appears to visitors.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            Popup Settings
            <div className="flex items-center gap-2">
              <Label htmlFor="popup-enabled" className="text-sm font-normal text-muted-foreground">
                {form.enabled ? "Active" : "Disabled"}
              </Label>
              <Switch
                id="popup-enabled"
                checked={form.enabled}
                onCheckedChange={(v) => setForm((p) => ({ ...p, enabled: v }))}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. 🎁 Special Offer!"
            />
          </div>
          <div>
            <Label>Subtitle / Description</Label>
            <Input
              value={form.subtitle}
              onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
              placeholder="e.g. Get 10% off your first order"
            />
          </div>
          <div>
            <Label>Coupon Code</Label>
            <Input
              value={form.coupon_code}
              onChange={(e) => setForm((p) => ({ ...p, coupon_code: e.target.value.toUpperCase() }))}
              placeholder="e.g. SAVE10"
              className="font-mono tracking-wider uppercase"
            />
          </div>
          <div>
            <Label>Delay (seconds before popup appears)</Label>
            <Input
              type="number"
              min={1}
              max={120}
              value={form.delay_seconds}
              onChange={(e) => setForm((p) => ({ ...p, delay_seconds: parseInt(e.target.value) || 10 }))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              The popup will appear {form.delay_seconds} second{form.delay_seconds !== 1 ? "s" : ""} after a visitor loads the site.
            </p>
          </div>
          <Button onClick={handleSave} disabled={updateMutation.isPending || addMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {popupSection ? "Save Changes" : "Create Popup"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
