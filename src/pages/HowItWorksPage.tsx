import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/ChatWidget";

const phases = [
  {
    num: "01",
    timing: "~5 min",
    icon: "⚡",
    title: "Deep Dive: Context & Theory",
    desc: "Begin each session with precision-targeted content. Video, audio, and structured theory to prime your executive mindset.",
    badges: [],
    label: "INTAKE",
  },
  {
    num: "02",
    timing: "~15 min",
    icon: "🎯",
    title: "AI-Powered Real-Time Practice",
    desc: "Your AI Coach fires live scenarios. Immediate, brutally honest feedback on structure, clarity, and authority.",
    badges: [{ text: "🤖 AI Active", gold: true }],
    label: "DRILL",
  },
  {
    num: "03",
    timing: "~10 min",
    icon: "🏆",
    title: "Flash Executive Simulation",
    desc: "A timed written role-play. Board meetings, investor challenges, difficult clients — performed under pressure.",
    badges: [{ text: "⏱ Timed", gold: false }],
    label: "SIMULATION",
  },
  {
    num: "04",
    timing: "~3 min",
    icon: "📈",
    title: "AI Performance Report",
    desc: "Personalised score, strengths, areas to sharpen. Your AI Coach remembers everything and adapts over time.",
    badges: [{ text: "📊 Auto-generated", gold: false }],
    label: "DEBRIEF",
  },
];

const tools = [
  { icon: "🤖", title: "AI Coach Chat", desc: "Your always-on training partner" },
  { icon: "🚨", title: "Rescue Mode", desc: "Emergency communication prep" },
  { icon: "📝", title: "Grammar Tool", desc: "Precision language correction" },
  { icon: "⚔️", title: "Q&A Gauntlet", desc: "Hostile questioning drills" },
  { icon: "💬", title: "AI Debate Club", desc: "Structured argumentation" },
  { icon: "✉️", title: "Email Tone", desc: "Executive email transformation" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.55, ease: "easeOut" as const } }),
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#0B1A2A]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <p className="text-xs tracking-[0.2em] text-[#C9A84C] uppercase mb-4">The Method</p>
          <h1 className="font-serif text-[clamp(36px,5vw,52px)] font-bold text-[#F4F2ED] leading-tight mb-6">
            The VOICE<sup className="text-[#C9A84C]">³</sup> Method
          </h1>
          <div className="w-[60px] h-[2px] bg-[#C9A84C] mx-auto mb-6" />
          <p className="text-[18px] text-[#8E96A3] max-w-xl mx-auto mb-8 leading-relaxed">
            This is not a language course. It is an executive performance system built for leaders who
            operate in high-stakes English environments.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["✓ AI-Powered Training", "✓ Human Professor Sessions"].map((pill) => (
              <span
                key={pill}
                style={{
                  background: "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: 999,
                  padding: "8px 20px",
                  color: "#C9A84C",
                  fontSize: 14,
                }}
              >
                {pill}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── 4 Phases ── */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <motion.h2
          className="text-center font-serif text-3xl font-bold text-[#F4F2ED] mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Inside Every Session
        </motion.h2>

        <div className="flex flex-col gap-6">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.num}
              className="bg-[#1C1F26] rounded-2xl border border-[#B89A5A]/10 p-8 relative overflow-hidden"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {/* Faded number */}
              <span
                className="absolute right-6 top-1/2 -translate-y-1/2 font-serif font-black select-none pointer-events-none"
                style={{ fontSize: 96, color: "#C9A84C", opacity: 0.05, lineHeight: 1 }}
              >
                {phase.num}
              </span>

              <div className="flex items-start gap-6 relative z-10">
                {/* Icon circle */}
                <div
                  className="flex-shrink-0 flex items-center justify-center text-2xl rounded-full"
                  style={{
                    width: 64,
                    height: 64,
                    background: "rgba(201,168,76,0.1)",
                    border: "2px solid rgba(201,168,76,0.3)",
                  }}
                >
                  {phase.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-xs tracking-[0.18em] text-[#C9A84C] font-bold uppercase">
                      Phase {phase.num} — {phase.label}
                    </span>
                    <span className="text-xs text-[#8E96A3]">({phase.timing})</span>
                    {phase.badges.map((b) => (
                      <span
                        key={b.text}
                        className="text-xs px-3 py-1 rounded-full"
                        style={
                          b.gold
                            ? { background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }
                            : { background: "rgba(255,255,255,0.05)", color: "#8E96A3", border: "1px solid rgba(255,255,255,0.1)" }
                        }
                      >
                        {b.text}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-[#F4F2ED] mb-2">{phase.title}</h3>
                  <p className="text-[#8E96A3] text-sm leading-relaxed">{phase.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 6 AI Tools ── */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs tracking-[0.2em] text-[#C9A84C] uppercase mb-3">Included</p>
          <h2 className="font-serif text-3xl font-bold text-[#F4F2ED]">6 AI-Powered Tools</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              className="bg-[#1C1F26] rounded-xl border border-[#B89A5A]/10 p-6 cursor-default transition-all duration-300 hover:border-[#B89A5A]/30"
              style={{ transition: "transform 0.2s, border-color 0.2s" }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <span className="text-3xl mb-4 block">{tool.icon}</span>
              <h3 className="text-[#F4F2ED] font-bold text-base mb-1">{tool.title}</h3>
              <p className="text-[#8E96A3] text-sm">{tool.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 pb-32 text-center">
        <motion.div
          className="max-w-xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F4F2ED] mb-4">
            Your first session is a diagnostic.
          </h2>
          <p className="text-[#8E96A3] text-lg mb-8">Free for new members. Takes 30 minutes.</p>
          <Link to="/auth">
            <Button
              className="h-14 px-10 text-base font-bold rounded-xl"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E8C87A)", color: "#060f1d" }}
            >
              Start Your Executive Diagnostic
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
