import { useEffect } from "react";
import PlatformLayout from "@/components/PlatformLayout";
import { motion } from "framer-motion";
import ChatWidget from "@/components/ChatWidget";
import { CheckCircle2, Play, Lock, Clock, ArrowRight, FolderOpen, Mic, ChevronRight, Library, Wrench, Swords, BookOpen, Flame, Timer, BarChart2, Trophy, User, Zap, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { sessionsData } from "@/lib/sessionsData";
import { chaptersData } from "@/lib/chaptersData";
import { Card, ProgressBar, Badge } from "@/components/ui/VoiceUI";
import { toast } from "sonner";

const TOTAL_SESSIONS = 10;

const statusConfig = {
  done: { icon: CheckCircle2, color: "text-[#C9A84C]", bg: "bg-[#C9A84C]/10", label: "Concluída" },
  progress: { icon: Play, color: "text-[#C9A84C]", bg: "bg-[#C9A84C]/10", label: "Em progresso" },
  todo: { icon: Lock, color: "text-white/30", bg: "bg-white/5", label: "Por fazer" },
  teacher: { icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10", label: "Aula com Professora" },
};

const glassCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
  backdropFilter: "blur(24px)",
};

const MeuCurso = () => {
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = currentUser?.id || "";

  // Show payment success toast
  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast.success("Pagamento concluído com sucesso! Bem-vindo ao VOICE³.");
      searchParams.delete("payment");
      setSearchParams(searchParams, { replace: true });
    }
  }, []);
  const firstName = currentUser?.name?.split(" ")[0] || "Utilizador";

  let progress: Record<number, { completed: boolean; score: number; completedAt: string }> = {};
  try {
    const stored = localStorage.getItem(`voice3_sessions_progress_${userId}`);
    if (stored) progress = JSON.parse(stored);
  } catch (_e) {}

  let onboardingData: { tone?: string; completed?: boolean } | null = null;
  try {
    const stored = localStorage.getItem(`voice3_onboarding_${userId}`);
    if (stored) onboardingData = JSON.parse(stored);
  } catch (_e) {}
  const onboardingCompleted = !!onboardingData?.completed;
  const userTone = onboardingData?.tone;

  let aiEval: any = null;
  try {
    const stored = localStorage.getItem(`voice3_ai_evaluation_${userId}`);
    if (stored) aiEval = JSON.parse(stored);
  } catch (_e) {}

  let diagnosticCompleted = false;
  try {
    const stored = localStorage.getItem(`voice3_diagnostic_completed_${userId}`);
    if (stored) diagnosticCompleted = true;
  } catch (_e) {}

  let chapterProgress: Record<string, { status: string; completedAt?: string }> = {};
  try {
    const stored = localStorage.getItem(`voice3_chapter_progress_${userId}`);
    if (stored) chapterProgress = JSON.parse(stored);
  } catch (_e) {}

  let assignments: any[] = [];
  try {
    const stored = localStorage.getItem(`voice3_student_assignments_${userId}`);
    if (stored) assignments = JSON.parse(stored);
  } catch (_e) {}
  const pendingAssignments = assignments.filter((a: any) => a.status !== 'completed');

  let professorInfo: { name: string; title?: string } | null = null;
  try {
    const stored = localStorage.getItem(`voice3_professor_assignment_${userId}`);
    if (stored) professorInfo = JSON.parse(stored);
  } catch (_e) {}

  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const progressPercent = Math.round((completedCount / TOTAL_SESSIONS) * 100);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia,";
    if (hour < 18) return "Boa tarde,";
    return "Boa noite,";
  };

  const scores = Object.values(progress).filter(p => p.completed && p.score > 0).map(p => p.score);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 89;

  const getSessionStatus = (id: number) => {
    if (progress[id]?.completed) return "done";
    for (let i = 1; i <= TOTAL_SESSIONS; i++) {
      if (!progress[i]?.completed) return i === id ? "progress" : "todo";
    }
    return "todo";
  };

  const nextSession = sessionsData.find(s => getSessionStatus(s.id) === "progress") || sessionsData[0];

  const getNextSessionChapterInfo = () => {
    if (nextSession.id >= 1 && nextSession.id <= 5) {
      const ch = chaptersData.find(c => c.id === 'ch2');
      if (!ch) return null;
      const done = [1,2,3,4,5].filter(id => progress[id]?.completed).length;
      return { chapter: ch, indexInChapter: nextSession.id, totalInChapter: 5, done };
    }
    if (nextSession.id >= 6 && nextSession.id <= 10) {
      const ch = chaptersData.find(c => c.id === 'ch3');
      if (!ch) return null;
      const done = [6,7,8,9,10].filter(id => progress[id]?.completed).length;
      return { chapter: ch, indexInChapter: nextSession.id - 5, totalInChapter: 5, done };
    }
    return null;
  };
  const nextSessionChapterInfo = getNextSessionChapterInfo();

  const sessionsDoneByChapter: Record<string, number> = {
    ch1: diagnosticCompleted ? 1 : 0,
    ch2: [1,2,3,4,5].filter(id => progress[id]?.completed).length,
    ch3: [6,7,8,9,10].filter(id => progress[id]?.completed).length,
  };

  let sessionProgressStr: Record<string, { status: string; score?: number }> = {};
  try {
    const stored = localStorage.getItem(`voice3_session_progress_${userId}`);
    if (stored) sessionProgressStr = JSON.parse(stored);
  } catch (_e) {}

  const isChapterUnlocked = (chapter: typeof chaptersData[0], allChapters: typeof chaptersData, idx: number): boolean => {
    if (idx === 0) return true;
    if (chapter.isDiagnostic) return true;
    const prevChapter = allChapters[idx - 1];
    const prevCp = chapterProgress[prevChapter.id];
    if (prevCp?.status === 'completed') return true;
    const prevCompletedSessions = prevChapter.sessions.filter(s =>
      sessionProgressStr[s.id]?.status === 'completed'
    ).length;
    return prevCompletedSessions === prevChapter.totalSessions;
  };

  const programmeChapters = chaptersData.map((ch, idx) => {
    const sessionsWithProgress = ch.sessions.map(s => ({
      ...s,
      sessionStatus: sessionProgressStr[s.id]?.status,
      score: sessionProgressStr[s.id]?.score,
    }));
    const completedSessionsCount = sessionsWithProgress.filter(s => s.sessionStatus === 'completed').length;
    const totalSessionsCount = ch.totalSessions;
    const pct = totalSessionsCount > 0 ? Math.round((completedSessionsCount / totalSessionsCount) * 100) : 0;
    const cp = chapterProgress[ch.id];
    const unlocked = isChapterUnlocked(ch, chaptersData, idx);
    let status: string;
    if (cp?.status === 'completed' || pct === 100) {
      status = 'completed';
    } else if (pct > 0 || cp?.status === 'in_progress') {
      status = 'in_progress';
    } else if (unlocked) {
      status = 'available';
    } else {
      status = 'locked';
    }
    return { ...ch, sessionsWithProgress, completedSessions: completedSessionsCount, completionPct: pct, status, unlocked };
  });

  const combinedList = [
    ...sessionsData.slice(0, 5).map(s => ({ ...s, isTeacher: false })),
    { id: 101, title: "Aula com Professora #1", objective: "Completa as sessões 1-5 para desbloquear", time: "45 min", isTeacher: true, requiresSessions: 5 },
    ...sessionsData.slice(5).map(s => ({ ...s, isTeacher: false })),
    { id: 102, title: "Aula com Professora #2", objective: "Completa todas as sessões para desbloquear", time: "45 min", isTeacher: true, requiresSessions: 10 },
  ];

  const currentMonth = new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });

  return (
    <PlatformLayout>
      {/* ═══ Welcome Hero ═══ */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p style={{ letterSpacing: "0.15em" }} className="text-[10px] text-[#C9A84C]/60 uppercase font-medium mb-4">
          Programa de Comunicação Executiva · {currentMonth}
        </p>
        <h1 className="text-4xl font-light text-[#F4F2ED] mb-2 tracking-tight leading-tight">
          {getGreeting()}{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #C9A84C, #E8C97A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 600,
            }}
          >
            {firstName}.
          </span>
        </h1>
        <p className="text-sm text-[#8E96A3] mb-5">
          Estás a {progressPercent}% do teu percurso para fluência executiva.
        </p>
        <div className="mb-2 max-w-md">
          <ProgressBar value={progressPercent} height={5} />
        </div>
        <p style={{ letterSpacing: "0.06em" }} className="text-[11px] text-[#8E96A3]/60 uppercase">
          {completedCount} de {TOTAL_SESSIONS} capítulos · {progressPercent}% concluído
        </p>
        {!aiEval && !diagnosticCompleted && chapterProgress['ch1']?.status !== 'completed' && (
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 mt-5 px-5 py-3 rounded-xl border border-[#C9A84C]/25 text-sm text-[#F4F2ED] hover:border-[#C9A84C]/50 hover:shadow-[0_0_30px_rgba(201,168,76,0.1)] transition-all duration-300"
            style={{ background: "rgba(201,168,76,0.06)" }}
          >
            <Target className="h-4 w-4 text-[#C9A84C]" />
            <span className="text-[#C9A84C] font-semibold">Completa o teu Perfil Executivo</span>
            <span className="text-[#8E96A3]">para desbloquear treino personalizado</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#C9A84C]" />
          </Link>
        )}
      </motion.div>

      {/* ═══ Hero Card + Quick Progress ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-8">
        {/* Current Session Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 relative rounded-2xl overflow-hidden transition-all duration-300 group"
          style={{
            background: "linear-gradient(135deg, rgba(20,20,32,0.95), rgba(11,26,42,0.95))",
            borderTop: "1px solid rgba(201,168,76,0.12)",
            borderRight: "1px solid rgba(201,168,76,0.12)",
            borderBottom: "1px solid rgba(201,168,76,0.12)",
            borderLeft: "3px solid #C9A84C",
            boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/[0.02] to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#C9A84C]/[0.03] blur-[60px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[#C9A84C]/[0.02] blur-[40px] pointer-events-none" />

          <div className="relative p-7">
            <div className="mb-5 flex items-center gap-3">
              {nextSessionChapterInfo ? (
                <span style={{ letterSpacing: "0.12em", fontSize: "10px" }} className="uppercase font-semibold text-[#C9A84C]/70">
                  Cap. {nextSessionChapterInfo.chapter.number} — {nextSessionChapterInfo.chapter.title} · Sessão {nextSessionChapterInfo.indexInChapter} de {nextSessionChapterInfo.totalInChapter}
                </span>
              ) : (
                <span style={{ letterSpacing: "0.12em", fontSize: "10px" }} className="uppercase font-semibold text-[#C9A84C]/70">
                  Sessão {nextSession.id}
                </span>
              )}
              <div className="flex-1 h-px bg-gradient-to-r from-[#C9A84C]/20 to-transparent" />
            </div>

            <div className="flex items-start justify-between mb-2">
              <h2 className="text-[#F4F2ED] flex-1 mr-4 font-serif" style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 500, lineHeight: 1.3 }}>
                {nextSession.title}
              </h2>
              <span className="text-xs text-[#8E96A3]/70 flex items-center gap-1.5 shrink-0 mt-1 px-2.5 py-1 rounded-full bg-white/5">
                <Clock className="h-3 w-3" />{nextSession.time}
              </span>
            </div>
            <p className="text-[#8E96A3] text-sm mb-6 leading-relaxed max-w-xl">{nextSession.objective}</p>

            {nextSessionChapterInfo && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span style={{ letterSpacing: "0.08em" }} className="text-[10px] text-[#8E96A3]/60 uppercase">Progresso do Capítulo</span>
                  <span className="text-[10px] text-[#C9A84C] font-semibold">
                    {nextSessionChapterInfo.done}/{nextSessionChapterInfo.totalInChapter}
                  </span>
                </div>
                <ProgressBar value={nextSessionChapterInfo.done} max={nextSessionChapterInfo.totalInChapter} height={4} />
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button
                className="rounded-full font-semibold h-10 px-7 text-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0A0A0F", border: "none" }}
                asChild
              >
                <Link to={`/app/sessao/${nextSession.id}`}>
                  {completedCount > 0 && getSessionStatus(nextSession.id) === "progress" ? "Continuar" : "Iniciar"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <span className="text-xs text-[#8E96A3]/70">
                {getSessionStatus(nextSession.id) === "progress" ? "Em progresso" : getSessionStatus(nextSession.id) === "done" ? "Concluída ✓" : "Próxima sessão"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Session Quick Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 flex flex-col gap-3"
        >
          <div style={{ letterSpacing: "0.1em" }} className="text-[10px] text-[#8E96A3]/70 uppercase font-medium mb-1">Progresso das Sessões</div>
          {sessionsData.slice(0, 3).map((session) => {
            const status = getSessionStatus(session.id);
            return (
              <Link
                key={session.id}
                to={`/app/sessao/${session.id}`}
                className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 group hover:shadow-[0_8px_32px_rgba(201,168,76,0.08)]"
                style={{
                  ...glassCard,
                  borderColor: status === "progress" ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.06)",
                }}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${status === "done" ? "bg-[#C9A84C]/12" : status === "progress" ? "bg-[#C9A84C]/8" : "bg-white/5"}`}>
                  {status === "done" ? (
                    <CheckCircle2 className="h-4 w-4 text-[#C9A84C]" />
                  ) : status === "progress" ? (
                    <Play className="h-3.5 w-3.5 text-[#C9A84C]" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-white/15" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${status === "todo" ? "text-white/25" : "text-[#F4F2ED]"}`}>{session.title}</p>
                  {status === "done" && progress[session.id]?.score && (
                    <p className="text-[11px] text-[#C9A84C]/80">{progress[session.id].score}% · Concluída</p>
                  )}
                  {status === "progress" && <p className="text-[11px] text-[#C9A84C]/80">Em progresso</p>}
                  {status === "todo" && <p className="text-[11px] text-white/15">Bloqueada</p>}
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-white/15 group-hover:text-[#C9A84C] transition-colors shrink-0" />
              </Link>
            );
          })}
          <Link to="/app/sessoes" className="text-center text-xs text-[#C9A84C]/80 hover:text-[#E8C97A] py-1.5 transition-colors">
            Ver todas as sessões →
          </Link>
        </motion.div>
      </div>

      {/* ═══ Métricas Diárias ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Flame, label: "Sequência", value: "7 dias", sub: "Continua assim!", color: "#F97316" },
            { icon: Timer, label: "Tempo de Estudo", value: "2h 14min", sub: "Esta semana", color: "#3B82F6" },
            { icon: TrendingUp, label: "Pontuação Média", value: `${avgScore}%`, sub: "Últimas 5 sessões", color: "#C9A84C" },
            { icon: Trophy, label: "Ranking", value: "#12", sub: "Top 6%", color: "#A855F7" },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="p-5 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              style={{
                ...glassCard,
                borderColor: "rgba(255,255,255,0.04)",
              }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${metric.color}15` }}>
                  <metric.icon className="h-4 w-4" style={{ color: metric.color }} />
                </div>
                <span style={{ letterSpacing: "0.08em", fontSize: "10px" }} className="uppercase font-semibold text-[#8E96A3]/80">{metric.label}</span>
              </div>
              <p className="text-2xl font-light text-[#F4F2ED] mb-1 tracking-tight">{metric.value}</p>
              <p className="text-[11px] text-[#8E96A3]/60">{metric.sub}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══ O Meu Programa ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span style={{ letterSpacing: "0.1em" }} className="text-[10px] text-[#8E96A3]/70 uppercase font-semibold">O Meu Programa</span>
            <div className="h-px w-16 bg-gradient-to-r from-[#C9A84C]/20 to-transparent" />
          </div>
          <Link to="/capitulos" className="text-xs text-[#C9A84C]/80 hover:text-[#E8C97A] transition-colors">
            Ver tudo →
          </Link>
        </div>
        <div className="space-y-2">
          {programmeChapters.map((ch) => {
            const isDone = ch.completionPct === 100;
            const isActive = ch.status === 'in_progress';
            return (
              <Link
                key={ch.id}
                to="/capitulos"
                className="block rounded-2xl p-4 transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
                style={{
                  background: isDone ? 'rgba(34,197,94,0.03)' : isActive ? 'rgba(201,168,76,0.04)' : 'rgba(255,255,255,0.02)',
                  border: isDone ? '1px solid rgba(34,197,94,0.15)' : isActive ? '1px solid rgba(201,168,76,0.18)' : '1px solid rgba(255,255,255,0.05)',
                  opacity: ch.unlocked ? 1 : 0.4,
                  cursor: ch.unlocked ? 'pointer' : 'default',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-semibold"
                    style={{
                      background: isDone ? 'rgba(34,197,94,0.12)' : isActive ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.05)',
                      border: isDone ? '1px solid rgba(34,197,94,0.25)' : isActive ? '1px solid rgba(201,168,76,0.25)' : '1px solid rgba(255,255,255,0.08)',
                      color: isDone ? 'rgba(74,222,128,0.9)' : isActive ? '#C9A84C' : '#F4F2ED',
                    }}
                  >
                    {isDone ? '✓' : ch.unlocked ? ch.number : '🔒'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm text-[#F4F2ED]">Cap. {ch.number} — {ch.title}</span>
                      {ch.isDiagnostic && <Badge variant="purple" size="xs">Diagnóstico</Badge>}
                      {isDone && <Badge variant="success" size="xs">✓ Concluído</Badge>}
                    </div>
                    <span className="text-[11px] text-[#8E96A3]/50">
                      {ch.unlocked
                        ? `${ch.completedSessions}/${ch.totalSessions} sessões concluídas`
                        : 'Completa o capítulo anterior para desbloquear'}
                    </span>
                  </div>
                  {ch.unlocked && ch.totalSessions > 0 && (
                    <div className="w-24 text-right shrink-0">
                      <div className="text-[13px] font-bold mb-1.5" style={{ color: isDone ? 'rgba(74,222,128,0.9)' : '#C9A84C' }}>
                        {ch.completionPct}%
                      </div>
                      <ProgressBar value={ch.completionPct} color={isDone ? "green" : "gold"} height={3} />
                    </div>
                  )}
                  {ch.unlocked && (
                    <ChevronRight className="h-4 w-4 text-white/15 shrink-0" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* ═══ Explorar VOICE³ ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <h2 style={{ letterSpacing: "0.1em" }} className="text-[10px] text-[#8E96A3]/70 uppercase font-semibold">Explorar VOICE³</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-[#C9A84C]/15 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Library,
              title: "Catálogo de Programas",
              description: "Explora 35+ programas em 7 segmentos",
              cta: "Ver Catálogo",
              to: "/app/catalogue",
              accent: "#3B82F6",
            },
            {
              icon: Wrench,
              title: "O Meu Toolkit",
              description: "Ferramentas para desafios imediatos",
              cta: "Abrir Toolkit",
              to: "/app/toolkit",
              accent: "#C9A84C",
            },
            {
              icon: Swords,
              title: "Arena de Prática",
              description: "Testa as tuas competências sob pressão",
              cta: "Começar Prática",
              to: "/app/practice",
              accent: "#F97316",
            },
          ].map((card, i) => (
            <motion.div
              key={card.to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 + i * 0.07 }}
            >
              <Link
                to={card.to}
                className="flex flex-col gap-4 p-6 rounded-2xl transition-all duration-300 group h-full hover:shadow-[0_8px_32px_rgba(201,168,76,0.08)]"
                style={{
                  ...glassCard,
                  borderColor: "rgba(255,255,255,0.05)",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${card.accent}40`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)")}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all" style={{ background: `${card.accent}12`, border: `1px solid ${card.accent}25` }}>
                  <card.icon className="h-5 w-5" style={{ color: card.accent }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#F4F2ED] mb-1.5 group-hover:text-[#C9A84C] transition-colors">{card.title}</p>
                  <p className="text-xs text-[#8E96A3]/70 leading-relaxed">{card.description}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-[11px] font-semibold text-[#C9A84C] group-hover:bg-[#C9A84C]/10 group-hover:border-[#C9A84C]/20 transition-all">
                  {card.cta}
                  <ChevronRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══ Resultados do Diagnóstico ═══ */}
      {aiEval && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <h2 style={{ letterSpacing: "0.1em" }} className="text-[10px] text-[#8E96A3]/70 uppercase font-semibold">Resultados do Diagnóstico</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-[#C9A84C]/15 to-transparent" />
          </div>
          <Card gold style={{ backdropFilter: "blur(24px)" }}>
            <div className="flex items-start gap-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}
              >
                <span className="text-2xl font-bold text-[#C9A84C]">{aiEval.level}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <span className="text-sm font-semibold text-[#F4F2ED]">Nível {aiEval.level}</span>
                  {aiEval.teachingStyle && (
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-medium text-[#C9A84C]"
                      style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}
                    >
                      {aiEval.teachingStyle}
                    </span>
                  )}
                </div>
                <div className="space-y-2.5">
                  {Object.entries(aiEval.weakPoints || {}).sort(([, a]: any, [, b]: any) => b - a).slice(0, 3).map(([key, val]: [string, any]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span style={{ letterSpacing: "0.04em" }} className="text-xs text-[#8E96A3]/70 w-28 capitalize">{key}</span>
                      <div className="flex-1">
                        <ProgressBar value={(val / 10) * 100} height={3} />
                      </div>
                      <span className="text-xs text-[#C9A84C]/80 w-10 text-right font-medium">{val}/10</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Link to="/sessoes/diagnostico" className="text-xs text-[#C9A84C]/70 hover:text-[#E8C97A] transition-colors">
                Ver análise completa →
              </Link>
            </div>
          </Card>
        </motion.div>
      )}

      {/* ═══ O Teu Professor ═══ */}
      {professorInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.255 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <h2 style={{ letterSpacing: "0.1em" }} className="text-[10px] text-[#8E96A3]/70 uppercase font-semibold">O Teu Professor</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-[#C9A84C]/15 to-transparent" />
          </div>
          <Card gold style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(24px)" }}>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}
              >
                <User className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F4F2ED]">{professorInfo.name}</p>
                <p className="text-xs text-[#8E96A3]/60">{professorInfo.title || 'Coach de Inglês Executivo'}</p>
              </div>
            </div>
            <Button
              size="sm"
              className="rounded-xl h-9 px-5 text-xs font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.2)]"
              style={{ background: "rgba(201,168,76,0.12)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.2)" }}
              asChild
            >
              <Link to="/app/aulas">Marcar Sessão →</Link>
            </Button>
          </Card>
        </motion.div>
      )}

      {/* ═══ Tarefas do Professor ═══ */}
      {pendingAssignments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <h2 style={{ letterSpacing: "0.1em" }} className="text-[10px] text-[#8E96A3]/70 uppercase font-semibold">Tarefas do Professor</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-[#C9A84C]/15 to-transparent" />
          </div>
          <Card style={{ padding: 0, overflow: "hidden", backdropFilter: "blur(24px)" }}>
            <div className="divide-y divide-white/[0.04]">
              {pendingAssignments.slice(0, 3).map((a: any, i: number) => (
                <div key={a.id || i} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/8 flex items-center justify-center shrink-0">
                    <BookOpen className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-sm text-[#F4F2ED]">{a.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/8 border border-amber-400/15 text-amber-400/80 font-medium">
                        Atribuído pelo Professor
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8E96A3]/50">Prazo: {a.dueDate}</p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${a.status === 'pending' ? 'bg-yellow-400/8 text-yellow-400/80' : 'bg-blue-400/8 text-blue-400/80'}`}>
                    {a.status === 'pending' ? 'Pendente' : 'Em progresso'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* ═══ Materiais ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.27 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <h2 style={{ letterSpacing: "0.1em" }} className="text-[10px] text-[#8E96A3]/70 uppercase font-semibold">Materiais</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-[#C9A84C]/15 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="#"
            className="flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 group hover:shadow-[0_8px_32px_rgba(201,168,76,0.08)]"
            style={glassCard}
          >
            <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/8 flex items-center justify-center shrink-0">
              <FolderOpen className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#F4F2ED] group-hover:text-[#C9A84C] transition-colors">Instruções Pré-Sessão</p>
              <p className="text-[11px] text-[#8E96A3]/50">Download · PDF</p>
            </div>
            <ArrowRight className="h-4 w-4 text-white/15 group-hover:text-[#C9A84C] transition-colors shrink-0" />
          </a>
          <a
            href="#"
            className="flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 group hover:shadow-[0_8px_32px_rgba(201,168,76,0.08)]"
            style={glassCard}
          >
            <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/8 flex items-center justify-center shrink-0">
              <Mic className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#F4F2ED] group-hover:text-[#C9A84C] transition-colors">Diagnóstico Gravado</p>
              <p className="text-[11px] text-[#8E96A3]/50">Gravação Inicial · Áudio</p>
            </div>
            <ArrowRight className="h-4 w-4 text-white/15 group-hover:text-[#C9A84C] transition-colors shrink-0" />
          </a>
        </div>
      </motion.div>

      {/* ═══ Todas as Sessões ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <Card style={{ padding: 0, overflow: "hidden", backdropFilter: "blur(24px)", borderRadius: 16 }}>
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
          >
            <h2 style={{ letterSpacing: "0.1em" }} className="text-[10px] font-semibold text-[#8E96A3]/70 uppercase">Todas as Sessões</h2>
            <span className="text-[11px] text-[#8E96A3]/50">{completedCount}/{TOTAL_SESSIONS} concluídas</span>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {combinedList.map((item, i) => {
              if (item.isTeacher) {
                const requiresSessions = (item as { requiresSessions: number }).requiresSessions;
                const isUnlocked = completedCount >= requiresSessions;
                return (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.015] transition-colors">
                    <div className={`w-9 h-9 rounded-xl ${isUnlocked ? "bg-amber-400/8" : "bg-white/4"} flex items-center justify-center shrink-0`}>
                      {isUnlocked ? <Clock className="h-4 w-4 text-amber-400" /> : <Lock className="h-3.5 w-3.5 text-white/15" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-white/60">{item.title}</h3>
                      <p className="text-[11px] text-white/25 truncate">
                        {isUnlocked ? "Desbloqueada! Marca a tua aula." : `Completa ${requiresSessions} sessões para desbloquear`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] text-white/15">{item.time}</span>
                      {isUnlocked ? (
                        <Button size="sm" className="bg-amber-400/8 text-amber-400/80 hover:bg-amber-400/15 border-0 rounded-xl h-8 text-xs px-4" asChild>
                          <Link to="/app/aulas">Marcar Aula</Link>
                        </Button>
                      ) : (
                        <span className="text-[11px] text-white/15 font-medium px-2.5 py-1 rounded-lg bg-white/3">Bloqueada</span>
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
                <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  className={`flex items-center gap-4 px-6 py-4 hover:bg-white/[0.015] transition-colors ${status === "progress" ? "border-l-2 border-[#C9A84C]" : ""}`}>
                  <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="w-7 h-7 rounded-full border border-white/8 flex items-center justify-center shrink-0">
                    <span className={`text-[10px] font-bold ${status === "todo" ? "text-white/15" : "text-[#C9A84C]"}`}>{sessionItem.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-sm ${status === "progress" ? "text-[#F4F2ED]" : status === "done" ? "text-white/60" : "text-white/25"}`}>{item.title}</h3>
                    <p className="text-[11px] text-white/25 truncate">{sessionItem.objective}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {progress[sessionItem.id]?.score && <span className="text-xs font-medium text-[#C9A84C]/80">{progress[sessionItem.id].score}%</span>}
                    <span className="text-[11px] text-white/15">{item.time}</span>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${status === "done" ? "bg-[#C9A84C]/8 text-[#C9A84C]/80" : status === "progress" ? "bg-[#C9A84C]/8 text-[#C9A84C]/80" : "bg-white/4 text-white/15"}`}>
                      {config.label}
                    </span>
                    {status !== "todo" && (
                      <Button size="sm" variant="ghost" className="rounded-xl h-8 text-xs px-3 text-[#8E96A3]/60 hover:text-[#F4F2ED] hover:bg-white/5" asChild>
                        <Link to={`/app/sessao/${sessionItem.id}`}>
                          {status === "progress" ? "Continuar" : "Rever"}
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                    {status === "todo" && (
                      <Button size="sm" variant="ghost" className="rounded-xl h-8 text-xs px-3 text-white/15 cursor-not-allowed" disabled>
                        <Lock className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      <ChatWidget />
    </PlatformLayout>
  );
};

export default MeuCurso;
