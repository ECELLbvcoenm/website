"use client";

import { motion } from "framer-motion";
import { pastEvents } from "../../lib/events";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export default function EventsPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <div className="min-h-screen pt-32 pb-32" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-16 max-w-2xl">
          <span className="stamp mb-4 inline-flex">§ 02 · Events</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-4 mt-4">
            The full record.
          </h1>
          <div className="dim-line ml-0 mb-6 max-w-xs" />
          <p className="text-lg leading-relaxed normal-case" style={{ color: "var(--text-secondary)" }}>
            Every seminar, competition and bootcamp we&apos;ve run, in one place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents.map((event, i) => (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.05 }}
              key={event.id}
              className="index-card glass-hover overflow-hidden flex flex-col"
            >
              <div className="relative h-56 w-full" style={{ background: "var(--bg-secondary)" }}>
                {event.coverImage ? (
                  <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="font-data text-xs" style={{ color: "var(--text-muted)" }}>
                      No cover image
                    </p>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="stamp" style={{ background: "var(--bg-primary)" }}>
                    {event.type}
                  </span>
                </div>
              </div>

              <div className="p-7 flex flex-col flex-1">
                <h3 className="font-display text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                  {event.title}
                </h3>
                <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "var(--text-secondary)" }}>
                  {event.shortDescription}
                </p>

                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center text-xs font-data" style={{ color: "var(--text-muted)" }}>
                    <Calendar className="w-3.5 h-3.5 mr-2.5" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-xs font-data" style={{ color: "var(--text-muted)" }}>
                    <Clock className="w-3.5 h-3.5 mr-2.5" />
                    <span>{event.time}</span>
                  </div>
                </div>

                <Link
                  href={`/events/${event.id}`}
                  className="flex items-center justify-between mt-auto pt-5 rule"
                >
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                    Read more
                  </span>
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ border: "1px solid var(--border-primary)", color: "var(--text-primary)" }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
