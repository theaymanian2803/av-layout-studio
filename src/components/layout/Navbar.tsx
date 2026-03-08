import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, Camera, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Catalog" },
];

export const Navbar = () => {
  const { totalItems, setIsOpen } = useCart();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Camera className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">AV<span className="text-primary">Store</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
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

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-card overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
              {user ? (
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium hover:text-primary transition-colors">
                  My Account
                </Link>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium hover:text-primary transition-colors">
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
