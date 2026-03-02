import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Building2, Users, BarChart3, CreditCard, ArrowRight } from "lucide-react";

const features = [
  { icon: Building2, title: "Regista a tua empresa", desc: "Configuração rápida e simples." },
  { icon: Users, title: "Adiciona alunos", desc: "Nome e email. Cada um recebe acesso." },
  { icon: CreditCard, title: "Escolhe e paga", desc: "Atribui packs de forma centralizada." },
  { icon: BarChart3, title: "Acompanha progresso", desc: "Dashboard com métricas de cada aluno." },
];

const ForCompanies = () => {
  return (
    <section className="py-24 bg-background" id="empresas">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Building2 className="h-4 w-4" /> Para Empresas
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Investe no Inglês da tua equipa
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Gere packs, alunos e acompanha o progresso de toda a equipa num único dashboard.
            </p>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 px-8">
              Saber Mais
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForCompanies;
