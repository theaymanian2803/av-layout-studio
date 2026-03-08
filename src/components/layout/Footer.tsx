import { Link } from "react-router-dom";
import { useBrandsAndCategories } from "@/hooks/useProducts";
import { Camera, Mail, MapPin, Phone, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const companyLinks = [
  { label: "About Us", to: "/about" },
];

const supportLinks = [
  { label: "Help Center", to: "/help" },
  { label: "Shipping & Returns", to: "/shipping" },
  { label: "Warranty", to: "/warranty" },
  { label: "Contact Us", to: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Cookie Policy", to: "/cookies" },
];

export const Footer = () => {
  const { categories } = useBrandsAndCategories();

  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter strip */}
      <div className="bg-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Stay in the loop</h3>
            <p className="text-sm text-muted-foreground">Get deals, new arrivals & pro tips straight to your inbox.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <Input placeholder="Enter your email" className="h-10 w-full md:w-72 bg-background" />
            <Button className="h-10 px-6 font-semibold shrink-0">Subscribe</Button>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <Camera className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-black tracking-tight text-foreground">CineGear</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Your trusted source for professional cameras, lenses, audio, lighting & accessories.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((cat: any) => (
                <li key={cat.id}>
                  <Link
                    to={`/catalog?category=${encodeURIComponent(cat.name)}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/catalog" className="text-sm text-primary font-medium hover:underline">
                  View All →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Support</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">123 Gear Street, Studio City, CA 91604</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href="tel:+18001234567" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  +1 (800) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href="mailto:support@cinegear.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  support@cinegear.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CineGear. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {legalLinks.map((item) => (
              <Link key={item.label} to={item.to} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {["Visa", "Mastercard", "PayPal", "Amex"].map((card) => (
              <span
                key={card}
                className="text-[10px] font-semibold text-muted-foreground bg-secondary px-2 py-1 rounded"
              >
                {card}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
