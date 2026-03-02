import PlatformLayout from "@/components/PlatformLayout";
import { motion } from "framer-motion";
import ChatWidget from "@/components/ChatWidget";
import CourseProgressTimeline from "@/components/CourseProgressTimeline";
import SessionCard from "@/components/SessionCard";
import { BookOpen, CheckCircle2, Play, Lock, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const sessions = [
  { id: 1, title: "Introdução ao Inglês Empresarial", objective: "Vocabulário base e apresentação pessoal", time: "20 min", status: "done" },
  { id: 2, title: "Email Profissional", objective: "Escrever emails formais e informais", time: "25 min", status: "done" },
  { id: 3, title: "Reuniões — Participação Ativa", objective: "Expressar opiniões e fazer sugestões", time: "25 min", status: "progress" },
  { id: 4, title: "Apresentações (Parte 1)", objective: "Estruturar uma apresentação impactante", time: "30 min", status: "todo" },
  { id: 5, title: "📅 Aula com Professora #1", objective: "Completa as sessões 1-4 para desbloquear", time: "45 min", status: "teacher", requiresSessions: 4, unlockedAt: 4 },
  { id: 6, title: "Apresentações (Parte 2)", objective: "Praticar delivery e Q&A", time: "25 min", status: "todo" },
  { id: 7, title: "Negociação em Inglês", objective: "Técnicas de negociação e persuasão", time: "30 min", status: "todo" },
  { id: 8, title: "Entrevistas de Emprego", objective: "Responder com confiança a perguntas comuns", time: "25 min", status: "todo" },
  { id: 9, title: "Comunicação Oral Avançada", objective: "Fluência e pronúncia em contexto profissional", time: "30 min", status: "todo" },
  { id: 10, title: "📅 Aula com Professora #2", objective: "Completa todas as sessões para desbloquear", time: "45 min", status: "teacher", requiresSessions: 8, unlockedAt: 8 },
];

const completedSessions = sessions.filter(s => s.status === "done").length;
const totalRegularSessions = sessions.filter(s => s.status !== "teacher").length;

// The 3 featured session cards: done, progress (highlighted), todo
const featuredSessions = [sessions[1], sessions[2], sessions[3]];

const statusConfig = {
  done: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Concluída" },
  progress: { icon: Play, color: "text-primary", bg: "bg-primary/10", label: "Em progresso" },
  todo: { icon: BookOpen, color: "text-white/40", bg: "bg-white/5", label: "Por fazer" },
  teacher: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Aula com Professora" },
};

const MeuCurso = () => {
  const progressPercent = Math.round((completedSessions / totalRegularSessions) * 100);

  return (
    <PlatformLayout>
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white tracking-tight">Inglês Empresarial</h1>
        <p className="text-white/50 mt-1">Pack Pro · {completedSessions}/{totalRegularSessions} sessões concluídas</p>
      </motion.div>

      {/* Course Progress Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white/5 border border-white/10 mb-6"
      >
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
            Course Progress
          </h2>
          <span className="text-xs text-primary font-medium">{progressPercent}% completo</span>
        </div>
        <CourseProgressTimeline />
      </motion.div>

      {/* Sessions section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Sessões</h2>
          <button className="text-xs text-primary hover:text-primary/80 transition-colors">Ver todas</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featuredSessions.map((session, i) => (
            <SessionCard
              key={session.id}
              title={session.title}
              subtitle={session.objective}
              time={session.time}
              status={session.status as "done" | "progress" | "todo"}
              highlighted={session.status === "progress"}
              index={i}
            />
          ))}
        </div>
      </motion.div>

      {/* All sessions list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Todas as Sessões</h2>
        </div>
        <div className="divide-y divide-white/5">
          {sessions.map((session, i) => {
            const config = statusConfig[session.status as keyof typeof statusConfig];
            const Icon = config.icon;
            const isTeacher = session.status === "teacher";
            const isUnlocked = isTeacher && session.requiresSessions != null && completedSessions >= session.requiresSessions;
            const isLocked = isTeacher && !isUnlocked;

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-white/5 ${
                  session.status === "progress" ? "bg-primary/5" : ""
                }`}
              >
                <div className={`w-9 h-9 rounded-xl ${isLocked ? "bg-white/5" : config.bg} flex items-center justify-center shrink-0`}>
                  {isLocked ? (
                    <Lock className="h-4 w-4 text-white/30" />
                  ) : (
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-sm ${session.status === "progress" ? "text-white" : "text-white/80"}`}>
                    {session.title}
                  </h3>
                  <p className="text-xs text-white/40 truncate">
                    {isLocked
                      ? `Completa ${session.requiresSessions} sessões para desbloquear (${completedSessions}/${session.requiresSessions})`
                      : session.objective}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-white/30">{session.time}</span>
                  {session.status === "progress" && (
                    <Button size="sm" className="bg-primary text-white hover:bg-primary/90 rounded-lg h-7 text-xs px-3">
                      Continuar <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                  {isTeacher && isUnlocked && (
                    <Button size="sm" className="bg-warning text-warning-foreground hover:bg-warning/90 rounded-lg h-7 text-xs px-3" asChild>
                      <Link to="/app/aulas">Marcar Aula</Link>
                    </Button>
                  )}
                  {isLocked && (
                    <span className="text-xs text-white/30 font-medium px-2 py-1 rounded-lg bg-white/5">Bloqueada</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <ChatWidget />
    </PlatformLayout>
  );
};

export default MeuCurso;
