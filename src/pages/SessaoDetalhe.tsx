import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PlatformLayout from "@/components/PlatformLayout";
import SessionDetail from "@/components/SessionDetail";
import { ArrowLeft, ArrowRight, Clock, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { sessionsData } from "@/lib/sessionsData";
import { chaptersData, sessionTypeLabels, sessionTypeColors } from "@/lib/chaptersData";
import { toast } from "sonner";

const SessaoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "";

  const sessionId = parseInt(id || "0");
  const sessionIndex = sessionsData.findIndex((s) => s.id === sessionId);
  const session = sessionIndex !== -1 ? sessionsData[sessionIndex] : undefined;

  // Find matching chapter session by title for rich metadata
  const chapterSessionMatch = (() => {
    if (!session) return null;
    for (const chapter of chaptersData) {
      const s = chapter.sessions.find(
        (cs) => cs.title.toLowerCase() === session.title.toLowerCase()
      );
      if (s) return { chapter, chapterSession: s };
    }
    return null;
  })();

  const chapter = chapterSessionMatch?.chapter ?? null;
  const chapterSession = chapterSessionMatch?.chapterSession ?? null;

  const prevSession = sessionIndex > 0 ? sessionsData[sessionIndex - 1] : null;
  const nextSession = sessionIndex !== -1 && sessionIndex < sessionsData.length - 1 ? sessionsData[sessionIndex + 1] : null;

  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [existingScore, setExistingScore] = useState<number | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`voice3_sessions_progress_${userId}`);
      if (stored) {
        const progress = JSON.parse(stored);
        if (progress[sessionId]?.completed) {
          setAlreadyCompleted(true);
          setExistingScore(progress[sessionId].score);
        }
      }
    } catch (_e) {
      // ignore
    }
  }, [userId, sessionId]);

  const handleComplete = (score: number) => {
    try {
      const stored = localStorage.getItem(`voice3_sessions_progress_${userId}`);
      const progress = stored ? JSON.parse(stored) : {};
      progress[sessionId] = {
        completed: true,
        score,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(`voice3_sessions_progress_${userId}`, JSON.stringify(progress));
    } catch (_e) {
      // ignore
    }
    setAlreadyCompleted(true);
    setExistingScore(score);
    toast.success(`Session complete! Score: ${score}%`, {
      description: "Your progress has been saved.",
    });
  };

  if (!session) {
    return (
      <PlatformLayout>
        <div className="text-center py-20">
          <h1 className="font-serif text-2xl font-bold mb-4 text-[#F4F2ED]">
            Session not found
          </h1>
          <Link
            to="/app/sessoes"
            className="text-[#B89A5A] hover:text-[#d4ba6a] text-sm transition-colors"
          >
            ← Back to Sessions
          </Link>
        </div>
      </PlatformLayout>
    );
  }

  // Access control: first session is always accessible; others require previous to be done
  let canAccess = session.id === 1;
  if (!canAccess) {
    try {
      const stored = localStorage.getItem(`voice3_sessions_progress_${userId}`);
      if (stored) {
        const progress = JSON.parse(stored);
        if (progress[session.id - 1]?.completed) canAccess = true;
      }
    } catch (_e) {
      // ignore
    }
  }

  if (!canAccess) {
    return (
      <PlatformLayout>
        <div className="text-center py-20">
          <p className="text-[#8E96A3] mb-4">
            Complete the previous session to unlock this one.
          </p>
          <Link
            to="/app/sessoes"
            className="text-[#B89A5A] hover:text-[#d4ba6a] text-sm transition-colors"
          >
            ← Back to Sessions
          </Link>
        </div>
      </PlatformLayout>
    );
  }

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mt-1 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#8E96A3] hover:text-[#F4F2ED] hover:bg-white/10 transition-all shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1 min-w-0">
            {/* Chapter breadcrumb */}
            {chapter && (
              <p className="text-xs text-[#B89A5A] tracking-[0.12em] uppercase font-medium mb-1.5">
                <BookOpen className="inline h-3 w-3 mr-1 opacity-70" />
                {chapter.title}
                {chapterSession && (
                  <span className="text-[#8E96A3] font-normal ml-1">
                    · Session {chapterSession.number} of {chapter.totalSessions}
                  </span>
                )}
              </p>
            )}
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <span className="text-xs text-[#B89A5A] tracking-[0.15em] uppercase font-medium border border-[#B89A5A]/30 px-2.5 py-0.5 rounded">
                Session {session.id}
              </span>
              <span className="text-xs text-[#8E96A3] flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {session.time}
              </span>
              {/* Session type badge */}
              {chapterSession && (
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${sessionTypeColors[chapterSession.sessionType]}`}>
                  {sessionTypeLabels[chapterSession.sessionType]}
                </span>
              )}
              {alreadyCompleted && existingScore !== null && (
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-400/10 px-2 py-0.5 rounded">
                  ✓ {existingScore}%
                </span>
              )}
            </div>
            <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] leading-tight">
              {session.title}
            </h1>
            <p className="text-sm text-[#8E96A3] mt-1">{session.objective}</p>

            {/* Progress indicator within chapter */}
            {chapter && chapterSession && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#8E96A3]">
                    Progress in {chapter.title}
                  </span>
                  <span className="text-xs text-[#B89A5A] font-semibold">
                    {chapterSession.number}/{chapter.totalSessions}
                  </span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: chapter.totalSessions }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i < chapterSession.number
                          ? 'bg-[#B89A5A]'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Session Detail Component */}
        <SessionDetail
          session={session}
          alreadyCompleted={alreadyCompleted}
          existingScore={existingScore}
          onComplete={handleComplete}
        />

        {/* Previous / Next navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
          {prevSession ? (
            <Link
              to={`/app/sessoes/${prevSession.id}`}
              className="flex items-center gap-2 text-sm text-[#8E96A3] hover:text-[#F4F2ED] transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <div>
                <div className="text-xs text-[#8E96A3]/60 mb-0.5">Previous</div>
                <div className="font-medium truncate max-w-[200px]">{prevSession.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextSession ? (
            <Link
              to={`/app/sessoes/${nextSession.id}`}
              className="flex items-center gap-2 text-sm text-[#8E96A3] hover:text-[#F4F2ED] transition-colors group text-right"
            >
              <div>
                <div className="text-xs text-[#8E96A3]/60 mb-0.5">Next</div>
                <div className="font-medium truncate max-w-[200px]">{nextSession.title}</div>
              </div>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </motion.div>
    </PlatformLayout>
  );
};

export default SessaoDetalhe;
