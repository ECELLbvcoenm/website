"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { pastEvents } from "../lib/events";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Terminal, Sparkles } from "lucide-react";

// Helper to generate member image path from name
function getMemberImagePath(name: string) {
  return `/images/members/${name.toLowerCase().replace(/\s+/g, "_")}.jpg`;
}

import { LOCAL_MEMBERS } from "../lib/localMembers";

export default function Home() {
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState<"upcoming" | "past">("past");

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: mems } = await supabase
          .from("members")
          .select("*")
          .order("rank", { ascending: true });

        setMembers([...(mems || []), ...LOCAL_MEMBERS]);
      } catch (err) {
        setMembers(LOCAL_MEMBERS);
      }

      const mappedEvents = pastEvents.map((e) => ({
        ...e,
        category: e.type,
        description: e.shortDescription,
      }));
      setEvents(mappedEvents);
    }
    fetchData();
  }, []);

  const filteredEvents = events.filter((event) => {
    const monthYearMatch = event.date?.match(/([a-zA-Z]+) (\d{4})/);
    const parsedDate = monthYearMatch
      ? new Date(`${monthYearMatch[1]} 1, ${monthYearMatch[2]}`)
      : new Date(event.date);
    const isPast = isNaN(parsedDate.getTime()) ? false : parsedDate < new Date();
    return filter === "upcoming" ? !isPast : isPast;
  });

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div
      className="selection:bg-indigo-500/30 overflow-hidden"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        {/* Animated grid background */}
        <div className="absolute inset-0 z-0 grid-bg opacity-50" />

        {/* Gradient orbs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-[120px]" style={{ background: "var(--accent-glow)" }} />
          <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-[100px]" style={{ background: "rgba(99, 102, 241, 0.08)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px]" style={{ background: "rgba(139, 92, 246, 0.05)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div
                variants={fadeUpVariant}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium glass"
              >
                <Terminal className="w-4 h-4" style={{ color: "var(--text-accent)" }} />
                <span style={{ color: "var(--text-secondary)" }}>
                  E-Cell BVCOENM // V2.0
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUpVariant}
                className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05]"
              >
                Empowering Ideas,
                <br />
                <span className="animated-gradient-text">
                  Igniting Ventures.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUpVariant}
                className="text-lg md:text-xl max-w-lg leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                We are the architects of the future. Cultivating
                entrepreneurship and building the next generation of founders.
              </motion.p>

              <motion.div
                variants={fadeUpVariant}
                className="flex flex-wrap items-center gap-4 pt-4"
              >
                <Link
                  href="/join"
                  className="px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2 hover:scale-105 hover:shadow-lg"
                  style={{
                    background: "var(--gradient-hero)",
                    color: "#fff",
                    boxShadow: "0 0 30px var(--accent-glow-strong)",
                  }}
                >
                  Join Team <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/events"
                  className="px-8 py-4 rounded-full font-bold transition-all hover:scale-105 glass"
                  style={{ color: "var(--text-primary)" }}
                >
                  Events Timeline
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Hero Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative aspect-square w-full max-w-md mx-auto lg:max-w-none group"
            >
              <div
                className="absolute inset-0 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-50"
                style={{
                  background: "linear-gradient(135deg, var(--accent-glow), rgba(99,102,241,0.15))",
                }}
              />
              <div
                className="absolute inset-0 rounded-[3rem] overflow-hidden flex flex-col items-center justify-center backdrop-blur-sm relative z-10 card-shine"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-primary)",
                }}
              >
                <img
                  src="/images/events/logo/PHOTO-2026-03-15-01-22-36.jpg"
                  alt="E-Cell Official Logo"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out opacity-90"
                />

                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, var(--bg-primary) 5%, transparent 60%)",
                  }}
                />
                <div className="absolute bottom-10 left-10 right-10 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex flex-col items-center justify-center backdrop-blur-md animate-pulse"
                    style={{
                      border: "1px solid var(--border-glass)",
                      background: "var(--bg-glass)",
                      boxShadow: "0 0 20px var(--accent-glow)",
                    }}
                  >
                    <Sparkles className="w-5 h-5" style={{ color: "var(--accent-blue)" }} />
                  </div>
                  <div>
                    <p
                      className="font-mono tracking-widest text-sm font-bold uppercase"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Official Hub
                    </p>
                    <p
                      className="text-xs mt-1 tracking-widest uppercase"
                      style={{ color: "var(--text-accent)" }}
                    >
                      System Online
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PROTOCOL SECTION ── */}
      <section
        className="py-24"
        style={{
          borderTop: "1px solid var(--border-primary)",
          borderBottom: "1px solid var(--border-primary)",
          background: "var(--bg-card)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeUpVariant}
              className="font-mono text-xs uppercase tracking-[0.3em] mb-4"
              style={{ color: "var(--text-accent)" }}
            >
              Core Directives
            </motion.h2>
            <motion.h3
              variants={fadeUpVariant}
              className="text-4xl md:text-5xl font-bold tracking-tighter mb-16"
              style={{ color: "var(--text-primary)" }}
            >
              ARCHITECTS OF INNOVATION.
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: "PROTOCOL_01",
                  title: "Incubation",
                  desc: "Nurturing barebone ideas into structured, scalable models with dedicated mentorship.",
                },
                {
                  id: "PROTOCOL_02",
                  title: "Network",
                  desc: "Connecting visionaries with angel investors, VC firms, and industry veterans.",
                },
                {
                  id: "PROTOCOL_03",
                  title: "Innovation",
                  desc: "Deploying deep-tech solutions through hackathons and competitive sprints.",
                },
              ].map((protocol) => (
                <motion.div
                  key={protocol.id}
                  variants={fadeUpVariant}
                  className="p-8 rounded-2xl transition-all group glass glass-hover glow-border card-shine"
                >
                  <span
                    className="font-mono text-xs tracking-widest block mb-6"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {protocol.id}
                  </span>
                  <h4
                    className="text-2xl font-bold mb-4 transition-colors"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {protocol.title}
                  </h4>
                  <p
                    className="leading-relaxed text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {protocol.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── INDUSTRY PARTNERS ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-xs uppercase tracking-[0.3em] mb-12"
            style={{ color: "var(--text-muted)" }}
          >
            Industry Partners
          </motion.h3>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            {["NUTRIPULP", "STARBUCKS", "STARTUPNEWS", "iCOSMETIQUES"].map(
              (partner) => (
                <Link
                  href="/sponsors"
                  key={partner}
                  className="text-xl md:text-2xl font-black tracking-widest transition-colors cursor-pointer"
                  style={{ color: "var(--text-primary)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--text-accent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-primary)")
                  }
                >
                  {partner}
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── PRESERVED SECTIONS (TEAM & EVENTS) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-32">
        {/* THE TEAM */}
        <section>
          <div className="mb-12">
            <h1
              className="text-6xl font-black tracking-tighter italic transition-colors cursor-default"
              style={{ color: "var(--text-primary)" }}
            >
              THE COUNCIL.
            </h1>
            <p
              className="mt-2 text-lg font-medium uppercase tracking-[0.2em]"
              style={{ color: "var(--text-muted)" }}
            >
              Operational Command
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 pt-4 scrollbar-hide snap-x snap-mandatory">
            {members.map((member) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                key={member.id}
                className="min-w-[280px] snap-center group relative rounded-2xl p-6 transition-all duration-500 glass glass-hover glow-border card-shine"
              >
                <div
                  className="aspect-square w-full rounded-xl mb-6 flex items-center justify-center text-4xl font-bold grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-500 overflow-hidden relative"
                  style={{
                    background: "var(--bg-card)",
                    color: "var(--text-muted)",
                  }}
                >
                  <img
                    src={getMemberImagePath(member.name)}
                    alt={member.name}
                    className="w-full h-full object-cover absolute inset-0 z-10"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="z-0">{member.name?.[0]}</span>
                </div>
                <h3
                  className="text-xl font-bold tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {member.name}
                </h3>
                <p
                  className="text-xs font-black uppercase tracking-widest mt-1"
                  style={{ color: "var(--text-accent)" }}
                >
                  {member.role}
                </p>
              </motion.div>
            ))}
            {members.length === 0 && (
              <div
                className="min-w-full h-[300px] flex items-center justify-center rounded-[2rem]"
                style={{ border: "1px dashed var(--border-primary)" }}
              >
                <p
                  className="italic font-mono tracking-tighter uppercase"
                  style={{ color: "var(--text-muted)" }}
                >
                  // Fetching personnel records...
                </p>
              </div>
            )}
          </div>
        </section>

        {/* TRENDING EVENTS */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2
                className="text-5xl font-bold tracking-tighter"
                style={{ color: "var(--text-primary)" }}
              >
                TIMELINE.
              </h2>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Our journey from ideas to ventures.
              </p>
            </div>

            <div
              className="flex p-1 rounded-full backdrop-blur-md w-fit glass"
            >
              <button
                onClick={() => setFilter("past")}
                className="px-6 py-2 rounded-full text-[10px] tracking-widest font-black transition-all"
                style={{
                  background:
                    filter === "past"
                      ? "var(--accent-blue)"
                      : "transparent",
                  color:
                    filter === "past" ? "#fff" : "var(--text-muted)",
                  boxShadow:
                    filter === "past"
                      ? "0 0 20px var(--accent-glow-strong)"
                      : "none",
                }}
              >
                PAST
              </button>
              <button
                onClick={() => setFilter("upcoming")}
                className="px-6 py-2 rounded-full text-[10px] tracking-widest font-black transition-all"
                style={{
                  background:
                    filter === "upcoming"
                      ? "var(--accent-blue)"
                      : "transparent",
                  color:
                    filter === "upcoming" ? "#fff" : "var(--text-muted)",
                  boxShadow:
                    filter === "upcoming"
                      ? "0 0 20px var(--accent-glow-strong)"
                      : "none",
                }}
              >
                UPCOMING
              </button>
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="flex gap-8 overflow-x-auto pb-12 pt-4 scrollbar-hide snap-x snap-mandatory px-2">
              {filteredEvents.map((event) => (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  key={event.id}
                  className="min-w-[320px] md:min-w-[450px] snap-center backdrop-blur-sm rounded-[2rem] p-10 relative group transition-all duration-700 flex flex-col glass glass-hover glow-border card-shine"
                >
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 block"
                    style={{ color: "var(--text-accent)", opacity: 0.6 }}
                  >
                    {event.category || "Event"}
                  </span>
                  <h3
                    className="text-3xl font-bold mb-4 transition-colors"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {event.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-8 flex-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className="font-mono text-xs italic"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {event.date}
                    </span>
                    <Link
                      href={`/events/${event.id}`}
                      className="h-8 w-8 rounded-full flex items-center justify-center transition-all z-10"
                      style={{
                        border: "1px solid var(--border-primary)",
                        color: "var(--text-primary)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--accent-blue)";
                        e.currentTarget.style.borderColor = "var(--accent-blue)";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "var(--border-primary)";
                        e.currentTarget.style.color = "var(--text-primary)";
                      }}
                    >
                      <span className="text-lg">→</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div
              className="h-[300px] flex items-center justify-center rounded-[2rem]"
              style={{ border: "1px dashed var(--border-primary)" }}
            >
              <p
                className="italic font-mono tracking-tighter uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                // No {filter} events discovered in the logs...
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}