"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { pastEvents } from "../lib/events";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

export default function Home() {
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState<"upcoming" | "past">("past");

  useEffect(() => {
    async function fetchData() {
      const { data: mems } = await supabase
        .from("members")
        .select("*")
        .order("rank", { ascending: true });
        
      setMembers(mems || []);
      
      // Load static local events mapping their custom fields directly to the display logic
      const mappedEvents = pastEvents.map(e => ({
        ...e,
        category: e.type,
        description: e.shortDescription,
      }));
      setEvents(mappedEvents);
    }
    fetchData();
  }, []);

  const filteredEvents = events.filter((event) => {
    // Extract month and year from strings like "12th, 13th & 15th February 2025"
    const monthYearMatch = event.date?.match(/[a-zA-Z]+ \d{4}/);
    const parsedDate = monthYearMatch ? new Date(monthYearMatch[0]) : new Date(event.date);
    const isPast = isNaN(parsedDate.getTime()) ? false : parsedDate < new Date();
    
    return filter === "upcoming" ? !isPast : isPast;
  });

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="bg-black text-white selection:bg-blue-500/30 overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px]" />
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
              <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white/70">
                <Terminal className="w-4 h-4" />
                <span>E-Cell BVCOENM // V2.0</span>
              </motion.div>
              
              <motion.h1 
                variants={fadeUpVariant}
                className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1]"
              >
                Empowering Ideas, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
                  Igniting Ventures.
                </span>
              </motion.h1>
              
              <motion.p 
                variants={fadeUpVariant}
                className="text-zinc-400 text-lg md:text-xl max-w-lg leading-relaxed"
              >
                We are the architects of the future. Cultivating entrepreneurship and building the next generation of founders.
              </motion.p>
              
              <motion.div variants={fadeUpVariant} className="flex flex-wrap items-center gap-4 pt-4">
                <Link 
                  href="/join" 
                  className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-slate-200 hover:scale-105 transition-all flex items-center gap-2"
                >
                  Join Team <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/community" 
                  className="border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/5 transition-all"
                >
                  Explore Community
                </Link>
                <Link 
                  href="/events" 
                  className="border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/5 transition-all"
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
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-50" />
              <div className="absolute inset-0 border border-white/10 rounded-[3rem] overflow-hidden flex flex-col items-center justify-center backdrop-blur-sm relative z-10 bg-zinc-900/50">
                <img 
                  src="/images/events/logo/PHOTO-2026-03-15-01-22-36.jpg" 
                  alt="E-Cell Official Logo" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out opacity-90"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                <div className="absolute bottom-10 left-10 right-10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex flex-col items-center justify-center backdrop-blur-md bg-white/5 animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                  <div>
                    <p className="font-mono text-white tracking-widest text-sm font-bold uppercase">Official Hub</p>
                    <p className="text-blue-400 text-xs mt-1 tracking-widest uppercase">System Online</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- PROTOCOL SECTION --- */}
      <section className="py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeUpVariant}
              className="font-mono text-xs uppercase tracking-[0.3em] text-blue-500 mb-4"
            >
              Core Directives
            </motion.h2>
            <motion.h3 
              variants={fadeUpVariant}
              className="text-4xl md:text-5xl font-bold tracking-tighter mb-16"
            >
              ARCHITECTS OF INNOVATION.
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: "PROTOCOL_01", title: "Incubation", desc: "Nurturing barebone ideas into structured, scalable models with dedicated mentorship." },
                { id: "PROTOCOL_02", title: "Network", desc: "Connecting visionaries with angel investors, VC firms, and industry veterans." },
                { id: "PROTOCOL_03", title: "Innovation", desc: "Deploying deep-tech solutions through hackathons and competitive sprints." }
              ].map((protocol) => (
                <motion.div 
                  key={protocol.id}
                  variants={fadeUpVariant}
                  className="bg-black border border-white/10 p-8 rounded-2xl hover:border-blue-500/40 hover:bg-white/[0.02] transition-colors group"
                >
                  <span className="font-mono text-xs text-zinc-500 tracking-widest block mb-6">{protocol.id}</span>
                  <h4 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors">{protocol.title}</h4>
                  <p className="text-zinc-400 leading-relaxed text-sm">{protocol.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- INDUSTRY PARTNERS --- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-zinc-600 text-xs uppercase tracking-[0.3em] mb-12"
          >
            Industry Partners
          </motion.h3>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            {["NUTRIPULP", "STARBUCKS", "STARTUPNEWS", "iCOSMETIQUES"].map((partner) => (
              <Link href="/sponsors" key={partner} className="text-xl md:text-2xl font-black tracking-widest text-white hover:text-blue-400 transition-colors cursor-pointer">
                {partner}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRESERVED SECTIONS (TEAM & EVENTS) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-32">
        
        {/* THE TEAM - Converted to Horizontal Scroll */}
        <section>
          <div className="mb-12">
            <h1 className="text-6xl font-black tracking-tighter italic hover:text-blue-500 transition-colors cursor-default">THE COUNCIL.</h1>
            <p className="text-zinc-500 mt-2 text-lg font-medium uppercase tracking-[0.2em]">Operational Command</p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 pt-4 scrollbar-hide snap-x snap-mandatory">
            {members.map((member) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                key={member.id} 
                className="min-w-[280px] snap-center group relative bg-zinc-900/30 border border-white/5 rounded-2xl p-6 transition-all duration-500 hover:border-blue-500/40"
              >
                <div className="aspect-square w-full bg-zinc-800/50 rounded-xl mb-6 flex items-center justify-center text-4xl font-bold text-zinc-700 grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-500 overflow-hidden">
                  {member.name?.[0] || "?"}
                </div>
                <h3 className="text-xl font-bold tracking-tight">{member.name}</h3>
                <p className="text-blue-500 text-xs font-black uppercase tracking-widest mt-1">{member.role}</p>
              </motion.div>
            ))}
            {members.length === 0 && (
              <div className="min-w-full h-[300px] flex items-center justify-center border border-dashed border-white/5 rounded-[2rem]">
                <p className="text-zinc-700 italic font-mono tracking-tighter uppercase">
                  // Fetching personnel records...
                </p>
              </div>
            )}
          </div>
        </section>

        {/* TRENDING EVENTS - Preserved Horizontal Scroll */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-5xl font-bold tracking-tighter">TIMELINE.</h2>
              <p className="text-zinc-500 text-sm mt-1">Our journey from ideas to ventures.</p>
            </div>

            <div className="flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md w-fit">
              <button 
                onClick={() => setFilter('past')}
                className={`px-6 py-2 rounded-full text-[10px] tracking-widest font-black transition-all ${
                  filter === 'past' 
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.6)]' 
                  : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                PAST
              </button>
              <button 
                onClick={() => setFilter('upcoming')}
                className={`px-6 py-2 rounded-full text-[10px] tracking-widest font-black transition-all ${
                  filter === 'upcoming' 
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.6)]' 
                  : 'text-zinc-500 hover:text-zinc-300'
                }`}
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
                  className="min-w-[320px] md:min-w-[450px] snap-center bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-[2rem] p-10 relative group transition-all duration-700 hover:border-blue-500/50 hover:shadow-[0_0_50px_-20px_rgba(59,130,246,0.3)] flex flex-col"
                >
                  <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.3em] mb-4 block">
                    {event.category || 'Event'}
                  </span>
                  <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-400 transition-colors">{event.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-8 flex-1">{event.description}</p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-zinc-600 font-mono text-xs italic">{event.date}</span>
                    <Link href={`/events/${event.id}`} className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all text-white z-10">
                      <span className="text-lg">→</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center border border-dashed border-white/5 rounded-[2rem]">
              <p className="text-zinc-700 italic font-mono tracking-tighter uppercase">
                // No {filter} events discovered in the logs...
              </p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}