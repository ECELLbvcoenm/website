"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const sponsors = [
  {
    name: "Nutripulp",
    logo: "/images/sponsors/nutripulp.png",
    description: "Providing healthy, refreshing beverages to fuel our next generation of entrepreneurs."
  },
  {
    name: "Starbucks",
    logo: "/images/sponsors/starbucks.png",
    description: "Fueling late-night brainstorming sessions and marathon hackathons."
  },
  {
    name: "StartupNews",
    logo: "/images/sponsors/startupnews.png",
    description: "Our official media partner, broadcasting E-Cell's vision to the world."
  },
  {
    name: "iCosmetiques",
    logo: "/images/sponsors/icosmetiques.png",
    description: "Supporting innovation and aesthetic excellence in our ecosystem."
  }
];

export default function SponsorsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 }
    }
  };

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-32 overflow-hidden selection:bg-blue-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-24"
        >
          <h4 className="font-mono text-blue-500 text-sm tracking-[0.3em] uppercase mb-4">Our Backers</h4>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight italic uppercase">
            The Partners.
          </h1>
          <p className="text-zinc-400 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
            These industry leaders support our mission to cultivate entrepreneurship and build the next generation of visionary founders.
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
              className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 group relative overflow-hidden flex flex-col items-center hover:border-blue-500/50 hover:shadow-[0_0_50px_-15px_rgba(59,130,246,0.2)] transition-all"
            >
              {/* Animated background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/0 via-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:via-purple-600/5 group-hover:to-transparent transition-all duration-700" />
              
              <div className="w-full h-48 mb-8 relative flex items-center justify-center bg-white rounded-2xl border border-white/10 overflow-hidden group-hover:border-blue-500/50 transition-colors">
                <img 
                  src={sponsor.logo} 
                  alt={sponsor.name}
                  className="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <h2 className="text-3xl font-bold mb-4 tracking-tight group-hover:text-blue-400 transition-colors">
                {sponsor.name}
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm text-center relative z-10">
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
          className="mt-32 p-12 rounded-[3rem] border border-white/10 bg-gradient-to-t from-white/5 to-transparent relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none" />
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 relative z-10">Partner with Us</h3>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8 relative z-10">
            Join our ecosystem and help us shape the future of innovation. Get in touch to explore sponsorship opportunities.
          </p>
          <button className="relative z-10 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-slate-200 hover:scale-105 transition-all">
            Contact Team
          </button>
        </motion.div>

      </div>
    </div>
  );
}
