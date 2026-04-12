import { motion } from "framer-motion";
import {
  Target,
  Sliders,
  Zap,
  BarChart3,
  Eye,
  Headphones,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Tone Calibration",
    desc: "Shift between Diplomat, Anchor, American Direct and Collaborator depending on your audience.",
  },
  {
    icon: Sliders,
    title: "Voice DNA Analytics",
    desc: "Track words per minute, filler frequency, vocabulary range and pitch variation over time.",
  },
  {
    icon: Zap,
    title: "High-Stakes Q&A",
    desc: "Face hostile board questions, sceptical investor challenges and rapid-fire scenarios.",
  },
  {
    icon: BarChart3,
    title: "The Shadow Coach",
    desc: "A continuous AI engine that tracks your Voice DNA even during live human coaching sessions.",
  },
  {
    icon: Eye,
    title: "The Prep Room",
    desc: "Upload your CV and generate a bespoke interview simulation based on your actual scenario.",
  },
  {
    icon: Headphones,
    title: "The Error Bank",
    desc: "Your chronological, categorised record of fossilised errors and pronunciation patterns.",
  },
];

const SessionFormats = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-base)" }}
      id="experiencia"
    >
      {/* Decorative background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 60% 50%, rgba(212,168,83,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p
            className="tracking-[0.2em] uppercase text-sm mb-6 font-medium"
            style={{ color: "var(--gold)" }}
          >
            06 — THE EXPERIENCE
          </p>
          <h2
            className="font-serif text-4xl md:text-5xl font-semibold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Built for Executives.{" "}
            <span style={{ color: "var(--gold)" }}>Not for Students.</span>
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Every feature is designed for real executive scenarios.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 },
                }}
                className="group relative"
              >
                <div
                  className="relative h-full rounded-xl p-8 backdrop-blur-sm transition-all duration-300"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--gold)";
                    e.currentTarget.style.boxShadow =
                      "0 0 20px rgba(212, 168, 83, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Icon */}
                  <div className="mb-6 inline-flex p-3 rounded-lg" style={{ backgroundColor: "var(--gold-10)" }}>
                    <Icon className="h-6 w-6" style={{ color: "var(--gold)" }} />
                  </div>

                  {/* Title and Subtitle */}
                  <h3 className="font-serif text-xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                    {feature.title}
                  </h3>
                  {(feature as any).subtitle && (
                    <p className="text-sm font-medium mb-4" style={{ color: "var(--gold)" }}>
                      {(feature as any).subtitle}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {feature.desc}
                  </p>

                  {/* Accent line on hover */}
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all duration-300"
                    style={{
                      width: "0%",
                      background: `linear-gradient(90deg, var(--gold), transparent)`,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.width = "100%";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.width = "0%";
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Section Divider */}
      <div
        className="h-px w-full mt-20"
        style={{
          background: "linear-gradient(90deg, transparent, var(--border-gold), transparent)",
        }}
      />
    </section>
  );
};

export default SessionFormats;
