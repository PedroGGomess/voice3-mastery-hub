import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Layers, Flame, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/ChatWidget";

const steps = [
  {
    num: "01",
    icon: Zap,
    title: "Precision Diagnostic",
    desc: "We map your Voice DNA — words per minute, filler frequency, active vocabulary and fluency level. This creates your personalised baseline and tracks every improvement along the journey.",
    tags: ["VOICE DNA", "BASELINE"],
  },
  {
    num: "02",
    icon: Layers,
    title: "The 6 Programmes",
    desc: "Master specific domains of executive communication through AI-structured sessions. From high-pressure presentations (DEFEND) to industry-specific vocabulary (TRANSLATE) to crisis communication (PREPARE).",
    tags: ["DEFEND", "TRANSLATE", "LEAD", "OPERATE", "DECODE", "PREPARE"],
  },
  {
    num: "03",
    icon: Flame,
    title: "AI Pressure Testing",
    desc: "Face hostile Q&A, boardroom simulations and AI debate clubs that push you beyond your comfort zone. Choose your AI opponent — Tough CEO, Analytical German Director, Sceptical Investor.",
    tags: ["AI PERSONAS", "SIMULATIONS"],
  },
  {
    num: "04",
    icon: UserCheck,
    title: "Coach Calibration",
    desc: "1-on-1 sessions with specialist coaches who refine your Tone Calibration — choosing between Diplomat, Anchor, American Direct or Collaborator for your audience.",
    tags: ["TONE CALIBRATION", "LIVE 1-ON-1"],
  },
];

const sessionTypes = [
  { name: "Briefing", desc: "Executive scenario + Phrase Arsenal", time: "15 min", color: "#58a6ff" },
  { name: "Drill", desc: "Controlled practice with AI correction", time: "15 min", color: "#3fb950" },
  { name: "Simulation", desc: "Pressure roleplay with Shadow Coach", time: "20 min", color: "#d29922" },
  { name: "Error Bank", desc: "Error review + Language Vault", time: "10 min", color: "#f85149" },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[3px] mb-6 block" style={{ color: "var(--gold)" }}>
            The Platform
          </span>
          <h1 className="font-serif text-[clamp(32px,5vw,48px)] font-bold leading-[1.15] mb-5">
            Human Coaching. AI Precision.{" "}
            <span className="italic" style={{ color: "var(--gold)" }}>Executive Results.</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            A four-step engine that takes you from diagnostic to boardroom-ready.
          </p>
        </motion.div>
      </section>

      {/* 4 Steps */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <div className="space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-8 items-start p-7 rounded-xl"
              style={{
                background: "var(--bg-elevated)",
                borderLeft: "3px solid var(--gold)",
              }}
            >
              <div className="shrink-0 text-center">
                <span className="font-serif text-5xl font-bold block" style={{ color: "var(--gold-10)" }}>
                  {step.num}
                </span>
                <step.icon className="h-5 w-5 mx-auto mt-2" style={{ color: "var(--gold)" }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{step.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {step.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] px-3 py-1 rounded-full font-semibold tracking-wide"
                      style={{ background: "var(--gold-10)", color: "var(--gold)", letterSpacing: "1px" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px max-w-5xl mx-auto" style={{ background: "linear-gradient(90deg, transparent, var(--border-gold), transparent)" }} />

      {/* Session Types */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[3px]" style={{ color: "var(--gold)" }}>
            Session Structure
          </span>
          <h2 className="font-serif text-3xl font-bold mt-3">
            Each Micro-Chapter = 4 Sessions
          </h2>
          <p className="text-base mt-3" style={{ color: "var(--text-secondary)" }}>
            Briefing → Drill → Simulation → Error Bank. Repeat.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sessionTypes.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl p-5"
              style={{ background: "var(--bg-surface)", borderTop: `3px solid ${s.color}` }}
            >
              <h4 className="font-semibold mb-1" style={{ color: s.color }}>{s.name}</h4>
              <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
              <span className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>{s.time}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: "linear-gradient(180deg, var(--bg-base), var(--gold-10))" }}>
        <h2 className="font-serif text-3xl font-bold mb-3">Ready to Start?</h2>
        <p className="font-serif italic text-lg mb-8" style={{ color: "var(--gold)" }}>Clarity. Control. Command.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            className="h-12 px-8 font-semibold rounded-md text-base"
            style={{ background: "var(--gold)", color: "#000" }}
            asChild
          >
            <Link to="/auth?mode=register">
              Apply to VOICE³ <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-12 px-8 rounded-md text-base"
            style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
            asChild
          >
            <Link to="/contact">Talk to Our Team</Link>
          </Button>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
