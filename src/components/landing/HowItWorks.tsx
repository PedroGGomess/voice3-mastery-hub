import { motion } from "framer-motion";
import { Zap, Layers, Flame, UserCheck } from "lucide-react";

const steps = [
  {
    icon: Zap,
    number: "01",
    title: "Diagnóstico de Precisão",
    description: "Mapeamos o teu Voice DNA — palavras por minuto, frequência de fillers, vocabulário activo e nível de fluência.",
    tags: ["VOICE DNA", "ANÁLISE"],
  },
  {
    icon: Layers,
    number: "02",
    title: "Os 6 Programas",
    description: "Domina domínios específicos: DEFEND, TRANSLATE, LEAD, OPERATE, DECODE, PREPARE. Cada um ataca um desafio executivo real.",
    tags: ["DEFEND", "TRANSLATE", "LEAD", "OPERATE", "DECODE", "PREPARE"],
  },
  {
    icon: Flame,
    number: "03",
    title: "Teste de Pressão AI",
    description: "Enfrenta Q&A hostis, simulações de boardroom e debates AI. Treina sob pressão antes do momento real.",
    tags: ["Q&A", "BOARDROOM", "PRESSÃO"],
  },
  {
    icon: UserCheck,
    number: "04",
    title: "Calibração com Professor",
    description: "Sessões 1-on-1 com professores que refinam o teu Tone — Diplomat, Anchor, American Direct ou Collaborator.",
    tags: ["TONE", "1-ON-1", "COACHING"],
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" style={{ backgroundColor: "#0A0A0F" }} className="py-28 relative overflow-hidden">
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
          <p className="text-[#D4A853] tracking-[0.15em] uppercase text-xs md:text-sm mb-4 font-semibold">
            05 — A PLATAFORMA
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-6 leading-tight">
            Coaching Humano. Precisão AI. Resultados Executivos.
          </h2>
          <p
            className="max-w-2xl mx-auto text-lg"
            style={{ color: "#9A9AB0", lineHeight: "1.8" }}
          >
            Um motor de quatro etapas que te leva do diagnóstico ao boardroom.
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
                  backgroundColor: "#12121A",
                  borderLeft: "3px solid #D4A853",
                  borderTop: "1px solid rgba(212,168,83,0.1)",
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
                    style={{ backgroundColor: "rgba(212,168,83,0.1)" }}
                  >
                    <step.icon className="h-6 w-6" style={{ color: "#D4A853" }} />
                  </div>

                  {/* Number + Title */}
                  <p
                    className="text-xs tracking-[0.2em] uppercase font-semibold mb-3"
                    style={{ color: "rgba(212,168,83,0.6)" }}
                  >
                    {step.number}
                  </p>
                  <h3 className="font-serif text-xl font-bold text-[#F5F5F5] mb-4 leading-tight">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed mb-6 flex-grow" style={{ color: "#9A9AB0" }}>
                    {step.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {step.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: "rgba(212,168,83,0.08)",
                          color: "#D4A853",
                          border: "1px solid rgba(212,168,83,0.2)",
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
                  backgroundColor: "#12121A",
                  borderLeft: "3px solid #D4A853",
                  borderTop: "1px solid rgba(212,168,83,0.1)",
                  borderRight: "1px solid rgba(212,168,83,0.05)",
                  borderBottom: "1px solid rgba(212,168,83,0.05)",
                  padding: "24px",
                }}
              >
                <div className="flex gap-4">
                  <div
                    className="w-12 h-12 shrink-0 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "rgba(212,168,83,0.1)" }}
                  >
                    <step.icon className="h-6 w-6" style={{ color: "#D4A853" }} />
                  </div>

                  <div className="flex-1">
                    <p
                      className="text-xs tracking-[0.2em] uppercase font-semibold mb-2"
                      style={{ color: "rgba(212,168,83,0.6)" }}
                    >
                      {step.number}
                    </p>
                    <h3 className="font-serif text-lg font-bold text-[#F5F5F5] mb-3">{step.title}</h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "#9A9AB0" }}>
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: "rgba(212,168,83,0.08)",
                            color: "#D4A853",
                            border: "1px solid rgba(212,168,83,0.2)",
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
          background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.15), transparent)",
        }}
      />
    </section>
  );
};

export default HowItWorks;
