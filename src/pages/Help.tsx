import { Search, Package, CreditCard, Truck, RefreshCw, Shield, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const topics = [
  { icon: Package, label: "Orders", description: "Track orders, modify or cancel" },
  { icon: Truck, label: "Shipping", description: "Delivery times, tracking" },
  { icon: RefreshCw, label: "Returns", description: "Return policy, refunds" },
  { icon: CreditCard, label: "Payments", description: "Payment methods, billing" },
  { icon: Shield, label: "Warranty", description: "Coverage and claims" },
  { icon: MessageCircle, label: "Contact", description: "Get in touch", to: "/contact" },
];

const faqs = [
  { q: "How do I track my order?", a: "Once your order ships, you'll receive an email with a tracking number. You can also view order status in your Account → Order History." },
  { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, PayPal, and Apple Pay. All transactions are secured with SSL encryption." },
  { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping (2-3 days) and Next-Day delivery are also available at checkout." },
  { q: "What is your return policy?", a: "We offer a 30-day return policy on most items. Products must be unused and in original packaging. Some restrictions apply to opened software and special orders." },
  { q: "Do you ship internationally?", a: "Yes! We ship to over 100 countries. International shipping rates and delivery times are calculated at checkout based on your location." },
  { q: "How do I contact customer support?", a: "You can reach us via email at support@cinegear.com, phone at +1 (800) 123-4567, or through our Contact Us page. We respond within 24 hours." },
];

const Help = () => (
  <div className="min-h-screen py-12">
    <div className="container mx-auto px-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl font-black mb-4">Help Center</h1>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Find answers to common questions or get in touch with our support team.
        </p>
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for help..." className="pl-10 h-12" />
        </div>
      </motion.div>

      {/* Topics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16">
        {topics.map((t, i) => {
          const Card = (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-5 flex items-start gap-4 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <t.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold">{t.label}</div>
                <div className="text-sm text-muted-foreground">{t.description}</div>
              </div>
            </motion.div>
          );
          return t.to ? <Link to={t.to} key={t.label}>{Card}</Link> : Card;
        })}
      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-lg px-5">
              <AccordionTrigger className="text-left font-medium">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </div>
);

export default Help;
