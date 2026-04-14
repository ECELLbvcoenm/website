"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const sponsors = [
  {
    name: "Starbucks",
    logo: "/images/sponsors/starbucks.png",
    description:
      "Fueling late-night brainstorming sessions and marathon hackathons.",
  },
  {
    name: "Nutripulp",
    logo: "/images/sponsors/nutripulp.png",
    description:
      "Providing healthy, refreshing beverages to fuel our next generation of entrepreneurs.",
  },
  {
    name: "StartupNews",
    logo: "/images/sponsors/startupnews.png",
    description:
      "Our official media partner, broadcasting E-Cell's vision to the world.",
  },
  {
    name: "iCosmetiques",
    logo: "/images/sponsors/icosmetiques.png",
    description:
      "Supporting innovation and aesthetic excellence in our ecosystem.",
  },
];

export default function SponsorsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 },
    },
  };

  return (
    <div
      className="min-h-screen pt-32 pb-32 overflow-hidden selection:bg-indigo-500/30"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{ background: "var(--accent-glow)" }}
        />
        <div
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-[100px]"
          style={{ background: "rgba(139,92,246,0.05)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 pb-14 border-b text-left"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <p
            className="font-mono text-xs uppercase tracking-[0.24em] mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Sponsors
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.02]">
            Our
            <br />
            <span style={{ color: "var(--text-secondary)" }}>Partners.</span>
          </h1>
          <p
            className="mt-8 max-w-3xl text-lg md:text-2xl leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            These industry leaders support our mission to cultivate
            entrepreneurship and build the next generation of visionary
            founders.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {sponsors.map((sponsor) => (
            <motion.div
              key={sponsor.name}
              variants={cardVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="backdrop-blur-md rounded-[2rem] p-10 group relative overflow-hidden flex flex-col items-center glass glass-hover glow-border card-shine"
            >
              <div
                className="w-full h-48 mb-8 relative flex items-center justify-center rounded-2xl overflow-hidden transition-colors"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-primary)",
                }}
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <h2
                className="text-3xl font-bold mb-4 tracking-tight transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                {sponsor.name}
              </h2>
              <p
                className="text-sm leading-relaxed max-w-sm text-center relative z-10"
                style={{ color: "var(--text-secondary)" }}
              >
                {sponsor.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-32 p-12 rounded-[3rem] relative overflow-hidden glass glow-border"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top, var(--accent-glow), transparent 50%)",
            }}
          />
          <h3
            className="text-3xl md:text-5xl font-black tracking-tighter mb-6 relative z-10"
            style={{ color: "var(--text-primary)" }}
          >
            Partner with Us
          </h3>
          <p
            className="max-w-xl mx-auto mb-8 relative z-10"
            style={{ color: "var(--text-secondary)" }}
          >
            Join our ecosystem and help us shape the future of innovation. Get
            in touch to explore sponsorship opportunities.
          </p>
          <button
            className="relative z-10 px-8 py-4 rounded-full font-bold transition-all hover:scale-105"
            style={{
              background: "var(--gradient-hero)",
              color: "#fff",
              boxShadow: "0 0 30px var(--accent-glow-strong)",
            }}
          >
            Contact Team
          </button>
        </motion.div>
      </div>
    </div>
  );
}
