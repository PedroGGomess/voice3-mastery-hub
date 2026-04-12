import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "O que é o VOICE³?",
    a: "VOICE³ é uma plataforma de comunicação executiva com inteligência artificial, desenhada para líderes globais que precisam operar sob pressão. Não é um curso de inglês tradicional — é um programa de treino executivo focado em presença vocal, autoridade e impacto em cenários reais como board meetings, negociações e pitch internacional.",
  },
  {
    q: "Preciso de ter um nível avançado de inglês?",
    a: "Não. VOICE³ é desenhado para falantes em nível B1/B2 (intermediate). O programa trabalha a partir do teu nível atual e desenvolve não apenas a gramática, mas a confiança, presença vocal e autoridade na comunicação executiva.",
  },
  {
    q: "Como funcionam as sessões com professor?",
    a: "As sessões 1-on-1 com professor são personalizadas para a tua jornada. Trabalhas com calibração de tom (escolhendo entre Diplomat, Anchor, American Direct ou Collaborator), análise de performance e feedback prático sobre como soar mais assertivo, persuasivo e impactante em contextos executivos.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. VOICE³ oferece plena flexibilidade. Podes cancelar a tua subscrição a qualquer momento, sem penalizações ou contratos de longa duração. Acreditamos que resultados reais falam por si.",
  },
  {
    q: "Quanto tempo demora a ver resultados?",
    a: "87% dos participantes reportam melhoria mensurável em 4 semanas. A maioria nota mudanças significativas em presença vocal e confiança em 2 semanas. Os resultados mais profundos (transformação de como és percebido) emergem com consistência ao longo de 8-12 semanas.",
  },
  {
    q: "O que é o Voice DNA?",
    a: "Voice DNA Analytics é o sistema de métricas do VOICE³. Acompanha em tempo real: palavras por minuto, redução de preenchimentos (fillers), pacing, entoação, vocabulário executivo e muito mais. Recebe um relatório personalizado após cada sessão com dados precisos sobre o teu progresso.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{ backgroundColor: "#0A0A0F" }}
      id="faq"
    >
      {/* Decorative background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(212, 168, 83, 0.07) 0%, transparent 60%)",
        }}
      />

      <div className="container max-w-3xl relative z-10 px-4">
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
            FAQ
          </p>
          <h2
            className="font-serif text-4xl md:text-5xl font-semibold mb-6"
            style={{ color: "#F5F5F5" }}
          >
            Perguntas Frequentes
          </h2>
          <p style={{ color: "#9A9AB0" }}>
            Tudo o que precisas saber sobre VOICE³.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div key={idx} variants={itemVariants}>
                <motion.div
                  className="transition-all duration-300"
                  style={{
                    borderRadius: 12,
                    backgroundColor: isOpen ? "rgba(212, 168, 83, 0.05)" : "rgba(255, 255, 255, 0.02)",
                    border: isOpen
                      ? "1px solid rgba(212, 168, 83, 0.25)"
                      : "1px solid rgba(255, 255, 255, 0.05)",
                    overflow: "hidden",
                  }}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between cursor-pointer transition-colors duration-300 hover:bg-opacity-40"
                    style={{
                      backgroundColor: isOpen
                        ? "rgba(212, 168, 83, 0.03)"
                        : "transparent",
                      fontSize: 15,
                      fontWeight: 500,
                      textAlign: "left",
                    }}
                  >
                    <span
                      className="font-semibold transition-colors duration-300"
                      style={{
                        color: isOpen ? "#D4A853" : "rgba(245, 245, 245, 0.9)",
                      }}
                    >
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{
                        rotate: isOpen ? 180 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ marginLeft: 16, flexShrink: 0 }}
                    >
                      <ChevronDown
                        className="h-5 w-5 transition-colors duration-300"
                        style={{
                          color: isOpen ? "#D4A853" : "#9A9AB0",
                        }}
                      />
                    </motion.div>
                  </button>

                  {/* Accordion Content */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{
                          overflow: "hidden",
                        }}
                      >
                        <div
                          className="px-6 md:px-8 py-5 md:py-6 border-t"
                          style={{
                            borderColor: "rgba(212, 168, 83, 0.1)",
                          }}
                        >
                          <p
                            className="text-sm md:text-base leading-relaxed"
                            style={{ color: "rgba(245, 245, 245, 0.75)" }}
                          >
                            {faq.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 p-8 md:p-10 rounded-lg text-center"
          style={{
            backgroundColor: "rgba(212, 168, 83, 0.05)",
            border: "1px solid rgba(212, 168, 83, 0.15)",
          }}
        >
          <p className="mb-4" style={{ color: "#F5F5F5" }}>
            Não encontras a resposta que procuras?
          </p>
          <a
            href="mailto:support@voice3.com"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:brightness-110"
            style={{
              backgroundColor: "#D4A853",
              color: "#000",
            }}
          >
            Contacta o Suporte
          </a>
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

export default FAQ;
