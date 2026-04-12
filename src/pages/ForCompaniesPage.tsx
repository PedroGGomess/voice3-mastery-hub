import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check, BarChart3, Users, Globe, Shield, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/ChatWidget";

const features = [
  { icon: BarChart3, title: "Dashboard Centralizado", desc: "Uma visão completa do progresso de toda a equipa, pontuações e trajectórias de aprendizagem." },
  { icon: BookOpen, title: "Percursos Personalizados", desc: "Conteúdo adaptado à tua indústria, clientes e desafios executivos específicos." },
  { icon: Users, title: "Gestão de Equipas", desc: "Alocação flexível de lugares, onboarding simplificado e gestão de licenças." },
  { icon: Shield, title: "Segurança Enterprise", desc: "SSO, conformidade RGPD e infraestrutura segura para dados corporativos." },
  { icon: TrendingUp, title: "Relatórios de ROI", desc: "Relatórios mensais detalhados que demonstram o retorno do investimento em comunicação." },
  { icon: Globe, title: "Suporte Global", desc: "Account manager dedicado, suporte em português e inglês, totalmente remoto." },
];

const benefits = [
  "Formação de comunicação executiva para toda a equipa",
  "Dashboard centralizado com progresso individual",
  "Account manager dedicado para clientes enterprise",
  "Currículo personalizado para a tua indústria",
  "Relatórios mensais detalhados de performance",
  "Gestão flexível de equipas e alocação de lugares",
];

export default function ForCompaniesPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0A0A0F", color: "#F5F5F5" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <span
            className="inline-block text-[11px] font-semibold uppercase tracking-[3px] mb-6"
            style={{ color: "#D4A853" }}
          >
            Para Empresas
          </span>
          <h1 className="font-serif text-[clamp(32px,5vw,52px)] font-bold leading-[1.15] mb-6">
            Desenhado para Empresas que Exigem{" "}
            <span className="italic" style={{ color: "#D4A853" }}>Performance</span>
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "#9A9AB0" }}>
            Implementa formação de comunicação executiva em toda a equipa. Acompanha resultados. Mede o ROI. Dá à tua liderança a vantagem competitiva em cada interação internacional.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="h-12 px-8 font-semibold rounded-md text-base"
              style={{ background: "#D4A853", color: "#000" }}
              asChild
            >
              <Link to="/contact">
                Agendar Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-12 px-8 rounded-md text-base"
              style={{ borderColor: "#D4A853", color: "#D4A853" }}
              asChild
            >
              <Link to="/packs">Ver Packs</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="h-px max-w-5xl mx-auto" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.2), transparent)" }} />

      {/* Benefits grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[3px]" style={{ color: "#D4A853" }}>
            Funcionalidades
          </span>
          <h2 className="font-serif text-3xl font-bold mt-3">
            Tudo o que Precisas para Escalar
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl p-6 transition-all duration-200"
              style={{ background: "#12121A", border: "1px solid rgba(255,255,255,0.05)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,168,83,0.3)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)")}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: "rgba(212,168,83,0.1)" }}
              >
                <f.icon className="h-5 w-5" style={{ color: "#D4A853" }} />
              </div>
              <h3 className="text-base font-semibold mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#9A9AB0" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px max-w-5xl mx-auto" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.2), transparent)" }} />

      {/* Why VOICE³ */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl font-bold mb-8 text-center">
            Porquê o VOICE³ para a Tua Empresa?
          </h2>
          <div className="space-y-4">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 py-3"
              >
                <Check className="h-5 w-5 shrink-0" style={{ color: "#D4A853" }} />
                <span className="text-base" style={{ color: "#CCCCDD" }}>{b}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: "linear-gradient(180deg, #0A0A0F, rgba(212,168,83,0.04))" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl font-bold mb-3">
            Pronto para Transformar a Tua Equipa?
          </h2>
          <p className="font-serif italic text-lg mb-8" style={{ color: "#D4A853" }}>
            Agenda uma chamada de 15 minutos.
          </p>
          <Button
            className="h-12 px-8 font-semibold rounded-md text-base"
            style={{ background: "#D4A853", color: "#000" }}
            asChild
          >
            <Link to="/contact">
              Contactar Equipa Comercial <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
