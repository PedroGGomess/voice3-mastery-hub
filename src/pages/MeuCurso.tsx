import PlatformLayout from "@/components/PlatformLayout";
import { Play, Clock, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ChatWidget from "@/components/ChatWidget";

const sessions = [
  { id: 1, title: "Introdução ao Inglês Empresarial", objective: "Vocabulário base e apresentação pessoal", time: "20 min", status: "done" },
  { id: 2, title: "Email Profissional", objective: "Escrever emails formais e informais", time: "25 min", status: "done" },
  { id: 3, title: "Reuniões — Participação Ativa", objective: "Expressar opiniões e fazer sugestões", time: "25 min", status: "progress" },
  { id: 4, title: "Apresentações (Parte 1)", objective: "Estruturar uma apresentação impactante", time: "30 min", status: "todo" },
  { id: 5, title: "📅 Aula com Professora #1", objective: "Validação do progresso com professora", time: "45 min", status: "teacher", locked: false },
  { id: 6, title: "Apresentações (Parte 2)", objective: "Praticar delivery e Q&A", time: "25 min", status: "todo" },
  { id: 7, title: "Negociação em Inglês", objective: "Técnicas de negociação e persuasão", time: "30 min", status: "todo" },
  { id: 8, title: "Entrevistas de Emprego", objective: "Responder com confiança a perguntas comuns", time: "25 min", status: "todo" },
  { id: 9, title: "Comunicação Oral Avançada", objective: "Fluência e pronúncia em contexto profissional", time: "30 min", status: "todo" },
  { id: 10, title: "📅 Aula com Professora #2", objective: "Revisão final e certificação", time: "45 min", status: "teacher", locked: true },
];

const statusConfig = {
  done: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Concluída" },
  progress: { icon: Play, color: "text-primary", bg: "bg-primary/10", label: "Em progresso" },
  todo: { icon: Circle, color: "text-muted-foreground", bg: "bg-secondary", label: "Por fazer" },
  teacher: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Aula com Professora" },
};

const MeuCurso = () => {
  return (
    <PlatformLayout>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card mb-8 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-80 aspect-video bg-surface-dark rounded-xl flex items-center justify-center shrink-0">
            <div className="text-center">
              <Play className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="text-sm text-surface-dark-foreground">Vídeo de boas-vindas</p>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Bem-vindo ao Voice3! 🎉</h1>
            <p className="text-muted-foreground">
              Obrigado por escolheres o Voice3. O teu percurso para dominar o Inglês empresarial começa aqui. 
              Assiste ao vídeo de boas-vindas e começa a tua primeira sessão.
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <span className="text-primary font-medium">Pack Pro — 10 sessões</span>
              <span className="text-muted-foreground">2/10 concluídas</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: "20%" }} />
        </div>
        <span className="text-sm font-medium text-muted-foreground">20%</span>
      </div>

      {/* Sessions timeline */}
      <div className="space-y-3">
        {sessions.map((session, i) => {
          const config = statusConfig[session.status as keyof typeof statusConfig];
          const Icon = config.icon;
          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`premium-card flex items-center gap-4 ${
                session.status === "progress" ? "ring-1 ring-primary" : ""
              } ${session.status === "teacher" ? "border-warning/30 bg-warning/5" : ""}`}
            >
              <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{session.title}</h3>
                <p className="text-xs text-muted-foreground">{session.objective}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground">{session.time}</span>
                {session.status === "progress" && (
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg h-8 text-xs">
                    Continuar <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                )}
                {session.status === "teacher" && !session.locked && (
                  <Button size="sm" className="bg-warning text-warning-foreground hover:bg-warning/90 rounded-lg h-8 text-xs" asChild>
                    <a href="/app/aulas">Marcar Aula</a>
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      <ChatWidget />
    </PlatformLayout>
  );
};

export default MeuCurso;
