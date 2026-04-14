import Link from "next/link";

export default function ResourcesPage() {
  return (
    <div
      className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-w-5xl mx-auto">
        <p
          className="font-mono text-xs tracking-[0.25em] uppercase mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Resources
        </p>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
          Learning Stack
        </h1>
        <p className="text-lg mb-10" style={{ color: "var(--text-secondary)" }}>
          Starter materials for ideation, validation, pitching, and execution are
          being compiled in one place.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {[
            ["Startup Basics", "Problem-solution fit, MVP, and user discovery."],
            ["Pitch Toolkit", "Deck structure, storytelling, and investor readiness."],
            ["Execution Systems", "Planning templates and team operating rhythm."],
            ["Events Archive", "Recordings and key takeaways from sessions."],
          ].map(([title, desc]) => (
            <div key={title} className="glass rounded-2xl p-5">
              <h2 className="font-bold mb-2">{title}</h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/events"
          className="inline-flex px-6 py-3 rounded-full font-semibold"
          style={{ background: "var(--bg-card-hover)", color: "var(--text-primary)" }}
        >
          Browse Events
        </Link>
      </div>
    </div>
  );
}
