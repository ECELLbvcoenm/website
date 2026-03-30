"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
        borderTop: "1px solid var(--border-primary)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left section: Large Logo */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="/images/events/logo/PHOTO-2026-03-15-01-22-36.jpg"
                  alt="E-Cell Logo"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover"
                  style={{ border: "1px solid var(--border-primary)" }}
                />
                <h2
                  className="text-6xl md:text-8xl font-black tracking-tighter"
                  style={{ color: "var(--text-primary)" }}
                >
                  E-CELL.
                </h2>
              </div>
              <p
                className="text-sm max-w-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Empowering the next generation of founders, builders, and
                visionaries at Bharati Vidyapeeth College of Engineering, Navi
                Mumbai.
              </p>
            </div>
          </div>

          {/* Right section: Links Columns */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4">
            {/* Column 1 */}
            <div className="space-y-6">
              <h4
                className="font-mono text-sm tracking-widest uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                01 / Navigate
              </h4>
              <ul className="space-y-4">
                {[
                  { name: "Home", href: "/" },
                  { name: "About Us", href: "/about" },
                  { name: "Events", href: "/events" },
                  { name: "Join Team", href: "/join" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:translate-x-1 inline-block duration-200"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--text-accent)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-secondary)")
                      }
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <h4
                className="font-mono text-sm tracking-widest uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                02 / Ecosystem
              </h4>
              <ul className="space-y-4">
                {[
                  { name: "Community", href: "/community" },
                  { name: "Founders", href: "/founders" },
                  { name: "Projects", href: "/projects" },
                  { name: "Resources", href: "/resources" },
                  { name: "Sponsors", href: "/sponsors" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:translate-x-1 inline-block duration-200"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--text-accent)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-secondary)")
                      }
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-6">
              <h4
                className="font-mono text-sm tracking-widest uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                03 / Socials
              </h4>
              <ul className="space-y-4">
                {[
                  { name: "Instagram", href: "https://instagram.com" },
                  { name: "LinkedIn", href: "https://linkedin.com" },
                  { name: "Twitter // X", href: "https://twitter.com" },
                  { name: "GitHub", href: "https://github.com" },
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-all hover:translate-x-1 inline-block duration-200"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--text-accent)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-secondary)")
                      }
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--border-primary)" }}
        >
          <p
            className="text-xs font-mono tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            © 2025 E-Cell BVCOENM. All rights reserved.
          </p>
          <p
            className="text-xs font-mono tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            SYSTEM_ONLINE // V2.0
          </p>
        </div>
      </div>
    </footer>
  );
}
