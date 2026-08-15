"use client";

import Link from "next/link";

export default function Footer() {
  const exploreLinks = [
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Members", href: "/members" },
  ];

  const ecosystemLinks = [
    { name: "Founders", href: "/founders" },
    { name: "Projects", href: "/projects" },
    { name: "Resources", href: "/resources" },
    { name: "Sponsors", href: "/sponsors" },
    { name: "Join Team", href: "/join" },
  ];

  const socialLinks = [
    { name: "Instagram", href: "https://instagram.com/ecellbvcoenm" },
    { name: "LinkedIn", href: "https://linkedin.com/company/ecell-bvcoenm" },
  ];

  return (
    <footer
      className="mt-auto"
      style={{
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
        borderTop: "1px solid var(--border-primary)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <img
                src="/images/events/logo/PHOTO-2026-03-15-01-22-36.jpg"
                alt="E-Cell Logo"
                className="w-12 h-12 rounded-xl object-cover group-hover:scale-105 transition-transform"
                style={{ border: "1px solid var(--border-primary)" }}
              />
              <div>
                <p
                  className="text-2xl md:text-3xl font-black tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  E-CELL BVCOENM
                </p>
                <p
                  className="text-[11px] uppercase tracking-[0.25em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Empowering Ideas, Igniting Ventures
                </p>
              </div>
            </Link>

            <p
              className="text-sm max-w-md leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Building a student-first entrepreneurial ecosystem through events,
              mentorship, and real-world startup exposure.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4
                className="font-mono text-xs tracking-[0.2em] uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                Explore
              </h4>
              <ul className="space-y-2">
                {exploreLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:opacity-80"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4
                className="font-mono text-xs tracking-[0.2em] uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                Ecosystem
              </h4>
              <ul className="space-y-2">
                {ecosystemLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:opacity-80"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4
                className="font-mono text-xs tracking-[0.2em] uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                Social
              </h4>
              <ul className="space-y-2">
                {socialLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm transition-colors hover:opacity-80"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12" style={{ borderTop: "1px solid var(--border-primary)" }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 font-data text-[11px]" style={{ color: "var(--text-muted)" }}>
            <div className="px-4 py-3" style={{ borderRight: "1px solid var(--border-primary)", borderTop: "1px solid var(--border-primary)" }}>
              <span className="block uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Sheet</span>
              <span style={{ color: "var(--text-secondary)" }}>E-CELL / SITE</span>
            </div>
            <div className="px-4 py-3" style={{ borderRight: "1px solid var(--border-primary)", borderTop: "1px solid var(--border-primary)" }}>
              <span className="block uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Rev.</span>
              <span style={{ color: "var(--text-secondary)" }}>03</span>
            </div>
            <div className="px-4 py-3" style={{ borderRight: "1px solid var(--border-primary)", borderTop: "1px solid var(--border-primary)" }}>
              <span className="block uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Year</span>
              <span style={{ color: "var(--text-secondary)" }}>2026</span>
            </div>
            <div className="px-4 py-3" style={{ borderTop: "1px solid var(--border-primary)" }}>
              <span className="block uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Drawn by</span>
              <span style={{ color: "var(--text-secondary)" }}>E-Cell BVCOENM</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
