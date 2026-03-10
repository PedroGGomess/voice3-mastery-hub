import PlatformLayout from "@/components/PlatformLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Play, CheckCircle2, Lock, Clock, ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatWidget from "@/components/ChatWidget";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { chaptersData, sessionTypeLabels, sessionTypeColors } from "@/lib/chaptersData";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

type FilterTab = "todas" | "concluidas" | "progresso" | "bloqueadas";

const Sessoes = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "";
  const [activeTab, setActiveTab] = useState<FilterTab>("todas");
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  // Load chapter & session progress from localStorage
  let chapterProgress: Record<string, { status: string; completedAt?: string }> = {};
  let sessionProgress: Record<string, { status: string; score?: number }> = {};
  try {
    const stored = localStorage.getItem(`voice3_chapter_progress_${userId}`);
    if (stored) chapterProgress = JSON.parse(stored);
  } catch (_e) {}
  try {
    const stored = localStorage.getItem(`voice3_session_progress_${userId}`);
    if (stored) sessionProgress = JSON.parse(stored);
  } catch (_e) {}

  // Also check old session progress format
  let oldProgress: Record<number, { completed: boolean; score: number }> = {};
  try {
    const stored = localStorage.getItem(`voice3_sessions_progress_${userId}`);
    if (stored) oldProgress = JSON.parse(stored);
  } catch (_e) {}

  const getChapterStatus = (chapterId: string, index: number): "completed" | "in_progress" | "available" | "locked" => {
    const cp = chapterProgress[chapterId];
    if (cp?.status === 'completed') return 'completed';
    if (cp?.status === 'in_progress' || cp?.status === 'available') return index === 0 ? 'available' : 'in_progress';
    if (index === 0) return 'available';
    const prevChapter = chaptersData[index - 1];
    const prevStatus = chapterProgress[prevChapter.id];
    if (prevStatus?.status === 'completed') return 'available';
    return 'locked';
  };

  const getSessionStatus = (sessionId: string): "completed" | "in_progress" | "locked" => {
    if (sessionProgress[sessionId]?.status === 'completed') return 'completed';
    if (sessionProgress[sessionId]?.status === 'in_progress') return 'in_progress';
    return 'locked';
  };

  const getCompletedSessions = (chapterId: string) => {
    const chapter = chaptersData.find(c => c.id === chapterId);
    if (!chapter) return 0;
    return chapter.sessions.filter(s => sessionProgress[s.id]?.status === 'completed').length;
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  };

  // Filter logic
  const getChapterMatchesFilter = (chapterId: string, index: number) => {
    const status = getChapterStatus(chapterId, index);
    const chapter = chaptersData.find(c => c.id === chapterId)!;
    if (activeTab === "todas") return true;
    if (activeTab === "concluidas") return status === "completed" || chapter.sessions.some(s => getSessionStatus(s.id) === "completed");
    if (activeTab === "progresso") return status === "in_progress" || status === "available" || chapter.sessions.some(s => getSessionStatus(s.id) === "in_progress");
    if (activeTab === "bloqueadas") return status === "locked";
    return true;
  };

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "todas", label: "Todas" },
    { key: "concluidas", label: "Concluídas" },
    { key: "progresso", label: "Em Progresso" },
    { key: "bloqueadas", label: "Bloqueadas" },
  ];

  const totalCompleted = chaptersData.reduce((acc, ch) => acc + (chapterProgress[ch.id]?.status === 'completed' ? 1 : 0), 0);

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#F4F2ED]">My Programme</h1>
            <p className="text-muted-foreground mt-1">Todas as sessões organizadas por capítulo. Treina ao teu ritmo.</p>
          </div>
          <Link
            to="/capitulos"
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B89A5A]/10 border border-[#B89A5A]/30 text-sm text-[#B89A5A] hover:bg-[#B89A5A]/20 transition-all font-medium"
          >
            Ver por Capítulos →
          </Link>
        </div>

        {/* Overall progress */}
        <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Progresso Geral</span>
            <span className="text-xs font-semibold text-[#B89A5A]">{totalCompleted}/{chaptersData.length} cap.</span>
          </div>
          <Progress value={(totalCompleted / chaptersData.length) * 100} className="h-1.5 bg-white/10" />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.key ? "bg-[#B89A5A] text-[#0B1A2A]" : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chapters accordion */}
        <div className="space-y-3">
          {chaptersData.map((chapter, index) => {
            if (!getChapterMatchesFilter(chapter.id, index)) return null;

            const status = getChapterStatus(chapter.id, index);
            const isLocked = status === "locked";
            const isExpanded = expandedChapters.has(chapter.id);
            const completedSessions = getCompletedSessions(chapter.id);
            const sessionPct = chapter.totalSessions > 0 ? Math.round((completedSessions / chapter.totalSessions) * 100) : 0;

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <div className={`rounded-xl border overflow-hidden transition-all ${
                  isLocked ? 'border-white/5 bg-[#1C1F26]/60' :
                  status === 'completed' ? 'border-[#B89A5A]/20 bg-[#1C1F26]' :
                  'border-[#B89A5A]/30 bg-[#1C1F26]'
                }`}>
                  {/* Chapter header */}
                  <button
                    onClick={() => !isLocked && toggleChapter(chapter.id)}
                    className={`w-full flex items-center gap-4 p-4 text-left transition-colors ${isLocked ? 'cursor-not-allowed' : 'hover:bg-white/[0.02]'}`}
                    disabled={isLocked}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      status === 'completed' ? 'bg-[#B89A5A]/10' :
                      isLocked ? 'bg-white/5' :
                      chapter.isDiagnostic ? 'bg-purple-400/10' : 'bg-[#B89A5A]/10'
                    }`}>
                      {status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-[#B89A5A]" />
                      ) : isLocked ? (
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
                        <p className="text-xs mt-0.5 text-[#8E96A3]">
                          {completedSessions}/{chapter.totalSessions} sessões
                          {(status === 'in_progress' || status === 'completed') && <> · {sessionPct}%</>}
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

                  {/* Sessions list (expanded) */}
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
                            const sessStatus = getSessionStatus(session.id);
                            const sessScore = sessionProgress[session.id]?.score;
                            const isDiagnosticSess = session.sessionType === 'diagnostic';
                            const isProfessorSess = session.sessionType === 'professor_session';

                            return (
                              <div key={session.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-[10px] font-bold ${
                                  sessStatus === 'completed' ? 'bg-[#B89A5A]/10 text-[#B89A5A]' :
                                  sessStatus === 'in_progress' ? 'bg-[#B89A5A]/10 text-[#B89A5A]' :
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
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-[#8E96A3]">{session.durationMinutes} min</span>
                                    {sessScore != null && <span className="text-[10px] text-[#B89A5A]">{sessScore}%</span>}
                                  </div>
                                </div>
                                <div className="shrink-0">
                                  {isDiagnosticSess ? (
                                    <Button size="sm" className="h-6 text-[10px] px-2.5 bg-purple-400/10 text-purple-400 hover:bg-purple-400/20 border-0" asChild>
                                      <Link to="/sessoes/diagnostico">
                                        {sessStatus === 'completed' ? 'Rever' : 'Iniciar'} <ArrowRight className="ml-1 h-3 w-3" />
                                      </Link>
                                    </Button>
                                  ) : sessStatus === 'completed' ? (
                                    <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-[#B89A5A]/10 text-[#B89A5A]">
                                      Concluída
                                    </span>
                                  ) : sessStatus === 'in_progress' ? (
                                    <Button size="sm" className="h-6 text-[10px] px-2.5 bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] border-0" asChild>
                                      <Link to={`/app/sessao/${session.id}`}>
                                        Continuar <ArrowRight className="ml-1 h-3 w-3" />
                                      </Link>
                                    </Button>
                                  ) : (
                                    <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-white/5 text-[#8E96A3] flex items-center gap-1">
                                      <Lock className="h-3 w-3" /> Bloqueada
                                    </span>
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
      </motion.div>
      <ChatWidget />
    </PlatformLayout>
  );
};

export default Sessoes;
