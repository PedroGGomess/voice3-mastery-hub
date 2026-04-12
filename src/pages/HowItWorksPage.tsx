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
    title: "Diagnóstico de Precisão",
    desc: "Mapeamos o teu Voice DNA — palavras por minuto, frequência de fillers, vocabulário activo e nível de fluência. Isto cria a tua baseline personalizada e acompanha cada melhoria ao longo do percurso.",
    tags: ["VOICE DNA", "BASELINE"],
  },
  {
    num: "02",
    icon: Layers,
    title: "Os 6 Programas",
    desc: "Domina domínios específicos de comunicação executiva através de sessões estruturadas com IA. De apresentações de alta pressão (DEFEND) a vocabulário específico da indústria (TRANSLATE) a comunicação de crise (PREPARE).",
    tags: ["DEFEND", "TRANSLATE", "LEAD", "OPERATE", "DECODE", "PREPARE"],
  },
  {
    num: "03",
    icon: Flame,
    title: "Teste de Pressão AI",
    desc: "Enfrenta Q&A hostis, simulações de boardroom e clubes de debate AI que te empurram para lá da zona de conforto. Escolhe o teu oponente AI — CEO Duro, Director Alemão Analítico, Investidor Céptico.",
    tags: ["AI PERSONAS", "SIMULAÇÕES"],
  },
  {
    num: "04",
    icon: UserCheck,
    title: "Calibração com Professor",
    desc: "Sessões 1-on-1 com professores especialistas que refinam a tua Calibração de Tom — escolhendo entre Diplomat, Anchor, American Direct ou Collaborator conforme a tua audiência.",
    tags: ["CALIBRAÇÃO DE TOM", "LIVE 1-ON-1"],
  },
];

const sessionTypes = [
  { name: "Briefing", desc: "Cenário executivo + Arsenal de frases", time: "15 min", color: "#58a6ff" },
  { name: "Drill", desc: "Prática controlada com correção AI", time: "15 min", color: "#3fb950" },
  { name: "Simulação", desc: "Roleplay de pressão com Shadow Coach", time: "20 min", color: "#d29922" },
  { name: "Error Bank", desc: "Revisão de erros + Language Vault", time: "10 min", color: "#f85149" },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0A0A0F", color: "#F5F5F5" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[3px] mb-6 block" style={{ color: "#D4A853" }}>
            A Plataforma
          </span>
          <h1 className="font-serif text-[clamp(32px,5vw,48px)] font-bold leading-[1.15] mb-5">
            Coaching Humano. Precisão AI.{" "}
            <span className="italic" style={{ color: "#D4A853" }}>Resultados Executivos.</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "#9A9AB0" }}>
            Um motor de quatro etapas que te leva do diagnóstico ao boardroom-ready.
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
                background: "#1A1A25",
                borderLeft: "3px solid #D4A853",
              }}
            >
              <div className="shrink-0 text-center">
                <span className="font-serif text-5xl font-bold block" style={{ color: "rgba(212,168,83,0.3)" }}>
                  {step.num}
                </span>
                <step.icon className="h-5 w-5 mx-auto mt-2" style={{ color: "#D4A853" }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#9A9AB0" }}>{step.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {step.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] px-3 py-1 rounded-full font-semibold tracking-wide"
                      style={{ background: "rgba(212,168,83,0.1)", color: "#D4A853", letterSpacing: "1px" }}
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
      <div className="h-px max-w-5xl mx-auto" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.2), transparent)" }} />

      {/* Session Types */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[3px]" style={{ color: "#D4A853" }}>
            Estrutura de Sessão
          </span>
          <h2 className="font-serif text-3xl font-bold mt-3">
            Cada Micro-Capítulo = 4 Sessões
          </h2>
          <p className="text-base mt-3" style={{ color: "#9A9AB0" }}>
            Briefing → Drill → Simulação → Error Bank. Repetir.
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
              style={{ background: "#12121A", borderTop: `3px solid ${s.color}` }}
            >
              <h4 className="font-semibold mb-1" style={{ color: s.color }}>{s.name}</h4>
              <p className="text-sm mb-3" style={{ color: "#9A9AB0" }}>{s.desc}</p>
              <span className="text-[11px] font-semibold" style={{ color: "#6E7681" }}>{s.time}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: "linear-gradient(180deg, #0A0A0F, rgba(212,168,83,0.04))" }}>
        <h2 className="font-serif text-3xl font-bold mb-3">Pronto para Começar?</h2>
        <p className="font-serif italic text-lg mb-8" style={{ color: "#D4A853" }}>Clarity. Control. Command.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            className="h-12 px-8 font-semibold rounded-md text-base"
            style={{ background: "#D4A853", color: "#000" }}
            asChild
          >
            <Link to="/auth?mode=register">
              Candidatar-me ao VOICE³ <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-12 px-8 rounded-md text-base"
            style={{ borderColor: "#D4A853", color: "#D4A853" }}
            asChild
          >
            <Link to="/contact">Falar com a Equipa</Link>
          </Button>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
