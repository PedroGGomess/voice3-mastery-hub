import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does the 7-Day Trial work?",
    a: "When you register, you enter your payment details to unlock the platform. For the first 7 days, you will not be charged. You receive full, unlimited access to all AI-driven features. If you decide the platform isn't for you, simply cancel before the 7 days are up with one click.",
  },
  {
    q: "Why do I need to provide a credit card for a free trial?",
    a: "VOICE³ uses advanced, highly responsive AI voice technology that requires significant computing power. Requiring a payment method ensures our servers remain dedicated to serious professionals.",
  },
  {
    q: "Does the 7-Day Trial include a session with a live human coach?",
    a: "No. The 7-Day Trial gives you unlimited access to the complete AI engine. Live 1-on-1 sessions with our elite human coaches are reserved exclusively for fully paid subscribers on the Hybrid tier.",
  },
  {
    q: "What happens if I cancel my trial or subscription?",
    a: "If you cancel, you will immediately lose access to your personalised data — your Error Bank, Vocabulary Vault, Voice DNA progress, and your custom-built curriculum. You will be downgraded to a free Maintenance Tier.",
  },
  {
    q: "What is the step-by-step experience once I subscribe?",
    a: "Your journey starts with the Precision Diagnostic to map your Voice DNA baseline. Next comes your Voice DNA profile revealing your current speaking patterns. You then enter your First Block of structured AI sessions. Daily Practice reinforces the material. Coach Calibration fine-tunes your tone with a specialist. Finally, you progress to the Next Block with advanced challenges.",
  },
  {
    q: "What are the different subscription packages available?",
    a: "We offer three tiers: The AI-Only tier gives you access to our complete AI engine with 7-day trial entry. The Hybrid tier is our most popular option, combining unlimited AI sessions with 4 live coaching sessions per month. The Business/Enterprise tier is fully customised for teams with dedicated account management and bespoke curriculum.",
  },
  {
    q: "I already speak English well. Why do I need this?",
    a: "The Speaking Gap exists because native fluency doesn't equal executive presence. You might speak English perfectly in casual conversation but sound uncertain in high-stakes situations. VOICE³ bridges the gap between linguistic ability and executive impact — building the psychological resilience, strategic vocabulary, and vocal authority that commands boardrooms.",
  },
  {
    q: "Is this just another language app like Duolingo or Babbel?",
    a: "No. VOICE³ is not a language app. It's an executive performance engine. While language apps teach vocabulary and grammar, VOICE³ focuses on executive communication dynamics: pressure resilience, tone calibration, real-time feedback, boardroom simulations, and persona development. It's designed for professionals who must perform, not students learning a language.",
  },
  {
    q: "How does the AI adapt to my specific needs?",
    a: "Your Voice DNA profile is your foundation. The AI maps your baseline — words per minute, filler frequency, vocabulary range, pitch patterns — then creates a personalised curriculum addressing your specific weak points. As you progress, the AI continuously learns from your sessions, adapting difficulty, content focus, and feedback intensity to match your trajectory.",
  },
  {
    q: "How do you ensure the exercises match my English level?",
    a: "We calibrate from Foundation to Mastery. Your diagnostic assessment determines your starting level. The AI then serves content at the right difficulty — challenging enough to drive improvement but not so difficult you lose confidence. The system automatically escalates as you master each block.",
  },
  {
    q: "Are there custom-made or highly personalised products available?",
    a: "Yes. Beyond our standard Hybrid and Business tiers, we offer fully custom bespoke modules tailored to your industry, company culture, and communication challenges. Enterprise programmes include team-wide assessments, competitive benchmarking, and a dedicated account manager. Contact our team for a custom consultation.",
  },
  {
    q: "How much time do I need to commit each week?",
    a: "Minimal but consistent. Most executives spend 10-15 minutes on daily micro-chapters—short, focused sessions that fit between meetings. The Prep Room simulations take 5 minutes to set up. If you choose live coaching on the Hybrid tier, sessions are 1 hour monthly, scheduled around your calendar.",
  },
  {
    q: "Who are the live coaches on the Hybrid and Business tiers?",
    a: "Our coaches are Elite Executive Communication Specialists — former C-suite executives, international diplomats, and professional speech coaches with 15+ years of experience training high-stakes communicators. Each brings real-world boardroom and negotiation experience.",
  },
  {
    q: "What happens during a live coaching session?",
    a: "Your coach reviews your Voice DNA analytics and Error Bank to identify patterns and opportunities. You then focus on a specific challenge — a presentation technique, tone shift, or high-pressure scenario — and get real-time feedback and refinement. Sessions are highly practical and immediately applicable to your upcoming challenges.",
  },
  {
    q: "Can I try VOICE³ for free?",
    a: "Yes. We offer a 7-Day Trial with full, unlimited access to our entire AI platform. No watermarks, no restrictions. Just register, enter your payment details, and you get 7 days free. Cancel anytime before day 7 with one click if it's not right for you.",
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
      style={{ backgroundColor: "var(--bg-base)" }}
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
            style={{ color: "var(--gold)" }}
          >
            FAQ
          </p>
          <h2
            className="font-serif text-4xl md:text-5xl font-semibold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Frequently Asked Questions
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Everything you need to know about VOICE³.
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
                    backgroundColor: isOpen ? "var(--gold-10)" : "rgba(255, 255, 255, 0.02)",
                    border: isOpen
                      ? "1px solid var(--border-gold)"
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
                        ? "var(--gold-15)"
                        : "transparent",
                      fontSize: 15,
                      fontWeight: 500,
                      textAlign: "left",
                    }}
                  >
                    <span
                      className="font-semibold transition-colors duration-300"
                      style={{
                        color: isOpen ? "var(--gold)" : "var(--text-primary)",
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
                          color: isOpen ? "var(--gold)" : "var(--text-secondary)",
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
                            borderColor: "var(--border-gold)",
                          }}
                        >
                          <p
                            className="text-sm md:text-base leading-relaxed"
                            style={{ color: "var(--text-secondary)" }}
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
            backgroundColor: "var(--gold-10)",
            border: "1px solid var(--border-gold)",
          }}
        >
          <p className="mb-4" style={{ color: "var(--text-primary)" }}>
            Can't find the answer you're looking for?
          </p>
          <a
            href="mailto:voice3.couch@gmail.com"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:brightness-110"
            style={{
              backgroundColor: "var(--gold)",
              color: "#000",
            }}
          >
            Contact Support
          </a>
        </motion.div>
      </div>

      {/* Section Divider */}
      <div
        className="h-px w-full mt-20"
        style={{
          background: "linear-gradient(90deg, transparent, var(--border-gold), transparent)",
        }}
      />
    </section>
  );
};

export default FAQ;
