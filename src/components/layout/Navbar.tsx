import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, Camera, User, LogIn, Shield, ChevronDown, CircleDot, Mic, Lightbulb, Wrench, Smartphone, Zap, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin, useBrandsAndCategories, useProducts } from "@/hooks/useProducts";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const categoryIcons: Record<string, React.ReactNode> = {
  Cameras: <Camera className="h-5 w-5" />,
  Lenses: <CircleDot className="h-5 w-5" />,
  Audio: <Mic className="h-5 w-5" />,
  Lighting: <Lightbulb className="h-5 w-5" />,
  Accessories: <Wrench className="h-5 w-5" />,
  Phones: <Smartphone className="h-5 w-5" />,
};

export const Navbar = () => {
  const { totalItems, setIsOpen } = useCart();
  const { user } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const { categories, brands, subcategories } = useBrandsAndCategories();
  const { data: products = [] } = useProducts();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const openMega = () => {
    clearTimeout(timeoutRef.current);
    setMegaOpen(true);
    if (!activeCat && categories.length > 0) setActiveCat(categories[0].name);
  };

  const closeMega = () => {
    timeoutRef.current = setTimeout(() => setMegaOpen(false), 200);
  };

  const keepOpen = () => clearTimeout(timeoutRef.current);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        megaRef.current && !megaRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeCategory = categories.find((c: any) => c.name === activeCat);
  const activeSubs = subcategories.filter((s: any) => activeCategory && s.category_id === activeCategory.id);
  const featuredProducts = products
    .filter(p => p.category === activeCat && p.rating >= 4)
    .slice(0, 3);

  return (
    <nav className="sticky top-0 z-50 border-b glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Camera className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">AV<span className="text-primary">Store</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50">
            Home
          </Link>

          {/* Shop Mega Trigger */}
          <button
            ref={triggerRef}
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
            onClick={() => setMegaOpen(!megaOpen)}
            className={`px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center gap-1 ${
              megaOpen ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            Shop <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />
          </button>

          <Link to="/catalog" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50">
            Catalog
          </Link>

          {isAdmin && (
            <Link to="/admin" className="px-3 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors rounded-md hover:bg-primary/5 flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {user ? (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/profile"><User className="h-5 w-5" /></Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth"><LogIn className="h-4 w-4 mr-1" /> Sign In</Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground">
                {totalItems}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* ===== MEGA MENU ===== */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            ref={megaRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={keepOpen}
            onMouseLeave={closeMega}
            className="absolute left-0 right-0 top-full z-50 border-b bg-card shadow-2xl shadow-background/80"
          >
            <div className="container mx-auto px-4 py-0">
              <div className="grid grid-cols-12 min-h-[360px]">
                {/* Categories column */}
                <div className="col-span-3 border-r py-6 pr-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-3 px-2">Categories</p>
                  <div className="space-y-0.5">
                    {categories.map((cat: any) => (
                      <button
                        key={cat.id}
                        onMouseEnter={() => setActiveCat(cat.name)}
                        onClick={() => { setActiveCat(cat.name); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                          activeCat === cat.name
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        }`}
                      >
                        <span className={activeCat === cat.name ? "text-primary" : "text-muted-foreground"}>
                          {categoryIcons[cat.name] || <Wrench className="h-5 w-5" />}
                        </span>
                        {cat.name}
                        <ArrowRight className={`h-3.5 w-3.5 ml-auto transition-opacity ${activeCat === cat.name ? "opacity-100" : "opacity-0"}`} />
                      </button>
                    ))}
                  </div>

                  {/* Brands quick links */}
                  <div className="mt-6 pt-4 border-t">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-3 px-2">Top Brands</p>
                    <div className="flex flex-wrap gap-1.5 px-2">
                      {brands.slice(0, 6).map((brand: any) => (
                        <Link
                          key={brand.id}
                          to={`/catalog?brand=${brand.name}`}
                          onClick={() => setMegaOpen(false)}
                          className="text-xs px-2.5 py-1 rounded-full border bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all font-medium"
                        >
                          {brand.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subcategories column */}
                <div className="col-span-4 py-6 px-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{activeCat} Subcategories</p>
                    <Link
                      to={`/catalog?category=${activeCat}`}
                      onClick={() => setMegaOpen(false)}
                      className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                    >
                      View All <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    {activeSubs.length > 0 ? (
                      activeSubs.map((sub: any) => (
                        <Link
                          key={sub.id}
                          to={`/catalog?category=${activeCat}&subcategory=${sub.name}`}
                          onClick={() => setMegaOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                        >
                          <Zap className="h-3 w-3 text-accent" />
                          {sub.name}
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground col-span-2 py-4">No subcategories yet.</p>
                    )}
                  </div>

                  {/* Browse all CTA */}
                  <div className="mt-6 pt-4 border-t">
                    <Link
                      to={`/catalog?category=${activeCat}`}
                      onClick={() => setMegaOpen(false)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-all"
                    >
                      <span className={activeCat ? "" : ""}>{categoryIcons[activeCat || ""] || <Camera className="h-4 w-4" />}</span>
                      Browse All {activeCat}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Featured products column */}
                <div className="col-span-5 py-6 pl-6 border-l bg-gradient-to-br from-transparent to-primary/[0.03]">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-4">Featured in {activeCat}</p>

                  {featuredProducts.length > 0 ? (
                    <div className="space-y-3">
                      {featuredProducts.map((p) => (
                        <Link
                          key={p.id}
                          to={`/product/${p.id}`}
                          onClick={() => setMegaOpen(false)}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-all group"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground font-medium">{p.brand}</p>
                            <p className="text-sm font-semibold truncate">{p.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-bold text-accent">${(p.price ?? 0).toLocaleString()}</span>
                              {p.original_price != null && (
                                <span className="text-xs text-muted-foreground line-through">${p.original_price.toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-8 text-center">No featured products in this category.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MOBILE MENU ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-card overflow-hidden"
          >
            <div className="p-4 space-y-1">
              <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 text-sm font-medium hover:text-primary hover:bg-secondary/50 rounded-lg transition-all">
                Home
              </Link>

              {/* Mobile categories */}
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold px-3 pt-3 pb-1">Shop by Category</p>
              {categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  to={`/catalog?category=${cat.name}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2.5 px-3 text-sm font-medium hover:text-primary hover:bg-secondary/50 rounded-lg transition-all"
                >
                  <span className="text-muted-foreground">{categoryIcons[cat.name] || <Wrench className="h-4 w-4" />}</span>
                  {cat.name}
                </Link>
              ))}

              <Link to="/catalog" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 text-sm font-medium hover:text-primary hover:bg-secondary/50 rounded-lg transition-all">
                Full Catalog
              </Link>

              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2.5 px-3 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-all">
                  <Shield className="h-4 w-4" /> Admin Dashboard
                </Link>
              )}

              {user ? (
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 text-sm font-medium hover:text-primary hover:bg-secondary/50 rounded-lg transition-all">
                  My Account
                </Link>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 text-sm font-medium hover:text-primary hover:bg-secondary/50 rounded-lg transition-all">
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
