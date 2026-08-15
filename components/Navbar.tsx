"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { User, LogOut, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import AuthModal from "./AuthModal";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Sponsors", href: "/sponsors" },
    { name: "Members", href: "/members" },
    { name: "Join Team", href: "/join" },
  ];

  return (
    <>
      {/* Ruler strip — tick marks, no functional purpose, purely a drafting-sheet signature */}
      <div
        className="fixed top-0 left-0 w-full z-50 h-2 hidden md:block"
        style={{
          background:
            "repeating-linear-gradient(90deg, var(--border-primary) 0, var(--border-primary) 1px, transparent 1px, transparent 48px)",
          borderBottom: "1px solid var(--border-primary)",
        }}
      />

      <nav
        className="fixed top-0 md:top-2 left-0 w-full z-50"
        style={{
          background: "var(--bg-nav)",
          borderBottom: "1px solid var(--border-primary)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <img
                src="/images/events/logo/PHOTO-2026-03-15-01-22-36.jpg"
                alt="E-Cell Logo"
                className="w-8 h-8 object-cover"
                style={{ border: "1px solid var(--border-primary)" }}
              />
              <span
                className="font-display font-bold text-lg tracking-tight group-hover:opacity-80 transition-opacity"
                style={{ color: "var(--text-primary)" }}
              >
                E-Cell <span style={{ color: "var(--text-accent)" }}>BVCOENM</span>
              </span>
            </Link>

            {/* Desktop Links — numbered, mono, bracket underline on active */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative px-3 py-2 text-sm font-medium transition-colors flex items-baseline gap-1.5"
                    style={{ color: isActive ? "var(--text-accent)" : "var(--text-secondary)" }}
                  >
                    <span className="font-data text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {link.name}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-0.5 left-3 right-3 h-[2px]"
                        style={{ background: "var(--text-accent)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {!loading && (
                <>
                  {user ? (
                    <div className="hidden md:flex items-center gap-2">
                      <div
                        className="w-8 h-8 flex items-center justify-center text-xs font-bold font-data"
                        style={{
                          background: "var(--accent-glow)",
                          color: "var(--text-accent)",
                          border: "1px solid var(--border-hover)",
                        }}
                      >
                        {user.email?.[0]?.toUpperCase() || "U"}
                      </div>
                      <button
                        onClick={signOut}
                        className="w-9 h-9 flex items-center justify-center transition-colors"
                        style={{ color: "var(--text-muted)", border: "1px solid var(--border-primary)" }}
                        title="Sign Out"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAuthOpen(true)}
                      className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors"
                      style={{
                        border: "1px solid var(--border-primary)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </button>
                  )}
                </>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center transition-colors"
                style={{ color: "var(--text-primary)", border: "1px solid var(--border-primary)" }}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
              style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-primary)" }}
            >
              <div className="px-4 py-4 space-y-1">
                {NAV_LINKS.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-baseline gap-2 px-4 py-3 text-sm font-medium transition-colors"
                      style={{
                        color: isActive ? "var(--text-accent)" : "var(--text-secondary)",
                        background: isActive ? "var(--accent-glow)" : "transparent",
                        borderLeft: isActive ? "2px solid var(--text-accent)" : "2px solid transparent",
                      }}
                    >
                      <span className="font-data text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {link.name}
                    </Link>
                  );
                })}

                <div className="pt-2 mt-2" style={{ borderTop: "1px solid var(--border-primary)" }}>
                  {user ? (
                    <button
                      onClick={() => {
                        signOut();
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setAuthOpen(true);
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium transition-colors"
                      style={{ color: "var(--text-accent)" }}
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
