import { Shield, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Warranty = () => (
  <div className="min-h-screen py-12">
    <div className="container mx-auto px-4 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-black mb-4">Warranty Information</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
           PetPaw supplies and accessories include the applicable manufacturer warranty, alongside our straightforward returns support.
        </p>
      </motion.div>

      {/* Standard Warranty */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Standard Manufacturer Warranty</h2>
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <p className="text-muted-foreground">
            Every product we sell includes the full manufacturer warranty. Coverage varies by brand and product type:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
               { category: "Pet beds", duration: "1 Year" },
               { category: "Feeders", duration: "1 Year" },
               { category: "Grooming tools", duration: "1 Year" },
               { category: "Travel gear", duration: "1 Year" },
               { category: "Toys", duration: "90 Days" },
               { category: "Electronics", duration: "1 Year" },
            ].map((item) => (
              <div key={item.category} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <span className="font-medium">{item.category}</span>
                <span className="text-sm text-primary font-semibold">{item.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Covered */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">What's Covered</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-semibold text-green-600">Covered</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Manufacturing defects</li>
              <li>• Electrical component failure</li>
              <li>• Mechanical malfunctions</li>
              <li>• Firmware/software issues</li>
              <li>• Workmanship defects</li>
            </ul>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="font-semibold text-red-600">Not Covered</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Physical damage or drops</li>
              <li>• Water/liquid damage</li>
              <li>• Normal wear and tear</li>
              <li>• Unauthorized modifications</li>
              <li>• Theft or loss</li>
            </ul>
          </div>
        </div>
      </section>

      {/* File a Claim */}
      <section className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
        <FileText className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Need to File a Claim?</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Contact our support team with your order number and a description of the issue. We'll guide you through the warranty process.
        </p>
        <Button asChild>
          <Link to="/contact">Contact Support</Link>
        </Button>
      </section>
    </div>
  </div>
);

export default Warranty;
