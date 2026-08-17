import Link from "next/link";
import { ArrowRight, Target, Users, Zap } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function AboutPage() {
  const pillars = [
    {
      icon: <Target className="w-6 h-6 text-blue-400" />,
      title: "Incubation",
      desc: "Guiding students from raw ideas to functional prototypes and viable startup models through mentorship and resources.",
    },
    {
      icon: <Users className="w-6 h-6 text-purple-400" />,
      title: "Network",
      desc: "Bridging the gap between student builders, alumni founders, and industry experts for collaborative growth.",
    },
    {
      icon: <Zap className="w-6 h-6 text-orange-400" />,
      title: "Execution",
      desc: "Prioritizing hands-on learning through hackathons, real-world projects, and operational challenges.",
    },
  ];

  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {/* Hero Section */}
      <section className="pt-28 pb-16 border-b" style={{ borderColor: "var(--border-primary)" }}>
        <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className="font-mono text-xs uppercase tracking-[0.24em] mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            About Us
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.02]">
            Our Story &
            <br />
            <span className="animated-gradient-text">Mission.</span>
          </h1>
          <p className="mt-8 text-lg md:text-2xl max-w-3xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Founded in 2017, E-Cell BVCOENM is a student-driven ecosystem dedicated to building the next generation of founders through action and execution.
          </p>
        </ScrollReveal>
      </section>

      {/* History & Origin */}
      <section className="py-20 border-b" style={{ borderColor: "var(--border-primary)" }}>
        <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">Since 2017</h2>
              <div className="space-y-6 text-base md:text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                <p>
                  The Entrepreneurship Cell of Bharati Vidyapeeth College of Engineering, Navi Mumbai, was established with a singular vision: to transform a campus of students into a thriving hub of innovators.
                </p>
                <p>
                  Over the years, we have evolved from hosting basic awareness seminars to running high-impact execution programs. We don't just talk about entrepreneurship; we actively foster an environment where students can build, fail, and scale.
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden glass p-2 border" style={{ borderColor: "var(--border-primary)" }}>
               <div className="aspect-video w-full rounded-xl flex flex-col items-center justify-center text-center p-6 relative overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                  <p className="font-mono text-xs uppercase tracking-widest mb-2 relative z-10" style={{ color: "var(--text-muted)" }}>Ecosystem</p>
                  <p className="text-2xl font-bold relative z-10">Building founders since day one.</p>
               </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Core Pillars */}
      <section className="py-20 border-b" style={{ borderColor: "var(--border-primary)" }}>
        <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] mb-4 text-center" style={{ color: "var(--text-muted)" }}>
            Our Framework
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-center mb-16">The Three Pillars</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-2xl glass glass-hover p-8 border-t-2 flex flex-col items-start"
                style={{ borderTopColor: "var(--border-hover)" }}
              >
                <div className="p-3 rounded-xl mb-6" style={{ background: "var(--bg-card)" }}>
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{pillar.title}</h3>
                <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {pillar.desc}
                </p>
              </article>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* CTA */}
      <section className="py-24">
        <ScrollReveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">Be Part of the Journey</h2>
          <p className="text-lg mb-10" style={{ color: "var(--text-secondary)" }}>
            Whether you want to learn, build, or lead, there is a place for you in the E-Cell ecosystem.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/join"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-transform hover:scale-105"
              style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}
            >
              Join the Team <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border transition-all hover:bg-[var(--bg-card)]"
              style={{ borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
            >
              Explore Community
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
