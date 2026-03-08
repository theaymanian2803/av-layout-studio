import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const posts = [
  {
    title: "Top 10 Cameras for Filmmakers in 2025",
    excerpt: "From cinema cameras to mirrorless hybrids, we break down the best options for every budget and use case.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop",
    author: "Sarah Chen",
    date: "Mar 5, 2025",
    category: "Guides",
  },
  {
    title: "Essential Audio Gear for Documentary Filmmakers",
    excerpt: "Great visuals mean nothing without great sound. Here's our recommended audio setup for docs.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop",
    author: "Mike Johnson",
    date: "Mar 2, 2025",
    category: "Audio",
  },
  {
    title: "Lighting Techniques: Natural vs Artificial",
    excerpt: "When to use natural light, when to bring out the LEDs, and how to blend both for cinematic results.",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=400&fit=crop",
    author: "Emma Davis",
    date: "Feb 28, 2025",
    category: "Lighting",
  },
  {
    title: "Our Favorite Lenses for Portrait Photography",
    excerpt: "The glass makes all the difference. Here are our top picks for stunning portrait work.",
    image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&h=400&fit=crop",
    author: "Alex Rivera",
    date: "Feb 25, 2025",
    category: "Lenses",
  },
  {
    title: "Building the Ultimate YouTube Studio on a Budget",
    excerpt: "You don't need to spend a fortune to create professional-looking content. Here's how.",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&h=400&fit=crop",
    author: "Jordan Lee",
    date: "Feb 20, 2025",
    category: "Guides",
  },
  {
    title: "Gimbal vs Steadicam: Which Is Right for You?",
    excerpt: "Both have their place in filmmaking. We compare the pros, cons, and best use cases.",
    image: "https://images.unsplash.com/photo-1579566346927-c68383817a25?w=600&h=400&fit=crop",
    author: "Sarah Chen",
    date: "Feb 15, 2025",
    category: "Accessories",
  },
];

const Blog = () => (
  <div className="min-h-screen py-12">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl font-black mb-4">Blog</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Tips, guides, and insights for filmmakers, photographers, and content creators.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {posts.map((post, i) => (
          <motion.article
            key={post.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl overflow-hidden group"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                {post.category}
              </span>
              <h2 className="font-bold text-lg mt-3 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {post.date}
                  </span>
                </div>
                <span className="text-primary font-medium flex items-center gap-1 group-hover:underline">
                  Read <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </div>
);

export default Blog;
