"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import AuthModal from "./AuthModal";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Sponsors", href: "/sponsors" },
    { name: "Members", href: "/members" },
    { name: "Join Team", href: "/join" },
  ];


  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl"
        style={{
          background: "var(--bg-nav)",
          borderBottom: "1px solid var(--border-primary)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-3 group">
                <img
                  src="/file_0000000042e082119506e5b1c459b4bc.png"
                  alt="E-Cell Logo"
                  className="w-9 h-9 object-contain group-hover:scale-110 transition-transform duration-300"
                />
                <span
                  className="font-bold text-xl tracking-tight group-hover:opacity-80 transition-opacity"
                  style={{ color: "var(--text-primary)" }}
                >
                  E-Cell <span style={{ color: "var(--text-accent)" }}>BVCOENM</span>
                </span>
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-1">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="relative px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        color: isActive
                          ? "var(--text-accent)"
                          : "var(--text-secondary)",
                      }}
                    >
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="nav-active"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                          style={{ background: "var(--accent-blue)" }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}


              </div>
            </div>

            {/* Right Side: Theme + Auth + Mobile Menu Toggle */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* Auth button */}
              {!loading && (
                <>
                  {user ? (
                    <div className="hidden md:flex items-center gap-2 relative">
                      <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold transition-all hover:scale-105"
                        style={{
                          background: "var(--accent-glow)",
                          border: "1px solid var(--border-hover)",
                        }}
                      >
                        {user.user_metadata?.avatar_url ? (
                          <img
                            src={user.user_metadata.avatar_url}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span style={{ color: "var(--text-accent)" }}>
                            {user.email?.[0]?.toUpperCase() || "U"}
                          </span>
                        )}
                      </button>

                      <AnimatePresence>
                        {profileOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-30"
                              onClick={() => setProfileOpen(false)}
                            />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 top-10 w-56 rounded-2xl p-4 shadow-xl z-40 glass"
                              style={{
                                background: "var(--bg-secondary)",
                                border: "1px solid var(--border-primary)",
                                backdropFilter: "blur(20px)",
                                WebkitBackdropFilter: "blur(20px)",
                              }}
                            >
                              <div className="flex flex-col gap-1 pb-3 mb-3 border-b border-[var(--border-primary)]">
                                <span
                                  className="text-sm font-semibold truncate"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {user.user_metadata?.full_name || user.email?.split("@")[0]}
                                </span>
                                <span
                                  className="text-xs truncate"
                                  style={{ color: "var(--text-muted)" }}
                                >
                                  {user.email}
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  signOut();
                                  setProfileOpen(false);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium transition-all text-red-400 hover:bg-red-500/10"
                              >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAuthOpen(true)}
                      className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-primary)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </button>
                  )}
                </>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg transition-colors"
                style={{
                  color: "var(--text-primary)",
                  background: "var(--bg-glass)",
                }}
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
              style={{
                background: "var(--bg-secondary)",
                borderTop: "1px solid var(--border-primary)",
              }}
            >
              <div className="px-4 py-4 space-y-1">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                      style={{
                        color: isActive
                          ? "var(--text-accent)"
                          : "var(--text-secondary)",
                        background: isActive ? "var(--accent-glow)" : "transparent",
                      }}
                    >
                      {link.name}
                    </Link>
                  );
                })}



                {/* Mobile auth */}
                <div
                  className="pt-2 mt-2"
                  style={{ borderTop: "1px solid var(--border-primary)" }}
                >
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 px-4 py-2">
                        <div
                          className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold"
                          style={{
                            background: "var(--accent-glow)",
                            border: "1px solid var(--border-hover)",
                          }}
                        >
                          {user.user_metadata?.avatar_url ? (
                            <img
                              src={user.user_metadata.avatar_url}
                              alt="Profile"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span style={{ color: "var(--text-accent)" }}>
                              {user.email?.[0]?.toUpperCase() || "U"}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span
                            className="text-sm font-semibold truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {user.user_metadata?.full_name || user.email?.split("@")[0]}
                          </span>
                          <span
                            className="text-xs truncate"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setMobileOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors text-red-400 hover:bg-red-500/10"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setAuthOpen(true);
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors"
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

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
