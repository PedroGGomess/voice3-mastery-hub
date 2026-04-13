import { useState } from "react";
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
    tagline: "Start your executive journey",
    promise: "You will lead meetings with more structure and confidence",
    features: [
      "All 10 chapters and AI tools",
      "Personalized learning path",
      "1 live coaching session",
      "Progress tracking and certificate",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    slug: "pro",
    price: 349,
    sessionsIncluded: 3,
    badge: "Most Popular",
    tagline: "For high-level performance",
    promise: "You will negotiate, present, and lead with authority in English",
    features: [
      "All 10 chapters and AI tools",
      "Personalized learning path",
      "3 live coaching sessions",
      "Progress tracking and certificate",
      "Priority booking",
    ],
  },
  {
    id: "advanced",
    name: "Advanced",
    slug: "advanced",
    price: 499,
    sessionsIncluded: 5,
    badge: null,
    tagline: "For senior leaders",
    promise: "You will lead global teams and close deals in English",
    features: [
      "All 10 chapters and AI tools",
      "Personalized learning path",
      "5 live coaching sessions",
      "Progress tracking and certificate",
      "Priority booking",
      "Session recordings",
    ],
  },
  {
    id: "business-master",
    name: "Business Master",
    slug: "business-master",
    price: "Custom",
    sessionsIncluded: 10,
    badge: null,
    tagline: "C-suite & teams",
    promise: "You will master any room, any boardroom, in any country",
    business: true,
    features: [
      "All 10 chapters and AI tools",
      "Personalized learning path",
      "10+ live coaching sessions",
      "Progress tracking and certificate",
      "Priority booking",
      "Session recordings",
      "Team dashboard and custom scenarios",
    ],
  },
];

const comparison = [
  { label: "All Chapters and AI Tools", values: [true, true, true, true] },
  { label: "Personalized Learning Path", values: [true, true, true, true] },
  { label: "Coach Sessions", values: ["1×", "3×", "5×", "10+"] },
  { label: "Progress Tracking", values: [true, true, true, true] },
  { label: "Priority Booking", values: [false, true, true, true] },
  { label: "Session Recordings", values: [false, false, true, true] },
  { label: "Team Dashboard", values: [false, false, false, true] },
  { label: "Custom Scenarios", values: [false, false, false, true] },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const } }),
};

