import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/ChatWidget";
import { toast } from "sonner";

const features = [
  {
    icon: "📊",
    title: "Centralised Dashboard",
    desc: "One view of your entire team's progress, scores, and learning trajectories.",
  },
  {
    icon: "🎯",
    title: "Customised Learning Paths",
    desc: "Tailor content to your industry, clients, and executive challenges.",
  },
  {
    icon: "👩‍🏫",
    title: "Dedicated Professor",
    desc: "Your team gets a dedicated language coach for live checkpoints.",
  },
  {
    icon: "📈",
    title: "ROI Measurement",
    desc: "Track communication improvements with before/after session analytics.",
  },
  {
    icon: "🔒",
    title: "GDPR Compliant",
    desc: "Enterprise-grade data security. All data processed in the EU.",
  },
  {
    icon: "🌍",
    title: "Multilingual Support",
    desc: "Platform available in English and Portuguese. More coming soon.",
  },
];

const steps = [
  {
    num: "01",
    label: "Discovery",
    desc: "We learn your team's specific challenges and goals.",
  },
  {
    num: "02",
    label: "Diagnostic",
    desc: "Every participant completes the AI Diagnostic Session.",
  },
  {
    num: "03",
    label: "Programme Starts",
    desc: "Custom learning paths activated for all team members.",
  },
  {
    num: "04",
    label: "Track Results",
    desc: "Real-time analytics show measurable progress.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function ForCompaniesPage() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    teamSize: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("We'll be in touch within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-[#0B1A2A]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <p className="text-xs tracking-[0.2em] text-[#C9A84C] uppercase mb-4">Enterprise</p>
          <h1 className="font-serif text-[clamp(36px,5vw,56px)] font-bold text-[#F4F2ED] leading-tight mb-8 max-w-3xl mx-auto">
            Elevate Your Team's Executive Communication
          </h1>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact">
              <Button
                className="h-12 px-8 font-bold rounded-xl"
                style={{ background: "linear-gradient(135deg, #C9A84C, #E8C87A)", color: "#060f1d" }}
              >
                Book Team Demo <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="h-12 px-8 font-bold rounded-xl text-[#C9A84C]"
              style={{ borderColor: "rgba(201,168,76,0.5)" }}
            >
              Download Enterprise Guide
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ── Trusted by ── */}
      <section className="pb-16 px-6 text-center">
        <p
          className="text-xs tracking-[0.12em] uppercase"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          GALP · NOS · EDP · SONAE · MILLENNIUM · CTT
        </p>
      </section>

      {/* ── 6 Features grid ── */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <motion.h2
          className="text-center font-serif text-3xl font-bold text-[#F4F2ED] mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Built for Enterprise
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              className="bg-[#1C1F26] rounded-xl p-7 border border-[#B89A5A]/10 hover:border-[#B89A5A]/30 transition-all duration-300"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <span className="text-[28px] mb-4 block">{feat.icon}</span>
              <h3 className="text-lg font-bold text-[#F4F2ED] mb-2">{feat.title}</h3>
              <p className="text-sm text-[#8E96A3] leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 4-Step Process ── */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <motion.h2
          className="text-center font-serif text-3xl font-bold text-[#F4F2ED] mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          How We Onboard Your Team
        </motion.h2>
        <div className="flex flex-col md:flex-row items-start gap-0">
          {steps.map((step, i) => (
            <div key={step.num} className="flex md:flex-col items-start md:items-center flex-1 gap-4 md:gap-0">
              <div className="flex md:flex-col items-center md:items-center w-full gap-0">
                {/* Step circle */}
                <motion.div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2"
                  style={{ borderColor: "#C9A84C", color: "#C9A84C" }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.4 }}
                >
                  {step.num}
                </motion.div>
                {/* Connector on md+ */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block flex-1 border-t border-dashed border-[#C9A84C]/30 mx-2 mt-0"
                    style={{ minWidth: 20 }}
                  />
                )}
              </div>
              <motion.div
                className="md:text-center mt-0 md:mt-4 px-2"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.1, duration: 0.4 }}
              >
                <p className="text-xs tracking-[0.12em] text-[#C9A84C] uppercase font-bold mb-1">
                  {step.label}
                </p>
                <p className="text-sm text-[#8E96A3] leading-relaxed max-w-[160px] mx-auto">{step.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Demo Request Form ── */}
      <section className="px-6 pb-32 max-w-[600px] mx-auto">
        <motion.div
          className="rounded-[20px] p-12"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(201,168,76,0.15)",
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {submitted ? (
            <div
              className="rounded-2xl p-10 text-center"
              style={{
                background: "rgba(52,211,153,0.05)",
                border: "1px solid rgba(52,211,153,0.3)",
              }}
            >
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-[#F4F2ED] mb-2">Request received!</h3>
              <p className="text-[#8E96A3]">We'll be in touch within 24 hours.</p>
            </div>
          ) : (
            <>
              <h2 className="font-serif text-2xl font-bold text-[#F4F2ED] mb-1 text-center">
                Book a Team Demo
              </h2>
              <p className="text-[#8E96A3] text-sm text-center mb-8">
                Tell us about your team and we'll reach out to schedule a personalised demo.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-[#8E96A3] uppercase tracking-wide mb-1.5">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg bg-[#0B1A2A] border border-[rgba(255,255,255,0.08)] text-[#F4F2ED] text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8E96A3] uppercase tracking-wide mb-1.5">
                    Company
                  </label>
                  <input
                    required
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg bg-[#0B1A2A] border border-[rgba(255,255,255,0.08)] text-[#F4F2ED] text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8E96A3] uppercase tracking-wide mb-1.5">
                    Work Email
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg bg-[#0B1A2A] border border-[rgba(255,255,255,0.08)] text-[#F4F2ED] text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8E96A3] uppercase tracking-wide mb-1.5">
                    Team Size
                  </label>
                  <select
                    required
                    value={form.teamSize}
                    onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg bg-[#0B1A2A] border border-[rgba(255,255,255,0.08)] text-[#F4F2ED] text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                  >
                    <option value="" disabled>Select team size</option>
                    <option value="1-10">1–10</option>
                    <option value="11-50">11–50</option>
                    <option value="51-200">51–200</option>
                    <option value="200+">200+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#8E96A3] uppercase tracking-wide mb-1.5">
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-[#0B1A2A] border border-[rgba(255,255,255,0.08)] text-[#F4F2ED] text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors resize-none"
                    placeholder="Tell us about your team's goals..."
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-[52px] text-base font-bold rounded-xl mt-2"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #E8C87A)", color: "#060f1d" }}
                >
                  Book Team Demo <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
