import Link from "next/link";

export default function ProjectsPage() {
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
          Projects
        </p>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
          Build. Ship. Improve.
        </h1>
        <p className="text-lg mb-10" style={{ color: "var(--text-secondary)" }}>
          We&apos;re putting together a showcase of ideas and prototypes that came out of
          our competitions and bootcamps. Check back soon.
        </p>

        <div className="glass rounded-lg p-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">In the meantime</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              See the competitions and bootcamps where these projects started.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex px-5 py-2.5 rounded-md text-sm font-semibold transition-colors"
            style={{ background: "var(--gradient-hero)", color: "#fff" }}
          >
            Browse events
          </Link>
        </div>
      </div>
    </div>
  );
}
