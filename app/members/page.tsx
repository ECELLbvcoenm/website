"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

type Member = {
  id: string | number;
  name: string;
  role: string;
  department: string;
  image_url?: string;
  rank?: number;
};

import { LOCAL_MEMBERS } from "@/lib/localMembers";

function getMemberImagePath(name: string) {
  return `/images/members/${name.toLowerCase().replace(/\s+/g, "_")}.jpg`;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("members")
          .select("*")
          .order("rank", { ascending: true })
          .order("name", { ascending: true });

        if (error) {
          console.warn("Notice: Database unreachable for members", error);
          setMembers(LOCAL_MEMBERS.sort((a, b) => (a.rank || 999) - (b.rank || 999)));
        } else {
          const combined = [...(data || []), ...LOCAL_MEMBERS];
          const EXCLUDED_NAMES = ["Vaibhav Dhepe", "Ganesh Wadhe"];
          
          // Filter out excluded members and those who might be duplicates
          const filtered = combined.filter(m => !EXCLUDED_NAMES.includes(m.name));
          
          // Sort by rank to ensure consistent team ordering
          const sorted = filtered.sort((a, b) => (a.rank || 999) - (b.rank || 999));
          setMembers(sorted);
        }
      } catch (err) {
        console.warn("Unexpected database error:", err);
        setMembers(LOCAL_MEMBERS.sort((a, b) => (a.rank || 999) - (b.rank || 999)));
      } finally {
        setIsLoading(false);
      }
    }
    fetchMembers();
  }, []);

  const groupedMembers = members.reduce((acc, member) => {
    const dept = member.department || "UNASSIGNED";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(member);
    return acc;
  }, {} as Record<string, Member[]>);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <div
      className="min-h-screen selection:bg-indigo-500/30 font-sans pb-32"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* Ambient Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3"
          style={{ background: "var(--accent-glow)" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        {/* Header */}
        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-12 mb-16"
          style={{ borderBottom: "1px solid var(--border-primary)" }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <p
              className="font-mono text-xs uppercase tracking-[0.24em] mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              Members
            </p>
            <h1
              className="text-5xl md:text-7xl font-black tracking-tight leading-[1.02] mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Core
              <br />
              <span style={{ color: "var(--text-secondary)" }}>Network.</span>
            </h1>
            <p
              className="text-lg md:text-2xl max-w-2xl leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              The people driving Bharati Vidyapeeth&apos;s student entrepreneurship
              ecosystem.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-xl flex items-center justify-between gap-12 font-mono shrink-0"
          >
            <div className="flex flex-col">
              <span
                className="text-xs tracking-widest uppercase mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Total Nodes
              </span>
              <span
                className="text-3xl font-bold"
                style={{ color: "var(--text-accent)" }}
              >
                {members.length}
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="text-xs tracking-widest uppercase mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Partitions
              </span>
              <span
                className="text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {Object.keys(groupedMembers).length}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Loading or Groups */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2
              className="w-10 h-10 animate-spin mb-6"
              style={{ color: "var(--text-muted)" }}
            />
            <p
              className="text-sm font-mono tracking-widest animate-pulse uppercase"
              style={{ color: "var(--text-secondary)" }}
            >
              Connecting to Registry...
            </p>
          </div>
        ) : (
          <div className="space-y-32">
            {Object.entries(groupedMembers).map(
              ([department, deptMembers], index) => (
                <motion.div
                  key={department}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-12"
                >
                  {/* Left Column: Sticky Department Header */}
                  <div className="md:col-span-1">
                    <div
                      className="md:sticky md:top-32 pl-6 py-2"
                      style={{
                        borderLeft: "2px solid var(--accent-blue)",
                      }}
                    >
                      <span
                        className="font-mono text-xs tracking-widest block mb-4"
                        style={{ color: "var(--text-muted)" }}
                      >
                        UNIT {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2
                        className="text-3xl md:text-4xl font-bold tracking-tighter uppercase break-words"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {department}
                      </h2>
                    </div>
                  </div>

                  {/* Right Column: Member Cards Grid */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    <AnimatePresence>
                      {deptMembers.map((member) => (
                        <motion.div
                          key={member.id}
                          variants={itemVariants}
                          className="group relative rounded-2xl p-6 transition-all duration-500 flex flex-col glass glass-hover glow-border card-shine"
                        >
                          {/* Image / Placeholder */}
                          <div
                            className="aspect-square w-full rounded-xl mb-6 flex items-center justify-center text-7xl font-bold grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-500 overflow-hidden relative"
                            style={{
                              background: "var(--bg-card)",
                              color: "var(--text-muted)",
                            }}
                          >
                            {member.image_url ? (
                              <img
                                src={member.image_url}
                                alt={member.name}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            ) : (
                              <>
                                <img
                                  src={getMemberImagePath(member.name)}
                                  alt={member.name}
                                  className="absolute inset-0 w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                  }}
                                />
                                <span>{member.name[0]?.toUpperCase()}</span>
                              </>
                            )}
                          </div>

                          {/* Details */}
                          <div className="mt-auto">
                            <h3
                              className="text-xl font-bold tracking-tight mb-1 transition-colors line-clamp-1"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {member.name}
                            </h3>
                            <p
                              className="text-[10px] font-black uppercase tracking-widest line-clamp-2"
                              style={{ color: "var(--text-accent)" }}
                            >
                              {member.role}
                            </p>
                          </div>

                          {/* Decorative UI line */}
                          <div className="absolute top-6 right-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div
                              className="w-1 h-3 rounded-sm animate-pulse"
                              style={{ background: "var(--accent-blue)" }}
                            />
                            <div
                              className="w-1 h-2 rounded-sm"
                              style={{
                                background: "var(--accent-blue)",
                                opacity: 0.5,
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )
            )}

            {members.length === 0 && (
              <div
                className="py-20 text-center rounded-2xl backdrop-blur-sm glass"
              >
                <p
                  className="font-mono text-sm tracking-widest uppercase mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Registry Empty
                </p>
                <p style={{ color: "var(--text-secondary)" }}>
                  No members configured in the database.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
