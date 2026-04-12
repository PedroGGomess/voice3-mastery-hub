import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { chaptersData, sessionTypeLabels, sessionTypeColors } from "@/lib/chaptersData";
import {
  Lock, CheckCircle2, ChevronDown, ChevronRight,
  Play, ArrowRight, Target, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import PlatformLayout from "@/components/PlatformLayout";

type ChapterStatus = 'locked' | 'in_progress' | 'completed' | 'available';

export default function ChaptersOverview() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const userId = currentUser?.id || '';

  const [chapterProgress, setChapterProgress] = useState<Record<string, { status: string; completedAt?: string }>>({});
  const [sessionProgress, setSessionProgress] = useState<Record<string, { status: string; score?: number }>>({});
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [hasAiEval, setHasAiEval] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`voice3_chapter_progress_${userId}`);
      if (stored) setChapterProgress(JSON.parse(stored));
      else {
        // Chapter 1 always available (diagnostic)
        setChapterProgress({ ch1: { status: 'available' } });
      }
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
    // Check if previous chapter is completed
    const prevChapter = chaptersData[index - 1];
    const prevStatus = chapterProgress[prevChapter.id];
    if (prevStatus?.status === 'completed') return 'available';
    return 'locked';
  };

  const getCompletedSessions = (chapterId: string) => {
    const chapter = chaptersData.find(c => c.id === chapterId);
    if (!chapter) return 0;
    // If the chapter is marked completed, all sessions are completed
    if (chapterProgress[chapterId]?.status === 'completed') return chapter.totalSessions;
    return chapter.sessions.filter(s => sessionProgress[s.id]?.status === 'completed').length;
  };

  const totalCompleted = chaptersData.reduce((acc, ch) => {
    return acc + (chapterProgress[ch.id]?.status === 'completed' ? 1 : 0);
  }, 0);

  return (
    <PlatformLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-xs text-[#B89A5A] tracking-[0.2em] uppercase font-medium mb-1">Programa VOICE³</p>
        <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] tracking-tight mb-1">Os Teus Capítulos</h1>
        <p className="text-sm text-[#8E96A3]">{totalCompleted} de {chaptersData.length} capítulos concluídos</p>
      </motion.div>

      {/* AI personalisation banner */}
      {hasAiEval && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-[#B89A5A]/5 border border-[#B89A5A]/20 mb-5">
          <Sparkles className="h-4 w-4 text-[#B89A5A] shrink-0" />
          <p className="text-xs text-[#F4F2ED]">
            <span className="font-semibold text-[#B89A5A]">O teu percurso foi personalizado</span> com base nos resultados do diagnóstico.
          </p>
        </motion.div>
      )}

      {/* Overall progress */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-xl bg-[#1C1F26] border border-white/5 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Progresso Geral</span>
          <span className="text-xs font-semibold text-[#B89A5A]">{totalCompleted}/{chaptersData.length} cap. · {Math.round((totalCompleted / chaptersData.length) * 100)}%</span>
        </div>
        <Progress value={(totalCompleted / chaptersData.length) * 100} className="h-1.5 bg-white/10" />
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
              <div className={`rounded-xl border overflow-hidden transition-all ${isLocked ? 'border-white/5 bg-[#1C1F26]/60' : status === 'completed' ? 'border-[#B89A5A]/20 bg-[#1C1F26]' : 'border-[#B89A5A]/30 bg-[#1C1F26]'}`}>
                {/* Chapter header */}
                <button
                  onClick={() => !isLocked && setExpandedChapter(isExpanded ? null : chapter.id)}
                  className={`w-full flex items-center gap-4 p-4 text-left transition-colors ${isLocked ? 'cursor-not-allowed' : 'hover:bg-white/[0.02]'}`}
                  disabled={isLocked}
                >
                  {/* Number / status icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    status === 'completed' ? 'bg-[#B89A5A]/10' :
                    status === 'locked' ? 'bg-white/5' :
                    chapter.isDiagnostic ? 'bg-purple-400/10' : 'bg-[#B89A5A]/10'
                  }`}>
                    {status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-[#B89A5A]" />
                    ) : status === 'locked' ? (
                      <Lock className="h-4 w-4 text-white/20" />
                    ) : (
                      <span className={`font-bold text-sm ${chapter.isDiagnostic ? 'text-purple-400' : 'text-[#B89A5A]'}`}>
                        {chapter.number}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-semibold text-sm ${isLocked ? 'text-white/30' : 'text-[#F4F2ED]'}`}>
                        Cap. {chapter.number} — {chapter.title}
                      </h3>
                      {chapter.isDiagnostic && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-400 font-medium">Diagnóstico</span>
                      )}
                      {status === 'completed' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B89A5A]/10 border border-[#B89A5A]/20 text-[#B89A5A] font-medium">✓ Concluído</span>
                      )}
                    </div>
                    {!isLocked && (
                      <p className={`text-xs mt-0.5 ${isLocked ? 'text-white/20' : 'text-[#8E96A3]'}`}>
                        {completedSessions}/{chapter.totalSessions} sessões
                        {status === 'in_progress' || status === 'completed' ? <> · {sessionPct}%</> : null}
                      </p>
                    )}
                    {isLocked && (
                      <p className="text-xs text-white/20 mt-0.5">Completa o capítulo anterior para desbloquear</p>
                    )}
                    {!isLocked && (
                      <div className="mt-1.5 h-1 bg-white/10 rounded-full overflow-hidden max-w-xs">
                        <div className="h-full rounded-full bg-[#B89A5A] transition-all" style={{ width: `${sessionPct}%` }} />
                      </div>
                    )}
                  </div>

                  {!isLocked && (
                    <div className="shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-[#8E96A3]" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-[#8E96A3]" />
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
                      <div className="border-t border-white/5 divide-y divide-white/[0.04]">
                        {chapter.sessions.map((session, si) => {
                          const sessStatus = sessionProgress[session.id]?.status;
                          const sessScore = sessionProgress[session.id]?.score;
                          const isDiagnosticSess = session.sessionType === 'diagnostic';

                          return (
                            <div key={session.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                              <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-[10px] font-bold ${
                                sessStatus === 'completed' ? 'bg-[#B89A5A]/10 text-[#B89A5A]' :
                                'bg-white/5 text-[#8E96A3]'
                              }`}>
                                {sessStatus === 'completed' ? '✓' : `${si + 1}`}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className={`text-xs font-medium ${sessStatus === 'completed' ? 'text-white/60' : 'text-[#F4F2ED]'}`}>
                                    {session.title}
                                  </p>
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${sessionTypeColors[session.sessionType]}`}>
                                    {sessionTypeLabels[session.sessionType]}
                                  </span>
                                </div>
                                {sessScore && <p className="text-[10px] text-[#B89A5A] mt-0.5">{sessScore}%</p>}
                              </div>
                              <div className="shrink-0">
                                {isDiagnosticSess ? (
                                  <Button size="sm" className="h-6 text-[10px] px-2.5 bg-purple-400/10 text-purple-400 hover:bg-purple-400/20 border-0" asChild>
                                    <Link to="/sessoes/diagnostico">
                                      {sessStatus === 'completed' ? 'Rever' : 'Iniciar'}
                                    </Link>
                                  </Button>
                                ) : (
                                  <Button size="sm" className={`h-6 text-[10px] px-2.5 border-0 ${
                                    sessStatus === 'completed' ? 'bg-[#B89A5A]/10 text-[#B89A5A] hover:bg-[#B89A5A]/20' :
                                    'bg-white/5 text-[#F4F2ED] hover:bg-white/10'
                                  }`} asChild>
                                    <Link to={`/capitulos/${chapter.id}/sessoes/${session.id}`}>
                                      {sessStatus === 'completed' ? 'Rever' : 'Iniciar'}
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
    </PlatformLayout>
  );
}
