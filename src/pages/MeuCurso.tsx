import PlatformLayout from "@/components/PlatformLayout";
import { motion } from "framer-motion";
import {
  Play, ArrowRight, Flame, Target, TrendingUp,
  BookOpen, ChevronRight, Lock, CheckCircle2, Clock,
  Mic, BarChart3, Sparkles,
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

/* ── Colour tokens ── */
const C = {
  bg: "var(--bg-base)",
  card: "var(--bg-elevated)",
  border: "var(--border)",
  gold: "var(--gold)",
  goldLight: "var(--gold-light)",
  goldDim: "var(--gold-10)",
  text: "var(--text-primary)",
  textSec: "var(--text-secondary)",
  textMuted: "var(--text-muted)",
  green: "#3fb950",
  blue: "#58a6ff",
  orange: "#d29922",
  purple: "#bc8cff",
};

const programmeColors: Record<string, string> = {
  DIAGNOSTIC: C.purple, DEFEND: "#f85149", TRANSLATE: C.blue,
  LEAD: C.green, OPERATE: C.orange, DECODE: C.purple,
  PREPARE: "#f778ba", CAPSTONE: C.gold,
};

/* ── Progress bar ── */
const ProgressBar = ({ pct, height = 4 }: { pct: number; height?: number }) => (
  <div className="w-full rounded-full overflow-hidden" style={{ height, background: "var(--border)" }}>
    <div
      className="h-full rounded-full transition-all duration-500"
      style={{ width: `${Math.min(pct, 100)}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})` }}
    />
  </div>
);

/* ═══════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════ */
const MeuCurso = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "";
  const firstName = currentUser?.name?.split(" ")[0] || "there";

  /* ── localStorage reads ── */
  let aiEval: any = null;
  try { const s = localStorage.getItem(`voice3_ai_evaluation_${userId}`); if (s) aiEval = JSON.parse(s); } catch {}

  let chapterProgress: Record<string, { status: string }> = {};
  try { const s = localStorage.getItem(`voice3_chapter_progress_${userId}`); if (s) chapterProgress = JSON.parse(s); } catch {}

  let sessionProgress: Record<string, { status: string; score?: number }> = {};
  try { const s = localStorage.getItem(`voice3_session_progress_${userId}`); if (s) sessionProgress = JSON.parse(s); } catch {}

  /* ── Compute progress ── */
  const enrichedChapters = chaptersData.map((ch, idx) => {
    const doneSessions = ch.sessions.filter(s => sessionProgress[s.id]?.status === "completed").length;
    const pct = ch.totalSessions > 0 ? Math.round((doneSessions / ch.totalSessions) * 100) : 0;
    const cp = chapterProgress[ch.id];

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

  const totalSessions = chaptersData.reduce((sum, ch) => sum + ch.totalSessions, 0);
  const completedSessions = chaptersData.reduce(
    (sum, ch) => sum + ch.sessions.filter(s => sessionProgress[s.id]?.status === "completed").length, 0
  );
  const completedChapters = enrichedChapters.filter(ch => ch.status === "completed").length;
  const progressPercent = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  /* ── Find current session ── */
  let currentChapter = enrichedChapters[0];
  let currentSession: ChapterSession = chaptersData[0].sessions[0];
  for (const ch of enrichedChapters) {
    if (ch.status === "completed") continue;
    if (!ch.unlocked) break;
    currentChapter = ch;
    for (const s of ch.sessions) {
      if (sessionProgress[s.id]?.status !== "completed") { currentSession = s; break; }
    }
    break;
  }

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  };

  return (
    <PlatformLayout>
      <div className="max-w-3xl mx-auto pb-12">

        {/* ── Greeting ── */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-semibold" style={{ color: C.text }}>
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm mt-1" style={{ color: C.textSec }}>
            {completedSessions > 0
              ? `You've completed ${completedSessions} of ${totalSessions} sessions — keep going!`
              : "Welcome to Voice³. Let's start building your executive voice."}
          </p>
        </motion.div>

        {/* ── Continue Learning Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl overflow-hidden mb-8"
          style={{ background: "linear-gradient(135deg, #1a2332, #1e2d42)", border: `1px solid rgba(201,168,76,0.4)` }}
        >
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Play className="h-4 w-4" style={{ color: C.gold }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.gold }}>
                Continue Learning
              </span>
            </div>
            <h2 className="text-lg font-semibold mb-1" style={{ color: C.text }}>
              {currentSession.title}
            </h2>
            <p className="text-sm mb-1 leading-relaxed" style={{ color: C.textSec }}>
              {currentSession.description}
            </p>
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className="text-xs" style={{ color: C.textMuted }}>
                Chapter {currentChapter.number} · {currentSession.durationMinutes} min
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${sessionTypeColors[currentSession.sessionType]}`}>
                {sessionTypeLabels[currentSession.sessionType]}
              </span>
            </div>
            <Button
              size="sm"
              className="rounded-lg font-semibold h-10 px-6 text-sm"
              style={{ background: `linear-gradient(135deg, ${C.gold}, #a88a3a)`, color: C.bg, border: "none" }}
              asChild
            >
              <Link to={`/capitulos/${currentChapter.id}/sessoes/${currentSession.id}`}>
                {currentChapter.pct > 0 ? "Continue" : "Start Session"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {/* Progress strip */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px]" style={{ color: C.textMuted }}>
                Chapter {currentChapter.number} Progress
              </span>
              <span className="text-[10px] font-semibold" style={{ color: C.gold }}>
                {currentChapter.doneSessions}/{currentChapter.totalSessions} sessions
              </span>
            </div>
            <ProgressBar pct={currentChapter.pct} />
          </div>
        </motion.div>

        {/* ── Quick Stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { icon: Flame, label: "Sessions", value: `${completedSessions}/${totalSessions}`, color: C.orange },
            { icon: BookOpen, label: "Chapters", value: `${completedChapters}/${chaptersData.length}`, color: C.blue },
            { icon: TrendingUp, label: "Progress", value: `${progressPercent}%`, color: C.gold },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-xl p-4 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <Icon className="h-4 w-4 mx-auto mb-2" style={{ color }} />
              <p className="text-lg font-bold" style={{ color: C.gold }}>{value}</p>
              <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: C.textMuted }}>{label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Voice DNA Summary (if diagnostic done) ── */}
        {aiEval && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl p-5 mb-8"
            style={{ background: C.card, border: `1px solid ${C.border}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4" style={{ color: C.gold }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.textMuted }}>Your Voice DNA</span>
              </div>
              <Link to="/app/voice-dna" className="text-xs font-medium hover:underline" style={{ color: C.gold }}>
                View Details →
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Clarity", value: aiEval.clarityIndex || "—" },
                { label: "WPM", value: aiEval.wordsPerMin || "—" },
                { label: "Vocabulary", value: aiEval.vocabRange || "—" },
                { label: "Tone", value: aiEval.tone || "—" },
              ].map(m => (
                <div key={m.label} className="rounded-lg p-3 text-center" style={{ background: "rgba(0,0,0,0.2)" }}>
                  <p className="text-xl font-bold" style={{ color: C.gold }}>{m.value}</p>
                  <p className="text-[10px] uppercase mt-0.5" style={{ color: C.textMuted }}>{m.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Your Programme ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" style={{ color: C.gold }} />
              <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: C.textMuted }}>
                Your Programme
              </h2>
            </div>
            <Link to="/capitulos" className="text-xs font-medium hover:underline" style={{ color: C.gold }}>
              View All →
            </Link>
          </div>

          <div className="space-y-2">
            {enrichedChapters.map((ch) => {
              const color = programmeColors[ch.programme] || C.gold;
              const isDone = ch.status === "completed";
              const isLocked = !ch.unlocked;

              return (
                <Link
                  key={ch.id}
                  to={ch.unlocked ? `/capitulos/${ch.id}` : "#"}
                  onClick={e => { if (!ch.unlocked) e.preventDefault(); }}
                  className="flex items-center gap-4 rounded-xl p-4 transition-all duration-200 group"
                  style={{
                    background: ch.status === "in_progress" ? `${color}08` : C.card,
                    border: `1px solid ${ch.status === "in_progress" ? `${color}25` : C.border}`,
                    opacity: isLocked ? 0.4 : 1,
                    cursor: isLocked ? "default" : "pointer",
                  }}
                >
                  {/* Status icon */}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: isDone ? `${C.green}15` : `${color}12`,
                      border: `1px solid ${isDone ? `${C.green}25` : `${color}20`}`,
                    }}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4" style={{ color: C.green }} />
                    ) : isLocked ? (
                      <Lock className="h-3.5 w-3.5" style={{ color: C.textMuted }} />
                    ) : (
                      <span className="text-xs font-bold" style={{ color }}>{ch.number}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: C.text }}>
                      {ch.title}
                    </p>
                    <p className="text-xs" style={{ color: C.textMuted }}>
                      {isLocked
                        ? "Complete previous chapter to unlock"
                        : `${ch.doneSessions}/${ch.totalSessions} sessions · ${ch.pct}%`}
                    </p>
                  </div>

                  {/* Progress */}
                  {ch.unlocked && (
                    <div className="w-16 shrink-0">
                      <ProgressBar pct={ch.pct} height={3} />
                    </div>
                  )}

                  {ch.unlocked && (
                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: C.textMuted }} />
                  )}
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* ── Quick Actions ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: C.textMuted }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Target, label: "Programmes", desc: "Browse all", to: "/app/programmes" },
              { icon: Sparkles, label: "Toolkit", desc: "Quick tools", to: "/app/toolkit" },
              { icon: BarChart3, label: "Performance", desc: "Your stats", to: "/app/desempenho" },
              { icon: Clock, label: "Live Class", desc: "Book a session", to: "/app/aulas" },
            ].map(({ icon: Icon, label, desc, to }) => (
              <Link
                key={to}
                to={to}
                className="rounded-xl p-4 text-center transition-all duration-200 hover:-translate-y-0.5 group"
                style={{ background: C.card, border: `1px solid ${C.border}` }}
              >
                <Icon className="h-5 w-5 mx-auto mb-2 transition-colors group-hover:text-[var(--gold)]" style={{ color: C.textMuted }} />
                <p className="text-xs font-semibold" style={{ color: C.text }}>{label}</p>
                <p className="text-[10px]" style={{ color: C.textMuted }}>{desc}</p>
              </Link>
            ))}
          </div>
        </motion.div>

      </div>
    </PlatformLayout>
  );
};

export default MeuCurso;
