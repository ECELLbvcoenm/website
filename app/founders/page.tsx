import Link from "next/link";

export default function FoundersPage() {
  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <section className="pt-28 pb-16 border-b" style={{ borderColor: "var(--border-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className="font-mono text-xs uppercase tracking-[0.24em] mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Founder Network
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.02]">
            Founders &
            <br />
            <span style={{ color: "var(--text-secondary)" }}>Builders</span>
          </h1>
          <p className="mt-8 text-lg md:text-2xl max-w-3xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            This section spotlights student founders, alumni entrepreneurs, and
            ongoing ventures from the E-Cell ecosystem.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-[45vh]">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-2">Profiles Coming Soon</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            We are curating founder stories and startup journeys for this page.
          </p>
          <Link
            href="/community"
            className="inline-flex px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ background: "var(--bg-card-hover)", color: "var(--text-primary)" }}
          >
            Explore Community Projects
          </Link>
        </div>
      </div>
      </section>
    </div>
  );
}
