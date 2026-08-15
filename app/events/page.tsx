"use client";

import { motion } from "framer-motion";
import { pastEvents } from "../../lib/events";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";

export default function EventsPage() {
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
      className="min-h-screen selection:bg-indigo-500/30 overflow-hidden pt-32 pb-32"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{ background: "var(--accent-glow)" }}
        />
        <div
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-[100px]"
          style={{ background: "rgba(99,102,241,0.05)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-4 mb-14 pb-14 border-b"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <motion.p
            variants={fadeUpVariant}
            className="font-mono text-xs uppercase tracking-[0.24em]"
            style={{ color: "var(--text-muted)" }}
          >
            Events
          </motion.p>
          <motion.h1
            variants={fadeUpVariant}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[1.02]"
          >
            Event
            <br />
            <span style={{ color: "var(--text-secondary)" }}>Chronicles.</span>
          </motion.h1>
          <motion.p
            variants={fadeUpVariant}
            className="mt-2 text-lg md:text-2xl max-w-3xl leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            A timeline of ideas, ventures, and monumental events.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {pastEvents.map((event) => (
            <motion.div
              variants={fadeUpVariant}
              key={event.id}
              className="backdrop-blur-sm rounded-[2rem] overflow-hidden group transition-all duration-700 flex flex-col glass glass-hover glow-border"
            >
              <div
                className="relative h-64 w-full overflow-hidden"
                style={{ background: "var(--bg-card)" }}
              >
                {event.coverImage ? (
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center opacity-50">
                    <p
                      className="font-mono text-xs tracking-widest"
                      style={{ color: "var(--text-muted)" }}
                    >
                      [ NO IMAGE DATA ]
                    </p>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3 py-1 rounded-full backdrop-blur-md text-[10px] font-black uppercase tracking-widest glass"
                    style={{ color: "var(--text-accent)" }}
                  >
                    {event.type}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <h3
                  className="text-2xl font-bold mb-4 transition-colors"
                  style={{ color: "var(--text-primary)" }}
                >
                  {event.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-6 flex-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {event.shortDescription}
                </p>

                <div className="space-y-3 mb-6">
                  <div
                    className="flex items-center text-xs font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Calendar className="w-4 h-4 mr-3" />
                    <span>{event.date}</span>
                  </div>
                  <div
                    className="flex items-center text-xs font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Clock className="w-4 h-4 mr-3" />
                    <span>{event.time}</span>
                  </div>
                  {event.ref && (
                    <div
                      className="flex items-center text-xs font-mono"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <MapPin className="w-4 h-4 mr-3" />
                      <span>{event.ref}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/events/${event.id}`}
                  className="flex items-center justify-between mt-auto pt-6"
                  style={{ borderTop: "1px solid var(--border-primary)" }}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-widest transition-colors text-[var(--text-muted)] group-hover:text-[var(--text-accent)]"
                  >
                    Explore Details
                  </span>
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center transition-all border border-[var(--border-primary)] text-[var(--text-primary)] group-hover:border-[var(--accent-blue)] group-hover:text-[var(--text-accent)]"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
