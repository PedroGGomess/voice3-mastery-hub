import PlatformLayout from "@/components/PlatformLayout";
import { motion } from "framer-motion";
import ChatWidget from "@/components/ChatWidget";
import {
  CheckCircle2, Play, Lock, Clock, ArrowRight,
  ChevronRight, Flame, Target, TrendingUp, Zap,
  BookOpen, User, Shield, Languages, Briefcase,
  AlertTriangle, BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  chaptersData,
  sessionTypeLabels,
  sessionTypeColors,
  type Session as ChapterSession,
} from "@/lib/chaptersData";

/* ═══════════════════════════════════════════════
   COLOUR SYSTEM (CSS CUSTOM PROPERTIES)
   ═══════════════════════════════════════════════ */
const C = {
  bg: "var(--bg-base)",
  card: "var(--bg-elevated)",
  cardHover: "var(--bg-surface)",
  border: "var(--border)",
  gold: "var(--gold)",
  goldLight: "var(--gold-light)",
  goldDim: "var(--gold-10)",
  text: "var(--text-primary)",
  textSec: "var(--text-secondary)",
  textMuted: "var(--text-muted)",
  green: "#3fb950",
  blue: "#58a6ff",
  red: "#f85149",
  orange: "#d29922",
  purple: "#bc8cff",
};

/* ───── Tiny UI helpers ───── */
const SectionHeader = ({ num, label }: { num: number; label: string }) => (
  <div className="flex items-center gap-3 mb-4 mt-10 first:mt-0">
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
      style={{ background: C.gold, color: C.bg }}
    >
      {num}
    </div>
    <span
      className="text-[10px] font-semibold uppercase"
      style={{ letterSpacing: "1.5px", color: C.textMuted }}
    >
      {label}
    </span>
    <div className="flex-1 h-px" style={{ background: C.border }} />
  </div>
);

