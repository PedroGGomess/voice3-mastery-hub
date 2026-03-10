import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "What is VOICE³?",
    a: "VOICE³ is a premium executive English communication training programme. It is designed for professionals who need to perform — not just communicate — in high-stakes business environments.",
  },
  {
    q: "How long does each session take?",
    a: "Each AI session takes approximately 25–30 minutes, structured for busy executive schedules.",
  },
  {
    q: "Can I access the platform on mobile?",
    a: "Yes, the platform is fully responsive and optimised for mobile, tablet, and desktop.",
  },
  {
    q: "What language is the training in?",
    a: "Sessions are conducted in English. Portuguese support materials are available throughout the programme.",
  },
  {
    q: "How do Live Professor Sessions work?",
    a: "Live Professor Sessions are 45-minute 1-on-1 video calls with specialist professors, scheduled directly through the platform.",
  },
  {
    q: "Is there a certificate at the end?",
    a: "Yes. Upon completion, you receive the VOICE³ Executive Communication Certificate, shareable on LinkedIn and professional profiles.",
  },
  {
    q: "Can companies register multiple employees?",
    a: "Yes. The Business Master plan includes full team management, centralised billing, and a company dashboard.",
  },
  {
    q: "What happens if I fail a session quiz?",
    a: "You can retry any session quiz an unlimited number of times. There is no penalty — mastery is the goal.",
  },
  {
    q: "Is there support available?",
    a: "All plans include priority email support. Business Master plans include a dedicated account manager.",
  },
  {
    q: "How is VOICE³ different from other English courses?",
    a: "VOICE³ is not a language course. It is an executive performance programme. The focus is on strategic communication, authority, and impact — not grammar exercises.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-28" style={{ backgroundColor: "#0B1A2A" }} id="faq">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 fade-up"
        >
          <p className="text-[#C9A84C] tracking-[0.2em] uppercase text-sm mb-4 font-medium">FAQ</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#F4F2ED]">Frequently Asked Questions</h2>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="fade-up"
                style={{
                  border: isOpen ? "1px solid rgba(201,168,76,0.22)" : "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12,
                  background: isOpen ? "rgba(201,168,76,0.03)" : "rgba(255,255,255,0.02)",
                  overflow: "hidden",
                  transition: "border-color 0.25s, background 0.25s",
                  marginBottom: 0,
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: 15,
                    fontWeight: 500,
                    color: isOpen ? "#C9A84C" : "rgba(255,255,255,0.85)",
                    background: "none",
                    border: "none",
                    textAlign: "left" as const,
                    transition: "color 0.25s",
                  }}
                >
                  <span>{faq.q}</span>
                  <Plus
                    className="h-5 w-5 shrink-0 ml-4 text-[#C9A84C]"
                    style={{ transition: "transform 0.3s", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                  />
                </button>
                <div style={{
                  maxHeight: isOpen ? 300 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}>
                  <p style={{ padding: "0 24px 20px", color: "rgba(255,255,255,0.6)", lineHeight: 1.75 }}>{faq.a}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="h-px w-full mt-8" style={{ background: "linear-gradient(90deg, transparent, #C9A84C33, transparent)" }} />
    </section>
  );
};

export default FAQ;
