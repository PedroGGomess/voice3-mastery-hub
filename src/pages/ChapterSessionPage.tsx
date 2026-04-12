import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Play, BookOpen, Target, Zap, BarChart3 } from "lucide-react";
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
  goldLight: "var(--gold-light)",
  text: "var(--text-primary)",
  textSec: "var(--text-secondary)",
  textMuted: "var(--text-muted)",
};

type Phase = "intro" | "practice" | "complete";

export default function ChapterSessionPage() {
  const { chapterId, sessionId } = useParams<{ chapterId: string; sessionId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const userId = currentUser?.id || "";

  const chapter = chaptersData.find(c => c.id === chapterId);
  const session = chapter?.sessions.find(s => s.id === sessionId);

  const [phase, setPhase] = useState<Phase>("intro");
  const [sessionProgress, setSessionProgress] = useState<Record<string, { status: string; score?: number }>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`voice3_session_progress_${userId}`);
      if (stored) setSessionProgress(JSON.parse(stored));
    } catch (_e) {}
  }, [userId]);

  const isCompleted = sessionProgress[sessionId || ""]?.status === "completed";

  useEffect(() => {
    if (isCompleted) setPhase("complete");
  }, [isCompleted]);

  if (!chapter || !session) {
    return (
      <PlatformLayout>
        <div className="flex flex-col items-center justify-center py-24" style={{ color: C.textMuted }}>
          <p className="text-sm">Sessão não encontrada.</p>
          <Link to="/capitulos" className="mt-3 text-xs hover:underline" style={{ color: C.gold }}>← Voltar aos capítulos</Link>
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

      // Check if all sessions in chapter are now completed
      const allCompleted = chapter.sessions.every(s =>
        s.id === session.id || existing[s.id]?.status === "completed"
      );
      if (allCompleted) {
        const chapKey = `voice3_chapter_progress_${userId}`;
        const chapExisting = localStorage.getItem(chapKey) ? JSON.parse(localStorage.getItem(chapKey)!) : {};
        chapExisting[chapter.id] = { status: "completed", completedAt: new Date().toISOString() };
        // Unlock next chapter
        const chapterIndex = chaptersData.findIndex(c => c.id === chapter.id);
        if (chapterIndex >= 0 && chapterIndex < chaptersData.length - 1) {
          const nextChapter = chaptersData[chapterIndex + 1];
          if (!chapExisting[nextChapter.id]) {
            chapExisting[nextChapter.id] = { status: "available" };
          }
        }
        localStorage.setItem(chapKey, JSON.stringify(chapExisting));
        toast.success("Capítulo concluído! 🎉");
      }
    } catch (_e) {}

    setPhase("complete");
    toast.success(`Sessão concluída com ${finalScore}%!`);
  };

  const sessionTypeIcon = {
    briefing: BookOpen,
    drill: Target,
    simulation: Zap,
    error_bank: BarChart3,
    diagnostic: Play,
    professor_session: BookOpen,
  };

  const Icon = sessionTypeIcon[session.sessionType] || BookOpen;

  // Find next session in chapter
  const sessionIndex = chapter.sessions.findIndex(s => s.id === session.id);
  const nextSession = sessionIndex < chapter.sessions.length - 1 ? chapter.sessions[sessionIndex + 1] : null;

  // Build AI prompt context based on session type
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
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link
          to={`/capitulos/${chapter.id}`}
          className="inline-flex items-center gap-2 text-xs mb-4 transition-colors hover:opacity-80"
          style={{ color: C.textMuted }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Cap. {chapter.number} — {chapter.title}
        </Link>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${C.gold}15` }}>
            <Icon className="h-5 w-5" style={{ color: C.gold }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-xl font-semibold" style={{ color: C.text }}>{session.title}</h1>
              <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${sessionTypeColors[session.sessionType]}`}>
                {sessionTypeLabels[session.sessionType]}
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: C.textSec }}>{session.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Phase: Intro */}
      {phase === "intro" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl p-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <h2 className="font-semibold text-sm mb-3" style={{ color: C.text }}>Sobre esta sessão</h2>
            <p className="text-sm leading-relaxed" style={{ color: C.textSec }}>{session.description}</p>

            {session.arsenalPhrases && session.arsenalPhrases.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.textMuted }}>Arsenal de Frases</h3>
                <div className="flex flex-wrap gap-2">
                  {session.arsenalPhrases.map((phrase, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: `${C.gold}10`, color: C.gold, border: `1px solid ${C.gold}20` }}>
                      "{phrase}"
                    </span>
                  ))}
                </div>
              </div>
            )}

            {session.leadershipCompetency && (
              <div className="mt-4 flex items-center gap-2">
                <Target className="h-3.5 w-3.5" style={{ color: C.gold }} />
                <span className="text-xs" style={{ color: C.textMuted }}>
                  Competência: <span style={{ color: C.gold }}>{session.leadershipCompetency}</span>
                </span>
              </div>
            )}

            <div className="mt-6">
              <Button
                onClick={() => setPhase("practice")}
                className="h-10 px-6 text-sm font-medium rounded-lg"
                style={{ background: C.gold, color: C.bg }}
              >
                <Play className="h-4 w-4 mr-2" />
                Iniciar Sessão
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Phase: Practice (AI Chat) */}
      {phase === "practice" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
            <SessionAIChat
              sessionTitle={session.title}
              scenario={getAIContext()}
              onComplete={(score: number) => handleComplete(score)}
            />
          </div>
        </motion.div>
      )}

      {/* Phase: Complete */}
      {phase === "complete" && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <div className="rounded-xl p-8 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${C.gold}15` }}>
              <CheckCircle2 className="h-8 w-8" style={{ color: C.gold }} />
            </div>
            <h2 className="font-serif text-xl font-semibold mb-2" style={{ color: C.text }}>Sessão Concluída!</h2>
            <p className="text-sm mb-6" style={{ color: C.textSec }}>
              {isCompleted ? "Já completaste esta sessão." : "Excelente trabalho! O teu progresso foi guardado."}
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              {nextSession && (
                <Button asChild className="h-9 px-5 text-sm font-medium rounded-lg" style={{ background: C.gold, color: C.bg }}>
                  <Link to={`/capitulos/${chapter.id}/sessoes/${nextSession.id}`}>
                    Próxima Sessão →
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" className="h-9 px-5 text-sm rounded-lg border-white/10">
                <Link to={`/capitulos/${chapter.id}`}>
                  Voltar ao Capítulo
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </PlatformLayout>
  );
}
