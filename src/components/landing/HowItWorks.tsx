import { motion } from "framer-motion";
import { UserPlus, Package, Brain, GraduationCap, TrendingUp } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Regista-te", desc: "Cria a tua conta em segundos." },
  { icon: Package, title: "Escolhe o teu Pack", desc: "4, 10, 15 ou Business Master." },
  { icon: Brain, title: "Treina com AI", desc: "Sessões práticas com feedback imediato." },
  { icon: GraduationCap, title: "Aulas com Professora", desc: "Valida o teu progresso com aulas reais." },
  { icon: TrendingUp, title: "Resultados", desc: "Comunica com confiança no trabalho." },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-background" id="como-funciona">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Como funciona</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Um percurso claro, estruturado e focado em resultados reais.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="premium-card text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-xs font-medium text-muted-foreground mb-2">Passo {i + 1}</div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
