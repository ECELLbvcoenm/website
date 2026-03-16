"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Search, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Define the assumed schema structure
type Project = {
  id: string | number;
  title: string;
  description: string;
  category: string;
  status: string; // e.g., 'active', 'completed'
  github_url: string;
};

const CATEGORIES = ["All", "AI/ML", "Web Dev", "FinTech", "SaaS"];

export default function CommunityPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch projects strictly from Supabase
  useEffect(() => {
    async function fetchProjects() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("id", { ascending: false });

        if (error) {
          console.error("Error fetching projects:", error);
          // Optional: handle error state here
        } else {
          setProjects(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) =>
    activeCategory === "All" ? true : project.category === activeCategory
  );

  // Animation layout configs
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans pb-20">
      
      {/* Structural Ambient Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            Builder Matrix
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Explore the ecosystem of ongoing innovations.
          </motion.p>
        </div>

        {/* Category Filter (Glassmorphism) */}
        <div className="flex justify-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1 p-1 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-full flex-wrap justify-center overflow-hidden"
          >
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors z-10 ${
                  activeCategory === category 
                    ? "text-white" 
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {activeCategory === category && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {category}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Loading State or Density Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-white/40 text-sm animate-pulse">Synchronizing Data...</p>
          </div>
        ) : (
          <>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-20 border border-white/5 bg-white/[0.01] rounded-2xl backdrop-blur-sm">
                <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white/70 mb-2">No Projects Found</h3>
                <p className="text-white/40">Try selecting a different category horizon.</p>
              </div>
            ) : (
              <motion.div
                key={activeCategory} // Force re-render of animation when category filters
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                <AnimatePresence>
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={itemVariants}
                      layout
                      className="group relative bg-white/[0.02] border border-white/10 p-5 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 flex flex-col h-full"
                    >
                      {/* Top Header Row */}
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-mono px-2 py-1 bg-white/5 rounded text-white/60">
                          {project.category}
                        </span>
                        {/* Status Indicator (Pulse Green if active) */}
                        {project.status?.toLowerCase() === "active" && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-wider text-green-400 font-semibold">Active</span>
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 mb-[4rem]">
                        <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-blue-100 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-white/50 line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Hover Effect - View Source Link Overlay */}
                      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between pt-4 border-t border-white/10 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <span className="text-sm font-medium text-blue-400">Initialize</span>
                        <a 
                          href={project.github_url || "#"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 px-3 py-1.5 rounded-lg text-sm transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Source
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
