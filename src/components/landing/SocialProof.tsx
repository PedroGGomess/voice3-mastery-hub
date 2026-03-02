import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ana Rodrigues",
    role: "Product Manager, Farfetch",
    text: "As sessões com AI mudaram completamente a minha confiança em reuniões internacionais. Em 2 semanas já notei diferença.",
  },
  {
    name: "Miguel Santos",
    role: "Sales Director, Siemens",
    text: "O feedback imediato é impressionante. As aulas com professora complementam perfeitamente e validam o progresso.",
  },
  {
    name: "Sofia Ferreira",
    role: "HR Manager, Deloitte",
    text: "Implementámos o Voice3 para toda a equipa. O dashboard empresarial é excelente para acompanhar resultados.",
  },
];

const logos = ["Farfetch", "Deloitte", "Siemens", "Accenture", "EDP", "Sonae"];

const SocialProof = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O que dizem os nossos alunos</h2>
          <p className="text-muted-foreground text-lg">
            Profissionais que já transformaram o seu Inglês empresarial.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="premium-card"
            >
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              <p className="text-sm leading-relaxed mb-6">{t.text}</p>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 opacity-40">
          {logos.map((logo) => (
            <span key={logo} className="text-lg font-bold tracking-wider">{logo}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
