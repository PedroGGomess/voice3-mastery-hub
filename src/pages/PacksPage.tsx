import { motion } from "framer-motion";
import { Check, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const packs = [
  {
    name: "Starter",
    price: 149,
    popular: false,
    features: [
      "4 sessões AI",
      "1 aula com professora (45 min)",
      "Acompanhamento básico",
      "Suporte por email",
      "Certificado de conclusão",
    ],
  },
  {
    name: "Pro",
    price: 349,
    popular: true,
    features: [
      "8 sessões AI",
      "2 aulas com professora (45 min cada)",
      "Análise de progresso completa",
      "Chat AI assistente 24/7",
      "Suporte prioritário por email",
      "Certificado de conclusão",
      "Acesso às gravações",
    ],
  },
  {
    name: "Advanced",
    price: 499,
    popular: false,
    features: [
      "12 sessões AI",
      "3 aulas com professora (45 min cada)",
      "Analytics avançados e relatórios",
      "Chat AI assistente 24/7",
      "Suporte prioritário",
      "Certificado de conclusão",
      "Gravações das sessões",
      "Percurso de aprendizagem personalizado",
    ],
  },
  {
    name: "Business Master",
    price: 799,
    popular: false,
    features: [
      "20 sessões AI",
      "4 aulas com professora (60 min cada)",
      "Analytics executivos",
      "Chat AI assistente 24/7",
      "Gestor de suporte dedicado",
      "Certificado premium",
      "Todas as gravações",
      "Percurso personalizado",
      "Integração empresarial",
      "Relatório mensal de progresso",
    ],
  },
];

const PacksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl font-bold">
            VOICE<span className="text-primary">3</span>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm" className="rounded-xl">
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Packs & Preços
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Escolhe o pack que melhor se adapta aos teus objetivos profissionais. Todos incluem aulas com professora.
          </p>
        </motion.div>
      </section>

      {/* Pack cards */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {packs.map((pack, i) => (
            <motion.div
              key={pack.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`premium-card relative flex flex-col ${
                pack.popular
                  ? "border-primary/50 shadow-[0_0_30px_hsl(var(--primary)/0.15)]"
                  : ""
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1 whitespace-nowrap">
                  <Star className="h-3 w-3" /> Mais Popular
                </div>
              )}

              <h3 className="font-serif text-2xl font-bold mb-1">{pack.name}</h3>

              <div className="mb-6">
                <span className="text-4xl font-bold">€{pack.price}</span>
                <span className="text-muted-foreground text-base">/pack</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {pack.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to="/login">
                <Button
                  className={`w-full rounded-xl h-11 ${
                    pack.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                  }`}
                >
                  Começar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Comparison note */}
        <p className="text-center text-muted-foreground text-sm mt-12">
          Todos os packs incluem acesso à plataforma, certificado de conclusão e suporte por email.
          Precisas de uma solução personalizada para a tua empresa?{" "}
          <Link to="/#packs" className="text-primary hover:underline">
            Fala connosco
          </Link>
          .
        </p>
      </section>
    </div>
  );
};

export default PacksPage;
