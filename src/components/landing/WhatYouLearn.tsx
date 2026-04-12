import { motion } from "framer-motion";
import { Lightbulb, Lock, Zap } from "lucide-react";

const WhatYouLearn = () => {
  const pillars = [
    {
      title: "CLARITY",
      icon: Lightbulb,
      description: "Position messages with absolute precision and eliminate ambiguity.",
    },
    {
      title: "CONTROL",
      icon: Lock,
      description: "Justify arguments with structured authority and command the room.",
    },
    {
      title: "COMMAND",
      icon: Zap,
      description: "Close with impact and executive presence to drive decisive outcomes.",
    },
  ];

  return (
    <section style={{ backgroundColor: "var(--bg-base)" }} className="py-28 relative overflow-hidden">
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
          className="text-center mb-16"
        >
          <p className="text-[var(--gold)] tracking-[0.15em] uppercase text-xs md:text-sm mb-4 font-semibold">
            03 — THE CHALLENGE
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: "var(--text-primary)" }}>
            Stop losing the room because of your language.
          </h2>
          <p
            className="max-w-2xl mx-auto text-lg"
            style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}
          >
            The problem isn't your grammar; it's your authority under pressure. When pressure hits, executives don't need English lessons — they need strategic vocabulary and tone control.
          </p>
        </motion.div>

        {/* Promise Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-16 rounded-lg p-8 md:p-10"
          style={{
            backgroundColor: "var(--bg-elevated)",
            border: "2px solid var(--gold)",
          }}
        >
          <p
            className="font-serif text-xl md:text-2xl font-bold leading-relaxed"
            style={{ color: "var(--text-primary)", lineHeight: "1.8" }}
          >
            The VOICE³ Method bridges the gap.{" "}
            <span style={{ color: "var(--gold)" }}>This isn't learning English. It's performance engineering.</span>
          </p>
        </motion.div>

        {/* Method Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              className="group"
            >
              <div
                className="rounded-lg overflow-hidden border transition-all duration-300 h-full flex flex-col hover:shadow-xl"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderTop: "3px solid var(--gold)",
                  borderLeft: "1px solid var(--border-gold)",
                  borderRight: "1px solid var(--border-gold)",
                  borderBottom: "1px solid rgba(212,168,83,0.05)",
                  padding: "32px 28px",
                }}
              >
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: "var(--gold-10)" }}
                  >
                    <pillar.icon className="h-7 w-7" style={{ color: "var(--gold)" }} />
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-2xl font-bold mb-4 tracking-wide" style={{ color: "var(--text-primary)" }}>
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {pillar.description}
                  </p>

                  {/* Accent line */}
                  <div
                    className="mt-6 h-1 w-12 rounded-full"
                    style={{ backgroundColor: "var(--gold)" }}
                  />
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

export default WhatYouLearn;
