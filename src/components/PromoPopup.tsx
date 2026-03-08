import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLandingSections } from "@/hooks/useLandingSections";

export const PromoPopup = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { data: sections = [] } = useLandingSections();

  const popupSection = sections.find(
    (s) => (s.config as any)?.type === "promo_popup" && s.visible
  );

  const config = popupSection?.config as any;
  const delay = (config?.delay_seconds ?? 10) * 1000;
  const couponCode = config?.coupon_code || "SAVE10";
  const title = popupSection?.title || "Special Offer!";
  const subtitle = popupSection?.subtitle || "Use this coupon for an exclusive discount";
  const dismissed = sessionStorage.getItem("promo_popup_dismissed");

  useEffect(() => {
    if (!popupSection || dismissed) return;
    const timer = setTimeout(() => setOpen(true), delay);
    return () => clearTimeout(timer);
  }, [popupSection, delay, dismissed]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("promo_popup_dismissed", "true");
  };

  if (!popupSection) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-card border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Decorative top gradient */}
            <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-5">
                <Gift className="h-8 w-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <p className="text-muted-foreground text-sm mb-6">{subtitle}</p>

              {/* Coupon code box */}
              <div className="flex items-center gap-2 justify-center mb-6">
                <div className="flex-1 max-w-[220px] bg-secondary border-2 border-dashed border-primary/40 rounded-xl px-5 py-3">
                  <span className="text-lg font-black tracking-[0.15em] text-primary">
                    {couponCode}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="h-12 w-12 rounded-xl border-2 shrink-0"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-green-500 font-medium mb-4"
                >
                  Copied to clipboard!
                </motion.p>
              )}

              <Button onClick={handleClose} className="w-full rounded-xl h-11">
                Start Shopping
              </Button>

              <p className="text-xs text-muted-foreground mt-4">
                *Terms and conditions apply
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
