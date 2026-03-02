import { motion } from "framer-motion";
import { Mail, Users, Presentation, Handshake, Briefcase, Mic } from "lucide-react";

const topics = [
  { icon: Mail, title: "Emails Profissionais", desc: "Escreve emails claros, concisos e impactantes." },
  { icon: Users, title: "Reuniões", desc: "Participa com confiança em reuniões em inglês." },
  { icon: Presentation, title: "Apresentações", desc: "Apresenta ideias de forma estruturada e persuasiva." },
  { icon: Handshake, title: "Negociação", desc: "Negocia termos e condições com fluência." },
  { icon: Briefcase, title: "Entrevistas", desc: "Prepara-te para entrevistas de emprego internacionais." },
  { icon: Mic, title: "Comunicação Oral", desc: "Melhora pronúncia e fluência em contexto real." },
];

const WhatYouLearn = () => {
  return (
    <section className="py-24 bg-background" id="o-que-aprendes">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O que aprendes</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conteúdo prático focado no que realmente precisas no trabalho.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, i) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="premium-card group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <topic.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{topic.title}</h3>
              <p className="text-sm text-muted-foreground">{topic.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatYouLearn;
