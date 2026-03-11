import PlatformLayout from "@/components/PlatformLayout";
import { motion } from "framer-motion";
import ChatWidget from "@/components/ChatWidget";
import { CheckCircle2, Play, Lock, Clock, ArrowRight, FolderOpen, Mic, ChevronRight, Library, Wrench, Swords, BookOpen, Flame, Timer, BarChart2, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { sessionsData } from "@/lib/sessionsData";
import { chaptersData } from "@/lib/chaptersData";
import { Card, ProgressBar, Badge } from "@/components/ui/VoiceUI";

const TOTAL_SESSIONS = 10;

const statusConfig = {
  done: { icon: CheckCircle2, color: "text-[#C9A84C]", bg: "bg-[#C9A84C]/10", label: "Concluída" },
  progress: { icon: Play, color: "text-[#C9A84C]", bg: "bg-[#C9A84C]/10", label: "Em progresso" },
  todo: { icon: Lock, color: "text-white/30", bg: "bg-white/5", label: "Por fazer" },
  teacher: { icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10", label: "Aula com Professora" },
};

const glassCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(20px)",
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

  // Load AI evaluation
  let aiEval: any = null;
  try {
    const stored = localStorage.getItem(`voice3_ai_evaluation_${userId}`);
    if (stored) aiEval = JSON.parse(stored);
  } catch (_e) {}

  // Check if Chapter 1 diagnostic is completed
  let diagnosticCompleted = false;
  try {
    const stored = localStorage.getItem(`voice3_diagnostic_completed_${userId}`);
    if (stored) diagnosticCompleted = true;
  } catch (_e) {}

  // Load chapter-level progress
  let chapterProgress: Record<string, { status: string; completedAt?: string }> = {};
  try {
    const stored = localStorage.getItem(`voice3_chapter_progress_${userId}`);
    if (stored) chapterProgress = JSON.parse(stored);
  } catch (_e) {}

  // Load professor assignments
  let assignments: any[] = [];
  try {
    const stored = localStorage.getItem(`voice3_student_assignments_${userId}`);
    if (stored) assignments = JSON.parse(stored);
  } catch (_e) {}
  const pendingAssignments = assignments.filter((a: any) => a.status !== 'completed');

  // Load professor info
  let professorInfo: { name: string; title?: string } | null = null;
  try {
    const stored = localStorage.getItem(`voice3_professor_assignment_${userId}`);
    if (stored) professorInfo = JSON.parse(stored);
  } catch (_e) {}

  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const progressPercent = Math.round((completedCount / TOTAL_SESSIONS) * 100);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
  };

  // Compute avg score from completed sessions
  const scores = Object.values(progress).filter(p => p.completed && p.score > 0).map(p => p.score);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 89;

  const getSessionStatus = (id: number) => {
    if (progress[id]?.completed) return "done";
    for (let i = 1; i <= TOTAL_SESSIONS; i++) {
      if (!progress[i]?.completed) return i === id ? "progress" : "todo";
    }
    return "todo";
  };

  // Find the next session in progress
  const nextSession = sessionsData.find(s => getSessionStatus(s.id) === "progress") || sessionsData[0];

  // Chapter context for the hero card — sessions 1-5 → ch2, 6-10 → ch3
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

  // Sessions done per chapter (for chapter cards)
  const sessionsDoneByChapter: Record<string, number> = {
    ch1: diagnosticCompleted ? 1 : 0,
    ch2: [1,2,3,4,5].filter(id => progress[id]?.completed).length,
    ch3: [6,7,8,9,10].filter(id => progress[id]?.completed).length,
  };

  // Load string-ID session progress for chapter-based view
  let sessionProgressStr: Record<string, { status: string; score?: number }> = {};
  try {
    const stored = localStorage.getItem(`voice3_session_progress_${userId}`);
    if (stored) sessionProgressStr = JSON.parse(stored);
  } catch (_e) {}

  // Build programme data from chaptersData + session progress
  const isChapterUnlocked = (chapter: typeof chaptersData[0], allChapters: typeof chaptersData, idx: number): boolean => {
    if (idx === 0) return true;
    if (chapter.isDiagnostic) return true;
    const prevChapter = allChapters[idx - 1];
    const prevCp = chapterProgress[prevChapter.id];
    if (prevCp?.status === 'completed') return true;
    // Compute completion from session progress
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
    return {
      ...ch,
      sessionsWithProgress,
      completedSessions: completedSessionsCount,
      completionPct: pct,
      status,
      unlocked,
    };
  });

  // Build combined list
  const combinedList = [
    ...sessionsData.slice(0, 5).map(s => ({ ...s, isTeacher: false })),
    { id: 101, title: "📅 Aula com Professora #1", objective: "Completa as sessões 1-5 para desbloquear", time: "45 min", isTeacher: true, requiresSessions: 5 },
    ...sessionsData.slice(5).map(s => ({ ...s, isTeacher: false })),
    { id: 102, title: "📅 Aula com Professora #2", objective: "Completa todas as sessões para desbloquear", time: "45 min", isTeacher: true, requiresSessions: 10 },
  ];

  return (
    <PlatformLayout>
      {/* Hero Welcome Area */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p style={{ letterSpacing: "0.12em" }} className="text-[10px] text-[#C9A84C]/70 uppercase font-medium mb-3">
          Executive Communication Programme · March 2026
        </p>
        <h1 className="text-3xl font-light text-[#F4F2ED] mb-1 tracking-tight">
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
        <p className="text-sm text-[#8E96A3] mb-4">
          You're {progressPercent}% through your journey to executive fluency.
        </p>
        <div className="mb-2 max-w-md">
          <ProgressBar value={progressPercent} height={4} />
        </div>
        <p style={{ letterSpacing: "0.06em" }} className="text-[11px] text-[#8E96A3]/70 uppercase">
          {completedCount} of {TOTAL_SESSIONS} chapters · {progressPercent}% complete
        </p>
        {!aiEval && !diagnosticCompleted && chapterProgress['ch1']?.status !== 'completed' && (
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl border border-[#C9A84C]/30 text-sm text-[#F4F2ED] hover:border-[#C9A84C]/50 transition-all"
            style={{ background: "rgba(201,168,76,0.08)" }}
          >
            <span className="text-[#C9A84C] font-semibold">Complete your Executive Profile</span> to unlock personalised training →
          </Link>
        )}
      </motion.div>

      {/* Hero + Progress row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        {/* Current Session Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 relative rounded-xl overflow-hidden transition-all duration-300 group"
          style={{
            background: "#141420",
            borderTop: "1px solid rgba(201,168,76,0.15)",
            borderRight: "1px solid rgba(201,168,76,0.15)",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
            borderLeft: "3px solid #C9A84C",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/[0.03] to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#C9A84C]/[0.04] blur-3xl pointer-events-none" />

          <div className="relative p-6">
            {/* Top badge */}
            <div className="mb-4">
              {nextSessionChapterInfo ? (
                <span style={{ letterSpacing: "0.1em", fontSize: "10px" }} className="uppercase font-semibold text-[#C9A84C]/80">
                  Cap. {nextSessionChapterInfo.chapter.number} — {nextSessionChapterInfo.chapter.title} · Session {nextSessionChapterInfo.indexInChapter} of {nextSessionChapterInfo.totalInChapter}
                </span>
              ) : (
                <span style={{ letterSpacing: "0.1em", fontSize: "10px" }} className="uppercase font-semibold text-[#C9A84C]/80">
                  Sessão {nextSession.id}
                </span>
              )}
            </div>

            <div className="flex items-start justify-between mb-1">
              <h2 style={{ fontSize: "28px", fontWeight: 300, lineHeight: 1.3 }} className="text-[#F4F2ED] flex-1 mr-4">
                {nextSession.title}
              </h2>
              <span className="text-xs text-[#8E96A3] flex items-center gap-1 shrink-0 mt-1">
                <Clock className="h-3 w-3" />{nextSession.time}
              </span>
            </div>
            <p className="text-[#8E96A3] text-sm mb-5 leading-relaxed">{nextSession.objective}</p>

            {nextSessionChapterInfo && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ letterSpacing: "0.08em" }} className="text-[10px] text-[#8E96A3]/70 uppercase">Chapter Progress</span>
                  <span className="text-[10px] text-[#C9A84C] font-semibold">
                    {nextSessionChapterInfo.done}/{nextSessionChapterInfo.totalInChapter}
                  </span>
                </div>
                <ProgressBar value={nextSessionChapterInfo.done} max={nextSessionChapterInfo.totalInChapter} height={4} />
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button
                className="rounded-full font-semibold h-9 px-6 text-sm transition-all duration-300 hover:shadow-[0_0_24px_rgba(201,168,76,0.35)]"
                style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0A0A0F", border: "none" }}
                asChild
              >
                <Link to={`/app/sessao/${nextSession.id}`}>
                  {completedCount > 0 && getSessionStatus(nextSession.id) === "progress" ? "Continuar →" : "Iniciar →"}
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
          <div style={{ letterSpacing: "0.08em" }} className="text-[10px] text-[#8E96A3] uppercase font-medium mb-1">Session Progress</div>
          {sessionsData.slice(0, 3).map((session) => {
            const status = getSessionStatus(session.id);
            return (
              <Link
                key={session.id}
                to={`/app/sessao/${session.id}`}
                className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group hover:shadow-[0_8px_32px_rgba(201,168,76,0.12)]"
                style={{
                  ...glassCard,
                  borderColor: status === "progress" ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.08)",
                }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${status === "done" ? "bg-[#C9A84C]/15" : status === "progress" ? "bg-[#C9A84C]/10" : "bg-white/5"}`}>
                  {status === "done" ? (
                    <CheckCircle2 className="h-4 w-4 text-[#C9A84C]" />
                  ) : status === "progress" ? (
                    <Play className="h-3.5 w-3.5 text-[#C9A84C]" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-white/20" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${status === "todo" ? "text-white/30" : "text-[#F4F2ED]"}`}>{session.title}</p>
                  {status === "done" && progress[session.id]?.score && (
                    <p className="text-xs text-[#C9A84C]">{progress[session.id].score}% · Concluída</p>
                  )}
                  {status === "progress" && <p className="text-xs text-[#C9A84C]">Em progresso</p>}
                  {status === "todo" && <p className="text-xs text-white/20">Bloqueada</p>}
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-white/20 group-hover:text-[#C9A84C] transition-colors shrink-0" />
              </Link>
            );
          })}
          <Link to="/app/sessoes" className="text-center text-xs text-[#C9A84C] hover:text-[#E8C97A] py-1 transition-colors">
            Ver todas as sessões →
          </Link>
        </motion.div>
      </div>

      {/* Chapter Progress — vertical list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <span style={{ letterSpacing: "0.08em" }} className="text-[10px] text-[#8E96A3] uppercase font-medium">My Programme</span>
          <Link to="/capitulos" className="text-xs text-[#C9A84C] hover:text-[#E8C97A] transition-colors">
            Ver tudo →
          </Link>
        </div>
        <div>
          {programmeChapters.map((ch) => {
            const isDone = ch.completionPct === 100;
            const isActive = ch.status === 'in_progress';
            return (
              <Link
                key={ch.id}
                to="/capitulos"
                style={{
                  display: "block",
                  background: isDone ? 'rgba(34,197,94,0.04)' : isActive ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.02)',
                  border: isDone ? '1px solid rgba(34,197,94,0.2)' : isActive ? '1px solid rgba(201,168,76,0.25)' : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14, padding: '16px 20px', marginBottom: 8,
                  opacity: ch.unlocked ? 1 : 0.45, cursor: ch.unlocked ? 'pointer' : 'default',
                  transition: 'all 0.25s', textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
                    background: isDone ? 'rgba(34,197,94,0.15)' : isActive ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.06)',
                    border: isDone ? '1px solid rgba(34,197,94,0.3)' : isActive ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.1)',
                    color: isDone ? 'rgba(74,222,128,0.9)' : '#F4F2ED',
                  }}>
                    {isDone ? '✓' : ch.unlocked ? ch.number : '🔒'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' as const }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#F4F2ED' }}>Cap. {ch.number} — {ch.title}</span>
                      {ch.isDiagnostic && (
                        <Badge variant="purple" size="xs">Diagnostic</Badge>
                      )}
                      {isDone && (
                        <Badge variant="success" size="xs">✓ Complete</Badge>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                      {ch.unlocked
                        ? `${ch.completedSessions}/${ch.totalSessions} sessions completed`
                        : 'Complete previous chapter to unlock'}
                    </span>
                  </div>
                  {ch.unlocked && ch.totalSessions > 0 && (
                    <div style={{ width: 100, textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isDone ? 'rgba(74,222,128,0.9)' : '#C9A84C', marginBottom: 4 }}>
                        {ch.completionPct}%
                      </div>
                      <ProgressBar value={ch.completionPct} color={isDone ? "green" : "gold"} height={4} />
                    </div>
                  )}
                  {ch.unlocked && (
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 18, flexShrink: 0 }}>›</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Daily Metrics Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="mb-6"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Flame, emoji: "🔥", label: "Streak", value: "7 days", sub: "Keep it up!" },
            { icon: Timer, emoji: "⏱", label: "Study Time", value: "2h 14min", sub: "This week" },
            { icon: BarChart2, emoji: "📊", label: "Avg Score", value: `${avgScore}%`, sub: "Last 5 sessions" },
            { icon: Trophy, emoji: "🏆", label: "Rank", value: "#12", sub: "Top 6%" },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 + i * 0.05 }}
            >
              <Card hover padding={16}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{metric.emoji}</span>
                  <span style={{ letterSpacing: "0.08em", fontSize: "10px" }} className="uppercase font-semibold text-[#8E96A3]">{metric.label}</span>
                </div>
                <p className="text-xl font-light text-[#F4F2ED] mb-0.5">{metric.value}</p>
                <p className="text-[11px] text-[#8E96A3]">{metric.sub}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Explore VOICE³ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ letterSpacing: "0.08em" }} className="text-[10px] text-[#8E96A3] uppercase font-medium">Explore VOICE³</h2>
          <div className="h-px flex-1 bg-[#C9A84C]/20 mx-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              icon: Library,
              title: "Programme Catalogue",
              description: "Explore 35+ programmes across 7 segments",
              cta: "Browse Catalogue",
              to: "/app/catalogue",
            },
            {
              icon: Wrench,
              title: "My Toolkit",
              description: "On-demand tools for immediate challenges",
              cta: "Open Toolkit",
              to: "/app/toolkit",
            },
            {
              icon: Swords,
              title: "Practice Arena",
              description: "Pressure test your communication skills",
              cta: "Start Practicing",
              to: "/app/practice",
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
                className="flex flex-col gap-4 p-5 rounded-xl transition-all duration-300 group h-full hover:shadow-[0_8px_32px_rgba(201,168,76,0.12)]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(201,168,76,0.1)",
                  backdropFilter: "blur(20px)",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.1)")}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/5 border border-[#C9A84C]/20 flex items-center justify-center shrink-0 group-hover:from-[#C9A84C]/30 transition-all">
                  <card.icon className="h-5 w-5 text-[#C9A84C]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#F4F2ED] mb-1.5 group-hover:text-[#C9A84C] transition-colors">{card.title}</p>
                  <p className="text-xs text-[#8E96A3] leading-relaxed">{card.description}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-xs font-semibold text-[#C9A84C] group-hover:bg-[#C9A84C]/20 transition-all">
                  {card.cta}
                  <ChevronRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Diagnostic Results Card */}
      {aiEval && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ letterSpacing: "0.08em" }} className="text-[10px] text-[#8E96A3] uppercase font-medium">Resultados do Diagnóstico</h2>
            <div className="h-px flex-1 bg-[#C9A84C]/20 mx-4" />
          </div>
          <Card gold style={{ backdropFilter: "blur(20px)" }}>
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)" }}
              >
                <span className="text-xl font-bold text-[#C9A84C]">{aiEval.level}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="text-sm font-semibold text-[#F4F2ED]">Nível {aiEval.level}</span>
                  {aiEval.teachingStyle && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium text-[#C9A84C]"
                      style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
                    >
                      {aiEval.teachingStyle}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {Object.entries(aiEval.weakPoints || {}).sort(([, a]: any, [, b]: any) => b - a).slice(0, 3).map(([key, val]: [string, any]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span style={{ letterSpacing: "0.04em" }} className="text-xs text-[#8E96A3] w-24 capitalize">{key}</span>
                      <div className="flex-1">
                        <ProgressBar value={(val / 10) * 100} height={4} />
                      </div>
                      <span className="text-xs text-[#C9A84C] w-8 text-right">{val}/10</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Link to="/sessoes/diagnostico" className="text-xs text-[#C9A84C] hover:text-[#E8C97A] transition-colors">
                Ver análise completa →
              </Link>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Professor Info Card */}
      {professorInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.255 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ letterSpacing: "0.08em" }} className="text-[10px] text-[#8E96A3] uppercase font-medium">O Teu Professor</h2>
            <div className="h-px flex-1 bg-[#C9A84C]/20 mx-4" />
          </div>
          <Card gold style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(20px)" }}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)" }}
              >
                <User className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F4F2ED]">{professorInfo.name}</p>
                <p className="text-xs text-[#8E96A3]">{professorInfo.title || 'Executive English Coach'}</p>
              </div>
            </div>
            <Button
              size="sm"
              className="rounded-lg h-8 px-4 text-xs font-semibold"
              style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.25)" }}
              asChild
            >
              <Link to="/app/aulas">Book Session →</Link>
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Professor Assignments */}
      {pendingAssignments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ letterSpacing: "0.08em" }} className="text-[10px] text-[#8E96A3] uppercase font-medium">👨‍🏫 Tarefas do Professor</h2>
            <div className="h-px flex-1 bg-[#C9A84C]/20 mx-4" />
          </div>
          <Card style={{ padding: 0, overflow: "hidden", backdropFilter: "blur(20px)" }}>
            <div className="divide-y divide-white/[0.04]">
              {pendingAssignments.slice(0, 3).map((a: any, i: number) => (
                <div key={a.id || i} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-sm text-[#F4F2ED]">{a.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 font-medium">
                        👨‍🏫 Professor Assigned
                      </span>
                    </div>
                    <p className="text-xs text-[#8E96A3]">Prazo: {a.dueDate}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${a.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-blue-400/10 text-blue-400'}`}>
                    {a.status === 'pending' ? 'Pendente' : 'Em progresso'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Materials Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.27 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ letterSpacing: "0.08em" }} className="text-[10px] text-[#8E96A3] uppercase font-medium">Materials</h2>
          <div className="h-px flex-1 bg-[#C9A84C]/20 mx-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="#"
            className="flex items-center gap-4 p-4 rounded-xl transition-all group hover:shadow-[0_8px_32px_rgba(201,168,76,0.12)]"
            style={glassCard}
          >
            <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
              <FolderOpen className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#F4F2ED] group-hover:text-[#C9A84C] transition-colors">Instruções Pré-Sessão</p>
              <p className="text-xs text-[#8E96A3]">Download · PDF</p>
            </div>
            <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-[#C9A84C] transition-colors shrink-0" />
          </a>
          <a
            href="#"
            className="flex items-center gap-4 p-4 rounded-xl transition-all group hover:shadow-[0_8px_32px_rgba(201,168,76,0.12)]"
            style={glassCard}
          >
            <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
              <Mic className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#F4F2ED] group-hover:text-[#C9A84C] transition-colors">Diagnóstico Gravado</p>
              <p className="text-xs text-[#8E96A3]">Gravação Inicial · Audio</p>
            </div>
            <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-[#C9A84C] transition-colors shrink-0" />
          </a>
        </div>
      </motion.div>

      {/* All Sessions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Card style={{ padding: 0, overflow: "hidden", backdropFilter: "blur(20px)" }}>
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h2 style={{ letterSpacing: "0.08em" }} className="text-[10px] font-semibold text-[#8E96A3] uppercase">Todas as Sessões</h2>
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
                className={`flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors ${status === "progress" ? "border-l-2 border-[#C9A84C]" : ""}`}>
                <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                </div>
                <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                  <span className={`text-[10px] font-bold ${status === "todo" ? "text-white/20" : "text-[#C9A84C]"}`}>{sessionItem.id}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-sm ${status === "progress" ? "text-[#F4F2ED]" : status === "done" ? "text-white/70" : "text-white/30"}`}>{item.title}</h3>
                  <p className="text-xs text-white/30 truncate">{sessionItem.objective}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {progress[sessionItem.id]?.score && <span className="text-xs font-medium text-[#C9A84C]">{progress[sessionItem.id].score}%</span>}
                  <span className="text-xs text-white/20">{item.time}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status === "done" ? "bg-[#C9A84C]/10 text-[#C9A84C]" : status === "progress" ? "bg-[#C9A84C]/10 text-[#C9A84C]" : "bg-white/5 text-white/20"}`}>
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
        </Card>
      </motion.div>

      <ChatWidget />
    </PlatformLayout>
  );
};

export default MeuCurso;
