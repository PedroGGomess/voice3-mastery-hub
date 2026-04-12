import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/ChatWidget";
import BusinessMasterModal from "@/components/landing/BusinessMasterModal";

type Pack = {
  id: string;
  name: string;
  slug: string | null;
  price: number | string;
  sessionsIncluded: number;
  badge: string | null;
  tagline: string;
  promise: string;
  features: string[];
  business?: boolean;
};

const staticPacks: Pack[] = [
  {
    id: "starter",
    name: "Starter",
    slug: "starter",
    price: 149,
    sessionsIncluded: 1,
    badge: null,
    tagline: "Para começar a tua jornada executiva",
    promise: "Vais comandar reuniões com mais estrutura e confiança",
    features: [
      "Todos os 10 capítulos e ferramentas AI",
      "Percurso de aprendizagem personalizado",
      "1 sessão ao vivo com professor",
      "Acompanhamento e certificado",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    slug: "pro",
    price: 349,
    sessionsIncluded: 3,
    badge: "Mais Popular",
    tagline: "Para performance de alto nível",
    promise: "Vais negociar, apresentar e liderar com autoridade em inglês",
    features: [
      "Todos os 10 capítulos e ferramentas AI",
      "Percurso de aprendizagem personalizado",
      "3 sessões ao vivo com professor",
      "Acompanhamento e certificado",
      "Reserva prioritária",
    ],
  },
  {
    id: "advanced",
    name: "Advanced",
    slug: "advanced",
    price: 499,
    sessionsIncluded: 5,
    badge: null,
    tagline: "Para líderes seniores",
    promise: "Vais liderar equipas globais e fechar negócios em inglês",
    features: [
      "Todos os 10 capítulos e ferramentas AI",
      "Percurso de aprendizagem personalizado",
      "5 sessões ao vivo com professor",
      "Acompanhamento e certificado",
      "Reserva prioritária",
      "Gravações das sessões",
    ],
  },
  {
    id: "business-master",
    name: "Business Master",
    slug: "business-master",
    price: "Sob Consulta",
    sessionsIncluded: 10,
    badge: null,
    tagline: "C-suite & equipas",
    promise: "Vais dominar qualquer sala, qualquer boardroom, em qualquer país",
    business: true,
    features: [
      "Todos os 10 capítulos e ferramentas AI",
      "Percurso de aprendizagem personalizado",
      "10+ sessões ao vivo com professor",
      "Acompanhamento e certificado",
      "Reserva prioritária",
      "Gravações das sessões",
      "Dashboard de equipa e cenários personalizados",
    ],
  },
];

const comparison = [
  { label: "Todos os Capítulos e Ferramentas AI", values: [true, true, true, true] },
  { label: "Percurso Personalizado", values: [true, true, true, true] },
  { label: "Sessões com Professor", values: ["1×", "3×", "5×", "10+"] },
  { label: "Acompanhamento de Progresso", values: [true, true, true, true] },
  { label: "Reserva Prioritária", values: [false, true, true, true] },
  { label: "Gravações das Sessões", values: [false, false, true, true] },
  { label: "Dashboard de Equipa", values: [false, false, false, true] },
  { label: "Cenários Personalizados", values: [false, false, false, true] },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const } }),
};

function CellValue({ v, colIdx }: { v: boolean | string; colIdx: number }) {
  if (v === true)
    return <span style={{ color: "#52C41A", fontWeight: 700 }}>✓</span>;
  if (v === false)
    return <span style={{ color: "#8E96A3" }}>—</span>;
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded"
      style={
        colIdx === 1
          ? { color: "#C9A84C", background: "rgba(201,168,76,0.1)" }
          : { color: "#F4F2ED" }
      }
    >
      {v}
    </span>
  );
}

