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
    title: "My Case",
    subtitle: "Real-World Threading",
    desc: "O teu cenário real (apresentação ao board, negociação, pitch) percorre todas as sessões.",
  },
  {
    icon: Sliders,
    title: "Calibração de Tom",
    desc: "Escolhe o teu estilo: Diplomat, Anchor, American Direct ou Collaborator.",
  },
  {
    icon: Zap,
    title: "Rescue Mode",
    subtitle: "Preparação de Emergência",
    desc: "Preparação de emergência de 15 minutos para uma reunião que acontece hoje.",
  },
  {
    icon: BarChart3,
    title: "Voice DNA Analytics",
    desc: "Acompanha palavras por minuto, redução de fillers, crescimento de vocabulário em tempo real.",
  },
  {
    icon: Eye,
    title: "Q&A Hostil",
    desc: "Teste de pressão rápido onde a IA faz perguntas agressivas. Perdes 'vidas' por fillers.",
  },
  {
    icon: Headphones,
    title: "Shadow Coach",
    desc: "Liga-se ao teu Zoom ou Teams para feedback privado em tempo real durante reuniões.",
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
      style={{ backgroundColor: "#0A0A0F" }}
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
            style={{ color: "#D4A853" }}
          >
            06 — A EXPERIÊNCIA
          </p>
          <h2
            className="font-serif text-4xl md:text-5xl font-semibold mb-6"
            style={{ color: "#F5F5F5" }}
          >
            Feito para Executivos.{" "}
            <span style={{ color: "#D4A853" }}>Não para Estudantes.</span>
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "#9A9AB0" }}>
            Cada funcionalidade é desenhada para cenários executivos reais.
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
                    backgroundColor: "#12121A",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#D4A853";
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
                  <div className="mb-6 inline-flex p-3 rounded-lg" style={{ backgroundColor: "rgba(212, 168, 83, 0.08)" }}>
                    <Icon className="h-6 w-6" style={{ color: "#D4A853" }} />
                  </div>

                  {/* Title and Subtitle */}
                  <h3 className="font-serif text-xl font-semibold mb-1" style={{ color: "#F5F5F5" }}>
                    {feature.title}
                  </h3>
                  {feature.subtitle && (
                    <p className="text-sm font-medium mb-4" style={{ color: "#D4A853" }}>
                      {feature.subtitle}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-sm leading-relaxed" style={{ color: "#9A9AB0" }}>
                    {feature.desc}
                  </p>

                  {/* Accent line on hover */}
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all duration-300"
                    style={{
                      width: "0%",
                      background: `linear-gradient(90deg, #D4A853, transparent)`,
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
          background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.2), transparent)",
        }}
      />
    </section>
  );
};

export default SessionFormats;
