import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlatformLayout from "@/components/PlatformLayout";

const QUESTIONS = [
  "Your quarterly results are disappointing. Explain yourself.",
  "Why should we invest in your proposal when your competitor just launched something better?",
  "The board has lost confidence in your team. What's your response?",
  "You're over budget by 40%. Walk me through your plan to fix this.",
  "Your last two projects failed. Why should we trust you with this one?",
  "I've heard your team morale is terrible. What are you doing about it?",
  "The market has shifted. Your strategy is outdated. Convince me otherwise.",
  "You've missed three deadlines this quarter. What's your excuse?",
  "Our biggest client just threatened to leave. What's your retention plan?",
  "You want a promotion but your performance review says otherwise. Make your case.",
];

const FILLER_WORDS = ["um", "uh", "like", "you know", "basically", "actually"];
const TIMER_SECONDS = 30;

type GameState = "idle" | "playing" | "feedback" | "gameover";

function detectFillers(text: string): string[] {
  const lower = text.toLowerCase();
  return FILLER_WORDS.filter(fw => {
    const regex = new RegExp(`\\b${fw}\\b`, "gi");
    return regex.test(lower);
  });
}

const HostileQA = () => {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentQ, setCurrentQ] = useState(0);
  const [lives, setLives] = useState(3);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [feedback, setFeedback] = useState<{ fillers: string[]; lost: boolean } | null>(null);
  const [totalFillers, setTotalFillers] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startTimer = () => {
    clearTimer();
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearTimer();
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Keep timer-based callback stable
  const handleTimeUp = () => {
    clearTimer();
    setFeedback({ fillers: [], lost: true });
    setLives(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setTimeout(() => setGameState("gameover"), 1200);
      }
      return next;
    });
    setGameState("feedback");
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const handleStart = () => {
    setCurrentQ(0);
    setLives(3);
    setAnswer("");
    setTimeLeft(TIMER_SECONDS);
    setFeedback(null);
    setTotalFillers(0);
    setAnsweredCount(0);
    setGameState("playing");
    startTimer();
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;
    clearTimer();
    const fillers = detectFillers(answer);
    const lostLife = fillers.length > 0;
    setTotalFillers(prev => prev + fillers.length);
    setAnsweredCount(prev => prev + 1);
    if (lostLife) {
      setLives(prev => {
        const next = prev - 1;
        if (next <= 0) setTimeout(() => setGameState("gameover"), 1500);
        return next;
      });
    }
    setFeedback({ fillers, lost: lostLife });
    setGameState("feedback");
  };

  const handleNext = () => {
    const nextQ = currentQ + 1;
    if (nextQ >= QUESTIONS.length) {
      setGameState("gameover");
      return;
    }
    setCurrentQ(nextQ);
    setAnswer("");
    setFeedback(null);
    setGameState("playing");
    startTimer();
  };

  const timerPercent = (timeLeft / TIMER_SECONDS) * 100;

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-xs text-[#B89A5A] tracking-[0.2em] uppercase font-medium mb-1">My Practice</p>
        <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] tracking-tight mb-1">
          🔥 Hostile Q&amp;A Gauntlet
        </h1>
        <p className="text-[#8E96A3] text-sm">Pressure Test</p>
      </motion.div>

      {gameState === "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-[#1C1F26] border border-[#B89A5A]/10 p-8 text-center max-w-lg mx-auto"
        >
          <div className="text-5xl mb-4">🔥</div>
          <h2 className="font-serif text-xl font-semibold text-[#F4F2ED] mb-3">
            Are you ready?
          </h2>
          <p className="text-[#8E96A3] text-sm mb-2 leading-relaxed">
            The AI will ask you 10 aggressive business questions. You have{" "}
            <span className="text-[#F4F2ED] font-semibold">30 seconds</span> to respond to each one.
          </p>
          <p className="text-[#8E96A3] text-sm mb-6 leading-relaxed">
            Use filler words like <span className="text-red-400 font-semibold">"um", "uh", "like", "you know", "basically", "actually"</span>{" "}
            and you lose a life. You start with{" "}
            <span className="text-[#B89A5A] font-semibold">3 lives ⭐⭐⭐</span>.
          </p>
          <button
            onClick={handleStart}
            className="px-8 py-3 rounded-xl bg-[#B89A5A] text-[#0B1A2A] font-bold text-sm hover:bg-[#d4ba6a] transition-all"
          >
            🚀 Start Gauntlet
          </button>
        </motion.div>
      )}

      {(gameState === "playing" || gameState === "feedback") && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Lives + Progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <span key={i} className={`text-xl ${i < lives ? "opacity-100" : "opacity-20"}`}>⭐</span>
              ))}
            </div>
            <span className="text-xs text-[#8E96A3]">
              Question {currentQ + 1} / {QUESTIONS.length}
            </span>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-xl bg-[#1C1F26] border border-[#B89A5A]/20 p-6"
            >
              <p className="text-xs text-[#B89A5A] uppercase tracking-wider font-semibold mb-3">
                🎯 Hostile Question
              </p>
              <p className="font-serif text-lg font-semibold text-[#F4F2ED] leading-relaxed">
                "{QUESTIONS[currentQ]}"
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Timer Bar */}
          {gameState === "playing" && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#8E96A3]">
                <span>Time remaining</span>
                <span className={timeLeft <= 10 ? "text-red-400 font-bold" : ""}>{timeLeft}s</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full transition-colors ${
                    timeLeft > 15 ? "bg-[#B89A5A]" : timeLeft > 8 ? "bg-amber-400" : "bg-red-500"
                  }`}
                  style={{ width: `${timerPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Answer Input */}
          {gameState === "playing" && (
            <div className="space-y-3">
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Type your response here..."
                rows={4}
                className="w-full bg-[#1C1F26] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F4F2ED] placeholder-[#8E96A3]/50 focus:outline-none focus:border-[#B89A5A]/50 transition-colors resize-none"
              />
              <button
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="w-full py-3 rounded-xl bg-[#B89A5A] text-[#0B1A2A] font-bold text-sm hover:bg-[#d4ba6a] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Submit Answer →
              </button>
            </div>
          )}

          {/* Feedback */}
          {gameState === "feedback" && feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border p-5 ${
                feedback.lost
                  ? "bg-red-500/5 border-red-500/20"
                  : "bg-emerald-500/5 border-emerald-500/20"
              }`}
            >
              {feedback.lost ? (
                <>
                  <p className="font-bold text-red-400 mb-2">
                    {timeLeft === 0 ? "⏰ Time's up! You lost a life." : "❌ Filler words detected! You lost a life."}
                  </p>
                  {feedback.fillers.length > 0 && (
                    <p className="text-sm text-[#8E96A3]">
                      Detected: {feedback.fillers.map(f => (
                        <span key={f} className="text-red-400 font-semibold">"{f}" </span>
                      ))}
                    </p>
                  )}
                  <p className="text-xs text-[#8E96A3] mt-2">
                    Replace with pauses or phrases like "Let me think about that for a moment..."
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold text-emerald-400 mb-1">✅ Clean answer! No filler words detected.</p>
                  <p className="text-xs text-[#8E96A3]">Good executive communication. Keep going.</p>
                </>
              )}
              <button
                onClick={handleNext}
                className="mt-4 px-5 py-2 rounded-lg bg-[#B89A5A]/20 text-[#B89A5A] font-semibold text-sm hover:bg-[#B89A5A]/30 transition-all"
              >
                {currentQ + 1 >= QUESTIONS.length ? "See Results →" : "Next Question →"}
              </button>
            </motion.div>
          )}
        </div>
      )}

      {gameState === "gameover" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl bg-[#1C1F26] border border-[#B89A5A]/20 p-8 text-center max-w-md mx-auto"
        >
          <div className="text-5xl mb-4">{lives > 0 ? "🏆" : "💀"}</div>
          <h2 className="font-serif text-xl font-semibold text-[#F4F2ED] mb-4">
            {lives > 0 ? "Gauntlet Complete!" : "Eliminated"}
          </h2>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-lg bg-[#0B1A2A] p-3">
              <p className="text-2xl font-bold text-[#B89A5A]">{answeredCount}</p>
              <p className="text-xs text-[#8E96A3] mt-0.5">Answered</p>
            </div>
            <div className="rounded-lg bg-[#0B1A2A] p-3">
              <p className="text-2xl font-bold text-[#B89A5A]">{lives}</p>
              <p className="text-xs text-[#8E96A3] mt-0.5">Lives Left</p>
            </div>
            <div className="rounded-lg bg-[#0B1A2A] p-3">
              <p className={`text-2xl font-bold ${lives <= 0 ? "text-red-400" : "text-[#B89A5A]"}`}>{totalFillers}</p>
              <p className="text-xs text-[#8E96A3] mt-0.5">Filler Words</p>
            </div>
          </div>
          <button
            onClick={handleStart}
            className="px-8 py-3 rounded-xl bg-[#B89A5A] text-[#0B1A2A] font-bold text-sm hover:bg-[#d4ba6a] transition-all"
          >
            🔄 Try Again
          </button>
        </motion.div>
      )}
    </PlatformLayout>
  );
};

export default HostileQA;
