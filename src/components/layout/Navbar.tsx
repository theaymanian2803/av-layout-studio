import { Link, useNavigate } from "react-router-dom";
import { useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bird, Bone, Cat, ChevronDown, Dog, Fish, Heart, LogIn, Menu, Moon, Package, PawPrint, Search, Shield, ShoppingCart, Sun, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin, useBrandsAndCategories, useProducts } from "@/hooks/useProducts";
import { useLandingSections } from "@/hooks/useLandingSections";
import { useWishlist } from "@/hooks/useWishlist";
import { ThemeContext } from "@/App";

const categoryIcons: Record<string, typeof PawPrint> = {
  "Dog Food": Dog, "Cat Food": Cat, "Fish Food": Fish, "Bird Food": Bird,
  Treats: Bone, "Pet Supplies": Package,
};

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return <Button variant="ghost" size="icon" onClick={toggleTheme} className="relative h-9 w-9" aria-label="Toggle color theme">
    <Sun className={`absolute h-4 w-4 transition-all ${theme === "dark" ? "scale-0 rotate-90" : "scale-100"}`} />
    <Moon className={`h-4 w-4 transition-all ${theme === "dark" ? "scale-100" : "scale-0 -rotate-90"}`} />
  </Button>;
};

export const Navbar = () => {
  const { totalItems, setIsOpen } = useCart();
  const { user } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const { categories, brands, subcategories } = useBrandsAndCategories();
  const { data: products = [] } = useProducts();
  const { data: sections = [] } = useLandingSections();
  const { wishlistIds } = useWishlist();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  const megaMenuSection = sections.find((section) => (section.config as { type?: string })?.type === "mega_menu");
  const megaConfig = (megaMenuSection?.config || {}) as Record<string, unknown>;
  const announcementEnabled = megaConfig.announcement_enabled !== false;
  const megaEnabled = megaConfig.mega_enabled !== false;
  const announcementText = typeof megaConfig.announcement_text === "string" && megaConfig.announcement_text
    ? megaConfig.announcement_text : "Free shipping on orders over $75 — everything your pet loves, delivered";
  const announcementLink = typeof megaConfig.announcement_link === "string" ? megaConfig.announcement_link : "";
  const topBrandIds = Array.isArray(megaConfig.top_brand_ids) ? megaConfig.top_brand_ids as string[] : [];
  const featuredProductIds = typeof megaConfig.featured_product_ids === "object" && megaConfig.featured_product_ids
    ? megaConfig.featured_product_ids as Record<string, string[]> : {};

  const currentCategory = activeCat || categories[0]?.name || "";
  const activeCategory = categories.find((category) => category.name === currentCategory);
  const activeSubs = subcategories.filter((subcategory) => activeCategory && subcategory.category_id === activeCategory.id);
  const selectedIds = featuredProductIds[currentCategory] || [];
  const featuredProducts = selectedIds.length
    ? selectedIds.map((id) => products.find((product) => product.id === id)).filter((product) => product !== undefined).slice(0, 3)
    : products.filter((product) => product.category === currentCategory).slice(0, 3);
  const displayBrands = topBrandIds.length ? brands.filter((brand) => topBrandIds.includes(brand.id)) : brands.slice(0, 6);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return products.filter((product) => [product.name, product.brand, product.category].some((value) => value.toLowerCase().includes(query))).slice(0, 5);
  }, [products, searchQuery]);

  const submitSearch = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setSearchFocused(false);
    navigate(`/catalog?search=${encodeURIComponent(query)}`);
  }, [navigate, searchQuery]);

  const activateMega = (name?: string) => {
    setActiveCat(name || categories[0]?.name || null);
    setMegaOpen(true);
  };

  return <header className="sticky top-0 z-50 bg-background">
    <AnimatePresence>{announcementEnabled && !announcementDismissed && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="relative bg-pet-ink px-10 py-2 text-center text-xs font-bold text-primary-foreground">
      {announcementLink ? <Link to={announcementLink}>{announcementText}</Link> : announcementText}
      <Button variant="ghost" size="icon" onClick={() => setAnnouncementDismissed(true)} className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" aria-label="Dismiss announcement"><X className="h-3 w-3" /></Button>
    </motion.div>}</AnimatePresence>

    <div className="hidden border-b bg-card py-2 text-xs text-muted-foreground md:block"><div className="container mx-auto flex items-center justify-between px-4"><div className="flex gap-5"><Link to="/about" className="hover:text-primary">About us</Link><Link to="/contact" className="hover:text-primary">Contact us</Link><Link to="/help" className="hover:text-primary">FAQs</Link></div><p>Save 20% on your first PetPaw order</p><p>Friendly support, seven days a week</p></div></div>

    <div className="border-b bg-card"><div className="container mx-auto flex h-20 items-center gap-4 px-4">
      <Link to="/" className="flex shrink-0 items-center gap-2 text-xl font-black"><PawPrint className="h-8 w-8 text-primary" /><span>Pet<span className="text-primary">Paw</span></span></Link>
      <div className="relative mx-auto hidden w-full max-w-xl md:block">
        <form onSubmit={submitSearch} className="flex h-11 overflow-hidden rounded-md border bg-background"><span className="flex items-center border-r px-4 text-xs font-bold text-muted-foreground">All Categories</span><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} onFocus={() => setSearchFocused(true)} placeholder="Search food, treats & supplies…" className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" /><Button type="submit" size="icon" className="h-11 w-12 rounded-none" aria-label="Search"><Search className="h-4 w-4" /></Button></form>
        <AnimatePresence>{searchFocused && searchQuery.trim() && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-md border bg-card shadow-xl">
          {searchResults.length ? searchResults.map((product) => <Link key={product.id} to={`/product/${product.id}`} onClick={() => { setSearchFocused(false); setSearchQuery(""); }} className="flex items-center gap-3 border-b px-4 py-3 last:border-0 hover:bg-muted"><img src={product.image} alt="" className="h-10 w-10 object-cover" /><span className="min-w-0 flex-1 truncate text-sm font-bold">{product.name}</span><span className="text-sm font-extrabold text-primary">${product.price.toFixed(2)}</span></Link>) : <p className="p-4 text-sm text-muted-foreground">No products found.</p>}
        </motion.div>}</AnimatePresence>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        {user && <Button variant="ghost" size="icon" asChild className="relative h-9 w-9"><Link to="/favorites" aria-label="Favorites"><Heart className="h-4 w-4" />{wishlistIds.length > 0 && <Badge className="absolute -right-1 -top-1 h-4 min-w-4 p-0 text-[9px]">{wishlistIds.length}</Badge>}</Link></Button>}
        {user ? <Button variant="ghost" size="icon" asChild className="h-9 w-9"><Link to="/account" aria-label="My account"><User className="h-4 w-4" /></Link></Button> : <Button variant="ghost" size="sm" asChild><Link to="/auth"><LogIn className="h-4 w-4" /> Sign in</Link></Button>}
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="relative h-9 w-9" aria-label="Open cart"><ShoppingCart className="h-4 w-4" />{totalItems > 0 && <Badge className="absolute -right-1 -top-1 h-4 min-w-4 p-0 text-[9px]">{totalItems}</Badge>}</Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open menu">{mobileOpen ? <X /> : <Menu />}</Button>
      </div>
    </div></div>

    <nav className="bg-primary text-primary-foreground"><div className="container mx-auto hidden h-11 items-center px-4 md:flex">
      <Link to="/" className="flex h-full items-center px-4 text-sm font-bold hover:bg-primary-foreground/10">Home</Link>
      {megaEnabled && <Button variant="ghost" onMouseEnter={() => activateMega()} onClick={() => setMegaOpen(!megaOpen)} className="h-full rounded-none px-4 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">Shop <ChevronDown className="h-3 w-3" /></Button>}
      {categories.slice(0, 5).map((category) => <Link key={category.id} to={`/catalog?category=${encodeURIComponent(category.name)}`} onMouseEnter={() => activateMega(category.name)} className="flex h-full items-center px-4 text-sm font-bold hover:bg-primary-foreground/10">{category.name}</Link>)}
      <Link to="/catalog" className="ml-auto flex h-full items-center gap-2 px-4 text-sm font-bold hover:bg-primary-foreground/10"><Menu className="h-4 w-4" /> All products</Link>
    </div></nav>

    <AnimatePresence>{megaOpen && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} onMouseLeave={() => setMegaOpen(false)} className="absolute left-0 right-0 border-b bg-card shadow-xl"><div className="container mx-auto grid min-h-80 grid-cols-12 px-4">
      <div className="col-span-3 border-r py-6 pr-4"><p className="mb-3 text-xs font-extrabold uppercase text-muted-foreground">Shop by pet</p>{categories.map((category) => { const Icon = categoryIcons[category.name] || PawPrint; return <Button key={category.id} variant="ghost" onMouseEnter={() => setActiveCat(category.name)} asChild className={`mb-1 w-full justify-start ${currentCategory === category.name ? "bg-primary/10 text-primary" : ""}`}><Link to={`/catalog?category=${encodeURIComponent(category.name)}`}><Icon className="h-4 w-4" />{category.name}</Link></Button>; })}</div>
      <div className="col-span-4 px-6 py-6"><p className="mb-3 text-xs font-extrabold uppercase text-muted-foreground">Popular in {currentCategory}</p><div className="grid grid-cols-2 gap-2">{activeSubs.map((subcategory) => <Link key={subcategory.id} to={`/catalog?category=${encodeURIComponent(currentCategory)}&subcategory=${encodeURIComponent(subcategory.name)}`} className="rounded-md px-3 py-2 text-sm hover:bg-muted hover:text-primary">{subcategory.name}</Link>)}</div><div className="mt-6 border-t pt-4"><p className="mb-2 text-xs font-extrabold uppercase text-muted-foreground">Trusted brands</p><div className="flex flex-wrap gap-2">{displayBrands.map((brand) => <Link key={brand.id} to={`/catalog?brand=${encodeURIComponent(brand.name)}`} className="rounded-full border px-3 py-1 text-xs font-bold hover:border-primary hover:text-primary">{brand.name}</Link>)}</div></div></div>
      <div className="col-span-5 border-l bg-muted/30 px-6 py-6"><p className="mb-3 text-xs font-extrabold uppercase text-muted-foreground">Recommended picks</p><div className="grid grid-cols-3 gap-3">{featuredProducts.map((product) => <Link key={product.id} to={`/product/${product.id}`} className="rounded-md bg-card p-2"><img src={product.image} alt={product.name} className="aspect-square w-full object-cover" /><p className="mt-2 line-clamp-2 text-xs font-bold">{product.name}</p><p className="mt-1 text-sm font-extrabold text-primary">${product.price.toFixed(2)}</p></Link>)}</div></div>
    </div></motion.div>}</AnimatePresence>

    <AnimatePresence>{mobileOpen && <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-b bg-card md:hidden"><div className="p-4"><form onSubmit={submitSearch} className="mb-4 flex rounded-md border"><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search PetPaw" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" /><Button size="icon" className="rounded-l-none"><Search /></Button></form><div className="grid grid-cols-2 gap-2"><Link to="/" onClick={() => setMobileOpen(false)} className="rounded-md p-3 text-sm font-bold hover:bg-muted">Home</Link>{categories.map((category) => <Link key={category.id} to={`/catalog?category=${encodeURIComponent(category.name)}`} onClick={() => setMobileOpen(false)} className="rounded-md p-3 text-sm font-bold hover:bg-muted">{category.name}</Link>)}<Link to="/catalog" onClick={() => setMobileOpen(false)} className="rounded-md p-3 text-sm font-bold text-primary">All Products</Link>{isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-md p-3 text-sm font-bold text-primary"><Shield className="h-4 w-4" />Admin</Link>}</div></div></motion.div>}</AnimatePresence>
  </header>;
};