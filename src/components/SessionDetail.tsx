import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Lock, ClipboardList, Target, Building2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SessionAIChat from "@/components/SessionAIChat";
import SessionQuiz from "@/components/SessionQuiz";
import type { Session } from "@/lib/sessionsData";
import { useAuth } from "@/contexts/AuthContext";

type Phase = "learn" | "practice" | "quiz" | "complete";

interface PhaseProgress {
  phaseCompleted: "learn" | "drill" | "simulation" | null;
  drillScore: number | null;
  quizScore: number | null;
}

interface SessionDetailProps {
  session: Session;
  alreadyCompleted?: boolean;
  existingScore?: number | null;
  onComplete: (score: number) => void;
}

const PHASES: { key: Phase; icon: React.ElementType; label: string }[] = [
  { key: "learn", icon: ClipboardList, label: "Intake" },
  { key: "practice", icon: Target, label: "Drill" },
  { key: "quiz", icon: Building2, label: "Simulation" },
  { key: "complete", icon: BarChart3, label: "Debrief" },
];

const phaseIndex = (p: Phase) => PHASES.findIndex((ph) => ph.key === p);

const SessionDetail = ({ session, alreadyCompleted = false, existingScore = null, onComplete }: SessionDetailProps) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "guest";
  const progressKey = `voice3_phase_progress_${userId}_${session.id}`;

  // Load saved phase progress from localStorage
  const savedProgress = (() => {
    if (alreadyCompleted) return null;
    try {
      const stored = localStorage.getItem(progressKey);
      if (stored) return JSON.parse(stored) as PhaseProgress;
    } catch (_e) { /* ignore */ }
    return null;
  })();

  const getInitialPhase = (): Phase => {
    if (alreadyCompleted) return "complete";
    if (!savedProgress) return "learn";
    if (savedProgress.phaseCompleted === "simulation") return "complete";
    if (savedProgress.phaseCompleted === "drill") return "quiz";
    if (savedProgress.phaseCompleted === "learn") return "practice";
    return "learn";
  };

  const [phase, setPhase] = useState<Phase>(getInitialPhase);
  const [learnDone, setLearnDone] = useState(alreadyCompleted || (savedProgress?.phaseCompleted != null));
  const [practiceDone, setPracticeDone] = useState(
    alreadyCompleted ||
    savedProgress?.phaseCompleted === "drill" ||
    savedProgress?.phaseCompleted === "simulation"
  );
  const [practiceScore, setPracticeScore] = useState<number | null>(savedProgress?.drillScore ?? null);
  const [quizScore, setQuizScore] = useState<number | null>(
    alreadyCompleted ? existingScore : (savedProgress?.quizScore ?? null)
  );
  const [quizPassed, setQuizPassed] = useState(
    alreadyCompleted || savedProgress?.phaseCompleted === "simulation"
  );

  const saveProgress = (update: Partial<PhaseProgress>) => {
    try {
      const stored = localStorage.getItem(progressKey);
      const existing: PhaseProgress = stored
        ? JSON.parse(stored)
        : { phaseCompleted: null, drillScore: null, quizScore: null };
      const current: PhaseProgress = { ...existing, ...update };
      localStorage.setItem(progressKey, JSON.stringify(current));
    } catch (_e) { /* ignore */ }
  };

  // Clear saved progress when session is fully completed
  useEffect(() => {
    if (alreadyCompleted) {
      try { localStorage.removeItem(progressKey); } catch (_e) { /* ignore */ }
    }
  }, [alreadyCompleted, progressKey]);

  const currentIdx = phaseIndex(phase);

  const aiScenario = `You are in a professional meeting with international colleagues. The topic is: **${session.title}**. Your task is to engage confidently, applying the vocabulary and phrases from this session. I will present scenarios and evaluate your responses for grammar, vocabulary, tone, and executive presence.`;

  const handleLearnComplete = () => {
    setLearnDone(true);
    saveProgress({ phaseCompleted: "learn", drillScore: null, quizScore: null });
    setPhase("practice");
  };

  const handlePracticeComplete = (score: number) => {
    setPracticeScore(score);
    setPracticeDone(true);
    saveProgress({ phaseCompleted: "drill", drillScore: score, quizScore: null });
    setPhase("quiz");
  };

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    if (score >= 60) {
      setQuizPassed(true);
      const finalScore = practiceScore !== null
        ? Math.round((score + practiceScore) / 2)
        : score;
      saveProgress({ phaseCompleted: "simulation", drillScore: practiceScore, quizScore: score });
      setPhase("complete");
      onComplete(finalScore);
    } else {
      // Failed — let them retry by resetting quiz state
      setPhase("quiz");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main content area */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {/* ── LEARN PHASE ── */}
          {phase === "learn" && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-6"
            >
              <div className="rounded-xl bg-[#1C1F26] border border-[#B89A5A]/10 p-5">
                <div className="flex items-center gap-2 mb-1">
                  <ClipboardList className="h-4 w-4 text-[#B89A5A]" />
                  <p className="text-xs text-[#B89A5A] tracking-[0.15em] uppercase font-medium">Intake — Strategic Context</p>
                </div>
                <p className="text-[#8E96A3] text-sm">Review the strategic context and key frameworks for this session. Take notes — you'll apply everything in the simulation.</p>
              </div>
              {session.content.map((block, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-[#1C1F26] border border-[#B89A5A]/10 p-6"
                >
                  <h3 className="font-serif text-lg font-semibold text-[#F4F2ED] mb-3">
                    {block.title}
                  </h3>
                  {block.type === "text" && (
                    <p className="text-[#8E96A3] leading-relaxed text-sm">{block.body}</p>
                  )}
                  {(block.type === "vocabulary" || block.type === "phrases") && (
                    <ul className="space-y-2">
                      {block.items?.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-[#8E96A3]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B89A5A] mt-2 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              <Button
                onClick={handleLearnComplete}
                className="w-full bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-lg h-11"
              >
                Content Reviewed — Start Practice
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* ── PRACTICE PHASE ── */}
          {phase === "practice" && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="rounded-xl bg-[#1C1F26] border border-[#B89A5A]/10 p-6"
            >
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-[#B89A5A]" />
                  <p className="text-xs text-[#B89A5A] tracking-[0.15em] uppercase font-medium">
                    Drill — Targeted Practice
                  </p>
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#F4F2ED]">
                  Apply What You Learned
                </h3>
                <p className="text-[#8E96A3] text-sm mt-1">Practice specific phrases and structures. The AI will correct your executive tone in real time.</p>
              </div>
              <SessionAIChat
                sessionTitle={session.title}
                scenario={aiScenario}
                onComplete={handlePracticeComplete}
              />
            </motion.div>
          )}

          {/* ── QUIZ PHASE ── */}
          {phase === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="rounded-xl bg-[#1C1F26] border border-[#B89A5A]/10 p-6"
            >
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-4 w-4 text-[#B89A5A]" />
                  <p className="text-xs text-[#B89A5A] tracking-[0.15em] uppercase font-medium">
                    Simulation — High-Stakes Scenario
                  </p>
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#F4F2ED]">
                  Boardroom Test
                </h3>
                <p className="text-[#8E96A3] text-sm mt-1">This is your boardroom test. Answer as if your career depends on it. You need 60% to complete this session.</p>
              </div>
              <SessionQuiz questions={session.quiz} onComplete={handleQuizComplete} />
            </motion.div>
          )}

          {/* ── COMPLETE PHASE ── */}
          {phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl bg-[#1C1F26] border border-[#B89A5A]/20 p-8 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-[#B89A5A]/10 border-2 border-[#B89A5A] flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-9 w-9 text-[#B89A5A]" />
              </div>
              <p className="text-xs text-[#B89A5A] tracking-[0.15em] uppercase font-medium mb-2">Debrief — Performance Analysis</p>
              <p className="font-serif text-5xl font-bold text-[#B89A5A] mb-2">
                {quizScore !== null ? `${quizScore}%` : "✓"}
              </p>
              <h3 className="font-serif text-2xl font-semibold text-[#F4F2ED] mb-1">
                Your Authority Score: {quizScore !== null ? `${quizScore}/100` : "—"}
              </h3>
              <p className="text-[#8E96A3] mb-2 max-w-sm mx-auto text-sm">
                {session.title} — all phases completed. Your performance has been recorded.
              </p>
              <p className="text-xs text-[#8E96A3]/70 mb-6 max-w-xs mx-auto">
                Authority Score measures your executive communication precision, vocabulary range, and strategic tone.
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-xs text-[#8E96A3]">
                {practiceScore !== null && (
                  <span className="px-3 py-1.5 rounded-lg bg-[#B89A5A]/10 border border-[#B89A5A]/20 text-[#B89A5A]">
                    Drill: {practiceScore}%
                  </span>
                )}
                {quizScore !== null && (
                  <span className="px-3 py-1.5 rounded-lg bg-[#B89A5A]/10 border border-[#B89A5A]/20 text-[#B89A5A]">
                    Simulation: {quizScore}%
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Phase sidebar */}
      <div className="w-full lg:w-52 shrink-0">
        <div className="sticky top-6 rounded-xl bg-[#1C1F26] border border-white/5 p-4 space-y-1">
          <p className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium mb-4">
            Session Phases
          </p>
          {PHASES.map((p, i) => {
            const done =
              (p.key === "learn" && learnDone) ||
              (p.key === "practice" && practiceDone) ||
              (p.key === "quiz" && quizPassed) ||
              (p.key === "complete" && quizPassed);
            const active = p.key === phase;
            const accessible =
              alreadyCompleted ||
              i === 0 ||
              (i === 1 && learnDone) ||
              (i === 2 && practiceDone) ||
              (i === 3 && quizPassed);

            return (
              <button
                key={p.key}
                onClick={() => accessible && setPhase(p.key)}
                disabled={!accessible}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                  active
                    ? "bg-[#243A5A] text-[#B89A5A] border border-[#B89A5A]/20"
                    : done
                    ? "text-[#B89A5A]/70 hover:bg-white/5"
                    : accessible
                    ? "text-[#8E96A3] hover:bg-white/5"
                    : "text-white/20 cursor-not-allowed"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-[#B89A5A] shrink-0" />
                ) : accessible ? (
                  <p.icon className="h-4 w-4 shrink-0" />
                ) : (
                  <Lock className="h-4 w-4 shrink-0 text-white/20" />
                )}
                <span className="font-medium">{p.label}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#B89A5A] animate-pulse" />
                )}
              </button>
            );
          })}

          {/* Score summary */}
          {(practiceScore !== null || quizScore !== null) && (
            <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
              {practiceScore !== null && (
                <div className="flex justify-between text-xs">
                  <span className="text-[#8E96A3]">Drill</span>
                  <span className="text-[#B89A5A] font-medium">{practiceScore}%</span>
                </div>
              )}
              {quizScore !== null && (
                <div className="flex justify-between text-xs">
                  <span className="text-[#8E96A3]">Simulation</span>
                  <span className="text-[#B89A5A] font-medium">{quizScore}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;
