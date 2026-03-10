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
    value: "hello@voice3.pt",
    href: "mailto:hello@voice3.pt",
  },
  {
    icon: "📍",
    label: "Location",
    value: "Lisboa, Portugal · Serving clients globally",
    href: null,
  },
  {
    icon: "⏰",
    label: "Response Time",
    value: "Within 24h · Mon–Fri 9:00–18:00 WET",
    href: null,
  },
  {
    icon: "💬",
    label: "Live Chat",
    value: "Available via widget",
    href: null,
  },
];

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes — every new member begins with the AI Diagnostic Session completely free.",
  },
  {
    q: "Can I pay in instalments?",
    a: "Yes. We offer flexible payment plans. Contact us for details.",
  },
  {
    q: "How quickly can I start?",
    a: "Immediately after registration. Your diagnostic session is available 24/7.",
  },
];

const subjectOptions = [
  "General Enquiry",
  "Enterprise Solutions",
  "Press & Media",
  "Partnership",
  "Technical Support",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
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
      setError("Something went wrong. Please email us directly at hello@voice3.pt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1A2A]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <p className="text-xs tracking-[0.2em] text-[#C9A84C] uppercase mb-4">Get In Touch</p>
          <h1 className="font-serif text-[clamp(32px,5vw,48px)] font-bold text-[#F4F2ED] leading-tight mb-5">
            Let's Talk.
          </h1>
          <div className="w-[60px] h-[2px] bg-[#C9A84C] mx-auto mb-5" />
          <p className="text-[17px] text-[#8E96A3] max-w-lg mx-auto leading-relaxed">
            Questions, enterprise solutions, or press enquiries — we respond within 24 hours.
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
                  style={{ background: "rgba(201,168,76,0.1)" }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-[11px] text-[#8E96A3] uppercase tracking-wider mb-0.5">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-[#F4F2ED] hover:text-[#C9A84C] transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-[#F4F2ED]">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Divider */}
            <div className="w-full h-px bg-[#B89A5A]/15 my-2" />

            <Link to="/auth">
              <Button
                variant="outline"
                className="font-bold text-[#C9A84C] rounded-xl"
                style={{ borderColor: "rgba(201,168,76,0.5)" }}
              >
                Start Free Diagnostic <ArrowRight className="ml-2 w-4 h-4" />
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
                  <h3 className="text-xl font-bold text-[#F4F2ED] mb-2">
                    Message sent. We reply in 24h.
                  </h3>
                  <p className="text-[#8E96A3] text-sm mb-4">
                    You can also email us directly at{" "}
                    <a
                      href="mailto:hello@voice3.pt"
                      className="text-[#C9A84C] hover:underline"
                    >
                      hello@voice3.pt
                    </a>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#8E96A3] uppercase tracking-wide mb-1.5">
                        Full Name
                      </label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg bg-[#0B1A2A] border border-[rgba(255,255,255,0.08)] text-[#F4F2ED] text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8E96A3] uppercase tracking-wide mb-1.5">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg bg-[#0B1A2A] border border-[rgba(255,255,255,0.08)] text-[#F4F2ED] text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#8E96A3] uppercase tracking-wide mb-1.5">
                      Company{" "}
                      <span className="normal-case text-[10px] text-[#8E96A3]/60">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full h-11 px-4 rounded-lg bg-[#0B1A2A] border border-[rgba(255,255,255,0.08)] text-[#F4F2ED] text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#8E96A3] uppercase tracking-wide mb-1.5">
                      Subject
                    </label>
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full h-11 px-4 rounded-lg bg-[#0B1A2A] border border-[rgba(255,255,255,0.08)] text-[#F4F2ED] text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                    >
                      <option value="" disabled>Select a subject</option>
                      {subjectOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#8E96A3] uppercase tracking-wide mb-1.5">
                      Message
                    </label>
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ minHeight: 140 }}
                      className="w-full px-4 py-3 rounded-lg bg-[#0B1A2A] border border-[rgba(255,255,255,0.08)] text-[#F4F2ED] text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-400">
                      {error}{" "}
                      <a href="mailto:hello@voice3.pt" className="underline">
                        hello@voice3.pt
                      </a>
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-[52px] text-base font-bold rounded-xl"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #E8C87A)", color: "#060f1d" }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span
                          className="inline-block w-4 h-4 border-2 border-[#060f1d]/40 border-t-[#060f1d] rounded-full animate-spin"
                        />
                        Sending...
                      </span>
                    ) : (
                      <>
                        Send Message <ArrowRight className="ml-2 w-5 h-5" />
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
          className="text-center font-serif text-2xl font-bold text-[#F4F2ED] mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Quick Answers
        </motion.h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <motion.div
                key={faq.q}
                className="rounded-xl border overflow-hidden transition-colors duration-200"
                style={{
                  background: "#1C1F26",
                  borderColor: isOpen ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.08)",
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
                    style={{ color: isOpen ? "#C9A84C" : "#F4F2ED" }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                    style={{
                      color: "#8E96A3",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-[#8E96A3] leading-relaxed">{faq.a}</p>
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
