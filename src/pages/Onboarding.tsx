import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const INDUSTRIES = [
  "Technology", "Finance/Banking", "Legal", "Healthcare",
  "Consulting", "Manufacturing", "Energy", "Government", "Other",
];

const SENIORITY_LEVELS = [
  "C-Suite", "VP/Director", "Senior Manager", "Manager", "Senior Professional",
];

const AUDIENCE_SIZES = [
  "1–5", "5–20", "20–50", "50+",
];

const CHALLENGES = [
  "I struggle with meetings and group discussions",
  "I find it difficult to write executive-level emails",
  "Presentations make me nervous",
  "Negotiations and persuasion in English",
  "Phone/video calls with international stakeholders",
  "All of the above — I need comprehensive training",
];

const AUDIENCES = [
  "Board members / C-Suite",
  "International clients",
  "Cross-functional teams",
  "External partners / vendors",
  "Government / regulatory bodies",
  "Direct reports",
];

const TONES = [
  {
    key: "Diplomat",
    emoji: "🤝",
    description: "Measured, empathetic, relationship-first. You lead with questions before conclusions.",
  },
  {
    key: "Anchor",
    emoji: "⚓",
    description: "Authoritative, structured, data-driven. You project certainty and control.",
  },
  {
    key: "American Direct",
    emoji: "🎯",
    description: "Clear, concise, action-oriented. You get to the point fast.",
  },
  {
    key: "Collaborator",
    emoji: "🌐",
    description: "Inclusive, team-focused, consensus-building. You bring people together.",
  },
];

export interface OnboardingData {
  industry: string;
  seniority: string;
  audienceSize: string;
  challenge: string;
  audiences: string[];
  tone: string;
}

const TOTAL_STEPS = 5;

