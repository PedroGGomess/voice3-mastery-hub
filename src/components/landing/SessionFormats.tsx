import { motion } from "framer-motion";
import { MessageSquare, Mic, Video, FileText, BarChart3 } from "lucide-react";

const formats = [
  { icon: MessageSquare, title: "Chat de Texto", desc: "Pratica escrita com feedback AI em tempo real." },
  { icon: Mic, title: "Áudio", desc: "Treina pronúncia e compreensão oral." },
  { icon: Video, title: "Roleplay & Vídeo", desc: "Simula cenários reais do teu dia-a-dia profissional." },
  { icon: FileText, title: "Exercícios", desc: "Atividades focadas em vocabulário e gramática business." },
  { icon: BarChart3, title: "Feedback AI", desc: "Análise detalhada do teu desempenho após cada sessão." },
];

const SessionFormats = () => {
  return (
    <section className="py-24 bg-secondary/30" id="sessoes">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Como são as sessões</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Formatos variados para maximizar a tua aprendizagem.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-4">
          {formats.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="premium-card text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SessionFormats;
