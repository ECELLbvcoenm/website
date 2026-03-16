"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Sparkles, Building2, Megaphone, Terminal, Landmark } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    contact_number: "",
    department: "",
    motivation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentSelect = (dept: string) => {
    setFormData((prev) => ({ ...prev, department: dept }));
  };

  const nextStep = () => {
    setError(null);
    if (step === 1) {
      if (!formData.full_name || !formData.email) {
        setError("Name and Email are required.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.department) {
        setError("Please select a department.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.motivation) {
      setError("Please provide your motivation.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: dbError } = await supabase
        .from("applications")
        .insert({
          full_name: formData.full_name,
          email: formData.email,
          contact_number: formData.contact_number,
          department: formData.department,
          motivation: formData.motivation,
        });

      if (dbError) throw dbError;

      setStep(4); // Success step
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeIn" as const } }
  };

  const departments = [
    { id: "Technical", icon: Terminal, desc: "Engineering & Development" },
    { id: "Marketing", icon: Megaphone, desc: "Growth & Social Media" },
    { id: "Finance", icon: Landmark, desc: "Budgeting & Operations" },
    { id: "PR", icon: Building2, desc: "Public Relations & Outreach" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 selection:bg-blue-500/30 font-sans relative overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-blue-400 mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Join the Future</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Shape the Ecosystem
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg"
          >
            Step forward. We are looking for visionaries.
          </motion.p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
          {/* Progress Bar (hidden on success) */}
          {step < 4 && (
            <div className="w-full bg-white/5 h-1 rounded-full mb-8 overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500"
                initial={{ width: `${((step - 1) / 3) * 100}%` }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-1">Personal Details</h2>
                  <p className="text-sm text-white/50 mb-6">Let's start with your identity designation.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Full Name *</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Contact Number <span className="text-white/30">(Optional)</span></label>
                    <input
                      type="tel"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                </div>

                {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-colors"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Department */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-1">Select Department</h2>
                  <p className="text-sm text-white/50 mb-6">Where does your expertise align?</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {departments.map((dept) => {
                    const Icon = dept.icon;
                    const isSelected = formData.department === dept.id;
                    return (
                      <button
                        key={dept.id}
                        onClick={() => handleDepartmentSelect(dept.id)}
                        className={`flex flex-col items-start p-4 rounded-xl border transition-all duration-200 text-left ${
                          isSelected 
                            ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)] text-blue-400" 
                            : "bg-black/50 border-white/10 hover:border-white/30 text-white/70"
                        }`}
                      >
                        <Icon className="w-6 h-6 mb-3" />
                        <span className="font-semibold text-white">{dept.id}</span>
                        <span className="text-xs mt-1 text-white/50">{dept.desc}</span>
                      </button>
                    );
                  })}
                </div>

                {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 text-white/70 hover:text-white px-4 py-3 font-medium transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-colors"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Motivation */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-1">Your Motivation</h2>
                  <p className="text-sm text-white/50 mb-6">Why do you want to join this initiative?</p>
                </div>
                
                <div className="space-y-2">
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us about your drive, experience, and what you aim to achieve..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                  />
                </div>

                {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 text-white/70 hover:text-white px-4 py-3 font-medium transition-colors disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-medium shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Transmitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, type: "spring" } }}
                className="text-center py-10 space-y-6"
              >
                <div className="relative inline-block">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto relative z-10">
                      <CheckCircle2 className="w-10 h-10 text-blue-400" />
                    </div>
                  </motion.div>
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                    className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl -z-10"
                  />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-white">Application Received</h2>
                  <p className="text-white/50 max-w-sm mx-auto">
                    Your transmission was successful. Our team will review your profile and contact you shortly.
                  </p>
                </div>
                
                <div className="pt-8">
                  <button
                    onClick={() => {
                      setStep(1);
                      setFormData({ full_name: "", email: "", contact_number: "", department: "", motivation: "" });
                    }}
                    className="px-6 py-2 border border-white/20 hover:border-white/50 rounded-full text-sm font-medium transition-colors text-white/70 hover:text-white"
                  >
                    Return to Start
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer subtle text */}
        <p className="text-center text-white/20 text-xs mt-8 font-mono">
          SECURE CONNECTION // SYS_INIT V1.0.4
        </p>
      </div>
    </div>
  );
}
