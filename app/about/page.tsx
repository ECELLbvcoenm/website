import Link from "next/link";

export default function AboutPage() {
  return (
    <div
      className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-w-4xl mx-auto">
        <p
          className="font-mono text-xs tracking-[0.25em] uppercase mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          About E-Cell
        </p>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 animated-gradient-text">
          Student-Led, Founder-Focused.
        </h1>
        <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
          E-Cell BVCOENM exists to help students move from ideas to execution through
          events, mentorship, collaboration, and practical startup learning.
        </p>

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
    </div>
  );
}
