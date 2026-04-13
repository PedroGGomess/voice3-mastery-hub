import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { chaptersData, sessionTypeLabels, sessionTypeColors } from "@/lib/chaptersData";
import {
  Lock, CheckCircle2, ChevronDown, ChevronRight,
  Play, ArrowRight, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PlatformLayout from "@/components/PlatformLayout";

type ChapterStatus = 'locked' | 'in_progress' | 'completed' | 'available';

export default function ChaptersOverview() {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || '';

  const [chapterProgress, setChapterProgress] = useState<Record<string, { status: string; completedAt?: string }>>({});
  const [sessionProgress, setSessionProgress] = useState<Record<string, { status: string; score?: number }>>({});
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [hasAiEval, setHasAiEval] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`voice3_chapter_progress_${userId}`);
      if (stored) setChapterProgress(JSON.parse(stored));
      else setChapterProgress({ ch1: { status: 'available' } });
    } catch (_e) {}

    try {
      const stored = localStorage.getItem(`voice3_session_progress_${userId}`);
      if (stored) setSessionProgress(JSON.parse(stored));
    } catch (_e) {}

    try {
      const evalStored = localStorage.getItem(`voice3_ai_evaluation_${userId}`);
      if (evalStored) setHasAiEval(true);
    } catch (_e) {}
  }, [userId]);

  const getChapterStatus = (chapterId: string, index: number): ChapterStatus => {
    const cp = chapterProgress[chapterId];
    if (cp?.status === 'completed') return 'completed';
    if (cp?.status === 'in_progress' || cp?.status === 'available') return index === 0 ? 'available' : 'in_progress';
    if (index === 0) return 'available';
    const prevChapter = chaptersData[index - 1];
    const prevStatus = chapterProgress[prevChapter.id];
    if (prevStatus?.status === 'completed') return 'available';
    return 'locked';
  };

  const getCompletedSessions = (chapterId: string) => {
    const chapter = chaptersData.find(c => c.id === chapterId);
    if (!chapter) return 0;
    if (chapterProgress[chapterId]?.status === 'completed') return chapter.totalSessions;
    return chapter.sessions.filter(s => sessionProgress[s.id]?.status === 'completed').length;
  };

  const totalCompleted = chaptersData.reduce((acc, ch) => {
    return acc + (chapterProgress[ch.id]?.status === 'completed' ? 1 : 0);
  }, 0);

  return (
    <PlatformLayout>
      <div className="max-w-3xl mx-auto pb-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
            My Programme
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {totalCompleted} of {chaptersData.length} chapters completed
          </p>
        </motion.div>

        {/* AI personalisation banner */}
        {hasAiEval && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="flex items-center gap-3 p-3 rounded-xl mb-5"
            style={{ background: "var(--gold-10)", border: "1px solid rgba(201,168,76,0.2)" }}
          >
            <Sparkles className="h-4 w-4 shrink-0" style={{ color: "var(--gold)" }} />
            <p className="text-xs" style={{ color: "var(--text-primary)" }}>
              <span className="font-semibold" style={{ color: "var(--gold)" }}>Your path has been personalised</span> based on your diagnostic results.
            </p>
          </motion.div>
        )}

        {/* Overall progress */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl p-4 mb-6"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Overall Progress</span>
            <span className="text-xs font-semibold" style={{ color: "var(--gold)" }}>
              {totalCompleted}/{chaptersData.length} chapters · {Math.round((totalCompleted / chaptersData.length) * 100)}%
            </span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(totalCompleted / chaptersData.length) * 100}%`,
                background: "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />
          </div>
        </motion.div>

        {/* Chapters list */}
        <div className="space-y-3">
          {chaptersData.map((chapter, index) => {
            const status = getChapterStatus(chapter.id, index);
            const completedSessions = getCompletedSessions(chapter.id);
            const isExpanded = expandedChapter === chapter.id;
            const isLocked = status === 'locked';
            const sessionPct = chapter.totalSessions > 0 ? Math.round((completedSessions / chapter.totalSessions) * 100) : 0;

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <div
                  className="rounded-xl border overflow-hidden transition-all"
                  style={{
                    borderColor: isLocked ? "var(--border)" : status === 'completed' ? "rgba(201,168,76,0.2)" : "rgba(201,168,76,0.3)",
                    background: "var(--bg-elevated)",
                    opacity: isLocked ? 0.5 : 1,
                  }}
                >
                  {/* Chapter header */}
                  <button
                    onClick={() => !isLocked && setExpandedChapter(isExpanded ? null : chapter.id)}
                    className="w-full flex items-center gap-4 p-4 text-left transition-colors hover:bg-white/[0.02]"
                    disabled={isLocked}
                    style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: status === 'completed' ? 'rgba(63,185,80,0.1)' :
                          status === 'locked' ? 'rgba(255,255,255,0.04)' :
                          chapter.isDiagnostic ? 'rgba(188,140,255,0.1)' : 'var(--gold-10)',
                      }}
                    >
                      {status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5" style={{ color: "#3fb950" }} />
                      ) : status === 'locked' ? (
                        <Lock className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                      ) : (
                        <span className="font-bold text-sm" style={{ color: chapter.isDiagnostic ? '#bc8cff' : 'var(--gold)' }}>
                          {chapter.number}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                          Chapter {chapter.number} — {chapter.title}
                        </h3>
                        {chapter.isDiagnostic && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(188,140,255,0.1)", border: "1px solid rgba(188,140,255,0.2)", color: "#bc8cff" }}>
                            Diagnostic
                          </span>
                        )}
                        {status === 'completed' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(63,185,80,0.1)", color: "#3fb950" }}>
                            Completed
                          </span>
                        )}
                      </div>
                      {!isLocked && (
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {completedSessions}/{chapter.totalSessions} sessions · {sessionPct}%
                        </p>
                      )}
                      {isLocked && (
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Complete previous chapter to unlock</p>
                      )}
                      {!isLocked && (
                        <div className="mt-1.5 h-1 rounded-full overflow-hidden max-w-xs" style={{ background: "var(--border)" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${sessionPct}%`, background: "var(--gold)" }} />
                        </div>
                      )}
                    </div>

                    {!isLocked && (
                      <div className="shrink-0">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                        ) : (
                          <ChevronRight className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Sessions list */}
                  <AnimatePresence>
                    {isExpanded && !isLocked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div style={{ borderTop: "1px solid var(--border)" }}>
                          {chapter.sessions.map((session, si) => {
                            const sessStatus = sessionProgress[session.id]?.status;
                            const sessScore = sessionProgress[session.id]?.score;
                            const isDiagnosticSess = session.sessionType === 'diagnostic';

                            return (
                              <div
                                key={session.id}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                                style={{ borderBottom: si < chapter.sessions.length - 1 ? "1px solid var(--border)" : undefined }}
                              >
                                <div
                                  className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-[10px] font-bold"
                                  style={{
                                    background: sessStatus === 'completed' ? 'var(--gold-10)' : 'rgba(255,255,255,0.04)',
                                    color: sessStatus === 'completed' ? 'var(--gold)' : 'var(--text-muted)',
                                  }}
                                >
                                  {sessStatus === 'completed' ? '✓' : `${si + 1}`}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-xs font-medium" style={{ color: sessStatus === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                                      {session.title}
                                    </p>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${sessionTypeColors[session.sessionType]}`}>
                                      {sessionTypeLabels[session.sessionType]}
                                    </span>
                                  </div>
                                  {sessScore != null && <p className="text-[10px] mt-0.5" style={{ color: "var(--gold)" }}>{sessScore}%</p>}
                                </div>
                                <div className="shrink-0">
                                  {isDiagnosticSess ? (
                                    <Button size="sm" className="h-6 text-[10px] px-2.5 border-0" style={{ background: "rgba(188,140,255,0.1)", color: "#bc8cff" }} asChild>
                                      <Link to="/sessoes/diagnostico">
                                        {sessStatus === 'completed' ? 'Review' : 'Start'}
                                      </Link>
                                    </Button>
                                  ) : (
                                    <Button size="sm" className="h-6 text-[10px] px-2.5 border-0" style={{
                                      background: sessStatus === 'completed' ? 'var(--gold-10)' : 'rgba(255,255,255,0.04)',
                                      color: sessStatus === 'completed' ? 'var(--gold)' : 'var(--text-primary)',
                                    }} asChild>
                                      <Link to={`/capitulos/${chapter.id}/sessoes/${session.id}`}>
                                        {sessStatus === 'completed' ? 'Review' : 'Start'}
                                      </Link>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PlatformLayout>
  );
}