function CellValue({ v, colIdx }: { v: boolean | string; colIdx: number }) {
  if (v === true)
    return (
      <span style={{ color: "var(--gold)", fontWeight: 700 }}>✓</span>
    );
  if (v === false)
    return (
      <span style={{ color: "var(--text-muted)" }}>—</span>
    );
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded"
      style={
        colIdx === 1
          ? { color: "var(--text-gold)", background: "var(--gold-10)" }
          : { color: "var(--text-primary)" }
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
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <p
            className="text-xs tracking-[0.2em] uppercase mb-4 font-semibold"
            style={{ color: "var(--gold)" }}
          >
            Investimento
          </p>
          <h1
            className="font-serif text-[clamp(36px,5vw,52px)] font-bold leading-tight mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Escolhe o Teu Nível
          </h1>
          <div
            className="w-[60px] h-[2px] mx-auto mb-5"
            style={{ background: "var(--gold)" }}
          />
          <p
            className="text-[18px] max-w-lg mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            All packs include live coaching sessions, AI coaching and mastery certificate.
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
                  background: "var(--bg-elevated)",
                  border: isPro
                    ? "2px solid var(--border-gold-strong)"
                    : "1px solid var(--border)",
                }}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ borderColor: "var(--gold-15)" }}
              >
                {/* Badge */}
                {pack.badge && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap tracking-wider"
                    style={{
                      background: "linear-gradient(135deg, var(--gold), var(--gold-light))",
                      color: "var(--bg-base)",
                    }}
                  >
                    <Sparkles className="h-3 w-3" /> {pack.badge.toUpperCase()}
                  </div>
                )}

                <div className={pack.badge ? "pt-4" : ""}>
                  <h3
                    className="font-serif text-xl font-semibold mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {pack.name}
                  </h3>
                  <p
                    className="text-[13px] italic mb-5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {pack.tagline}
                  </p>

                  {/* Price */}
                  <div className="flex items-end gap-1 mb-4">
                    {typeof pack.price === "string" ? (
                      <span
                        className="text-2xl font-serif italic"
                        style={{ color: "var(--text-gold)" }}
                      >
                        {pack.price}
                      </span>
                    ) : (
                      <>
                        <span
                          className="font-serif font-bold leading-none"
                          style={{ fontSize: 56, color: "var(--text-gold)" }}
                        >
                          €{pack.price}
                        </span>
                        <span
                          className="text-sm mb-3"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          /pack
                        </span>
                      </>
                    )}
                  </div>

                  {/* Promise */}
                  <p
                    className="text-sm italic mb-4"
                    style={{ color: "var(--text-gold)" }}
                  >
                    "{pack.promise}"
                  </p>

                  <div
                    className="w-full h-px mb-4"
                    style={{ background: "var(--gold-10)" }}
                  />

                  {/* Sessions pill */}
                  <div className="mb-5">
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: "var(--gold-10)",
                        border: "1px solid var(--gold-15)",
                        color: "var(--text-gold)",
                      }}
                    >
                      Inclui {isBusiness ? "10+" : pack.sessionsIncluded} × Sessão de 45 min com Professor
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {pack.features.map((f) => (
                      <li
                        key={f}
                        className="text-sm flex items-start gap-2.5"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <Check
                          className="h-4 w-4 mt-0.5 shrink-0"
                          style={{ color: "var(--gold)" }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {isBusiness ? (
                    <Button
                      onClick={() => setModalOpen(true)}
                      className="w-full h-12 rounded-xl font-semibold hover:-translate-y-0.5 transition-all duration-300"
                      style={{
                        background: "var(--gold)",
                        color: "var(--bg-base)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "var(--gold-light)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px var(--gold-20)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "var(--gold)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                      }}
                    >
                      Falar com Comercial <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-xl font-medium hover:-translate-y-0.5 transition-all duration-300"
                      style={{
                        borderColor: "var(--gold-20)",
                        color: "var(--text-gold)",
                        background: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--gold-40)";
                        (e.currentTarget as HTMLElement).style.background = "var(--gold-5)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--gold-20)";
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                      asChild
                    >
                      <Link to={`/auth?mode=register&pack=${pack.slug}`}>
                        Escolher {pack.name} <ArrowRight className="ml-1.5 h-4 w-4" />
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
          className="text-center font-serif text-3xl font-bold mb-10"
          style={{ color: "var(--text-primary)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Comparar Todos os Planos
        </motion.h2>

        <motion.div
          className="overflow-x-auto rounded-2xl"
          style={{ border: "1px solid var(--gold-10)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--gold-5)" }}>
                <th
                  className="text-left py-4 px-5 font-bold tracking-wide"
                  style={{ color: "var(--text-gold)" }}
                >
                  Funcionalidade
                </th>
                {packs.map((p) => (
                  <th
                    key={p.id}
                    className="py-4 px-4 text-center font-bold"
                    style={{ color: "var(--text-gold)" }}
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, ri) => (
                <tr
                  key={row.label}
                  style={{
                    background: ri % 2 === 0 ? "var(--bg-elevated)" : "var(--bg-base)"
                  }}
                >
                  <td
                    className="py-3.5 px-5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {row.label}
                  </td>
                  {row.values.map((v, ci) => (
                    <td
                      key={ci}
                      className="py-3.5 px-4 text-center"
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
            background: "var(--gold-5)",
            border: "1px solid var(--gold-15)",
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3
            className="font-serif text-2xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Não tens a certeza de qual é o plano ideal?
          </h3>
          <p
            className="mb-7"
            style={{ color: "var(--text-secondary)" }}
          >
            Agenda uma chamada de diagnóstico gratuita de 15 minutos.
          </p>
          <Button
            onClick={() => setModalOpen(true)}
            variant="outline"
            className="h-12 px-8 font-bold rounded-xl"
            style={{
              borderColor: "var(--gold-30)",
              color: "var(--text-gold)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)";
              (e.currentTarget as HTMLElement).style.background = "var(--gold-5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--gold-30)";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
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
