import Link from "next/link";

export default function ResourcesPage() {
  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <section className="pt-28 pb-16 border-b" style={{ borderColor: "var(--border-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className="font-mono text-xs uppercase tracking-[0.24em] mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Resources
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.02]">
            Learning
            <br />
            <span style={{ color: "var(--text-secondary)" }}>Stack</span>
          </h1>
          <p className="mt-8 text-lg md:text-2xl max-w-3xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Starter materials for ideation, validation, pitching, and execution,
            compiled in one place for the community.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-[45vh]">
        <div className="max-w-5xl mx-auto">
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
      </section>
    </div>
  );
}
