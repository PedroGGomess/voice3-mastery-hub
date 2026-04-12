import { motion } from "framer-motion";
import { Lightbulb, Lock, Zap } from "lucide-react";

const WhatYouLearn = () => {
  const pillars = [
    {
      title: "CLARITY",
      icon: Lightbulb,
      description: "Posiciona a tua mensagem com precisão absoluta.",
    },
    {
      title: "CONTROL",
      icon: Lock,
      description: "Justifica o teu argumento com autoridade estruturada.",
    },
    {
      title: "COMMAND",
      icon: Zap,
      description: "Fecha com impacto e presença executiva.",
    },
  ];

  return (
    <section style={{ backgroundColor: "#0A0A0F" }} className="py-28 relative overflow-hidden">
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
          <p className="text-[#D4A853] tracking-[0.15em] uppercase text-xs md:text-sm mb-4 font-semibold">
            03 — O DESAFIO
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-6 leading-tight">
            Pára de perder a sala por causa da língua.
          </h2>
          <p
            className="max-w-2xl mx-auto text-lg"
            style={{ color: "#9A9AB0", lineHeight: "1.8" }}
          >
            Para executivos não-nativos, a barreira não é a gramática. É a autoridade. O teu sotaque não é o problema. É a capacidade de manter a sala quando a pressão sobe.
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
            backgroundColor: "rgba(212,168,83,0.05)",
            border: "2px solid #D4A853",
          }}
        >
          <p
            className="font-serif text-xl md:text-2xl font-bold text-[#F5F5F5] leading-relaxed"
            style={{ lineHeight: "1.8" }}
          >
            VOICE³ faz a ponte entre o teu B2 e o teu intelecto executivo.{" "}
            <span style={{ color: "#D4A853" }}>Isto não é aprender inglês. É engenharia de performance.</span>
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
                  backgroundColor: "#12121A",
                  borderTop: "3px solid #D4A853",
                  borderLeft: "1px solid rgba(212,168,83,0.1)",
                  borderRight: "1px solid rgba(212,168,83,0.1)",
                  borderBottom: "1px solid rgba(212,168,83,0.05)",
                  padding: "32px 28px",
                }}
              >
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: "rgba(212,168,83,0.1)" }}
                  >
                    <pillar.icon className="h-7 w-7" style={{ color: "#D4A853" }} />
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-2xl font-bold text-[#F5F5F5] mb-4 tracking-wide">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base leading-relaxed" style={{ color: "#9A9AB0" }}>
                    {pillar.description}
                  </p>

                  {/* Accent line */}
                  <div
                    className="mt-6 h-1 w-12 rounded-full"
                    style={{ backgroundColor: "#D4A853" }}
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
          background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.15), transparent)",
        }}
      />
    </section>
  );
};

export default WhatYouLearn;
