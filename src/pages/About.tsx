import { PawPrint, Award, Users, Globe, Heart, Bone } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "Pet Essentials" },
  { value: "500K+", label: "Happy Customers" },
  { value: "50+", label: "Brands" },
  { value: "24/7", label: "Support" },
];

const values = [
  { icon: Award, title: "Quality First", description: "We select food and supplies from trusted makers with clear standards." },
  { icon: Users, title: "Pet Parent Support", description: "Friendly help makes choosing the right everyday essentials easier." },
  { icon: Globe, title: "Reliable Delivery", description: "Carefully packed pet favorites delivered quickly and reliably." },
  { icon: Heart, title: "Pets at Heart", description: "Every product is chosen with comfort, play, and wellbeing in mind." },
];

const About = () => (
  <div className="min-h-screen">
    {/* Hero */}
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
             <PawPrint className="h-4 w-4 text-primary" />
             <span className="text-sm font-semibold text-primary">About PetPaw</span>
          </div>
           <h1 className="text-4xl md:text-6xl font-black mb-6">Better Everyday Care<br />for Every Pet</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
             We make it easier for pet parents to find dependable food, joyful treats, and practical essentials in one welcoming place.
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
                 PetPaw began with a simple belief: shopping for a pet should feel joyful, clear, and caring—not overwhelming.
              </p>
              <p>
                 Today, we bring together thoughtfully selected meals, treats, toys, and everyday supplies for dogs, cats, birds, fish, and small pets.
              </p>
              <p>
                 We are more than a store: we are pet people committed to making daily care simpler and every shared moment happier.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
               <Bone className="h-20 w-20 text-primary/50" />
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
