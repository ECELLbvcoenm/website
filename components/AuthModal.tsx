"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Loader2 } from "lucide-react";
import { useAuth } from "./AuthProvider";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError(null);
    setSuccess(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === "signin") {
      const { error: err } = await signInWithEmail(email, password);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        handleClose();
      }
    } else {
      const { error: err } = await signUpWithEmail(email, password);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        setSuccess("Check your email for a confirmation link!");
        setLoading(false);
      }
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl overflow-hidden glass"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)",
              boxShadow: "var(--shadow-card-hover)",
            }}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{
                background: "var(--bg-glass)",
                color: "var(--text-muted)",
                border: "1px solid var(--border-primary)",
              }}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <p className="font-mono text-xs uppercase tracking-[0.24em]" style={{ color: "var(--text-muted)" }}>
                  Authentication
                </p>
                <h2
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {mode === "signin" ? "Welcome Back" : "Create Account"}
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {mode === "signin"
                    ? "Sign in to your E-Cell account"
                    : "Join the E-Cell community"}
                </p>
              </div>

              {/* Google Button */}
              <button
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:scale-[1.02]"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div
                  className="flex-1 h-px"
                  style={{ background: "var(--border-primary)" }}
                />
                <span
                  className="text-xs font-medium uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  or
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "var(--border-primary)" }}
                />
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-all"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-all"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="text-sm text-green-400 bg-green-500/10 px-3 py-2 rounded-lg">
                    {success}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all hover:scale-[1.02] disabled:opacity-60"
                  style={{
                    background: "var(--text-primary)",
                    color: "var(--bg-primary)",
                    border: "1px solid var(--text-primary)",
                  }}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      {mode === "signin" ? "Sign In" : "Create Account"}
                    </>
                  )}
                </button>
              </form>

              {/* Toggle mode */}
              <p
                className="text-center text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => {
                    setMode(mode === "signin" ? "signup" : "signin");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="font-semibold hover:underline"
                  style={{ color: "var(--text-accent)" }}
                >
                  {mode === "signin" ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
