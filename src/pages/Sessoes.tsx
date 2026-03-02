import PlatformLayout from "@/components/PlatformLayout";
import { motion } from "framer-motion";
import { Brain, Play, CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatWidget from "@/components/ChatWidget";

const sessions = [
  { id: 1, title: "Vocabulário Base & Apresentação", format: "Texto + Quiz", time: "20 min", status: "done", score: 92 },
  { id: 2, title: "Email Profissional", format: "Texto + Escrita", time: "25 min", status: "done", score: 88 },
  { id: 3, title: "Reuniões — Participar Ativamente", format: "Áudio + Roleplay", time: "25 min", status: "progress" },
  { id: 4, title: "Apresentações (Parte 1)", format: "Vídeo + Texto", time: "30 min", status: "todo" },
  { id: 5, title: "Apresentações (Parte 2)", format: "Roleplay", time: "25 min", status: "todo" },
  { id: 6, title: "Negociação", format: "Áudio + Roleplay", time: "30 min", status: "todo" },
  { id: 7, title: "Entrevistas de Emprego", format: "Vídeo + Quiz", time: "25 min", status: "todo" },
  { id: 8, title: "Comunicação Oral Avançada", format: "Áudio + Feedback", time: "30 min", status: "todo" },
];

const Sessoes = () => {
  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-2xl font-bold mb-2">Sessões</h1>
        <p className="text-muted-foreground mb-8">Todas as sessões do teu pack. Treina ao teu ritmo.</p>

        <div className="grid gap-4">
          {sessions.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`premium-card flex items-center gap-4 ${
                s.status === "progress" ? "ring-1 ring-primary" : ""
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                s.status === "done" ? "bg-success/10" : s.status === "progress" ? "bg-primary/10" : "bg-secondary"
              }`}>
                {s.status === "done" ? <CheckCircle2 className="h-5 w-5 text-success" /> :
                 s.status === "progress" ? <Play className="h-5 w-5 text-primary" /> :
                 <Circle className="h-5 w-5 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{s.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Brain className="h-3 w-3" /> {s.format} · <Clock className="h-3 w-3" /> {s.time}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {s.score && <span className="text-xs font-medium text-success">{s.score}%</span>}
                {s.status === "progress" && (
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg h-8 text-xs">
                    Continuar <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                )}
                {s.status === "done" && (
                  <Button size="sm" variant="outline" className="rounded-lg h-8 text-xs">
                    Rever
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <ChatWidget />
    </PlatformLayout>
  );
};

export default Sessoes;
