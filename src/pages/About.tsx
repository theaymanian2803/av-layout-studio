import { Camera, Award, Users, Globe, Heart, Zap } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { value: "10K+", label: "Products" },
  { value: "500K+", label: "Happy Customers" },
  { value: "50+", label: "Brands" },
  { value: "24/7", label: "Support" },
];

const values = [
  { icon: Award, title: "Quality First", description: "We only stock gear from trusted brands with proven track records." },
  { icon: Users, title: "Customer Obsessed", description: "Your success is our success. We're here to help you create." },
  { icon: Globe, title: "Global Reach", description: "Shipping worldwide with fast, reliable delivery partners." },
  { icon: Heart, title: "Passion Driven", description: "Built by creators, for creators who demand the best." },
];

const About = () => (
  <div className="min-h-screen">
    {/* Hero */}
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Camera className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">About CineGear</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">Empowering Creators<br />Since 2015</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We started with a simple mission: make professional-grade equipment accessible to every creator, 
            from weekend enthusiasts to Hollywood productions.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-16 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Story */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                CineGear was founded by a group of filmmakers frustrated with the lack of quality equipment 
                retailers who truly understood the needs of creators. We knew there had to be a better way.
              </p>
              <p>
                Today, we're proud to serve over 500,000 creators worldwide—from YouTube content creators 
                to Oscar-winning cinematographers. Our team of experts personally tests every product we sell 
                to ensure it meets our exacting standards.
              </p>
              <p>
                We're not just a store; we're a community of passionate creators dedicated to helping you 
                tell your story with the best tools available.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Zap className="h-20 w-20 text-primary/50" />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <v.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
