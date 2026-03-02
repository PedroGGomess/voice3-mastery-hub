import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, BookOpen, MessageSquare, HelpCircle, Trophy, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import SessionAIChat from "@/components/SessionAIChat";
import SessionQuiz from "@/components/SessionQuiz";
import type { Session } from "@/lib/sessionsData";

type Phase = "learn" | "practice" | "quiz" | "complete";

interface SessionDetailProps {
  session: Session;
  alreadyCompleted?: boolean;
  existingScore?: number | null;
  onComplete: (score: number) => void;
}

const PHASES: { key: Phase; icon: React.ElementType; label: string }[] = [
  { key: "learn", icon: BookOpen, label: "Learn" },
  { key: "practice", icon: MessageSquare, label: "Practice" },
  { key: "quiz", icon: HelpCircle, label: "Quiz" },
  { key: "complete", icon: Trophy, label: "Complete" },
];

const phaseIndex = (p: Phase) => PHASES.findIndex((ph) => ph.key === p);

const SessionDetail = ({ session, alreadyCompleted = false, existingScore = null, onComplete }: SessionDetailProps) => {
  const [phase, setPhase] = useState<Phase>(alreadyCompleted ? "complete" : "learn");
  const [learnDone, setLearnDone] = useState(alreadyCompleted);
  const [practiceDone, setPracticeDone] = useState(alreadyCompleted);
  const [practiceScore, setPracticeScore] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(alreadyCompleted ? existingScore : null);
  const [quizPassed, setQuizPassed] = useState(alreadyCompleted);

  const currentIdx = phaseIndex(phase);

  const aiScenario = `You are in a professional meeting with international colleagues. The topic is: **${session.title}**. Your task is to engage confidently, applying the vocabulary and phrases from this session. I will present scenarios and evaluate your responses for grammar, vocabulary, tone, and executive presence.`;

  const handleLearnComplete = () => {
    setLearnDone(true);
    setPhase("practice");
  };

  const handlePracticeComplete = (score: number) => {
    setPracticeScore(score);
    setPracticeDone(true);
    setPhase("quiz");
  };

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    if (score >= 60) {
      setQuizPassed(true);
      const finalScore = practiceScore !== null
        ? Math.round((score + practiceScore) / 2)
        : score;
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
                <p className="text-xs text-[#B89A5A] tracking-[0.15em] uppercase font-medium mb-1">
                  AI Practice
                </p>
                <h3 className="font-serif text-xl font-semibold text-[#F4F2ED]">
                  Apply What You Learned
                </h3>
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
                <p className="text-xs text-[#B89A5A] tracking-[0.15em] uppercase font-medium mb-1">
                  Comprehension Quiz
                </p>
                <h3 className="font-serif text-xl font-semibold text-[#F4F2ED]">
                  Test Your Knowledge
                </h3>
                <p className="text-[#8E96A3] text-sm mt-1">You need 60% to complete this session.</p>
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
                <Trophy className="h-9 w-9 text-[#B89A5A]" />
              </div>
              <p className="font-serif text-5xl font-bold text-[#B89A5A] mb-2">
                {quizScore !== null ? `${quizScore}%` : "✓"}
              </p>
              <h3 className="font-serif text-2xl font-semibold text-[#F4F2ED] mb-2">
                Session Complete
              </h3>
              <p className="text-[#8E96A3] mb-6 max-w-sm mx-auto">
                {session.title} — all phases completed. Your performance has been recorded.
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-xs text-[#8E96A3]">
                {practiceScore !== null && (
                  <span className="px-3 py-1.5 rounded-lg bg-[#B89A5A]/10 border border-[#B89A5A]/20 text-[#B89A5A]">
                    Practice: {practiceScore}%
                  </span>
                )}
                {quizScore !== null && (
                  <span className="px-3 py-1.5 rounded-lg bg-[#B89A5A]/10 border border-[#B89A5A]/20 text-[#B89A5A]">
                    Quiz: {quizScore}%
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
                  <span className="text-[#8E96A3]">Practice</span>
                  <span className="text-[#B89A5A] font-medium">{practiceScore}%</span>
                </div>
              )}
              {quizScore !== null && (
                <div className="flex justify-between text-xs">
                  <span className="text-[#8E96A3]">Quiz</span>
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
