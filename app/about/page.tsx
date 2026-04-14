import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <section className="pt-28 pb-16 border-b" style={{ borderColor: "var(--border-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className="font-mono text-xs uppercase tracking-[0.24em] mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            About E-Cell
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.02]">
            Student-Led,
            <br />
            <span style={{ color: "var(--text-secondary)" }}>Founder-Focused.</span>
          </h1>
          <p className="mt-8 text-lg md:text-2xl max-w-3xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            E-Cell BVCOENM helps students move from ideas to execution through events,
            mentorship, collaboration, and practical startup learning.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-[45vh]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            ["Workshops", "Hands-on startup sessions and practical frameworks."],
            ["Community", "A strong peer network of builders and contributors."],
            ["Execution", "From ideation to validated prototypes and pitches."],
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
          href="/join"
          className="inline-flex px-6 py-3 rounded-full font-semibold"
          style={{ background: "var(--gradient-hero)", color: "#fff" }}
        >
          Join Team
        </Link>
      </div>
      </section>
    </div>
  );
}
