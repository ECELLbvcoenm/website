"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Search, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string | number;
  title: string;
  description: string;
  category: string;
  status: string;
  github_url: string;
};

const CATEGORIES = ["All", "AI/ML", "Web Dev", "FinTech", "SaaS"];

export default function CommunityPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from("projects").select("*").order("id", { ascending: false });
        if (error) console.warn("Notice: Database unreachable for projects");
        else setProjects(data || []);
      } catch (err) {
        console.warn("Unexpected database error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => activeCategory === "All" || p.category === activeCategory);

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } };

  return (
    <div className="min-h-screen selection:bg-indigo-500/30 font-sans pb-20" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px]" style={{ background: "var(--accent-glow)" }} />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full blur-[100px]" style={{ background: "rgba(139,92,246,0.06)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="text-center mb-16">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 animated-gradient-text">
            Builder Matrix
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Explore the ecosystem of ongoing innovations.
          </motion.p>
        </div>

        <div className="flex justify-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-1 p-1 rounded-full flex-wrap justify-center overflow-hidden glass">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className="relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors z-10" style={{ color: activeCategory === cat ? "var(--text-primary)" : "var(--text-muted)" }}>
                {activeCategory === cat && <motion.div layoutId="activeCategory" className="absolute inset-0 rounded-full -z-10" style={{ background: "var(--bg-card-hover)" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: "var(--text-accent)" }} />
            <p className="text-sm animate-pulse" style={{ color: "var(--text-muted)" }}>Synchronizing Data...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 rounded-2xl glass">
            <Search className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>No Projects Found</h3>
            <p style={{ color: "var(--text-muted)" }}>Try selecting a different category.</p>
          </div>
        ) : (
          <motion.div key={activeCategory} variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div key={project.id} variants={itemVariants} layout className="group relative p-5 rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full glass glass-hover glow-border card-shine">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}>{project.category}</span>
                    {project.status?.toLowerCase() === "active" && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "#22c55e" }}>Active</span>
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 mb-[4rem]">
                    <h3 className="text-lg font-bold mb-2 leading-tight" style={{ color: "var(--text-primary)" }}>{project.title}</h3>
                    <p className="text-sm line-clamp-3 leading-relaxed" style={{ color: "var(--text-muted)" }}>{project.description}</p>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between pt-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" style={{ borderTop: "1px solid var(--border-primary)" }}>
                    <span className="text-sm font-medium" style={{ color: "var(--text-accent)" }}>Initialize</span>
                    <a href={project.github_url || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm" style={{ background: "var(--accent-glow)", color: "var(--text-accent)" }}>
                      <ExternalLink className="w-4 h-4" />Source
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
