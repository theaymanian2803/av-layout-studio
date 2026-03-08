import { LayoutEngine } from "@/components/layout/LayoutEngine";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Pro <span className="text-primary neon-text">A/V</span> Gear
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Professional cameras, audio equipment, and visual gear for creators who demand the best. Customize your storefront—drag and arrange sections to match your workflow.
            </p>
          </motion.div>
        </div>
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      <div className="container mx-auto px-4 py-8">
        <LayoutEngine />
      </div>
    </div>
  );
};

export default Index;
