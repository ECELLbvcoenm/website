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
          Project highlights are organized in our community matrix. We’re adding a
          curated showcase view here soon.
        </p>

        <div className="glass rounded-2xl p-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Live Project Directory</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Browse active categories, project status, and source links.
            </p>
          </div>
          <Link
            href="/community"
            className="inline-flex px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ background: "var(--gradient-hero)", color: "#fff" }}
          >
            Open Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
