"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Linkedin } from "lucide-react";
import { NEC_MEMBERS } from "@/lib/necMembers";

export default function NecPage() {
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
      className="min-h-screen font-sans pb-32"
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
              National Entrepreneurship Challenge
            </p>
            <h1
              className="text-5xl md:text-7xl font-black tracking-tight leading-[1.02] mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              NEC
              <br />
              <span style={{ color: "var(--text-secondary)" }}>Team.</span>
            </h1>
            <p
              className="text-lg md:text-xl max-w-3xl leading-relaxed mt-4"
              style={{ color: "var(--text-secondary)" }}
            >
              The National Entrepreneurship Challenge (NEC) is India&apos;s first and largest entrepreneurship competition for students, organized by the Entrepreneurship Cell of IIT Bombay. It is a rigorous 6-month-long challenge designed to guide students in building a thriving entrepreneurial ecosystem from scratch. 
              <br/><br/>
              Our dedicated NEC Team represents E-Cell BVCOENM in this prestigious competition, tackling real-world startup challenges, executing strategic initiatives, and fostering a culture of innovation on our campus.
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
                Team Size
              </span>
              <span
                className="text-3xl font-bold"
                style={{ color: "var(--text-accent)" }}
              >
                {NEC_MEMBERS.length}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Members Grid */}
        <div className="space-y-32">
          <motion.div
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
                  UNIT 01
                </span>
                <h2
                  className="text-3xl md:text-4xl font-bold tracking-tighter uppercase break-words"
                  style={{ color: "var(--text-primary)" }}
                >
                  NEC TEAM
                </h2>
              </div>
            </div>

            {/* Right Column: Member Cards Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {NEC_MEMBERS.map((member) => (
                <motion.div
                  key={member.id}
                  variants={itemVariants}
                  className="group relative flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-4 bg-zinc-900/50">
                    <img
                      src={`/images/nec/${member.image}`}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                          member.name;
                      }}
                    />
                  </div>

                  {/* Member Info */}
                  <div className="flex-grow flex flex-col">
                    <h3
                      className="text-lg font-bold tracking-tight mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {member.name}
                    </h3>
                    <p
                      className="text-sm font-mono tracking-wider uppercase mb-3"
                      style={{ color: "var(--accent-blue)" }}
                    >
                      {member.role}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
