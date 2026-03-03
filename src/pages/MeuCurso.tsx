import PlatformLayout from "@/components/PlatformLayout";
import { motion } from "framer-motion";
import ChatWidget from "@/components/ChatWidget";
import { CheckCircle2, Play, Lock, Clock, ArrowRight, FolderOpen, Mic, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { sessionsData } from "@/lib/sessionsData";

const TOTAL_SESSIONS = 10;

const statusConfig = {
  done: { icon: CheckCircle2, color: "text-[#B89A5A]", bg: "bg-[#B89A5A]/10", label: "Concluída" },
  progress: { icon: Play, color: "text-[#B89A5A]", bg: "bg-[#B89A5A]/10", label: "Em progresso" },
  todo: { icon: Lock, color: "text-white/30", bg: "bg-white/5", label: "Por fazer" },
  teacher: { icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10", label: "Aula com Professora" },
};

const MeuCurso = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "";
  const firstName = currentUser?.name?.split(" ")[0] || "Utilizador";

  let progress: Record<number, { completed: boolean; score: number; completedAt: string }> = {};
  try {
    const stored = localStorage.getItem(`voice3_sessions_progress_${userId}`);
    if (stored) progress = JSON.parse(stored);
  } catch (_e) {
    // ignore
  }

  let onboardingData: { tone?: string; completed?: boolean } | null = null;
  try {
    const stored = localStorage.getItem(`voice3_onboarding_${userId}`);
    if (stored) onboardingData = JSON.parse(stored);
  } catch (_e) {
    // ignore
  }
  const onboardingCompleted = !!onboardingData?.completed;
  const userTone = onboardingData?.tone;

  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const progressPercent = Math.round((completedCount / TOTAL_SESSIONS) * 100);

  const getSessionStatus = (id: number) => {
    if (progress[id]?.completed) return "done";
    for (let i = 1; i <= TOTAL_SESSIONS; i++) {
      if (!progress[i]?.completed) return i === id ? "progress" : "todo";
    }
    return "todo";
  };

  // Find the next session in progress
  const nextSession = sessionsData.find(s => getSessionStatus(s.id) === "progress") || sessionsData[0];

  // Build combined list
  const combinedList = [
    ...sessionsData.slice(0, 5).map(s => ({ ...s, isTeacher: false })),
    { id: 101, title: "📅 Aula com Professora #1", objective: "Completa as sessões 1-5 para desbloquear", time: "45 min", isTeacher: true, requiresSessions: 5 },
    ...sessionsData.slice(5).map(s => ({ ...s, isTeacher: false })),
    { id: 102, title: "📅 Aula com Professora #2", objective: "Completa todas as sessões para desbloquear", time: "45 min", isTeacher: true, requiresSessions: 10 },
  ];

  return (
    <PlatformLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-xs text-[#B89A5A] tracking-[0.2em] uppercase font-medium mb-1">Executive Communication Programme</p>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] tracking-tight">
            Bem-vindo de volta, <span className="text-[#B89A5A]">{firstName}</span>
          </h1>
          {userTone && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B89A5A]/10 border border-[#B89A5A]/30 text-xs font-semibold text-[#B89A5A]">
              🎯 {userTone}
            </span>
          )}
        </div>
        {!onboardingCompleted && (
          <Link to="/onboarding" className="inline-flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl bg-[#B89A5A]/10 border border-[#B89A5A]/30 text-sm text-[#F4F2ED] hover:bg-[#B89A5A]/20 transition-all">
            <span className="text-[#B89A5A] font-semibold">Complete your Executive Profile</span> to unlock personalised training →
          </Link>
        )}
      </motion.div>

      {/* Hero + Progress row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        {/* Upcoming Session Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 relative rounded-xl overflow-hidden border border-[#B89A5A]/20 hover:border-[#B89A5A]/40 transition-all duration-300 group"
          style={{ background: "linear-gradient(135deg, #0F2235 0%, #1C2A3A 50%, #0B1A2A 100%)" }}
        >
          {/* Decorative overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#B89A5A]/5 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#B89A5A]/5 blur-3xl pointer-events-none" />

          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded border border-[#B89A5A]/30 bg-[#B89A5A]/10 text-[#B89A5A] text-xs font-semibold tracking-wider uppercase">
                Sessão {nextSession.id}
              </span>
              <span className="text-xs text-[#8E96A3] flex items-center gap-1">
                <Clock className="h-3 w-3" />{nextSession.time}
              </span>
            </div>

            <h2 className="font-serif text-2xl font-semibold text-[#F4F2ED] mb-2 leading-tight">
              {nextSession.title}
            </h2>
            <p className="text-[#8E96A3] text-sm mb-6 leading-relaxed">{nextSession.objective}</p>

            <div className="flex items-center gap-3">
              <Button
                className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-lg h-9 px-5 text-sm"
                asChild
              >
                <Link to={`/app/sessao/${nextSession.id}`}>
                  {completedCount > 0 && getSessionStatus(nextSession.id) === "progress" ? "Continuar" : "Iniciar"}
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>
              <span className="text-xs text-[#8E96A3]">
                {getSessionStatus(nextSession.id) === "progress" ? "Em progresso" : getSessionStatus(nextSession.id) === "done" ? "Concluída ✓" : "Próxima sessão"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Session Progress Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 flex flex-col gap-3"
        >
          <div className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium mb-1">Session Progress</div>
          {sessionsData.slice(0, 3).map((session) => {
            const status = getSessionStatus(session.id);
            return (
              <Link
                key={session.id}
                to={`/app/sessao/${session.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#1C1F26] border border-white/5 hover:border-[#B89A5A]/20 transition-all duration-200 group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${status === "done" ? "bg-[#B89A5A]/15" : status === "progress" ? "bg-[#B89A5A]/10" : "bg-white/5"}`}>
                  {status === "done" ? (
                    <CheckCircle2 className="h-4 w-4 text-[#B89A5A]" />
                  ) : status === "progress" ? (
                    <Play className="h-3.5 w-3.5 text-[#B89A5A]" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-white/20" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${status === "todo" ? "text-white/30" : "text-[#F4F2ED]"}`}>{session.title}</p>
                  {status === "done" && progress[session.id]?.score && (
                    <p className="text-xs text-[#B89A5A]">{progress[session.id].score}% · Concluída</p>
                  )}
                  {status === "progress" && <p className="text-xs text-[#B89A5A]">Em progresso</p>}
                  {status === "todo" && <p className="text-xs text-white/20">Bloqueada</p>}
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-white/20 group-hover:text-[#B89A5A] transition-colors shrink-0" />
              </Link>
            );
          })}
          <Link to="/app/sessoes" className="text-center text-xs text-[#B89A5A] hover:text-[#d4ba6a] py-1 transition-colors">
            Ver todas as sessões →
          </Link>
        </motion.div>
      </div>

      {/* Course Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl bg-[#1C1F26] border border-white/5 p-5 mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Course Progress</span>
          <span className="text-xs text-[#B89A5A] font-semibold">{completedCount}/{TOTAL_SESSIONS} sessões · {progressPercent}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#B89A5A] to-[#d4ba6a]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
          />
        </div>
        <div className="flex justify-between mt-3 gap-1">
          {sessionsData.map((s) => {
            const status = getSessionStatus(s.id);
            return (
              <div key={s.id} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${status === "done" ? "bg-[#B89A5A]" : status === "progress" ? "bg-[#B89A5A]/60 animate-pulse" : "bg-white/10"}`} />
                <span className={`text-[9px] font-medium hidden sm:block ${status === "todo" ? "text-white/20" : "text-[#8E96A3]"}`}>{s.id}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Materials Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Materials</h2>
          <div className="h-px flex-1 bg-[#B89A5A]/20 mx-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="#"
            className="flex items-center gap-4 p-4 rounded-xl bg-[#1C1F26] border border-white/5 hover:border-[#B89A5A]/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center shrink-0">
              <FolderOpen className="h-5 w-5 text-[#B89A5A]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#F4F2ED] group-hover:text-[#B89A5A] transition-colors">Instruções Pré-Sessão</p>
              <p className="text-xs text-[#8E96A3]">Download · PDF</p>
            </div>
            <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-[#B89A5A] transition-colors shrink-0" />
          </a>
          <a
            href="#"
            className="flex items-center gap-4 p-4 rounded-xl bg-[#1C1F26] border border-white/5 hover:border-[#B89A5A]/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center shrink-0">
              <Mic className="h-5 w-5 text-[#B89A5A]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#F4F2ED] group-hover:text-[#B89A5A] transition-colors">Diagnóstico Gravado</p>
              <p className="text-xs text-[#8E96A3]">Gravação Inicial · Audio</p>
            </div>
            <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-[#B89A5A] transition-colors shrink-0" />
          </a>
        </div>
      </motion.div>

      {/* All Sessions List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl bg-[#1C1F26] border border-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-[#8E96A3] uppercase tracking-wider">Todas as Sessões</h2>
          <span className="text-xs text-[#8E96A3]">{completedCount}/{TOTAL_SESSIONS} concluídas</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {combinedList.map((item, i) => {
            if (item.isTeacher) {
              const requiresSessions = (item as { requiresSessions: number }).requiresSessions;
              const isUnlocked = completedCount >= requiresSessions;
              return (
                <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className={`w-8 h-8 rounded-lg ${isUnlocked ? "bg-amber-400/10" : "bg-white/5"} flex items-center justify-center shrink-0`}>
                    {isUnlocked ? <Clock className="h-3.5 w-3.5 text-amber-400" /> : <Lock className="h-3.5 w-3.5 text-white/20" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-white/70">{item.title}</h3>
                    <p className="text-xs text-white/30 truncate">
                      {isUnlocked ? "Desbloqueada! Marca a tua aula." : `Completa ${requiresSessions} sessões para desbloquear`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-white/20">{item.time}</span>
                    {isUnlocked ? (
                      <Button size="sm" className="bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 border-0 rounded-lg h-7 text-xs px-3" asChild>
                        <Link to="/app/aulas">Marcar Aula</Link>
                      </Button>
                    ) : (
                      <span className="text-xs text-white/20 font-medium px-2 py-1 rounded-lg bg-white/5">Bloqueada</span>
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
                className={`flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors ${status === "progress" ? "border-l-2 border-[#B89A5A]" : ""}`}>
                <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                </div>
                <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                  <span className={`text-[10px] font-bold ${status === "todo" ? "text-white/20" : "text-[#B89A5A]"}`}>{sessionItem.id}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-sm ${status === "progress" ? "text-[#F4F2ED]" : status === "done" ? "text-white/70" : "text-white/30"}`}>{item.title}</h3>
                  <p className="text-xs text-white/30 truncate">{sessionItem.objective}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {progress[sessionItem.id]?.score && <span className="text-xs font-medium text-[#B89A5A]">{progress[sessionItem.id].score}%</span>}
                  <span className="text-xs text-white/20">{item.time}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status === "done" ? "bg-[#B89A5A]/10 text-[#B89A5A]" : status === "progress" ? "bg-[#B89A5A]/10 text-[#B89A5A]" : "bg-white/5 text-white/20"}`}>
                    {config.label}
                  </span>
                  {status !== "todo" && (
                    <Button size="sm" variant="ghost" className="rounded-lg h-7 text-xs px-3 text-[#8E96A3] hover:text-[#F4F2ED] hover:bg-white/5" asChild>
                      <Link to={`/app/sessao/${sessionItem.id}`}>
                        {status === "progress" ? "Continuar" : "Rever"}
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  )}
                  {status === "todo" && (
                    <Button size="sm" variant="ghost" className="rounded-lg h-7 text-xs px-3 text-white/20 cursor-not-allowed" disabled>
                      <Lock className="h-3 w-3" />
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
