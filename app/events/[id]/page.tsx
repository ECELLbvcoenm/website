"use client";

import { motion } from "framer-motion";
import { pastEvents } from "../../../lib/events";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const event = pastEvents.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        <h1 className="font-display text-4xl font-semibold tracking-tight mb-3">
          We couldn&apos;t find that event.
        </h1>
        <p className="mb-8 text-sm" style={{ color: "var(--text-muted)" }}>
          It may have been removed, or the link is out of date.
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 rounded-md index-card glass-hover text-sm font-semibold"
        >
          Go back
        </button>
      </div>
    );
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <div className="min-h-screen pt-32 pb-32" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/events"
          className="inline-flex items-center transition-colors mb-12 text-sm font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to events
        </Link>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-14">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="stamp">{event.type}</span>
            {event.ref && (
              <span className="font-data text-xs tracking-widest" style={{ color: "var(--text-muted)" }}>
                {event.ref}
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6" style={{ color: "var(--text-secondary)" }}>
            <div className="flex items-center text-sm font-data">
              <Calendar className="w-4 h-4 mr-2.5" style={{ color: "var(--text-muted)" }} />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center text-sm font-data">
              <Clock className="w-4 h-4 mr-2.5" style={{ color: "var(--text-muted)" }} />
              <span>{event.time}</span>
            </div>
          </div>
        </motion.div>

        {event.coverImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full aspect-video md:aspect-[21/9] rounded-lg overflow-hidden mb-14 index-card"
          >
            <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="index-card p-8 md:p-10 leading-relaxed text-[15px]" style={{ color: "var(--text-secondary)" }}>
            {event.fullDescription}
          </div>
        </motion.div>

        {event.gallery && event.gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h3 className="font-display text-2xl font-semibold tracking-tight mb-6">Photos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.gallery.map((imgUrl, idx) => (
                <div key={idx} className="aspect-video rounded-lg overflow-hidden index-card">
                  <img
                    src={imgUrl}
                    alt={`${event.title} photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