export default function PacksPage() {
  const [packs] = useState<Pack[]>(staticPacks);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B1A2A]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <p className="text-xs tracking-[0.2em] text-[#C9A84C] uppercase mb-4 font-semibold">Investimento</p>
          <h1 className="font-serif text-[clamp(36px,5vw,52px)] font-bold text-[#F4F2ED] leading-tight mb-4">
            Escolhe o Teu Nível
          </h1>
          <div className="w-[60px] h-[2px] bg-[#C9A84C] mx-auto mb-5" />
          <p className="text-[18px] text-[#8E96A3] max-w-lg mx-auto leading-relaxed">
            Todos os packs incluem sessões ao vivo com professor, coaching AI e certificado de domínio.
          </p>
        </motion.div>
      </section>

      {/* ── Pack Cards ── */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          {packs.map((pack, i) => {
            const isPro = pack.slug === "pro";
            const isBusiness = pack.slug === "business-master";
            return (
              <motion.div
                key={pack.id}
                className="relative rounded-2xl p-7 flex flex-col"
                style={{
                  background: isPro ? "linear-gradient(180deg, rgba(201,168,76,0.04), #11263A)" : "#11263A",
                  border: isPro
                    ? "2px solid rgba(201,168,76,0.5)"
                    : "1px solid rgba(255,255,255,0.06)",
                  transform: isPro ? "scale(1.04)" : undefined,
                  boxShadow: isPro ? "0 0 40px rgba(201,168,76,0.12)" : undefined,
                }}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={!isPro ? { borderColor: "rgba(201,168,76,0.3)" } : undefined}
              >
                {/* Badge */}
                {pack.badge && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap tracking-wider"
                    style={{
                      background: "linear-gradient(135deg, #C9A84C, #E8C87A)",
                      color: "#0B1A2A",
                    }}
                  >
                    <Sparkles className="h-3 w-3" /> {pack.badge.toUpperCase()}
                  </div>
                )}

                <div className={pack.badge ? "pt-4" : ""}>
                  <h3 className="font-serif text-xl font-semibold text-[#F4F2ED] mb-1">{pack.name}</h3>
                  <p className="text-[13px] italic text-[#8E96A3] mb-5">{pack.tagline}</p>

                  {/* Price */}
                  <div className="flex items-end gap-1 mb-4">
                    {typeof pack.price === "string" ? (
                      <span className="text-2xl font-serif italic text-[#C9A84C]">{pack.price}</span>
                    ) : (
                      <>
                        <span className="font-serif font-bold leading-none" style={{ fontSize: 56, color: "#C9A84C" }}>
                          €{pack.price}
                        </span>
                        <span className="text-[#8E96A3] text-sm mb-3">/pack</span>
                      </>
                    )}
                  </div>

                  {/* Promise */}
                  <p className="text-sm italic mb-4" style={{ color: "#C9A84C" }}>
                    "{pack.promise}"
                  </p>

                  <div className="w-full h-px bg-[#C9A84C]/10 mb-4" />

                  {/* Sessions pill */}
                  <div className="mb-5">
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: "rgba(201,168,76,0.1)",
                        border: "1px solid rgba(201,168,76,0.2)",
                        color: "#C9A84C",
                      }}
                    >
                      Inclui {isBusiness ? "10+" : pack.sessionsIncluded} × Sessão de 45 min com Professor
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {pack.features.map((f) => (
                      <li key={f} className="text-sm text-[#8E96A3] flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#C9A84C] mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {isBusiness ? (
                    <Button
                      onClick={() => setModalOpen(true)}
                      className="w-full h-12 rounded-xl font-semibold bg-[#C9A84C] text-[#0B1A2A] hover:bg-[#d4b56a] hover:shadow-[0_0_24px_rgba(201,168,76,0.3)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Falar com Comercial <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  ) : isPro ? (
                    <Button
                      className="w-full h-12 rounded-xl font-semibold bg-[#C9A84C] text-[#0B1A2A] hover:bg-[#d4b56a] hover:shadow-[0_0_32px_rgba(201,168,76,0.3)] hover:-translate-y-0.5 transition-all duration-300"
                      asChild
                    >
                      <Link to={`/auth?mode=register&pack=${pack.slug}`}>
                        Escolher Pro <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-xl font-medium border border-[#C9A84C]/30 text-[#C9A84C] bg-transparent hover:border-[#C9A84C]/60 hover:bg-[#C9A84C]/5 hover:-translate-y-0.5 transition-all duration-300"
                      asChild
                    >
                      <Link to={`/auth?mode=register&pack=${pack.slug}`}>
                        {pack.slug === "starter" ? "Começar Agora" : "Escolher " + pack.name} <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <motion.h2
          className="text-center font-serif text-3xl font-bold text-[#F4F2ED] mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Comparar Todos os Planos
        </motion.h2>

        <motion.div
          className="overflow-x-auto rounded-2xl border border-[#C9A84C]/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "rgba(201,168,76,0.06)" }}>
                <th className="text-left py-4 px-5 text-[#C9A84C] font-bold tracking-wide">Funcionalidade</th>
                {packs.map((p) => (
                  <th key={p.id} className="py-4 px-4 text-center text-[#C9A84C] font-bold">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, ri) => (
                <tr
                  key={row.label}
                  style={{ background: ri % 2 === 0 ? "#11263A" : "#0B1A2A" }}
                >
                  <td className="py-3.5 px-5 text-[#8E96A3]">{row.label}</td>
                  {row.values.map((v, ci) => (
                    <td
                      key={ci}
                      className="py-3.5 px-4 text-center"
                      style={ci === 1 ? { background: "rgba(201,168,76,0.03)" } : undefined}
                    >
                      <CellValue v={v} colIdx={ci} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* ── Not sure card ── */}
      <section className="px-6 pb-32 max-w-2xl mx-auto">
        <motion.div
          className="text-center rounded-2xl p-10"
          style={{
            background: "rgba(201,168,76,0.04)",
            border: "1px solid rgba(201,168,76,0.12)",
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-serif text-2xl font-bold text-[#F4F2ED] mb-3">
            Não tens a certeza de qual é o plano ideal?
          </h3>
          <p className="text-[#8E96A3] mb-7">Agenda uma chamada de diagnóstico gratuita de 15 minutos.</p>
          <Button
            onClick={() => setModalOpen(true)}
            variant="outline"
            className="h-12 px-8 font-bold text-[#C9A84C] rounded-xl"
            style={{ borderColor: "rgba(201,168,76,0.5)" }}
          >
            Agendar Chamada <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </section>

      <Footer />
      <ChatWidget />
      <BusinessMasterModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
