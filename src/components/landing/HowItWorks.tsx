import { motion } from "framer-motion";
import { Zap, Layers, Flame, UserCheck } from "lucide-react";

const steps = [
  {
    icon: Zap,
    number: "01",
    title: "Precision Diagnostic",
    description: "We map your Voice DNA — words per minute, filler frequency, active vocabulary and fluency level. This creates your personalised baseline and tracks every improvement.",
    tags: ["VOICE DNA", "ANALYSIS"],
  },
  {
    icon: Layers,
    number: "02",
    title: "The 6 Programmes",
    description: "Master specific domains of executive communication through AI-structured sessions. From high-pressure presentations (DEFEND) to industry-specific vocabulary (TRANSLATE) to crisis communication (PREPARE).",
    tags: ["DEFEND", "TRANSLATE", "LEAD"],
  },
  {
    icon: Flame,
    number: "03",
    title: "AI Pressure Testing",
    description: "Face hostile Q&A, boardroom simulations and AI debate clubs that push you beyond your comfort zone. Choose your AI opponent — Tough CEO, Analytical German Director, Sceptical Investor.",
    tags: ["Q&A", "BOARDROOM", "PRESSURE"],
  },
  {
    icon: UserCheck,
    number: "04",
    title: "Coach Calibration",
    description: "1-on-1 sessions with specialist coaches who refine your Tone Calibration — choosing between Diplomat, Anchor, American Direct or Collaborator for your audience.",
    tags: ["TONE", "1-ON-1", "COACHING"],
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" style={{ backgroundColor: "var(--bg-base)" }} className="py-28 relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(212,168,83,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-[var(--gold)] tracking-[0.15em] uppercase text-xs md:text-sm mb-4 font-semibold">
            05 — HOW IT WORKS
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: "var(--text-primary)" }}>
            Human Coaching. AI Precision. Executive Results.
          </h2>
          <p
            className="max-w-2xl mx-auto text-lg"
            style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}
          >
            A four-stage engine that takes you from diagnostic to boardroom ready.
          </p>
        </motion.div>

        {/* Steps Grid - Desktop */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
          {/* Connection lines */}
          <div
            className="absolute top-24 left-0 right-0 h-px hidden lg:block"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.2), transparent)",
            }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative group"
            >
              {/* Card */}
              <div
                className="rounded-lg overflow-hidden border transition-all duration-300 h-full flex flex-col hover:shadow-xl"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderLeft: "3px solid var(--gold)",
                  borderTop: "1px solid var(--border-gold)",
                  borderRight: "1px solid rgba(212,168,83,0.05)",
                  borderBottom: "1px solid rgba(212,168,83,0.05)",
                  padding: "32px 24px",
                }}
              >
                {/* Step Number Background */}
                <div className="absolute -top-2 -right-2 text-[80px] font-serif font-bold opacity-5 select-none pointer-events-none">
                  {step.number}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: "var(--gold-10)" }}
                  >
                    <step.icon className="h-6 w-6" style={{ color: "var(--gold)" }} />
                  </div>

                  {/* Number + Title */}
                  <p
                    className="text-xs tracking-[0.2em] uppercase font-semibold mb-3"
                    style={{ color: "var(--text-gold)" }}
                  >
                    {step.number}
                  </p>
                  <h3 className="font-serif text-xl font-bold mb-4 leading-tight" style={{ color: "var(--text-primary)" }}>
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed mb-6 flex-grow" style={{ color: "var(--text-secondary)" }}>
                    {step.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {step.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: "var(--gold-10)",
                          color: "var(--gold)",
                          border: "1px solid var(--border-gold)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Steps - Mobile */}
        <div className="md:hidden space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <div
                className="rounded-lg overflow-hidden border transition-all duration-300"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderLeft: "3px solid var(--gold)",
                  borderTop: "1px solid var(--border-gold)",
                  borderRight: "1px solid rgba(212,168,83,0.05)",
                  borderBottom: "1px solid rgba(212,168,83,0.05)",
                  padding: "24px",
                }}
              >
                <div className="flex gap-4">
                  <div
                    className="w-12 h-12 shrink-0 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "var(--gold-10)" }}
                  >
                    <step.icon className="h-6 w-6" style={{ color: "var(--gold)" }} />
                  </div>

                  <div className="flex-1">
                    <p
                      className="text-xs tracking-[0.2em] uppercase font-semibold mb-2"
                      style={{ color: "var(--text-gold)" }}
                    >
                      {step.number}
                    </p>
                    <h3 className="font-serif text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>{step.title}</h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: "var(--gold-10)",
                            color: "var(--gold)",
                            border: "1px solid var(--border-gold)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom divider */}
      <div
        className="mt-20 h-px max-w-7xl mx-auto"
        style={{
          background: "linear-gradient(90deg, transparent, var(--border-gold), transparent)",
        }}
      />
    </section>
  );
};

export default HowItWorks;
