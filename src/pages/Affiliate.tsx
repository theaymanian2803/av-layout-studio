import { DollarSign, Users, TrendingUp, Gift, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

const benefits = [
  { icon: DollarSign, title: "Up to 10% Commission", description: "Earn competitive commissions on every sale you refer." },
  { icon: Users, title: "30-Day Cookie", description: "Your referrals are tracked for 30 days after clicking your link." },
  { icon: TrendingUp, title: "Real-Time Tracking", description: "Monitor clicks, conversions, and earnings in your dashboard." },
  { icon: Gift, title: "Exclusive Perks", description: "Get early access to products and special affiliate-only deals." },
];

const Affiliate = () => (
  <div className="min-h-screen py-12">
    <div className="container mx-auto px-4">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Affiliate Program</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Partner with CineGear and earn money promoting the gear you love. Perfect for creators, reviewers, and tech enthusiasts.
        </p>
      </motion.div>

      {/* Benefits */}
      <section className="mb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 text-center"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <b.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mb-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
        <div className="space-y-4">
          {[
            "Apply to join our affiliate program (takes 2 minutes)",
            "Get approved and receive your unique referral links",
            "Share links in your content, reviews, or social media",
            "Earn commission on every qualifying purchase",
            "Get paid monthly via PayPal or bank transfer",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                {i + 1}
              </div>
              <div className="pt-1 text-muted-foreground">{step}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section className="max-w-xl mx-auto bg-card border border-border rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Apply Now</h2>
        <form className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input placeholder="John" />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input placeholder="Doe" />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div>
            <Label>Website / Social Media URL</Label>
            <Input placeholder="https://youtube.com/@yourchannel" />
          </div>
          <div>
            <Label>How will you promote CineGear?</Label>
            <Input placeholder="YouTube reviews, blog posts, etc." />
          </div>
          <Button type="submit" className="w-full">Submit Application</Button>
        </form>
      </section>
    </div>
  </div>
);

export default Affiliate;
