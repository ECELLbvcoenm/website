"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
          setMembers(LOCAL_MEMBERS.sort((a, b) => (a.rank || 999) - (b.rank || 999)));
        } else {
          const combined = [...(data || []), ...LOCAL_MEMBERS];
          const EXCLUDED_NAMES = ["Vaibhav Dhepe", "Ganesh Wadhe"];
          const filtered = combined.filter((m) => !EXCLUDED_NAMES.includes(m.name));
          const sorted = filtered.sort((a, b) => (a.rank || 999) - (b.rank || 999));
          setMembers(sorted);
        }
      } catch {
        setMembers(LOCAL_MEMBERS.sort((a, b) => (a.rank || 999) - (b.rank || 999)));
      } finally {
        setIsLoading(false);
      }
    }
    fetchMembers();
  }, []);

  const groupedMembers = members.reduce((acc, member) => {
    const dept = member.department || "Unassigned";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(member);
    return acc;
  }, {} as Record<string, Member[]>);

  return (
    <div className="min-h-screen pb-32" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-10 mb-16 rule">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
            <p className="font-data text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "var(--text-muted)" }}>
              Team
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight mb-4">
              The people behind it.
            </h1>
            <p className="text-lg max-w-xl" style={{ color: "var(--text-secondary)" }}>
              Everyone currently running E-Cell, organised by department.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="index-card p-6 flex items-center gap-10 shrink-0"
          >
            <div className="flex flex-col">
              <span className="font-data text-xs tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)" }}>
                Members
              </span>
              <span className="font-display text-3xl font-semibold" style={{ color: "var(--text-accent)" }}>
                {members.length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-data text-xs tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)" }}>
                Departments
              </span>
              <span className="font-display text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
                {Object.keys(groupedMembers).length}
              </span>
            </div>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin mb-5" style={{ color: "var(--text-muted)" }} />
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Loading the team…
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            {Object.entries(groupedMembers).map(([department, deptMembers], index) => (
              <motion.div
                key={department}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-10"
              >
                <div className="md:col-span-1">
                  <div className="md:sticky md:top-28" style={{ borderLeft: "2px solid var(--text-accent)", paddingLeft: "1.25rem" }}>
                    <span className="font-data text-xs tracking-widest block mb-2" style={{ color: "var(--text-muted)" }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight break-words">
                      {department}
                    </h2>
                  </div>
                </div>

                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {deptMembers.map((member) => (
                    <div key={member.id} className="index-card glass-hover p-5 flex flex-col">
                      <div
                        className="aspect-square w-full rounded-md mb-5 flex items-center justify-center text-5xl font-semibold overflow-hidden relative"
                        style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}
                      >
                        {member.image_url ? (
                          <img src={member.image_url} alt={member.name} className="absolute inset-0 w-full h-full object-cover" />
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
                      <div className="mt-auto">
                        <h3 className="text-base font-semibold tracking-tight mb-1 line-clamp-1" style={{ color: "var(--text-primary)" }}>
                          {member.name}
                        </h3>
                        <p
                          className="font-data text-[11px] font-medium uppercase tracking-widest line-clamp-2"
                          style={{ color: "var(--text-accent)" }}
                        >
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {members.length === 0 && (
              <div className="py-20 text-center index-card">
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  No members listed yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
