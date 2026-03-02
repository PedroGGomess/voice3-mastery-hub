import PlatformLayout from "@/components/PlatformLayout";
import { motion } from "framer-motion";
import ChatWidget from "@/components/ChatWidget";
import CourseProgressTimeline from "@/components/CourseProgressTimeline";
import SessionCard from "@/components/SessionCard";
import { BookOpen, CheckCircle2, Play, Lock, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { sessionsData } from "@/lib/sessionsData";

const TOTAL_SESSIONS = 8;

const statusConfig = {
  done: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Concluída" },
  progress: { icon: Play, color: "text-primary", bg: "bg-primary/10", label: "Em progresso" },
  todo: { icon: BookOpen, color: "text-white/40", bg: "bg-white/5", label: "Por fazer" },
  teacher: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Aula com Professora" },
};

const MeuCurso = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "";

  let progress: Record<number, { completed: boolean; score: number; completedAt: string }> = {};
  try {
    const stored = localStorage.getItem(`voice3_sessions_progress_${userId}`);
    if (stored) progress = JSON.parse(stored);
  } catch (_e) {
    // ignore
  }

  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const progressPercent = Math.round((completedCount / TOTAL_SESSIONS) * 100);

  const getSessionStatus = (id: number) => {
    if (progress[id]?.completed) return "done";
    // first not completed is "progress"
    for (let i = 1; i <= TOTAL_SESSIONS; i++) {
      if (!progress[i]?.completed) return i === id ? "progress" : "todo";
    }
    return "todo";
  };

  const allItems = [
    ...sessionsData.map(s => ({ ...s, type: "session" as const })),
  ];

  // teacher lesson after session 4 and after session 8
  const teacherLessons = [
    { id: "t1", title: "📅 Aula com Professora #1", objective: "Completa as sessões 1-4 para desbloquear", time: "45 min", status: "teacher" as const, requiresSessions: 4 },
    { id: "t2", title: "📅 Aula com Professora #2", objective: "Completa todas as sessões para desbloquear", time: "45 min", status: "teacher" as const, requiresSessions: 8 },
  ];

  // Build combined list: sessions 1-4, teacher1, sessions 5-8, teacher2
  const combinedList = [
    ...sessionsData.slice(0, 4).map(s => ({ ...s, isTeacher: false })),
    { id: 101, title: teacherLessons[0].title, objective: teacherLessons[0].objective, time: teacherLessons[0].time, status: "teacher" as const, requiresSessions: 4, isTeacher: true },
    ...sessionsData.slice(4).map(s => ({ ...s, isTeacher: false })),
    { id: 102, title: teacherLessons[1].title, objective: teacherLessons[1].objective, time: teacherLessons[1].time, status: "teacher" as const, requiresSessions: 8, isTeacher: true },
  ];

  const featuredSessions = sessionsData.slice(0, 3).map(s => ({
    ...s,
    status: getSessionStatus(s.id),
  }));

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground tracking-tight">Inglês Empresarial</h1>
        <p className="text-white/50 mt-1">Pack Pro · {completedCount}/{TOTAL_SESSIONS} sessões concluídas</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl bg-white/5 border border-white/10 mb-6">
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Course Progress</h2>
          <span className="text-xs text-primary font-medium">{progressPercent}% completo</span>
        </div>
        <CourseProgressTimeline />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Sessões</h2>
          <Link to="/app/sessoes" className="text-xs text-primary hover:text-primary/80 transition-colors">Ver todas</Link>
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Todas as Sessões</h2>
        </div>
        <div className="divide-y divide-white/5">
          {combinedList.map((item, i) => {
            if (item.isTeacher) {
              const teacherItem = item as typeof combinedList[4];
              const isUnlocked = completedCount >= (teacherItem.requiresSessions || 0);
              return (
                <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 transition-colors">
                  <div className={`w-9 h-9 rounded-xl ${isUnlocked ? "bg-warning/10" : "bg-white/5"} flex items-center justify-center shrink-0`}>
                    {isUnlocked ? <Clock className="h-4 w-4 text-warning" /> : <Lock className="h-4 w-4 text-white/30" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-white/80">{item.title}</h3>
                    <p className="text-xs text-white/40 truncate">
                      {isUnlocked ? "Desbloqueada! Marca a tua aula." : `Completa ${teacherItem.requiresSessions} sessões para desbloquear (${completedCount}/${teacherItem.requiresSessions})`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-white/30">{item.time}</span>
                    {isUnlocked ? (
                      <Button size="sm" className="bg-warning text-warning-foreground hover:bg-warning/90 rounded-lg h-7 text-xs px-3" asChild>
                        <Link to="/app/aulas">Marcar Aula</Link>
                      </Button>
                    ) : (
                      <span className="text-xs text-white/30 font-medium px-2 py-1 rounded-lg bg-white/5">Bloqueada</span>
                    )}
                  </div>
                </motion.div>
              );
            }
            const sessionItem = item as typeof sessionsData[0] & { isTeacher: false };
            const status = getSessionStatus(sessionItem.id);
            const config = statusConfig[status as keyof typeof statusConfig];
            const Icon = config.icon;
            return (
              <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 transition-colors ${status === "progress" ? "bg-primary/5" : ""}`}>
                <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-sm ${status === "progress" ? "text-white" : "text-white/80"}`}>{item.title}</h3>
                  <p className="text-xs text-white/40 truncate">{item.objective}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {progress[sessionItem.id]?.score && <span className="text-xs font-medium text-success">{progress[sessionItem.id].score}%</span>}
                  <span className="text-xs text-white/30">{item.time}</span>
                  {status === "progress" && (
                    <Button size="sm" className="bg-primary text-white hover:bg-primary/90 rounded-lg h-7 text-xs px-3" asChild>
                      <Link to={`/app/sessao/${sessionItem.id}`}>Continuar <ArrowRight className="ml-1 h-3 w-3" /></Link>
                    </Button>
                  )}
                  {status === "done" && (
                    <Button size="sm" variant="outline" className="rounded-lg h-7 text-xs px-3" asChild>
                      <Link to={`/app/sessao/${sessionItem.id}`}>Rever</Link>
                    </Button>
                  )}
                  {status === "todo" && (
                    <Button size="sm" variant="outline" className="rounded-lg h-7 text-xs px-3" asChild>
                      <Link to={`/app/sessao/${sessionItem.id}`}>Iniciar</Link>
                    </Button>
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
