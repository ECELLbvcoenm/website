"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const sponsors = [
  {
    name: "Starbucks",
    logo: "/images/sponsors/starbucks.png",
    description: "Kept the coffee coming through late-night planning sessions and event days.",
  },
  {
    name: "Nutripulp",
    logo: "/images/sponsors/nutripulp.png",
    description: "Provided beverages for our bootcamp and larger events.",
  },
  {
    name: "StartupNews",
    logo: "/images/sponsors/startupnews.png",
    description: "Our media partner — covers E-Cell events for a wider audience.",
  },
  {
    name: "iCosmetiques",
    logo: "/images/sponsors/icosmetiques.png",
    description: "Supported our competitions with prizes and outreach.",
  },
];

export default function SponsorsPage() {
  return (
    <div className="min-h-screen pt-32 pb-32" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 max-w-2xl"
        >
          <p className="font-data text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "var(--text-muted)" }}>
            Sponsors
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight mb-4">
            Who backs us.
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            The businesses that support our events with funding, prizes, and reach.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sponsors.map((sponsor, i) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="index-card glass-hover p-8 flex flex-col items-center text-center"
            >
              <div
                className="w-full h-40 mb-6 flex items-center justify-center rounded-md overflow-hidden"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-primary)" }}
              >
                <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="font-display text-2xl font-semibold mb-3 tracking-tight" style={{ color: "var(--text-primary)" }}>
                {sponsor.name}
              </h2>
              <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--text-secondary)" }}>
                {sponsor.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 index-card p-10 md:p-14 text-center"
        >
          <h3 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Want to sponsor an event?
          </h3>
          <p className="max-w-xl mx-auto mb-8" style={{ color: "var(--text-secondary)" }}>
            We&apos;re always open to partners for our seminars, competitions, and bootcamps.
            Reach out and we&apos;ll walk you through what that looks like.
          </p>
          <Link
            href="/join"
            className="inline-flex px-7 py-3.5 rounded-md font-semibold text-sm transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--gradient-hero)", color: "#fff" }}
          >
            Get in touch
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
