"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronRight, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { pastEvents } from "@/lib/events";
import { LOCAL_MEMBERS } from "@/lib/localMembers";

type Member = {
  id: string | number;
  name: string;
  role: string;
  rank?: number;
};

type EventItem = {
  id: string;
  title: string;
  type: string;
  date: string;
  shortDescription: string;
};

function getMemberImagePath(name: string) {
  return `/images/members/${name.toLowerCase().replace(/\s+/g, "_")}.jpg`;
}

function parseEventDate(rawDate: string) {
  const monthYearMatch = rawDate.match(/([a-zA-Z]+)\s+(\d{4})/);
  if (monthYearMatch) {
    return new Date(`${monthYearMatch[1]} 1, ${monthYearMatch[2]}`);
  }
  return new Date(rawDate);
}

export default function Home() {
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filter, setFilter] = useState<"upcoming" | "past">("past");

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await supabase
          .from("members")
          .select("id, name, role, rank")
          .order("rank", { ascending: true })
          .order("name", { ascending: true });

        setMembers([...(data ?? []), ...LOCAL_MEMBERS]);
      } catch {
        setMembers(LOCAL_MEMBERS);
      }

      setEvents(pastEvents);
    }

    fetchData();
  }, []);

  const normalizedMembers = useMemo(() => {
    const byKey = new Map<string, Member>();
    for (const member of members) {
      const key = `${member.name.toLowerCase()}-${member.role.toLowerCase()}`;
      if (!byKey.has(key)) byKey.set(key, member);
    }

    return Array.from(byKey.values()).sort((first, second) => {
      const firstRank = first.rank ?? 999;
      const secondRank = second.rank ?? 999;
      return firstRank - secondRank;
    });
  }, [members]);

  const featuredMembers = normalizedMembers.filter((member) => {
    const normalizedRole = member.role.toLowerCase().replace(/\s+/g, " ").trim();
    return [
      "president",
      "vice president",
      "treasurer",
      "trasursrer",
      "joint treasurer",
      "joint trausers",
    ].includes(normalizedRole);
  });

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = parseEventDate(event.date);
      const isPast = !Number.isNaN(eventDate.getTime()) && eventDate < new Date();
      return filter === "upcoming" ? !isPast : isPast;
    });
  }, [events, filter]);

  const pillars = [
    {
      id: "01",
      title: "Incubation",
      desc: "Helping students shape early ideas into practical and scalable startup models.",
    },
    {
      id: "02",
      title: "Network",
      desc: "Connecting learners with founders, alumni, mentors, and industry opportunities.",
    },
    {
      id: "03",
      title: "Execution",
      desc: "Driving action through hackathons, workshops, and real project-based learning.",
    },
  ];

  const sponsorLogos = [
    { name: "Nutripulp", logo: "/images/sponsors/nutripulp.png" },
    { name: "Starbucks", logo: "/images/sponsors/starbucks.png" },
    { name: "StartupNews", logo: "/images/sponsors/startupnews.png" },
    { name: "iCosmetiques", logo: "/images/sponsors/icosmetiques.png" },
  ];

  const faqItems = [
    {
      question: "Who can join E-Cell BVCOENM?",
      answer:
        "Any motivated student from BVCOENM can apply. We welcome all branches and all experience levels.",
    },
    {
      question: "How much time commitment is expected?",
      answer:
        "Most members contribute around 3 to 5 hours per week, with higher involvement during event execution windows.",
    },
    {
      question: "How does the selection process work?",
      answer:
        "After form submission, shortlisted applicants are contacted for a short interaction round based on role and motivation.",
    },
    {
      question: "When will I hear back after applying?",
      answer:
        "The team usually responds within 7 to 10 days depending on the active recruitment cycle.",
    },
    {
      question: "What do members get from E-Cell?",
      answer:
        "Members get leadership exposure, execution experience, startup ecosystem access, and mentorship through projects and events.",
    },
  ];

  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <section
        className="pt-28 pb-20 border-b"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p
                className="font-mono text-xs uppercase tracking-[0.24em] mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                E-Cell BVCOENM
              </p>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.02]">
                Empowering Ideas,
                <br />
                <span style={{ color: "var(--text-secondary)" }}>Igniting Ventures.</span>
              </h1>

              <p
                className="mt-8 text-lg md:text-2xl max-w-2xl leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                A student-first entrepreneurship ecosystem focused on learning, execution,
                and real startup exposure.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/join"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: "var(--text-primary)",
                    color: "var(--bg-primary)",
                  }}
                >
                  Join Team <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/events"
                  className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold border"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                  }}
                >
                  Explore Events
                </Link>

                <Link
                  href="/community"
                  className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Community Directory
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <p className="text-3xl font-black">{normalizedMembers.length}+</p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                    Members
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-black">{events.length}</p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                    Events Logged
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-black">2024</p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                    Since
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div
                className="rounded-3xl overflow-hidden border"
                style={{ borderColor: "var(--border-primary)", background: "var(--bg-secondary)" }}
              >
                <img
                  src="/images/events/logo/PHOTO-2026-03-15-01-22-36.jpg"
                  alt="E-Cell Official Logo"
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6 border-t" style={{ borderColor: "var(--border-primary)" }}>
                  <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                    Official Hub
                  </p>
                  <p className="text-lg font-semibold mt-1">Building founders through action.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-b" style={{ borderColor: "var(--border-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] mb-4" style={{ color: "var(--text-muted)" }}>
            Core Focus
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-10">What We Build</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pillars.map((pillar) => (
              <article
                key={pillar.id}
                className="rounded-2xl border p-7"
                style={{ borderColor: "var(--border-primary)", background: "var(--bg-secondary)" }}
              >
                <p className="font-mono text-xs tracking-[0.2em] mb-5" style={{ color: "var(--text-muted)" }}>
                  PROTOCOL_{pillar.id}
                </p>
                <h3 className="text-3xl font-bold mb-4">{pillar.title}</h3>
                <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {pillar.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 border-b" style={{ borderColor: "var(--border-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <p className="font-mono text-xs uppercase tracking-[0.24em]" style={{ color: "var(--text-muted)" }}>
              Industry Partners
            </p>
            <Link href="/sponsors" className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              View Sponsors
            </Link>
          </div>

          <div className="sponsor-loop-mask rounded-xl border py-4" style={{ borderColor: "var(--border-primary)", background: "var(--bg-secondary)" }}>
            <div className="sponsor-loop-track">
              {[...sponsorLogos, ...sponsorLogos].map((sponsor, index) => (
                <Link
                  key={`${sponsor.name}-${index}`}
                  href="/sponsors"
                  className="sponsor-loop-item"
                  aria-label={`${sponsor.name} sponsor profile`}
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="h-10 w-auto object-contain"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-b" style={{ borderColor: "var(--border-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] mb-4" style={{ color: "var(--text-muted)" }}>
                Team
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Core Council</h2>
              <p className="text-sm md:text-base font-black uppercase tracking-[0.16em] mt-3" style={{ color: "var(--text-secondary)" }}>
                Operational Command
              </p>
            </div>
            <Link
              href="/members"
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              View All Members <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredMembers.map((member) => (
              <article
                key={member.id}
                className="group rounded-2xl border border-l-2 p-4"
                style={{ borderColor: "var(--border-primary)", background: "var(--bg-secondary)" }}
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-4 relative" style={{ background: "var(--bg-card)" }}>
                  <img
                    src={getMemberImagePath(member.name)}
                    alt={member.name}
                    className="absolute inset-0 h-full w-full object-cover z-10 grayscale saturate-0 opacity-85 transition-all duration-500 group-hover:grayscale-0 group-hover:saturate-100 group-hover:opacity-100"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center text-3xl font-bold z-0"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {member.name[0]?.toUpperCase()}
                  </div>
                </div>
                <p className="font-semibold leading-tight">{member.name}</p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "var(--text-secondary)" }}>
                  {member.role}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] mb-4" style={{ color: "var(--text-muted)" }}>
                Events
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Timeline</h2>
            </div>

            <div className="inline-flex rounded-xl border p-1" style={{ borderColor: "var(--border-primary)" }}>
              <button
                onClick={() => setFilter("past")}
                className="px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold"
                style={{
                  background: filter === "past" ? "var(--text-primary)" : "transparent",
                  color: filter === "past" ? "var(--bg-primary)" : "var(--text-secondary)",
                }}
              >
                Past
              </button>
              <button
                onClick={() => setFilter("upcoming")}
                className="px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold"
                style={{
                  background: filter === "upcoming" ? "var(--text-primary)" : "transparent",
                  color: filter === "upcoming" ? "var(--bg-primary)" : "var(--text-secondary)",
                }}
              >
                Upcoming
              </button>
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event) => (
                <article
                  key={event.id}
                  className="rounded-2xl border border-l-2 p-6 flex flex-col"
                  style={{ borderColor: "var(--border-primary)", background: "var(--bg-secondary)" }}
                >
                  <p className="text-[11px] uppercase tracking-[0.2em] mb-4" style={{ color: "var(--text-muted)" }}>
                    {event.type}
                  </p>
                  <h3 className="text-2xl font-bold leading-tight mb-3">{event.title}</h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                    {event.shortDescription}
                  </p>

                  <div className="mt-auto flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" /> {event.date}
                    </span>
                    <Link href={`/events/${event.id}`} className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div
              className="rounded-2xl border p-10 text-center"
              style={{ borderColor: "var(--border-primary)", background: "var(--bg-secondary)" }}
            >
              <p className="text-lg font-semibold mb-2">No events found</p>
              <p style={{ color: "var(--text-secondary)" }}>
                Try switching filters or check the events page for the full archive.
              </p>
            </div>
          )}

          <div className="mt-14 border-t pt-10" style={{ borderColor: "var(--border-primary)" }}>
            <p className="font-mono text-xs uppercase tracking-[0.24em] mb-3" style={{ color: "var(--text-muted)" }}>
              FAQ
            </p>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-6">Questions You Might Have</h3>

            <div className="space-y-3">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-xl border px-5 py-4"
                  style={{ borderColor: "var(--border-primary)", background: "var(--bg-secondary)" }}
                >
                  <summary className="cursor-pointer font-semibold list-none flex items-center justify-between gap-3">
                    <span>{item.question}</span>
                    <ChevronRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-open:rotate-90" style={{ color: "var(--text-muted)" }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <div
            className="mt-12 rounded-2xl border p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            style={{ borderColor: "var(--border-primary)", background: "var(--bg-secondary)" }}
          >
            <div>
              <p className="font-semibold text-xl">Ready to build with E-Cell?</p>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Join upcoming events, connect with the team, and start your startup journey.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/join"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}
              >
                Join Team <Users className="w-4 h-4" />
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold border"
                style={{ borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
              >
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
