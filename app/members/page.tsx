"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

// The schema is strictly assumed based on the implementation plan
type Member = {
  id: string | number;
  name: string;
  role: string;
  department: string;
  image_url?: string;
  rank?: number;
};

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
          .order("rank", { ascending: true }) // Maintains any hierarchical sorting from previous configs
          .order("name", { ascending: true }); // Fallback alphabetical

        if (error) {
          console.error("Error fetching members:", error);
        } else {
          setMembers(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembers();
  }, []);

  // Group the members array by their 'department' key
  const groupedMembers = members.reduce((acc, member) => {
    const dept = member.department || "UNASSIGNED";
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(member);
    return acc;
  }, {} as Record<string, Member[]>);

  // Staggered animation configs
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans pb-32">
      
      {/* Structural Ambient Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-zinc-900/40 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b border-white/10 pb-12 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4 uppercase">
              OUR NETWORK.
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-xl">
              The neural network driving Bharati Vidyapeeth's entrepreneurial ecosystem.
            </p>
          </motion.div>

          {/* Monospace Stat Box */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 rounded-xl flex items-center justify-between gap-12 font-mono shrink-0"
          >
            <div className="flex flex-col">
              <span className="text-zinc-500 text-xs tracking-widest uppercase mb-1">Total Nodes</span>
              <span className="text-3xl font-bold text-blue-500">{members.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-500 text-xs tracking-widest uppercase mb-1">Partitions</span>
              <span className="text-3xl font-bold text-white">{Object.keys(groupedMembers).length}</span>
            </div>
          </motion.div>
        </div>

        {/* --- LOADING or GROUPS --- */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-zinc-500 animate-spin mb-6" />
            <p className="text-zinc-400 text-sm font-mono tracking-widest animate-pulse uppercase">
              Connecting to Registry...
            </p>
          </div>
        ) : (
          <div className="space-y-32">
            {Object.entries(groupedMembers).map(([department, deptMembers], index) => (
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
                  <div className="md:sticky md:top-32 border-l-2 border-blue-500/50 pl-6 py-2">
                    <span className="font-mono text-zinc-500 text-xs tracking-widest block mb-4">
                      UNIT {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase break-words">
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
                        className="group relative bg-zinc-900/30 border border-white/5 rounded-2xl p-6 transition-all duration-500 hover:bg-zinc-800/50 hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] flex flex-col"
                      >
                        {/* Image / Placeholder */}
                        <div className="aspect-square w-full rounded-xl mb-6 bg-zinc-800/50 flex items-center justify-center text-7xl font-bold text-zinc-700/50 grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-500 overflow-hidden relative">
                          {member.image_url ? (
                            <img 
                              src={member.image_url} 
                              alt={member.name} 
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <span>{member.name[0]?.toUpperCase()}</span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="mt-auto">
                          <h3 className="text-xl font-bold tracking-tight mb-1 text-white group-hover:text-blue-50 transition-colors line-clamp-1">
                            {member.name}
                          </h3>
                          <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest line-clamp-2">
                            {member.role}
                          </p>
                        </div>
                        
                        {/* Decorative UI line block */}
                        <div className="absolute top-6 right-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-1 h-3 bg-blue-500 rounded-sm animate-pulse" />
                            <div className="w-1 h-2 bg-blue-500/50 rounded-sm" />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

              </motion.div>
            ))}

            {members.length === 0 && (
              <div className="py-20 text-center border border-dashed border-white/5 bg-white/[0.01] rounded-2xl backdrop-blur-sm">
                <p className="text-zinc-700 font-mono text-sm tracking-widest uppercase mb-2">Registry Empty</p>
                <p className="text-zinc-500">No members configured in the database.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
