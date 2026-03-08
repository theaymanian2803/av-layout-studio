import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { products, categories, brands } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useCart } from "@/contexts/CartContext";
import { Grid, List, ShoppingCart, Search, X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const { addItem } = useCart();

  const selectedCategory = searchParams.get("category") || "";
  const selectedBrand = searchParams.get("brand") || "";

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearch("");
    setPriceRange([0, 5000]);
  };

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedBrand && p.brand !== selectedBrand) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [selectedCategory, selectedBrand, priceRange, search]);

  const activeFilterCount = [selectedCategory, selectedBrand, search, priceRange[0] > 0 || priceRange[1] < 5000].filter(Boolean).length;

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-2">Category</h3>
        <div className="space-y-1">
          <button onClick={() => setFilter("category", "")} className={`block text-sm w-full text-left px-2 py-1.5 rounded ${!selectedCategory ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>All</button>
          {categories.map(c => (
            <button key={c.name} onClick={() => setFilter("category", c.name)} className={`block text-sm w-full text-left px-2 py-1.5 rounded ${selectedCategory === c.name ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Brand</h3>
        <div className="space-y-1">
          <button onClick={() => setFilter("brand", "")} className={`block text-sm w-full text-left px-2 py-1.5 rounded ${!selectedBrand ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>All</button>
          {brands.map(b => (
            <button key={b} onClick={() => setFilter("brand", b)} className={`block text-sm w-full text-left px-2 py-1.5 rounded ${selectedBrand === b ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {b}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3">Price Range</h3>
        <Slider min={0} max={5000} step={50} value={priceRange} onValueChange={setPriceRange} className="mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full text-muted-foreground">
          <X className="h-3 w-3 mr-1" /> Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Catalog</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} products</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-64" />
            </div>
            <div className="flex border rounded-md">
              <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="h-9 w-9" onClick={() => setView("grid")}><Grid className="h-4 w-4" /></Button>
              <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" className="h-9 w-9" onClick={() => setView("list")}><List className="h-4 w-4" /></Button>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden h-9 w-9 relative">
                  <SlidersHorizontal className="h-4 w-4" />
                  {activeFilterCount > 0 && <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[9px] bg-primary text-primary-foreground flex items-center justify-center">{activeFilterCount}</Badge>}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                <div className="mt-6"><FilterPanel /></div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="sm:hidden mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden md:block w-56 shrink-0">
            <FilterPanel />
          </aside>

          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg">No products found</p>
                <Button variant="link" onClick={clearFilters}>Clear filters</Button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((p, i) => (
                    <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}>
                      <Link to={`/product/${p.id}`} className="group block rounded-lg border bg-card overflow-hidden hover:border-primary/30 transition-colors">
                        <div className="aspect-square bg-muted overflow-hidden">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-muted-foreground">{p.brand}</p>
                          <p className="text-sm font-medium truncate mt-0.5">{p.name}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-accent font-bold">${p.price.toLocaleString()}</span>
                            {!p.inStock && <Badge variant="destructive" className="text-[10px]">Sold Out</Badge>}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map((p, i) => (
                    <motion.div key={p.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}>
                      <div className="flex gap-4 p-4 rounded-lg border bg-card hover:border-primary/30 transition-colors">
                        <Link to={`/product/${p.id}`}>
                          <img src={p.image} alt={p.name} className="w-24 h-24 rounded-md object-cover" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${p.id}`}>
                            <p className="text-xs text-muted-foreground">{p.brand} · {p.category}</p>
                            <p className="font-medium mt-0.5">{p.name}</p>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                          </Link>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <span className="text-accent font-bold text-lg">${p.price.toLocaleString()}</span>
                          <Button size="sm" onClick={() => addItem(p)} disabled={!p.inStock}>
                            <ShoppingCart className="h-3 w-3 mr-1" /> Add
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
