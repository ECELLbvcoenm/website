import Link from "next/link";

export default function FoundersPage() {
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
          Founder Network
        </p>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
          Founders & Builders
        </h1>
        <p className="text-lg mb-10" style={{ color: "var(--text-secondary)" }}>
          This section will spotlight student founders, alumni entrepreneurs, and
          ongoing ventures from the E-Cell ecosystem.
        </p>

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
    </div>
  );
}