const ProgressFill = ({ pct, height = 4 }: { pct: number; height?: number }) => (
  <div className="w-full rounded-full overflow-hidden" style={{ height, background: C.border }}>
    <div
      className="h-full rounded-full transition-all duration-500"
      style={{
        width: `${Math.min(pct, 100)}%`,
        background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`,
      }}
    />
  </div>
);

const MetricCard = ({ icon: Icon, label, value, change, color }: {
  icon: React.ElementType; label: string; value: string; change?: string; color: string;
}) => (
  <div className="rounded-xl p-4 transition-all duration-200" style={{ background: C.card, border: `1px solid ${C.border}` }}>
    <div className="flex items-center gap-2 mb-2">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
        <Icon className="h-3.5 w-3.5" style={{ color }} />
      </div>
      <span className="text-[10px] uppercase font-semibold" style={{ color: C.textMuted, letterSpacing: "1px" }}>{label}</span>
    </div>
    <p className="text-2xl font-bold" style={{ color: C.gold }}>{value}</p>
    {change && <p className="text-[10px] mt-0.5" style={{ color: C.green }}>{change}</p>}
  </div>
);

/* Programme colour & icon maps */
const programmeColors: Record<string, string> = {
  DIAGNOSTIC: C.purple,
  DEFEND: C.red,
  TRANSLATE: C.blue,
  LEAD: C.green,
  OPERATE: C.orange,
  DECODE: C.purple,
  PREPARE: "#f778ba",
  CAPSTONE: C.gold,
};

const programmeIcons: Record<string, React.ElementType> = {
  DIAGNOSTIC: Target,
  DEFEND: Shield,
  TRANSLATE: Languages,
  LEAD: Target,
  OPERATE: Briefcase,
  DECODE: BarChart3,
  PREPARE: AlertTriangle,
  CAPSTONE: Zap,
};

/* ═══════════════════════════════════════════════
   DASHBOARD COMPONENT
   ═══════════════════════════════════════════════ */
const MeuCurso = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "";
  const firstName = currentUser?.name?.split(" ")[0] || "Utilizador";

  /* ── localStorage reads ── */
  let onboardingData: { tone?: string; completed?: boolean } | null = null;
  try { const s = localStorage.getItem(`voice3_onboarding_${userId}`); if (s) onboardingData = JSON.parse(s); } catch {}
  const userTone = onboardingData?.tone;

  let aiEval: any = null;
  try { const s = localStorage.getItem(`voice3_ai_evaluation_${userId}`); if (s) aiEval = JSON.parse(s); } catch {}

  let diagnosticCompleted = false;
  try { if (localStorage.getItem(`voice3_diagnostic_completed_${userId}`)) diagnosticCompleted = true; } catch {}

  let chapterProgress: Record<string, { status: string; completedAt?: string }> = {};
  try { const s = localStorage.getItem(`voice3_chapter_progress_${userId}`); if (s) chapterProgress = JSON.parse(s); } catch {}

  let sessionProgress: Record<string, { status: string; score?: number }> = {};
  try { const s = localStorage.getItem(`voice3_session_progress_${userId}`); if (s) sessionProgress = JSON.parse(s); } catch {}

  let assignments: any[] = [];
  try { const s = localStorage.getItem(`voice3_student_assignments_${userId}`); if (s) assignments = JSON.parse(s); } catch {}
  const pendingAssignments = assignments.filter((a: any) => a.status !== "completed");

  let professorInfo: { name: string; title?: string } | null = null;
  try { const s = localStorage.getItem(`voice3_professor_assignment_${userId}`); if (s) professorInfo = JSON.parse(s); } catch {}

  /* ── Compute chapter-level progress from chaptersData ── */
  const enrichedChapters = chaptersData.map((ch, idx) => {
    const doneSessions = ch.sessions.filter(s => sessionProgress[s.id]?.status === "completed").length;
    const pct = ch.totalSessions > 0 ? Math.round((doneSessions / ch.totalSessions) * 100) : 0;
    const cp = chapterProgress[ch.id];

    // Unlock logic: first chapter always unlocked, diagnostic always unlocked, otherwise previous must be complete
    let unlocked = true;
    if (idx > 0 && !ch.isDiagnostic) {
      const prev = chaptersData[idx - 1];
      const prevCp = chapterProgress[prev.id];
      const prevDone = prev.sessions.filter(s => sessionProgress[s.id]?.status === "completed").length;
      unlocked = prevCp?.status === "completed" || prevDone === prev.totalSessions;
    }

    let status: string;
    if (cp?.status === "completed" || pct === 100) status = "completed";
    else if (pct > 0 || cp?.status === "in_progress") status = "in_progress";
    else if (unlocked) status = "available";
    else status = "locked";

    return { ...ch, doneSessions, pct, status, unlocked };
  });

  /* ── Global totals from chaptersData ── */
  const totalSessions = chaptersData.reduce((sum, ch) => sum + ch.totalSessions, 0);
  const completedSessions = chaptersData.reduce(
    (sum, ch) => sum + ch.sessions.filter(s => sessionProgress[s.id]?.status === "completed").length,
    0
  );
  const completedChapters = enrichedChapters.filter(ch => ch.status === "completed").length;
  const progressPercent = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  /* ── Find current session (first incomplete session in first incomplete chapter) ── */
  let currentChapter: typeof enrichedChapters[0] | null = null;
  let currentSession: ChapterSession | null = null;

  for (const ch of enrichedChapters) {
    if (ch.status === "completed") continue;
    if (!ch.unlocked) break;
    currentChapter = ch;
    for (const s of ch.sessions) {
      if (sessionProgress[s.id]?.status !== "completed") {
        currentSession = s;
        break;
      }
    }
    if (currentSession) break;
  }

  // Fallback to first chapter/session
  if (!currentChapter) currentChapter = enrichedChapters[0];
  if (!currentSession) currentSession = chaptersData[0].sessions[0];

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  };

  const currentDate = new Date().toLocaleDateString("pt-PT", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  /* Session type badge helper */
  const SessionTypeBadge = ({ type }: { type: ChapterSession["sessionType"] }) => {
    const colorClasses = sessionTypeColors[type] || "text-gray-400 bg-gray-400/10";
    return (
      <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${colorClasses}`}>
        {sessionTypeLabels[type] || type}
      </span>
    );
  };

  return (
    <PlatformLayout>
      <div style={{ maxWidth: 1100 }} className="mx-auto">

        {/* ════════════════════════════════
            1 — AÇÃO IMEDIATA
           ════════════════════════════════ */}
        <SectionHeader num={1} label="Ação Imediata" />

        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <h2 className="text-[26px] font-light" style={{ color: C.text }}>
            {getGreeting()}, {firstName}
          </h2>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-[13px]" style={{ color: C.textSec }}>
              {currentDate} · Cap. {currentChapter.number} · {currentChapter.title}
            </span>
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-[12px] font-semibold"
              style={{ background: C.goldDim, color: C.gold }}
            >
              <Flame className="h-3 w-3" /> {completedSessions > 0 ? `${completedSessions} sessões feitas` : "Começa hoje"}
            </span>
          </div>
        </motion.div>

        {/* Onboarding CTA */}
        {!aiEval && !diagnosticCompleted && chapterProgress["ch0"]?.status !== "completed" && (
          <Link
            to="/onboarding"
            className="flex items-center gap-3 mb-5 px-5 py-3.5 rounded-xl transition-all duration-200 hover:border-[#c9a84c]"
            style={{ background: C.goldDim, border: "1px solid rgba(201,168,76,0.3)" }}
          >
            <Target className="h-4 w-4" style={{ color: C.gold }} />
            <span className="text-sm font-semibold" style={{ color: C.gold }}>Completa o teu Perfil Executivo</span>
            <span className="text-sm" style={{ color: C.textSec }}>para desbloquear treino personalizado</span>
            <ArrowRight className="h-3.5 w-3.5 ml-auto" style={{ color: C.gold }} />
          </Link>
        )}

        {/* Current Session Hero Card — links to the SAME chapter page as O Meu Programa */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-xl overflow-hidden mb-6"
          style={{
            background: "linear-gradient(135deg, #1a2332, #1e2d42)",
            border: `1px solid ${C.gold}`,
          }}
        >
          <div
            className="absolute left-0 top-0 w-1 h-full"
            style={{ background: `linear-gradient(180deg, ${C.gold}, ${C.goldLight})` }}
          />
          <div className="p-6 pl-7">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className="text-[10px] font-semibold uppercase"
                style={{ letterSpacing: "2px", color: C.gold }}
              >
                Cap. {currentChapter.number} — {currentChapter.title}
              </span>
              <SessionTypeBadge type={currentSession.sessionType} />
            </div>
            <h3 className="text-lg font-semibold mb-1" style={{ color: C.text }}>
              {currentSession.title}
            </h3>
            <p className="text-[13px] mb-1 max-w-[700px] leading-relaxed" style={{ color: C.textSec }}>
              {currentSession.description}
            </p>
            <p className="text-[12px] mb-4" style={{ color: C.textMuted }}>
              {currentSession.durationMinutes} min · Sessão {currentSession.number} de {currentChapter.totalSessions} · {currentChapter.pct}% do capítulo concluído
            </p>
            <div className="flex gap-3">
              <Button
                size="sm"
                className="rounded-md font-semibold h-10 px-5 text-sm"
                style={{ background: `linear-gradient(135deg, ${C.gold}, #a88a3a)`, color: C.bg, border: "none" }}
                asChild
              >
                <Link to={`/capitulos/${currentChapter.id}`}>
                  <Play className="mr-2 h-3.5 w-3.5" />
                  {currentChapter.pct > 0 ? "Continue" : "Start Session"}
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-md h-10 px-5 text-sm"
                style={{ background: "transparent", color: C.textSec, border: `1px solid ${C.border}` }}
                asChild
              >
                <Link to="/capitulos">Ver Programa</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ════════════════════════════════
            2 — PROGRESSO & VOICE DNA
           ════════════════════════════════ */}
        <SectionHeader num={2} label="Progresso Atual — Sessão & Voice DNA" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          {/* Current Session Progress */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl p-5"
            style={{ background: C.card, border: `1px solid ${C.border}` }}
          >
            <span className="text-[10px] uppercase font-semibold block mb-3" style={{ letterSpacing: "1px", color: C.textMuted }}>
              Progresso Global
            </span>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: `${C.green}20`, color: C.green }}>
                {completedChapters === chaptersData.length ? "Concluído" : "Em Progresso"}
              </span>
              <span className="text-[11px]" style={{ color: C.textMuted }}>
                {completedSessions} de {totalSessions} sessões
              </span>
            </div>
            <ProgressFill pct={progressPercent} />
            <span className="text-[11px] mt-2 block" style={{ color: C.textMuted }}>
              {completedChapters} de {chaptersData.length} capítulos concluídos · {progressPercent}%
            </span>

            {/* Next 3 chapters quick view */}
            <div className="mt-4 space-y-2">
              {enrichedChapters.filter(ch => ch.status !== "completed").slice(0, 3).map(ch => {
                const color = programmeColors[ch.programme] || C.gold;
                return (
                  <Link
                    key={ch.id}
                    to={`/capitulos/${ch.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 group"
                    style={{
                      background: ch.status === "in_progress" ? `${color}08` : "transparent",
                      border: `1px solid ${ch.status === "in_progress" ? `${color}25` : "transparent"}`,
                      opacity: ch.unlocked ? 1 : 0.4,
                      cursor: ch.unlocked ? "pointer" : "default",
                    }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
                      {ch.unlocked ? (
                        <span className="text-[10px] font-bold" style={{ color }}>{ch.number}</span>
                      ) : (
                        <Lock className="h-3 w-3" style={{ color: C.textMuted }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium truncate" style={{ color: C.text }}>{ch.title}</p>
                      <p className="text-[10px]" style={{ color: C.textMuted }}>{ch.doneSessions}/{ch.totalSessions} sessões</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" style={{ color: C.textMuted }} />
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Voice DNA Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl p-5"
            style={{ background: C.card, border: `1px solid ${C.border}` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-semibold" style={{ letterSpacing: "1px", color: C.textMuted }}>O Teu Voice DNA</span>
              <span className="text-[11px]" style={{ color: C.textMuted }}>Últimos 30 dias</span>
            </div>

            {/* Clarity Index */}
            <div className="text-center rounded-lg p-4 mb-3" style={{ background: "#161b22" }}>
              <p
                className="text-5xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {aiEval?.clarityIndex || "—"}
              </p>
              <span className="text-[11px] uppercase" style={{ letterSpacing: "1px", color: C.textMuted }}>Índice de Clareza</span>
            </div>

            {/* Mini metrics */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Palavras/Min", value: aiEval?.wordsPerMin || "—", change: aiEval ? "↑ 6%" : undefined },
                { label: "Fillers/Min", value: aiEval?.fillersPerMin || "—", change: aiEval ? "↓ de 5.1" : undefined },
                { label: "Vocabulário", value: aiEval?.vocabRange || "—" },
                { label: "Tom Ativo", value: userTone || "—" },
              ].map(m => (
                <div key={m.label} className="rounded-lg p-3 text-center" style={{ background: "#161b22" }}>
                  <p className="text-xl font-bold" style={{ color: C.gold }}>{m.value}</p>
                  <p className="text-[10px] uppercase mt-0.5" style={{ letterSpacing: "0.5px", color: C.textMuted }}>{m.label}</p>
                  {m.change && <p className="text-[10px] mt-0.5" style={{ color: C.green }}>{m.change}</p>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <MetricCard icon={Flame} label="Sessões Feitas" value={`${completedSessions}`} color={C.orange} />
          <MetricCard icon={Clock} label="Capítulos" value={`${completedChapters}/${chaptersData.length}`} color={C.blue} />
          <MetricCard icon={TrendingUp} label="Progresso" value={`${progressPercent}%`} color={C.gold} />
          <MetricCard icon={Zap} label="Nível" value={aiEval?.level || "B2"} color={C.green} />
        </div>

        {/* ════════════════════════════════
            3 — O MEU PROGRAMA
           ════════════════════════════════ */}
        <SectionHeader num={3} label="O Meu Programa" />

        <div className="space-y-2 mb-6">
          {enrichedChapters.map((ch) => {
            const color = programmeColors[ch.programme] || C.gold;
            const isDone = ch.pct === 100;
            const isActive = ch.status === "in_progress" || ch.status === "available";
            const ProgrammeIcon = programmeIcons[ch.programme] || BookOpen;

            return (
              <Link
                key={ch.id}
                to={ch.unlocked ? `/capitulos/${ch.id}` : "#"}
                className="flex items-center gap-4 rounded-xl p-4 transition-all duration-200 group"
                style={{
                  background: ch.status === "in_progress" ? `${color}08` : C.card,
                  border: `1px solid ${ch.status === "in_progress" ? `${color}30` : C.border}`,
                  opacity: ch.unlocked ? 1 : 0.4,
                  cursor: ch.unlocked ? "pointer" : "default",
                }}
                onClick={e => { if (!ch.unlocked) e.preventDefault(); }}
              >
                {/* Programme dot */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      background: isDone ? `${C.green}15` : `${color}12`,
                      border: `1px solid ${isDone ? `${C.green}30` : `${color}25`}`,
                    }}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4" style={{ color: C.green }} />
                    ) : ch.unlocked ? (
                      <ProgrammeIcon className="h-4 w-4" style={{ color }} />
                    ) : (
                      <Lock className="h-3.5 w-3.5" style={{ color: C.textMuted }} />
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13px] font-semibold" style={{ color: C.text }}>
                      Cap. {ch.number} — {ch.title}
                    </span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase"
                      style={{ letterSpacing: "0.5px", background: `${color}15`, color }}
                    >
                      {ch.programme}
                    </span>
                    {isDone && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold" style={{ background: `${C.green}15`, color: C.green }}>
                        ✓ Concluído
                      </span>
                    )}
                  </div>
                  <span className="text-[11px]" style={{ color: C.textMuted }}>
                    {ch.unlocked
                      ? `${ch.doneSessions}/${ch.totalSessions} sessões · ${ch.sessions.map(s => sessionTypeLabels[s.sessionType]?.replace(/^[^\s]+\s/, "")).join(", ")}`
                      : "Completa o capítulo anterior para desbloquear"}
                  </span>
                </div>

                {/* Progress */}
                {ch.unlocked && ch.totalSessions > 0 && (
                  <div className="w-20 shrink-0 text-right">
                    <span className="text-[12px] font-bold" style={{ color: isDone ? C.green : C.gold }}>{ch.pct}%</span>
                    <ProgressFill pct={ch.pct} height={3} />
                  </div>
                )}

                {ch.unlocked && (
                  <ChevronRight className="h-4 w-4 shrink-0 group-hover:translate-x-0.5 transition-transform" style={{ color: C.textMuted }} />
                )}
              </Link>
            );
          })}
        </div>

        {/* ════════════════════════════════
            4 — FERRAMENTAS & PRÁTICA
           ════════════════════════════════ */}
        <SectionHeader num={4} label="Ferramentas & Prática" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { icon: "📚", name: "Catálogo", desc: "Todos os programas", to: "/app/catalogue" },
            { icon: "🧰", name: "Toolkit", desc: "Ferramentas rápidas", to: "/app/toolkit" },
            { icon: "⚔️", name: "Arena", desc: "Prática sob pressão", to: "/app/practice" },
            { icon: "📊", name: "Progresso", desc: "A tua evolução", to: "/app/progress" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-xl p-4 text-center transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: C.card, border: `1px solid ${C.border}` }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = C.gold)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-[12px] font-semibold" style={{ color: C.text }}>{item.name}</p>
              <p className="text-[10px]" style={{ color: C.textMuted }}>{item.desc}</p>
            </Link>
          ))}
        </div>

        {/* ════════════════════════════════
            5 — O TEU PROFESSOR
           ════════════════════════════════ */}
        {professorInfo && (
          <>
            <SectionHeader num={5} label="O Teu Professor" />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between rounded-xl p-5 mb-6"
              style={{ background: C.card, border: `1px solid ${C.border}` }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: C.goldDim, border: "1px solid rgba(201,168,76,0.25)" }}
                >
                  <User className="h-5 w-5" style={{ color: C.gold }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>{professorInfo.name}</p>
                  <p className="text-[11px]" style={{ color: C.textMuted }}>{professorInfo.title || "Coach de Inglês Executivo"}</p>
                </div>
              </div>
              <Button
                size="sm"
                className="rounded-md h-9 px-5 text-xs font-semibold"
                style={{ background: C.goldDim, color: C.gold, border: "1px solid rgba(201,168,76,0.25)" }}
                asChild
              >
                <Link to="/app/aulas">Marcar Sessão →</Link>
              </Button>
            </motion.div>
          </>
        )}

        {/* Professor Assignments */}
        {pendingAssignments.length > 0 && (
          <>
            <SectionHeader num={professorInfo ? 6 : 5} label="Tarefas do Professor" />
            <div className="rounded-xl overflow-hidden mb-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              {pendingAssignments.slice(0, 3).map((a: any, i: number) => (
                <div
                  key={a.id || i}
                  className="flex items-center gap-4 px-5 py-3.5"
                  style={{ borderBottom: i < Math.min(pendingAssignments.length, 3) - 1 ? `1px solid ${C.border}` : undefined }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${C.orange}15` }}>
                    <BookOpen className="h-3.5 w-3.5" style={{ color: C.orange }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: C.text }}>{a.title}</p>
                    <p className="text-[11px]" style={{ color: C.textMuted }}>Prazo: {a.dueDate}</p>
                  </div>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded font-semibold"
                    style={{
                      background: a.status === "pending" ? `${C.orange}15` : `${C.blue}15`,
                      color: a.status === "pending" ? C.orange : C.blue,
                    }}
                  >
                    {a.status === "pending" ? "Pendente" : "Em progresso"}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ════════════════════════════════
            DIAGNÓSTICO
           ════════════════════════════════ */}
        {aiEval && (
          <>
            <SectionHeader num={7} label="Resultados do Diagnóstico" />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-5 mb-6"
              style={{ background: "linear-gradient(135deg, #1a2332, #1e2d42)", border: `1px solid ${C.gold}` }}
            >
              <div className="flex items-start gap-5">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: C.goldDim, border: "1px solid rgba(201,168,76,0.25)" }}
                >
                  <span className="text-xl font-bold" style={{ color: C.gold }}>{aiEval.level}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="text-sm font-semibold" style={{ color: C.text }}>Nível {aiEval.level}</span>
                    {aiEval.teachingStyle && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: C.goldDim, color: C.gold }}>
                        {aiEval.teachingStyle}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {Object.entries(aiEval.weakPoints || {}).sort(([, a]: any, [, b]: any) => b - a).slice(0, 3).map(([key, val]: [string, any]) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-[11px] w-28 capitalize" style={{ color: C.textSec }}>{key}</span>
                        <div className="flex-1"><ProgressFill pct={(val / 10) * 100} height={3} /></div>
                        <span className="text-[11px] w-8 text-right font-medium" style={{ color: C.gold }}>{val}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* ════════════════════════════════
            TODAS AS SESSÕES (by chapter)
           ════════════════════════════════ */}
        <SectionHeader num={8} label="Todas as Sessões" />

        <div className="rounded-xl overflow-hidden mb-8" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
            <span className="text-[11px] font-semibold" style={{ color: C.textMuted }}>
              {completedSessions}/{totalSessions} sessões concluídas
            </span>
            <div className="w-32"><ProgressFill pct={progressPercent} height={3} /></div>
          </div>

          {enrichedChapters.map((ch) => {
            const color = programmeColors[ch.programme] || C.gold;
            return (
              <div key={ch.id}>
                {/* Chapter header row */}
                <div
                  className="flex items-center gap-3 px-5 py-2.5"
                  style={{ background: `${color}06`, borderBottom: `1px solid ${C.border}` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-[10px] font-semibold uppercase" style={{ letterSpacing: "1px", color }}>
                    Cap. {ch.number} — {ch.title}
                  </span>
                  <span className="text-[10px] ml-auto" style={{ color: C.textMuted }}>
                    {ch.doneSessions}/{ch.totalSessions}
                  </span>
                </div>

                {/* Sessions within chapter */}
                {ch.sessions.map((session, si) => {
                  const sp = sessionProgress[session.id];
                  const isDone = sp?.status === "completed";
                  const isActive = !isDone && ch.unlocked && ch.sessions.slice(0, si).every(prev => sessionProgress[prev.id]?.status === "completed");
                  const isLocked = !isDone && !isActive;

                  return (
                    <div
                      key={session.id}
                      className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-white/[0.02]"
                      style={{
                        borderBottom: `1px solid ${C.border}`,
                        borderLeft: isActive ? `3px solid ${C.gold}` : "3px solid transparent",
                        opacity: isLocked ? 0.4 : 1,
                      }}
                    >
                      {/* Status icon */}
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: isDone ? `${C.green}15` : isActive ? C.goldDim : "rgba(255,255,255,0.04)" }}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-3.5 w-3.5" style={{ color: C.green }} />
                        ) : isActive ? (
                          <Play className="h-3 w-3" style={{ color: C.gold }} />
                        ) : (
                          <Lock className="h-3 w-3" style={{ color: C.textMuted }} />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[12px] font-medium truncate" style={{ color: isLocked ? C.textMuted : C.text }}>
                            {session.title}
                          </p>
                          <SessionTypeBadge type={session.sessionType} />
                        </div>
                        <p className="text-[10px] truncate" style={{ color: C.textMuted }}>
                          {session.description}
                        </p>
                      </div>

                      {/* Duration + action */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px]" style={{ color: C.textMuted }}>{session.durationMinutes}min</span>
                        {isDone && (
                          <span className="text-[9px] px-2 py-0.5 rounded font-semibold" style={{ background: `${C.green}15`, color: C.green }}>
                            Concluída
                          </span>
                        )}
                        {isActive && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-lg h-7 text-[11px] px-3"
                            style={{ color: C.gold, background: C.goldDim }}
                            asChild
                          >
                            <Link to={`/capitulos/${ch.id}`}>
                              Start <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                        {isLocked && (
                          <span className="text-[9px] px-2 py-0.5 rounded font-semibold" style={{ background: "rgba(255,255,255,0.04)", color: C.textMuted }}>
                            Bloqueada
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* ════════════════════════════════
            CERTIFICAÇÃO
           ════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-5 rounded-xl p-5 mb-10"
          style={{ background: "linear-gradient(135deg, #1a2332, #1e2d42)", border: `1px solid ${C.gold}` }}
        >
          <span className="text-4xl">🎓</span>
          <div className="flex-1">
            <h4 className="text-[15px] font-semibold mb-1" style={{ color: C.text }}>Certificação VOICE³</h4>
            <p className="text-[12px] mb-3" style={{ color: C.textSec }}>
              Completa todos os capítulos e sessões com professor para receber o teu certificado de domínio executivo.
            </p>
            <ProgressFill pct={progressPercent} height={6} />
            <span className="text-[11px] mt-1 block" style={{ color: C.textMuted }}>
              {progressPercent}% concluído · {totalSessions - completedSessions} sessões restantes
            </span>
          </div>
        </motion.div>

      </div>
      <ChatWidget />
    </PlatformLayout>
  );
};

export default MeuCurso;
