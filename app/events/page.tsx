"use client";

import { motion } from "framer-motion";
import { pastEvents } from "../../lib/events";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";

export default function EventsPage() {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="bg-black text-white min-h-screen selection:bg-blue-500/30 overflow-hidden pt-32 pb-32">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-4 mb-16"
        >
          <motion.h1 
            variants={fadeUpVariant}
            className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] italic hover:text-blue-500 transition-colors cursor-default uppercase"
          >
            Chronicles.
          </motion.h1>
          <motion.p 
            variants={fadeUpVariant}
            className="text-zinc-500 text-lg md:text-xl max-w-2xl leading-relaxed uppercase tracking-[0.2em] font-medium"
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
              className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-[2rem] overflow-hidden group transition-all duration-700 hover:border-blue-500/50 hover:shadow-[0_0_50px_-20px_rgba(59,130,246,0.3)] flex flex-col"
            >
              <div className="relative h-64 w-full overflow-hidden bg-zinc-800">
                {event.coverImage ? (
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center opacity-50">
                    <p className="font-mono text-xs text-zinc-500 tracking-widest">[ NO IMAGE DATA ]</p>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    {event.type}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors">{event.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">{event.shortDescription}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-zinc-500 text-xs font-mono">
                    <Calendar className="w-4 h-4 mr-3 text-zinc-600" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-zinc-500 text-xs font-mono">
                    <Clock className="w-4 h-4 mr-3 text-zinc-600" />
                    <span>{event.time}</span>
                  </div>
                  {event.ref && (
                    <div className="flex items-center text-zinc-500 text-xs font-mono">
                      <MapPin className="w-4 h-4 mr-3 text-zinc-600" />
                      <span>{event.ref}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/events/${event.id}`}
                  className="flex items-center justify-between mt-auto pt-6 border-t border-white/5 group-hover:block"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">
                    Explore Details
                  </span>
                  <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all text-white">
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
