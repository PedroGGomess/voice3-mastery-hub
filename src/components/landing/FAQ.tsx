import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  return (
    <section className="py-28" style={{ backgroundColor: "#0B1A2A" }} id="faq">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-4 font-medium">FAQ</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#F4F2ED]">Frequently Asked Questions</h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <AccordionItem
                value={`faq-${i}`}
                className="bg-[#11263A] border border-[#B89A5A]/10 rounded-xl px-6 hover:border-[#B89A5A]/30 transition-colors"
              >
                <AccordionTrigger className="text-left font-medium text-[#F4F2ED] hover:no-underline py-5 hover:text-[#B89A5A] transition-colors [&[data-state=open]]:text-[#B89A5A]">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#8E96A3] pb-5 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
      {/* Section divider */}
      <div className="h-px w-full mt-8" style={{ background: 'linear-gradient(90deg, transparent, #B89A5A33, transparent)' }} />
    </section>
  );
};

export default FAQ;
