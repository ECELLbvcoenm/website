"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { pastEvents } from "../lib/events";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function getMemberImagePath(name: string) {
  return `/images/members/${name.toLowerCase().replace(/\s+/g, "_")}.jpg`;
}

import { LOCAL_MEMBERS } from "../lib/localMembers";
import { pastEvents as PastEventType } from "../lib/events";

type MemberRow = {
  id: string | number;
  name: string;
  role: string;
  department?: string;
  rank?: number;
};

type EventRow = (typeof PastEventType)[number] & {
  category?: string;
  description?: string;
};

export default function Home() {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [filter, setFilter] = useState<"upcoming" | "past">("past");

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: mems } = await supabase
          .from("members")
          .select("*")
          .order("rank", { ascending: true });

        setMembers([...(mems || []), ...LOCAL_MEMBERS]);
      } catch {
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

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-20 border-b" style={{ borderColor: "var(--border-primary)" }}>
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <p className="font-data text-xs tracking-[0.2em] uppercase mb-6" style={{ color: "var(--text-muted)" }}>
                Entrepreneurship Cell — BVCOENM, Navi Mumbai
              </p>

              <h1
                className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                Where a rough idea
                <br />
                becomes a first pitch.
              </h1>

              <p
                className="text-lg max-w-xl leading-relaxed mb-9"
                style={{ color: "var(--text-secondary)" }}
              >
                We run the seminars, competitions and bootcamps that take a student
                from &ldquo;I have an idea&rdquo; to standing in front of judges with a plan.
                Seven events in, and counting.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/join"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm transition-transform hover:-translate-y-0.5"
                  style={{ background: "var(--gradient-hero)", color: "#fff" }}
                >
                  Join the team <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm transition-colors glass glass-hover"
                  style={{ color: "var(--text-primary)" }}
                >
                  See past events
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
            >
              <div className="index-card overflow-hidden">
                <div className="aspect-[4/5] w-full relative">
                  <img
                    src="/images/events/logo/PHOTO-2026-03-15-01-22-36.jpg"
                    alt="E-Cell BVCOENM"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex items-center justify-between rule">
                  <span className="font-data text-xs tracking-[0.15em] uppercase" style={{ color: "var(--text-muted)" }}>
                    E-Cell BVCOENM
                  </span>
                  <span className="font-data text-xs" style={{ color: "var(--text-accent)" }}>
                    est. 2024
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-28">
        {/* TEAM */}
        <section>
          <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-2">
                The team
              </h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Students running E-Cell this year, across departments.
              </p>
            </div>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4 pt-1 scrollbar-hide snap-x snap-mandatory">
            {members.map((member) => (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={member.id}
                className="min-w-[240px] snap-start index-card glass-hover p-5"
              >
                <div
                  className="aspect-square w-full rounded-md mb-5 flex items-center justify-center text-3xl font-semibold overflow-hidden relative"
                  style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}
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
                <h3 className="text-base font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
                  {member.name}
                </h3>
                <p
                  className="font-data text-[11px] font-medium uppercase tracking-widest mt-1"
                  style={{ color: "var(--text-accent)" }}
                >
                  {member.role}
                </p>
              </motion.div>
            ))}
            {members.length === 0 && (
              <div className="min-w-full h-[220px] flex items-center justify-center index-card">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Loading the team roster…
                </p>
              </div>
            )}
          </div>
        </section>

        {/* EVENTS */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-2">
                Events
              </h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                What we&apos;ve run so far, and what&apos;s coming up.
              </p>
            </div>

            <div className="flex p-1 rounded-md w-fit index-card">
              <button
                onClick={() => setFilter("past")}
                className="px-5 py-1.5 rounded text-xs font-semibold tracking-wide transition-colors"
                style={{
                  background: filter === "past" ? "var(--text-accent)" : "transparent",
                  color: filter === "past" ? "#fff" : "var(--text-muted)",
                }}
              >
                PAST
              </button>
              <button
                onClick={() => setFilter("upcoming")}
                className="px-5 py-1.5 rounded text-xs font-semibold tracking-wide transition-colors"
                style={{
                  background: filter === "upcoming" ? "var(--text-accent)" : "transparent",
                  color: filter === "upcoming" ? "#fff" : "var(--text-muted)",
                }}
              >
                UPCOMING
              </button>
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto pb-6 pt-1 scrollbar-hide snap-x snap-mandatory px-1">
              {filteredEvents.map((event) => (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={event.id}
                  className="min-w-[300px] md:min-w-[400px] snap-start index-card p-8 relative flex flex-col glass-hover"
                >
                  <span className="stamp mb-5 w-fit">{event.category || "Event"}</span>
                  <h3 className="text-2xl font-display font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                    {event.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-8 flex-1" style={{ color: "var(--text-secondary)" }}>
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-5 rule">
                    <span className="font-data text-xs" style={{ color: "var(--text-muted)" }}>
                      {event.date}
                    </span>
                    <Link
                      href={`/events/${event.id}`}
                      className="h-8 w-8 rounded-full flex items-center justify-center transition-colors"
                      style={{ border: "1px solid var(--border-primary)", color: "var(--text-primary)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--text-accent)";
                        e.currentTarget.style.borderColor = "var(--text-accent)";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "var(--border-primary)";
                        e.currentTarget.style.color = "var(--text-primary)";
                      }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center index-card">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No {filter} events listed right now.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