const Onboarding = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    industry: "",
    seniority: "",
    audienceSize: "",
    challenge: "",
    audiences: [],
    tone: "",
  });

  const updateData = (updates: Partial<OnboardingData>) => setData(d => ({ ...d, ...updates }));

  const canProceed = () => {
    if (step === 1) return !!data.industry && !!data.seniority && !!data.audienceSize;
    if (step === 2) return !!data.challenge;
    if (step === 3) return data.audiences.length > 0;
    if (step === 4) return !!data.tone;
    return true;
  };

  const handleComplete = () => {
    const userId = currentUser?.id || "guest";
    localStorage.setItem(`voice3_onboarding_${userId}`, JSON.stringify({ ...data, completed: true }));
    navigate("/app");
  };

  const toggleAudience = (a: string) => {
    setData(d => ({
      ...d,
      audiences: d.audiences.includes(a)
        ? d.audiences.filter(x => x !== a)
        : [...d.audiences, a],
    }));
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #060E18 0%, #0B1A2A 60%, #0F2235 100%)" }}
    >
      {/* Logo */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <p className="font-serif text-2xl font-bold text-[#B89A5A] tracking-wide">VOICE³</p>
        <p className="text-xs text-[#8E96A3] tracking-[0.2em] uppercase mt-1">Executive Profile Audit</p>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-xs text-[#8E96A3] mb-2">
          <span>Step {step} of {TOTAL_STEPS}</span>
          <span>{Math.round((step / TOTAL_STEPS) * 100)}% complete</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#B89A5A] to-[#d4ba6a]"
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Step card */}
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="rounded-2xl bg-[#1C1F26] border border-[#B89A5A]/15 p-8 space-y-6"
            >
              <div>
                <p className="text-xs text-[#B89A5A] tracking-[0.15em] uppercase font-medium mb-1">Step 1</p>
                <h2 className="font-serif text-xl font-semibold text-[#F4F2ED]">Industry & Role Context</h2>
                <p className="text-[#8E96A3] text-sm mt-1">Help us personalise your executive training.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#F4F2ED]/80 block mb-2">What industry do you operate in?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {INDUSTRIES.map(ind => (
                      <button
                        key={ind}
                        onClick={() => updateData({ industry: ind })}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all text-left ${
                          data.industry === ind
                            ? "bg-[#B89A5A]/20 border-[#B89A5A] text-[#B89A5A]"
                            : "bg-white/5 border-white/10 text-[#8E96A3] hover:border-[#B89A5A]/30"
                        }`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#F4F2ED]/80 block mb-2">What is your seniority level?</label>
                  <div className="flex flex-wrap gap-2">
                    {SENIORITY_LEVELS.map(level => (
                      <button
                        key={level}
                        onClick={() => updateData({ seniority: level })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          data.seniority === level
                            ? "bg-[#B89A5A]/20 border-[#B89A5A] text-[#B89A5A]"
                            : "bg-white/5 border-white/10 text-[#8E96A3] hover:border-[#B89A5A]/30"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#F4F2ED]/80 block mb-2">How many people do you regularly communicate with in English?</label>
                  <div className="flex gap-2">
                    {AUDIENCE_SIZES.map(size => (
                      <button
                        key={size}
                        onClick={() => updateData({ audienceSize: size })}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                          data.audienceSize === size
                            ? "bg-[#B89A5A]/20 border-[#B89A5A] text-[#B89A5A]"
                            : "bg-white/5 border-white/10 text-[#8E96A3] hover:border-[#B89A5A]/30"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="rounded-2xl bg-[#1C1F26] border border-[#B89A5A]/15 p-8 space-y-6"
            >
              <div>
                <p className="text-xs text-[#B89A5A] tracking-[0.15em] uppercase font-medium mb-1">Step 2</p>
                <h2 className="font-serif text-xl font-semibold text-[#F4F2ED]">Communication Challenge</h2>
                <p className="text-[#8E96A3] text-sm mt-1">What is your primary communication challenge?</p>
              </div>
              <div className="space-y-2">
                {CHALLENGES.map(c => (
                  <button
                    key={c}
                    onClick={() => updateData({ challenge: c })}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all ${
                      data.challenge === c
                        ? "bg-[#B89A5A]/10 border-[#B89A5A] text-[#F4F2ED]"
                        : "bg-white/5 border-white/10 text-[#8E96A3] hover:border-[#B89A5A]/30"
                    }`}
                  >
                    {data.challenge === c
                      ? <CheckCircle2 className="h-4 w-4 text-[#B89A5A] shrink-0" />
                      : <ChevronRight className="h-4 w-4 shrink-0 text-white/20" />
                    }
                    {c}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="rounded-2xl bg-[#1C1F26] border border-[#B89A5A]/15 p-8 space-y-6"
            >
              <div>
                <p className="text-xs text-[#B89A5A] tracking-[0.15em] uppercase font-medium mb-1">Step 3</p>
                <h2 className="font-serif text-xl font-semibold text-[#F4F2ED]">Stakeholder Context</h2>
                <p className="text-[#8E96A3] text-sm mt-1">Who is your primary audience? (select all that apply)</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {AUDIENCES.map(a => {
                  const selected = data.audiences.includes(a);
                  return (
                    <button
                      key={a}
                      onClick={() => toggleAudience(a)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs text-left transition-all ${
                        selected
                          ? "bg-[#B89A5A]/10 border-[#B89A5A] text-[#F4F2ED]"
                          : "bg-white/5 border-white/10 text-[#8E96A3] hover:border-[#B89A5A]/30"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selected ? "bg-[#B89A5A] border-[#B89A5A]" : "border-white/30"}`}>
                        {selected && <CheckCircle2 className="h-3 w-3 text-[#0B1A2A]" />}
                      </div>
                      {a}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="rounded-2xl bg-[#1C1F26] border border-[#B89A5A]/15 p-8 space-y-6"
            >
              <div>
                <p className="text-xs text-[#B89A5A] tracking-[0.15em] uppercase font-medium mb-1">Step 4</p>
                <h2 className="font-serif text-xl font-semibold text-[#F4F2ED]">Tone Calibration</h2>
                <p className="text-[#8E96A3] text-sm mt-1">Select your preferred communication style.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TONES.map(t => {
                  const selected = data.tone === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => updateData({ tone: t.key })}
                      className={`flex flex-col gap-2 p-4 rounded-xl border text-left transition-all ${
                        selected
                          ? "bg-[#B89A5A]/10 border-[#B89A5A] shadow-[0_0_0_1px_#B89A5A]"
                          : "bg-white/5 border-white/10 hover:border-[#B89A5A]/30"
                      }`}
                    >
                      <span className="text-2xl">{t.emoji}</span>
                      <span className={`font-semibold text-sm ${selected ? "text-[#B89A5A]" : "text-[#F4F2ED]"}`}>{t.key}</span>
                      <span className="text-xs text-[#8E96A3] leading-relaxed">{t.description}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 5 — Confirmation */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="rounded-2xl bg-[#1C1F26] border border-[#B89A5A]/15 p-8 space-y-6"
            >
              <div>
                <p className="text-xs text-[#B89A5A] tracking-[0.15em] uppercase font-medium mb-1">Step 5</p>
                <h2 className="font-serif text-xl font-semibold text-[#F4F2ED]">Your Executive Profile</h2>
                <p className="text-[#8E96A3] text-sm mt-1">Review your profile before starting the programme.</p>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Industry", value: data.industry },
                  { label: "Seniority", value: data.seniority },
                  { label: "Audience Size", value: `${data.audienceSize} people` },
                  { label: "Primary Challenge", value: data.challenge },
                  { label: "Key Audiences", value: data.audiences.join(", ") },
                  { label: "Communication Tone", value: data.tone },
                ].map(item => (
                  <div key={item.label} className="flex gap-3 items-start">
                    <CheckCircle2 className="h-4 w-4 text-[#B89A5A] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs text-[#8E96A3] block">{item.label}</span>
                      <span className="text-sm text-[#F4F2ED] font-medium">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleComplete}
                  className="w-full bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-xl h-12 text-base"
                >
                  Start My Programme
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {step < 5 && (
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="ghost"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
              className="text-[#8E96A3] hover:text-[#F4F2ED] disabled:opacity-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-xl disabled:opacity-40"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
        {step === 5 && step > 1 && (
          <div className="flex mt-6">
            <Button
              variant="ghost"
              onClick={() => setStep(s => s - 1)}
              className="text-[#8E96A3] hover:text-[#F4F2ED]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
