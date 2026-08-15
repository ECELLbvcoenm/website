"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Terminal, Megaphone, Landmark, Building2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    full_name: string;
    email: string;
    contact_number: string;
    department: string;
    motivation: string;
  }>({ full_name: "", email: "", contact_number: "", department: "", motivation: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const nextStep = () => {
    setError(null);
    if (step === 1 && (!formData.full_name || !formData.email)) { setError("Name and email are required."); return; }
    if (step === 2 && !formData.department) { setError("Please select a department."); return; }
    setStep((p) => p + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.motivation) { setError("Tell us a little about why you'd like to join."); return; }
    setIsSubmitting(true); setError(null);
    try {
      const { error: dbError } = await supabase.from("applications").insert(formData);
      if (dbError) throw dbError;
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
    exit: { opacity: 0, x: -16, transition: { duration: 0.25, ease: "easeIn" as const } },
  };

  const departments = [
    { id: "Technical", icon: Terminal, desc: "Engineering & development" },
    { id: "Marketing", icon: Megaphone, desc: "Growth & social media" },
    { id: "Finance", icon: Landmark, desc: "Budgeting & operations" },
    { id: "PR", icon: Building2, desc: "Public relations & outreach" },
  ];

  const inputStyle = {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-primary)",
    color: "var(--text-primary)",
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 py-32"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="w-full max-w-xl">
        <div className="mb-10 text-center">
          <p className="font-data text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "var(--text-muted)" }}>
            Applications open
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-3">
            Join the team
          </h1>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Four short steps. Takes about two minutes.
          </p>
        </div>

        <div className="index-card p-6 md:p-8">
          {step < 4 && (
            <div className="w-full h-1 rounded-full mb-8 overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
              <motion.div
                className="h-full"
                style={{ background: "var(--text-accent)" }}
                initial={{ width: `${((step - 1) / 3) * 100}%` }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Your details</h2>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Let&apos;s start with who you are.</p>
                </div>
                <div className="space-y-4">
                  {(
                    [
                      { label: "Full name", name: "full_name", type: "text", ph: "Jane Doe", opt: false },
                      { label: "Email address", name: "email", type: "email", ph: "jane@example.com", opt: false },
                      { label: "Contact number", name: "contact_number", type: "tel", ph: "+91 98765 43210", opt: true },
                    ] as const
                  ).map((f) => (
                    <div key={f.name} className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                        {f.label} {f.opt && <span style={{ color: "var(--text-muted)" }}>(optional)</span>}
                      </label>
                      <input
                        type={f.type}
                        name={f.name}
                        value={formData[f.name]}
                        onChange={handleChange}
                        placeholder={f.ph}
                        className="w-full rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1"
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>
                {error && <p className="text-sm" style={{ color: "var(--accent-indigo)" }}>{error}</p>}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm transition-transform hover:-translate-y-0.5"
                    style={{ background: "var(--gradient-hero)", color: "#fff" }}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Pick a department</h2>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Where do you want to contribute?</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {departments.map((dept) => {
                    const Icon = dept.icon;
                    const sel = formData.department === dept.id;
                    return (
                      <button
                        key={dept.id}
                        onClick={() => setFormData((p) => ({ ...p, department: dept.id }))}
                        className="flex flex-col items-start p-4 rounded-md text-left transition-colors"
                        style={{
                          background: sel ? "var(--accent-glow)" : "var(--bg-secondary)",
                          border: `1px solid ${sel ? "var(--border-hover)" : "var(--border-primary)"}`,
                        }}
                      >
                        <Icon className="w-5 h-5 mb-3" style={{ color: sel ? "var(--text-accent)" : "var(--text-muted)" }} />
                        <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{dept.id}</span>
                        <span className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{dept.desc}</span>
                      </button>
                    );
                  })}
                </div>
                {error && <p className="text-sm" style={{ color: "var(--accent-indigo)" }}>{error}</p>}
                <div className="pt-2 flex justify-between">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-3 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm transition-transform hover:-translate-y-0.5"
                    style={{ background: "var(--gradient-hero)", color: "#fff" }}
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Why do you want to join?</h2>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>A few sentences is plenty.</p>
                </div>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  rows={5}
                  placeholder="What draws you to E-Cell?"
                  className="w-full rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 resize-none"
                  style={inputStyle}
                />
                {error && <p className="text-sm" style={{ color: "var(--accent-indigo)" }}>{error}</p>}
                <div className="pt-2 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium disabled:opacity-50"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-7 py-3 rounded-md font-semibold text-sm transition-transform hover:-translate-y-0.5 disabled:opacity-70"
                    style={{ background: "var(--gradient-hero)", color: "#fff" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      "Submit application"
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="s4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
                className="text-center py-8 space-y-6"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: "var(--accent-glow)" }}>
                  <CheckCircle2 className="w-8 h-8" style={{ color: "var(--text-accent)" }} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Application received</h2>
                  <p className="max-w-sm mx-auto text-sm" style={{ color: "var(--text-muted)" }}>
                    Thanks for applying. We&apos;ll go through it and reach out by email.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setStep(1);
                    setFormData({ full_name: "", email: "", contact_number: "", department: "", motivation: "" });
                  }}
                  className="px-6 py-2.5 rounded-md text-sm font-medium index-card glass-hover"
                >
                  Submit another response
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
