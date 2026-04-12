import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/ChatWidget";

const contactItems = [
  {
    icon: "✉️",
    label: "Email",
    value: "voice3.couch@gmail.com",
    href: "mailto:voice3.couch@gmail.com",
  },
  {
    icon: "📍",
    label: "Localização",
    value: "Lisboa, Portugal · Clientes globais",
    href: null,
  },
  {
    icon: "⏰",
    label: "Tempo de Resposta",
    value: "Até 24h · Seg–Sex 9:00–18:00 WET",
    href: null,
  },
  {
    icon: "💬",
    label: "Chat",
    value: "Disponível via widget",
    href: null,
  },
];

const faqs = [
  {
    q: "Existe um período de teste gratuito?",
    a: "Sim — cada novo membro começa com a Sessão de Diagnóstico AI completamente gratuita.",
  },
  {
    q: "Posso pagar em prestações?",
    a: "Sim. Oferecemos planos de pagamento flexíveis. Contacte-nos para mais detalhes.",
  },
  {
    q: "Quando posso começar?",
    a: "Imediatamente após o registo. A sessão de diagnóstico está disponível 24/7.",
  },
];

const subjectOptions = [
  "Informação Geral",
  "Soluções Empresariais",
  "Imprensa & Media",
  "Parcerias",
  "Suporte Técnico",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" as const },
  }),
};

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await new Promise((res) => setTimeout(res, 1500));
      setSubmitted(true);
    } catch {
      setError("Algo correu mal. Envie-nos um email directamente para voice3.couch@gmail.com.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0F" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "#D4A853" }}>
            Contacto
          </p>
          <h1
            className="font-serif font-bold leading-tight mb-5"
            style={{ fontSize: "clamp(32px, 5vw, 48px)", color: "#F5F5F5" }}
          >
            Vamos Conversar.
          </h1>
          <div className="w-[60px] h-[2px] mx-auto mb-5" style={{ background: "#D4A853" }} />
          <p className="text-[17px] max-w-lg mx-auto leading-relaxed" style={{ color: "#9A9AB0" }}>
            Questões, soluções empresariais ou parcerias — respondemos em 24 horas.
          </p>
        </motion.div>
      </section>

      {/* ── Main content ── */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Left: Contact Info */}
          <motion.div
            className="md:col-span-2 flex flex-col gap-6"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {contactItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-xl flex-shrink-0"
                  style={{ background: "rgba(212,168,83,0.1)" }}
                >
                  {item.icon}
                </div>
                <div>
                  <p
                    className="text-[11px] uppercase tracking-wider mb-0.5"
                    style={{ color: "#9A9AB0" }}
                  >
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm transition-colors hover:text-[#D4A853]"
                      style={{ color: "#F5F5F5" }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm" style={{ color: "#F5F5F5" }}>{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Divider */}
            <div className="w-full h-px my-2" style={{ background: "rgba(212,168,83,0.15)" }} />

            <Link to="/auth">
              <Button
                variant="outline"
                className="font-bold rounded-xl"
                style={{ borderColor: "rgba(212,168,83,0.5)", color: "#D4A853" }}
              >
                Diagnóstico Gratuito <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div
              className="rounded-[20px]"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                padding: "40px 36px",
              }}
            >
              {submitted ? (
                <div
                  className="rounded-2xl p-12 text-center"
                  style={{
                    background: "rgba(52,211,153,0.05)",
                    border: "1px solid rgba(52,211,153,0.3)",
                  }}
                >
                  <div className="text-5xl mb-4">✓</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#F5F5F5" }}>
                    Mensagem enviada. Respondemos em 24h.
                  </h3>
                  <p className="text-sm mb-4" style={{ color: "#9A9AB0" }}>
                    Também pode contactar-nos directamente em{" "}
                    <a
                      href="mailto:voice3.couch@gmail.com"
                      className="hover:underline"
                      style={{ color: "#D4A853" }}
                    >
                      voice3.couch@gmail.com
                    </a>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: "#9A9AB0" }}>
                        Nome Completo
                      </label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg text-sm focus:outline-none transition-colors"
                        style={{ background: "#0A0A0F", border: "1px solid rgba(255,255,255,0.08)", color: "#F5F5F5" }}
                        placeholder="O seu nome"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: "#9A9AB0" }}>
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg text-sm focus:outline-none transition-colors"
                        style={{ background: "#0A0A0F", border: "1px solid rgba(255,255,255,0.08)", color: "#F5F5F5" }}
                        placeholder="email@empresa.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: "#9A9AB0" }}>
                      Empresa{" "}
                      <span className="normal-case text-[10px]" style={{ color: "rgba(154,154,176,0.6)" }}>(opcional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full h-11 px-4 rounded-lg text-sm focus:outline-none transition-colors"
                      style={{ background: "#0A0A0F", border: "1px solid rgba(255,255,255,0.08)", color: "#F5F5F5" }}
                      placeholder="Nome da empresa"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: "#9A9AB0" }}>
                      Assunto
                    </label>
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full h-11 px-4 rounded-lg text-sm focus:outline-none transition-colors"
                      style={{ background: "#0A0A0F", border: "1px solid rgba(255,255,255,0.08)", color: "#F5F5F5" }}
                    >
                      <option value="" disabled>Selecione um assunto</option>
                      {subjectOptions.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: "#9A9AB0" }}>
                      Mensagem
                    </label>
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ minHeight: 140, background: "#0A0A0F", border: "1px solid rgba(255,255,255,0.08)", color: "#F5F5F5" }}
                      className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none transition-colors resize-none"
                      placeholder="Como podemos ajudar?"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-400">
                      {error}{" "}
                      <a href="mailto:voice3.couch@gmail.com" className="underline">
                        voice3.couch@gmail.com
                      </a>
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-[52px] text-base font-bold rounded-xl"
                    style={{ background: "linear-gradient(135deg, #D4A853, #E8C97A)", color: "#0A0A0F" }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="inline-block w-4 h-4 border-2 border-[#0A0A0F]/40 border-t-[#0A0A0F] rounded-full animate-spin" />
                        A enviar...
                      </span>
                    ) : (
                      <>
                        Enviar Mensagem <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 pb-32 max-w-2xl mx-auto">
        <motion.h2
          className="text-center font-serif text-2xl font-bold mb-8"
          style={{ color: "#F5F5F5" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Perguntas Frequentes
        </motion.h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <motion.div
                key={faq.q}
                className="rounded-xl border overflow-hidden transition-colors duration-200"
                style={{
                  background: "#12121A",
                  borderColor: isOpen ? "rgba(212,168,83,0.3)" : "rgba(255,255,255,0.08)",
                }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ color: isOpen ? "#D4A853" : "#F5F5F5" }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                    style={{
                      color: "#9A9AB0",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4">
                    <p className="text-sm leading-relaxed" style={{ color: "#9A9AB0" }}>{faq.a}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
