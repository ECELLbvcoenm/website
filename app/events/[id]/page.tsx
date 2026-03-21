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
  
  const event = pastEvents.find(e => e.id === eventId);
  
  if (!event) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black italic tracking-tighter mb-4">404_NOT_FOUND</h1>
        <p className="text-zinc-500 mb-8 font-mono">Event archive missing or corrupted.</p>
        <button onClick={() => router.back()} className="px-6 py-3 border border-white/10 rounded-full hover:bg-white/5 transition-all">
          Return to Hub
        </button>
      </div>
    );
  }

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <div className="bg-black text-white min-h-screen selection:bg-blue-500/30 overflow-hidden pt-32 pb-32">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        <Link href="/events" className="inline-flex items-center text-zinc-500 hover:text-white transition-colors mb-12 font-mono text-sm uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Matrix
        </Link>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="space-y-6 mb-16"
        >
          <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-black text-blue-400 uppercase tracking-widest">
              {event.type}
            </span>
            {event.ref && (
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-black text-zinc-400 uppercase tracking-widest">
                {event.ref}
              </span>
            )}
          </motion.div>

          <motion.h1 
            variants={fadeUpVariant}
            className="text-5xl md:text-6xl font-black tracking-tighter leading-tight"
          >
            {event.title}
          </motion.h1>

          <motion.div variants={fadeUpVariant} className="flex flex-wrap items-center gap-6 text-zinc-400 pt-4">
            <div className="flex items-center text-sm font-mono">
              <Calendar className="w-5 h-5 mr-3 text-zinc-600" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center text-sm font-mono">
              <Clock className="w-5 h-5 mr-3 text-zinc-600" />
              <span>{event.time}</span>
            </div>
          </motion.div>
        </motion.div>

        {event.coverImage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/10 mb-16"
          >
            <img 
              src={event.coverImage} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <div className="bg-zinc-900/40 p-8 md:p-12 rounded-[2rem] border border-white/5 leading-relaxed text-zinc-300">
            {event.fullDescription}
          </div>
        </motion.div>
        
        {event.gallery && event.gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20"
          >
            <h3 className="text-3xl font-black tracking-tighter mb-8 uppercase">Visual Archives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.gallery.map((imgUrl, idx) => (
                <div key={idx} className="aspect-video rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/5">
                  <img src={imgUrl} alt={`${event.title} gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
