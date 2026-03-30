"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Sparkles, Building2, Megaphone, Terminal, Landmark } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ full_name: "", email: "", contact_number: "", department: "", motivation: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const nextStep = () => {
    setError(null);
    if (step === 1 && (!formData.full_name || !formData.email)) { setError("Name and Email are required."); return; }
    if (step === 2 && !formData.department) { setError("Please select a department."); return; }
    setStep((p) => p + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.motivation) { setError("Please provide your motivation."); return; }
    setIsSubmitting(true); setError(null);
    try {
      const { error: dbError } = await supabase.from("applications").insert(formData);
      if (dbError) throw dbError;
      setStep(4);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeIn" as const } },
  };

  const departments = [
    { id: "Technical", icon: Terminal, desc: "Engineering & Development" },
    { id: "Marketing", icon: Megaphone, desc: "Growth & Social Media" },
    { id: "Finance", icon: Landmark, desc: "Budgeting & Operations" },
    { id: "PR", icon: Building2, desc: "Public Relations & Outreach" },
  ];

  const inputStyle = {
    background: "var(--bg-card)",
    border: "1px solid var(--border-primary)",
    color: "var(--text-primary)",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30 font-sans relative overflow-hidden" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none" style={{ background: "var(--accent-glow)" }} />

      <div className="w-full max-w-xl relative z-10">
        <div className="mb-12 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-6 glass" style={{ color: "var(--text-accent)" }}>
            <Sparkles className="w-4 h-4" /><span>Join the Future</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>
            Shape the Ecosystem
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg" style={{ color: "var(--text-muted)" }}>
            Step forward. We are looking for visionaries.
          </motion.p>
        </div>

        <div className="glass rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {step < 4 && (
            <div className="w-full h-1 rounded-full mb-8 overflow-hidden" style={{ background: "var(--bg-card)" }}>
              <motion.div className="h-full" style={{ background: "var(--accent-blue)" }} initial={{ width: `${((step - 1) / 3) * 100}%` }} animate={{ width: `${(step / 3) * 100}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} />
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div><h2 className="text-xl font-semibold mb-1">Personal Details</h2><p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Let's start with your identity.</p></div>
                <div className="space-y-4">
                  {[{ label: "Full Name *", name: "full_name", type: "text", ph: "Jane Doe" }, { label: "Email Address *", name: "email", type: "email", ph: "jane@example.com" }, { label: "Contact Number", name: "contact_number", type: "tel", ph: "+91 98765 43210", opt: true }].map((f) => (
                    <div key={f.name} className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{f.label} {f.opt && <span style={{ color: "var(--text-muted)" }}>(Optional)</span>}</label>
                      <input type={f.type} name={f.name} value={(formData as any)[f.name]} onChange={handleChange} placeholder={f.ph} className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all" style={inputStyle} />
                    </div>
                  ))}
                </div>
                {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                <div className="pt-4 flex justify-end">
                  <button onClick={nextStep} className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105" style={{ background: "var(--gradient-hero)", color: "#fff" }}>Continue <ArrowRight className="w-4 h-4" /></button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div><h2 className="text-xl font-semibold mb-1">Select Department</h2><p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Where does your expertise align?</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {departments.map((dept) => {
                    const Icon = dept.icon;
                    const sel = formData.department === dept.id;
                    return (
                      <button key={dept.id} onClick={() => setFormData((p) => ({ ...p, department: dept.id }))} className="flex flex-col items-start p-4 rounded-xl transition-all duration-200 text-left" style={{ background: sel ? "var(--accent-glow)" : "var(--bg-card)", border: `1px solid ${sel ? "var(--border-hover)" : "var(--border-primary)"}`, color: sel ? "var(--text-accent)" : "var(--text-secondary)" }}>
                        <Icon className="w-6 h-6 mb-3" /><span className="font-semibold" style={{ color: "var(--text-primary)" }}>{dept.id}</span><span className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{dept.desc}</span>
                      </button>
                    );
                  })}
                </div>
                {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                <div className="pt-4 flex justify-between">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-3 font-medium transition-colors" style={{ color: "var(--text-secondary)" }}><ArrowLeft className="w-4 h-4" /> Back</button>
                  <button onClick={nextStep} className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105" style={{ background: "var(--gradient-hero)", color: "#fff" }}>Next <ArrowRight className="w-4 h-4" /></button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div><h2 className="text-xl font-semibold mb-1">Your Motivation</h2><p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Why do you want to join?</p></div>
                <textarea name="motivation" value={formData.motivation} onChange={handleChange} rows={5} placeholder="Tell us about your drive..." className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all resize-none" style={inputStyle} />
                {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                <div className="pt-4 flex justify-between">
                  <button onClick={() => setStep(2)} disabled={isSubmitting} className="flex items-center gap-2 px-4 py-3 font-medium transition-colors disabled:opacity-50" style={{ color: "var(--text-secondary)" }}><ArrowLeft className="w-4 h-4" /> Back</button>
                  <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-70 hover:scale-105" style={{ background: "var(--gradient-hero)", color: "#fff", boxShadow: "0 0 20px var(--accent-glow-strong)" }}>
                    {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Transmitting...</> : "Submit Application"}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, type: "spring" } }} className="text-center py-10 space-y-6">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ background: "var(--accent-glow)" }}><CheckCircle2 className="w-10 h-10" style={{ color: "var(--text-accent)" }} /></div>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Application Received</h2>
                  <p className="max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>Your transmission was successful. Our team will review your profile and contact you shortly.</p>
                </div>
                <button onClick={() => { setStep(1); setFormData({ full_name: "", email: "", contact_number: "", department: "", motivation: "" }); }} className="px-6 py-2 rounded-full text-sm font-medium transition-colors glass glass-hover">Return to Start</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs mt-8 font-mono" style={{ color: "var(--text-muted)" }}>SECURE CONNECTION // SYS_V2.0</p>
      </div>
    </div>
  );
}
