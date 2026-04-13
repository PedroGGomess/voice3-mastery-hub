import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Play, BookOpen, Target, Zap, BarChart3, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { chaptersData, sessionTypeLabels, sessionTypeColors, type Session as ChapterSession } from "@/lib/chaptersData";
import SessionAIChat from "@/components/SessionAIChat";
import PlatformLayout from "@/components/PlatformLayout";
import { toast } from "sonner";

const C = {
  bg: "var(--bg-base)",
  card: "var(--bg-elevated)",
  border: "var(--border)",
  gold: "var(--gold)",
  text: "var(--text-primary)",
  textSec: "var(--text-secondary)",
  textMuted: "var(--text-muted)",
};

type Phase = "intro" | "practice" | "paused" | "complete";

export default function ChapterSessionPage() {
  const { chapterId, sessionId } = useParams<{ chapterId: string; sessionId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const userId = currentUser?.id || "";

  const chapter = chaptersData.find(c => c.id === chapterId);
  const session = chapter?.sessions.find(s => s.id === sessionId);

  const [phase, setPhase] = useState<Phase>("intro");
  const [sessionProgress, setSessionProgress] = useState<Record<string, { status: string; score?: number }>>({});
  const [chatKey, setChatKey] = useState(0); // key to force remount on restart

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`voice3_session_progress_${userId}`);
      if (stored) setSessionProgress(JSON.parse(stored));
    } catch (_e) {}
  }, [userId]);

  const isCompleted = sessionProgress[sessionId || ""]?.status === "completed";
  const previousScore = sessionProgress[sessionId || ""]?.score;

  if (!chapter || !session) {
    return (
      <PlatformLayout>
        <div className="flex flex-col items-center justify-center py-24" style={{ color: C.textMuted }}>
          <p className="text-sm">Session not found.</p>
          <Link to="/capitulos" className="mt-3 text-xs hover:underline" style={{ color: C.gold }}>Back to programme</Link>
        </div>
      </PlatformLayout>
    );
  }

  const handleComplete = (score?: number) => {
    const finalScore = score || 85;
    try {
      const sessKey = `voice3_session_progress_${userId}`;
      const existing = localStorage.getItem(sessKey) ? JSON.parse(localStorage.getItem(sessKey)!) : {};
      existing[session.id] = { status: "completed", score: finalScore, completedAt: new Date().toISOString() };
      localStorage.setItem(sessKey, JSON.stringify(existing));

      const allCompleted = chapter.sessions.every(s =>
        s.id === session.id || existing[s.id]?.status === "completed"
      );
      if (allCompleted) {
        const chapKey = `voice3_chapter_progress_${userId}`;
        const chapExisting = localStorage.getItem(chapKey) ? JSON.parse(localStorage.getItem(chapKey)!) : {};
        chapExisting[chapter.id] = { status: "completed", completedAt: new Date().toISOString() };
        const chapterIndex = chaptersData.findIndex(c => c.id === chapter.id);
        if (chapterIndex >= 0 && chapterIndex < chaptersData.length - 1) {
          const nextChapter = chaptersData[chapterIndex + 1];
          if (!chapExisting[nextChapter.id]) chapExisting[nextChapter.id] = { status: "available" };
        }
        localStorage.setItem(chapKey, JSON.stringify(chapExisting));
        toast.success("Chapter completed!");
      }
    } catch (_e) {}

    setPhase("complete");
    toast.success(`Session completed — ${finalScore}%`);
  };

  const handleRestart = () => {
    setChatKey(k => k + 1);
    setPhase("practice");
  };

  const handlePause = () => {
    setPhase("paused");
  };

  const handleResume = () => {
    setPhase("practice");
  };

  const sessionTypeIcon: Record<string, typeof BookOpen> = {
    briefing: BookOpen,
    drill: Target,
    simulation: Zap,
    error_bank: BarChart3,
    diagnostic: Play,
    professor_session: BookOpen,
  };

  const Icon = sessionTypeIcon[session.sessionType] || BookOpen;
  const sessionIndex = chapter.sessions.findIndex(s => s.id === session.id);
  const nextSession = sessionIndex < chapter.sessions.length - 1 ? chapter.sessions[sessionIndex + 1] : null;

  const getAIContext = () => {
    const base = `You are an executive English communication coach. The student is doing a "${sessionTypeLabels[session.sessionType]}" session on "${session.title}".`;
    switch (session.sessionType) {
      case "briefing":
        return `${base} Present the scenario, explain the context and key phrases they'll need. Arsenal phrases: ${(session.arsenalPhrases || []).join(", ")}. Be structured, clear, and professional. Start by introducing the topic.`;
      case "drill":
        return `${base} Run controlled practice exercises. Ask the student to use specific phrases and structures. Correct errors immediately with explanations. Be encouraging but precise.`;
      case "simulation":
        return `${base} You are the Shadow Coach running a pressure roleplay. Act as ${session.aiPersona || "a senior stakeholder"}. Create realistic business scenarios. Push the student but give feedback after each exchange.`;
      case "error_bank":
        return `${base} Review common errors from this topic. Present corrections and ask the student to identify and fix mistakes. Help them save key learnings to their Language Vault.`;
      default:
        return base;
    }
  };

  return (
    <PlatformLayout>
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <Link
          to={`/capitulos/${chapter.id}`}
          className="inline-flex items-center gap-2 text-xs mb-5 transition-colors hover:opacity-80"
          style={{ color: C.textMuted }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Chapter {chapter.number} — {chapter.title}
        </Link>

        {/* Session header — compact */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `var(--gold-10)` }}>
              <Icon className="h-4 w-4" style={{ color: C.gold }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-semibold" style={{ color: C.text }}>{session.title}</h1>
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${sessionTypeColors[session.sessionType]}`}>
                  {sessionTypeLabels[session.sessionType]}
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                {session.durationMinutes} min · Session {session.number} of {chapter.totalSessions}
                {isCompleted && previousScore ? ` · Previous score: ${previousScore}%` : ""}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Phase: Intro */}
        {phase === "intro" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-xl p-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <p className="text-sm leading-relaxed mb-4" style={{ color: C.textSec }}>{session.description}</p>

              {session.arsenalPhrases && session.arsenalPhrases.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.textMuted }}>Key Phrases</h3>
                  <div className="flex flex-col gap-1.5">
                    {session.arsenalPhrases.map((phrase, i) => (
                      <span key={i} className="text-xs px-3 py-2 rounded-lg" style={{ background: `var(--gold-10)`, color: C.gold, border: `1px solid rgba(201,168,76,0.15)` }}>
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {session.leadershipCompetency && (
                <div className="flex items-center gap-2 mb-5">
                  <Target className="h-3.5 w-3.5" style={{ color: C.gold }} />
                  <span className="text-xs" style={{ color: C.textMuted }}>
                    Focus: <span style={{ color: C.gold }}>{session.leadershipCompetency}</span>
                  </span>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setPhase("practice")}
                  className="h-10 px-6 text-sm font-medium rounded-lg"
                  style={{ background: C.gold, color: C.bg }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isCompleted ? "Start Again" : "Start Session"}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 px-5 text-sm rounded-lg"
                  style={{ borderColor: C.border, color: C.textSec }}
                >
                  <Link to={`/capitulos/${chapter.id}`}>Back to Chapter</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase: Practice (AI Chat) */}
        {phase === "practice" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Controls bar */}
            <div className="flex items-center gap-2 mb-3">
              <Button
                onClick={handlePause}
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs rounded-lg gap-1.5"
                style={{ borderColor: C.border, color: C.textSec }}
              >
                <Pause className="h-3 w-3" /> Pause
              </Button>
              <Button
                onClick={handleRestart}
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs rounded-lg gap-1.5"
                style={{ borderColor: C.border, color: C.textSec }}
              >
                <RotateCcw className="h-3 w-3" /> Restart
              </Button>
            </div>

            <div className="rounded-xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <div className="p-4">
                <SessionAIChat
                  key={chatKey}
                  sessionTitle={session.title}
                  scenario={getAIContext()}
                  onComplete={(score: number) => handleComplete(score)}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase: Paused */}
        {phase === "paused" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-xl p-8 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <Pause className="h-10 w-10 mx-auto mb-4" style={{ color: C.gold }} />
              <h2 className="text-lg font-semibold mb-2" style={{ color: C.text }}>Session Paused</h2>
              <p className="text-sm mb-6" style={{ color: C.textSec }}>
                Take your time. Your progress is saved. You can resume or start over.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={handleResume}
                  className="h-10 px-6 text-sm font-medium rounded-lg"
                  style={{ background: C.gold, color: C.bg }}
                >
                  <Play className="h-4 w-4 mr-2" /> Resume
                </Button>
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  className="h-10 px-5 text-sm rounded-lg"
                  style={{ borderColor: C.border, color: C.textSec }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" /> Start Over
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 px-5 text-sm rounded-lg"
                  style={{ borderColor: C.border, color: C.textSec }}
                >
                  <Link to={`/capitulos/${chapter.id}`}>Leave Session</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase: Complete */}
        {phase === "complete" && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="rounded-xl p-8 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4" style={{ color: C.gold }} />
              <h2 className="text-lg font-semibold mb-2" style={{ color: C.text }}>Session Complete</h2>
              <p className="text-sm mb-6" style={{ color: C.textSec }}>
                Your progress has been saved. You can review this session anytime.
              </p>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                {nextSession && (
                  <Button asChild className="h-10 px-5 text-sm font-medium rounded-lg" style={{ background: C.gold, color: C.bg }}>
                    <Link to={`/capitulos/${chapter.id}/sessoes/${nextSession.id}`}>
                      Next: {nextSession.title.length > 30 ? nextSession.title.slice(0, 30) + "..." : nextSession.title}
                    </Link>
                  </Button>
                )}
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  className="h-10 px-5 text-sm rounded-lg gap-1.5"
                  style={{ borderColor: C.border, color: C.textSec }}
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Try Again
                </Button>
                <Button asChild variant="outline" className="h-10 px-5 text-sm rounded-lg" style={{ borderColor: C.border, color: C.textSec }}>
                  <Link to={`/capitulos/${chapter.id}`}>Back to Chapter</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </PlatformLayout>
  );
}
