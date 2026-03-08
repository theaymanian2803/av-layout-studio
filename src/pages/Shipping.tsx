import { Truck, Clock, Globe, Package, RefreshCw, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const shippingOptions = [
  { name: "Standard Shipping", time: "5-7 Business Days", price: "Free over $99", icon: Truck },
  { name: "Express Shipping", time: "2-3 Business Days", price: "$14.99", icon: Clock },
  { name: "Next-Day Delivery", time: "1 Business Day", price: "$24.99", icon: Package },
  { name: "International", time: "7-14 Business Days", price: "Calculated at checkout", icon: Globe },
];

const Shipping = () => (
  <div className="min-h-screen py-12">
    <div className="container mx-auto px-4 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black mb-4 text-center">Shipping & Returns</h1>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Fast, reliable shipping and hassle-free returns. Your satisfaction is our priority.
        </p>
      </motion.div>

      {/* Shipping Options */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Shipping Options</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {shippingOptions.map((opt) => (
            <div key={opt.name} className="bg-card border border-border rounded-xl p-5 flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <opt.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold">{opt.name}</div>
                <div className="text-sm text-muted-foreground">{opt.time}</div>
                <div className="text-sm font-medium text-primary">{opt.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Returns */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <RefreshCw className="h-6 w-6 text-primary" /> Return Policy
        </h2>
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <p className="text-muted-foreground">
            We want you to be completely satisfied with your purchase. If you're not happy, we offer easy returns within 30 days of delivery.
          </p>
          <div className="space-y-3">
            {[
              "30-day return window from delivery date",
              "Items must be unused and in original packaging",
              "Free return shipping on defective items",
              "Refunds processed within 5-7 business days",
              "Exchange available for different sizes/colors",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusions */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Return Exclusions</h2>
        <div className="bg-secondary/30 border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-4">The following items cannot be returned:</p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Opened software, memory cards, or downloadable products</li>
            <li>Custom or special-order items</li>
            <li>Items marked as "Final Sale"</li>
            <li>Products with missing serial numbers or UPC codes</li>
            <li>Items showing signs of use or damage</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
);

export default Shipping;
