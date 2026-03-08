import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const openings = [
  { title: "Senior Software Engineer", dept: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Product Manager", dept: "Product", location: "Los Angeles, CA", type: "Full-time" },
  { title: "Customer Success Specialist", dept: "Support", location: "Remote", type: "Full-time" },
  { title: "Marketing Manager", dept: "Marketing", location: "Los Angeles, CA", type: "Full-time" },
  { title: "Warehouse Associate", dept: "Operations", location: "Ontario, CA", type: "Full-time" },
  { title: "UX Designer", dept: "Design", location: "Remote", type: "Contract" },
];

const perks = [
  "Competitive salary + equity",
  "Comprehensive health benefits",
  "Unlimited PTO",
  "Remote-friendly culture",
  "Equipment stipend",
  "Professional development budget",
  "401(k) matching",
  "Team offsites",
];

const Careers = () => (
  <div className="min-h-screen py-12">
    <div className="container mx-auto px-4">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Join Our Team</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Help us empower creators around the world. We're looking for passionate people who want to make a difference.
        </p>
      </motion.div>

      {/* Perks */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Why CineGear?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {perks.map((perk, i) => (
            <motion.div
              key={perk}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-lg p-4 text-center"
            >
              <span className="text-sm font-medium">{perk}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Openings */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
        <div className="space-y-4">
          {openings.map((job, i) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" /> {job.dept}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {job.type}
                  </span>
                </div>
              </div>
              <Button variant="outline" className="shrink-0">
                Apply <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 bg-primary/5 border border-primary/20 rounded-2xl p-10 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-3">Don't see your role?</h2>
        <p className="text-muted-foreground mb-6">
          We're always looking for talented people. Send us your resume and we'll keep you in mind for future openings.
        </p>
        <Button size="lg">Send Your Resume</Button>
      </section>
    </div>
  </div>
);

export default Careers;
