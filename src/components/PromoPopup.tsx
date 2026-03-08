import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLandingSections } from "@/hooks/useLandingSections";

const CONFETTI_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "#FFD700",
  "#FF6B6B",
  "#4ECDC4",
  "#A78BFA",
  "#F472B6",
  "#34D399",
];

const ConfettiBurst = () => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 500,
        y: -(Math.random() * 400 + 100),
        rotate: Math.random() * 720 - 360,
        scale: Math.random() * 0.6 + 0.4,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        shape: Math.random() > 0.5 ? "rect" : "circle",
        delay: Math.random() * 0.3,
        duration: Math.random() * 1.2 + 1.2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 0,
          }}
          animate={{
            opacity: [1, 1, 0],
            x: p.x,
            y: p.y,
            rotate: p.rotate,
            scale: p.scale,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.22, 0.68, 0.36, 1],
          }}
          className="absolute left-1/2 top-1/2"
          style={{
            width: p.shape === "rect" ? 8 : 7,
            height: p.shape === "rect" ? 12 : 7,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
};

export const PromoPopup = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { data: sections = [], isLoading } = useLandingSections();

  const popupSection = sections.find(
    (s) => (s.config as any)?.type === "promo_popup" && s.visible
  );

  const config = popupSection?.config as any;
  const delay = (config?.delay_seconds ?? 10) * 1000;
  const couponCode = config?.coupon_code || "SAVE10";
  const imageUrl = config?.image_url || "";
  const title = popupSection?.title || "Special Offer!";
  const subtitle = popupSection?.subtitle || "Use this coupon for an exclusive discount";

  useEffect(() => {
    if (!popupSection || isLoading) return;
    const dismissed = localStorage.getItem("promo_popup_dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setOpen(true), delay);
    return () => clearTimeout(timer);
  }, [popupSection, delay, isLoading]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("promo_popup_dismissed", "true");
  };

  if (!popupSection) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[420px] rounded-3xl overflow-hidden shadow-[0_25px_80px_-15px_rgba(0,0,0,0.6)]"
          >
            {/* Background image with fade-out gradient overlay */}
            {imageUrl && (
              <div className="absolute inset-0 z-0">
                <img
                  src={imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/90 to-[#0d0d0f]/40" />
              </div>
            )}

            {/* Solid dark bg when no image */}
            {!imageUrl && (
              <div className="absolute inset-0 z-0 bg-[#0d0d0f]" />
            )}

            {/* Subtle decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-primary/20 blur-[80px] z-0" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4 text-white/70" />
            </button>

            {/* Content */}
            <div className="relative z-10 px-8 pt-10 pb-8 text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.15, stiffness: 300 }}
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 mb-6"
              >
                <Sparkles className="h-7 w-7 text-primary" />
              </motion.div>

              <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
                {title}
              </h2>
              <p className="text-white/50 text-sm mb-7 max-w-[280px] mx-auto leading-relaxed">
                {subtitle}
              </p>

              {/* Coupon code */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 justify-center mb-6"
              >
                <div className="flex-1 max-w-[220px] bg-white/5 border border-dashed border-primary/50 rounded-2xl px-5 py-3.5 backdrop-blur-sm">
                  <span className="text-lg font-black tracking-[0.2em] text-primary">
                    {couponCode}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="h-[52px] w-[52px] rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-all shrink-0"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-primary" />
                  ) : (
                    <Copy className="h-5 w-5 text-white/60" />
                  )}
                </button>
              </motion.div>

              <AnimatePresence>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-primary font-medium mb-4"
                  >
                    Copied to clipboard!
                  </motion.p>
                )}
              </AnimatePresence>

              <Button
                onClick={handleClose}
                className="w-full rounded-2xl h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm tracking-wide"
              >
                Start Shopping
              </Button>

              <p className="text-[11px] text-white/25 mt-5">
                *Terms and conditions apply
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
