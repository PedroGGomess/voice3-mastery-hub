import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getChapterById, sessionTypeLabels, sessionTypeColors } from "@/lib/chaptersData";
import { ArrowLeft, CheckCircle2, Lock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import PlatformLayout from "@/components/PlatformLayout";

export default function ChapterDetail() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const userId = currentUser?.id || '';

  const chapter = getChapterById(chapterId || '');

  const [sessionProgress, setSessionProgress] = useState<Record<string, { status: string; score?: number }>>({});
  const [chapterProgress, setChapterProgress] = useState<Record<string, { status: string; completedAt?: string }>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`voice3_session_progress_${userId}`);
      if (stored) setSessionProgress(JSON.parse(stored));
    } catch (_e) {}
    try {
      const stored = localStorage.getItem(`voice3_chapter_progress_${userId}`);
      if (stored) setChapterProgress(JSON.parse(stored));
    } catch (_e) {}
  }, [userId]);

  if (!chapter) {
    return (
      <PlatformLayout>
        <div className="flex flex-col items-center justify-center py-24 text-[#8E96A3]">
          <p className="text-sm">Capítulo não encontrado.</p>
          <Link to="/capitulos" className="mt-3 text-xs text-[#B89A5A] hover:underline">← Voltar aos capítulos</Link>
        </div>
      </PlatformLayout>
    );
  }

  const isChapterCompleted = chapterProgress[chapter.id]?.status === 'completed';
  const completedSessions = isChapterCompleted
    ? chapter.totalSessions
    : chapter.sessions.filter(s => sessionProgress[s.id]?.status === 'completed').length;
  const sessionPct = chapter.totalSessions > 0 ? Math.round((completedSessions / chapter.totalSessions) * 100) : 0;

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link to="/capitulos" className="inline-flex items-center gap-2 text-xs text-[#8E96A3] hover:text-[#F4F2ED] mb-4 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />Voltar aos capítulos
        </Link>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${chapter.isDiagnostic ? 'bg-purple-400/10' : 'bg-[#B89A5A]/10'}`}>
            <span className={`font-bold text-lg ${chapter.isDiagnostic ? 'text-purple-400' : 'text-[#B89A5A]'}`}>{chapter.number}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED]">Cap. {chapter.number} — {chapter.title}</h1>
              {chapter.isDiagnostic && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-400 font-medium">Diagnóstico</span>
              )}
            </div>
            <p className="text-sm text-[#8E96A3] mt-1">{chapter.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-xl bg-[#1C1F26] border border-white/5 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Progresso</span>
          <span className="text-xs font-semibold text-[#B89A5A]">{completedSessions}/{chapter.totalSessions} sessões · {sessionPct}%</span>
        </div>
        <Progress value={sessionPct} className="h-1.5 bg-white/10" />
      </motion.div>

      {/* Sessions list */}
      <div className="rounded-xl bg-[#1C1F26] border border-white/5 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5">
          <h2 className="text-xs font-semibold text-[#8E96A3] uppercase tracking-wider">Sessões</h2>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {chapter.sessions.map((session, i) => {
            const sessStatus = isChapterCompleted ? 'completed' : sessionProgress[session.id]?.status;
            const sessScore = sessionProgress[session.id]?.score ?? (isChapterCompleted ? 100 : undefined);
            const isDiag = session.sessionType === 'diagnostic';

            return (
              <motion.div key={session.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${sessStatus === 'completed' ? 'bg-[#B89A5A]/10' : 'bg-white/5'}`}>
                    {sessStatus === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-[#B89A5A]" />
                    ) : (
                      <span className="text-xs font-bold text-[#8E96A3]">{i + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-medium text-sm ${sessStatus === 'completed' ? 'text-white/60' : 'text-[#F4F2ED]'}`}>
                        {session.title}
                      </h3>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${sessionTypeColors[session.sessionType]}`}>
                        {sessionTypeLabels[session.sessionType]}
                      </span>
                    </div>
                    <p className="text-xs text-[#8E96A3] mt-0.5">{session.description}</p>
                    {sessScore && <p className="text-xs text-[#B89A5A] mt-0.5">Score: {sessScore}%</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-[#8E96A3] flex items-center gap-1 hidden sm:flex">
                      <Clock className="h-3 w-3" />{session.durationMinutes}min
                    </span>
                    {isDiag ? (
                      <Button size="sm" className="h-7 text-xs px-3 bg-purple-400/10 text-purple-400 hover:bg-purple-400/20 border-0" asChild>
                        <Link to="/sessoes/diagnostico">{sessStatus === 'completed' ? 'Rever' : 'Iniciar'}</Link>
                      </Button>
                    ) : (
                      <span className={`text-xs px-2 py-1 rounded font-medium ${sessStatus === 'completed' ? 'bg-[#B89A5A]/10 text-[#B89A5A]' : 'bg-white/5 text-[#8E96A3]'}`}>
                        {sessStatus === 'completed' ? '✓ Concluída' : 'Em breve'}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PlatformLayout>
  );
}
