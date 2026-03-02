import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Star } from "lucide-react";

const packs = [
  {
    name: "Starter",
    sessions: 4,
    lessons: 1,
    lessonDetail: "1 aula no fim do pack",
    results: "Base sólida para emails e comunicação escrita",
    features: ["4 sessões AI práticas", "Feedback imediato", "1 aula com professora", "Certificado de conclusão"],
    popular: false,
  },
  {
    name: "Pro",
    sessions: 10,
    lessons: 2,
    lessonDetail: "1 a meio + 1 no fim",
    results: "Confiança em reuniões e apresentações",
    features: ["10 sessões AI práticas", "Roleplay & áudio", "2 aulas com professora", "Relatório de progresso", "Certificado avançado"],
    popular: true,
  },
  {
    name: "Advanced",
    sessions: 15,
    lessons: 3,
    lessonDetail: "Distribuídas ao longo do percurso",
    results: "Domínio completo do Inglês empresarial",
    features: ["15 sessões AI práticas", "Todos os formatos", "3 aulas com professora", "Análise detalhada", "Suporte prioritário"],
    popular: false,
  },
  {
    name: "Business Master",
    sessions: null,
    lessons: null,
    lessonDetail: "Personalizado",
    results: "Plano à medida da tua empresa",
    features: ["Sessões personalizadas", "Plano à medida", "Call com comercial", "Acompanhamento dedicado", "Relatórios empresa"],
    popular: false,
    custom: true,
  },
];

const Packs = () => {
  return (
    <section className="py-24 bg-secondary/30" id="packs">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Packs</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Escolhe o pack que melhor se adapta aos teus objetivos. Todos incluem aulas com professora.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packs.map((pack, i) => (
            <motion.div
              key={pack.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`premium-card relative flex flex-col ${
                pack.popular ? "ring-2 ring-primary" : ""
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1">
                  <Star className="h-3 w-3" /> Mais popular
                </div>
              )}

              <h3 className="text-xl font-bold mb-1">{pack.name}</h3>
              
              <div className="mb-4">
                {pack.sessions ? (
                  <div className="text-3xl font-bold">
                    {pack.sessions} <span className="text-base font-normal text-muted-foreground">sessões</span>
                  </div>
                ) : (
                  <div className="text-3xl font-bold gradient-text">Personalizado</div>
                )}
                {pack.lessons && (
                  <p className="text-sm text-primary font-medium mt-1">
                    + {pack.lessons} aula{pack.lessons > 1 ? "s" : ""} com professora
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{pack.lessonDetail}</p>
              </div>

              <p className="text-sm text-muted-foreground mb-6 border-b border-border pb-4">
                {pack.results}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {pack.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full rounded-xl h-11 ${
                  pack.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : pack.custom
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {pack.custom ? "Falar com Comercial" : "Escolher"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packs;
