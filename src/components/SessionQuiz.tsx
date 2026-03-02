import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface SessionQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

const SessionQuiz = ({ questions, onComplete }: SessionQuizProps) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const question = questions[current];
  const isLast = current === questions.length - 1;

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    const updated = [...answers];
    updated[current] = selected;
    setAnswers(updated);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (isLast) {
      const correct = answers.filter((a, i) => a === questions[i].correct).length;
      const score = Math.round((correct / questions.length) * 100);
      setFinalScore(score);
      setFinished(true);
    } else {
      setCurrent(current + 1);
      setSelected(null);
      setSubmitted(false);
    }
  };

  if (finished) {
    const passed = finalScore >= 60;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-8 text-center"
      >
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
            passed ? "bg-[#B89A5A]/10 border-2 border-[#B89A5A]" : "bg-red-500/10 border-2 border-red-500/40"
          }`}
        >
          {passed ? (
            <CheckCircle2 className="h-9 w-9 text-[#B89A5A]" />
          ) : (
            <XCircle className="h-9 w-9 text-red-400" />
          )}
        </div>
        <p className="font-serif text-5xl font-bold text-[#B89A5A] mb-2">{finalScore}%</p>
        <p className="text-[#F4F2ED] font-semibold text-lg mb-1">
          {passed ? "Quiz Passed" : "Quiz Not Passed"}
        </p>
        <p className="text-[#8E96A3] text-sm mb-8 max-w-xs">
          {passed
            ? "Excellent work. You demonstrated solid comprehension of this session's content."
            : "You need 60% to pass. Review the session content and try again."}
        </p>
        <Button
          onClick={() => onComplete(finalScore)}
          className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-lg px-8"
        >
          {passed ? "Continue to Next Phase" : "Retry Quiz"}
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-[#8E96A3] uppercase tracking-wider">
          Question {current + 1} of {questions.length}
        </p>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i < current
                  ? "w-5 bg-[#B89A5A]"
                  : i === current
                  ? "w-5 bg-[#B89A5A]/60"
                  : "w-5 bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <h3 className="font-serif text-xl text-[#F4F2ED] font-semibold mb-6 leading-snug">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((opt, i) => {
              let style =
                "border-white/10 text-[#8E96A3] hover:border-[#B89A5A]/40 hover:text-[#F4F2ED] cursor-pointer";
              if (selected === i && !submitted) {
                style = "border-[#B89A5A]/60 text-[#F4F2ED] bg-[#B89A5A]/5 cursor-pointer";
              }
              if (submitted) {
                if (i === question.correct) {
                  style = "border-[#B89A5A] text-[#B89A5A] bg-[#B89A5A]/10 cursor-default";
                } else if (i === selected && selected !== question.correct) {
                  style = "border-red-500/50 text-red-400 bg-red-500/5 cursor-default";
                } else {
                  style = "border-white/5 text-white/30 cursor-default";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={submitted}
                  className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl border bg-[#1C1F26] text-left text-sm transition-all duration-200 ${style}`}
                >
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {submitted && i === question.correct && (
                    <CheckCircle2 className="h-4 w-4 text-[#B89A5A] shrink-0" />
                  )}
                  {submitted && i === selected && selected !== question.correct && (
                    <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 px-4 py-3 rounded-xl text-sm ${
                  selected === question.correct
                    ? "bg-[#B89A5A]/10 border border-[#B89A5A]/20 text-[#B89A5A]"
                    : "bg-red-500/10 border border-red-500/20 text-red-400"
                }`}
              >
                {selected === question.correct
                  ? "Correct. Well done."
                  : `Incorrect. The correct answer is: ${question.options[question.correct]}`}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex justify-between items-center pt-2">
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={selected === null}
            className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-lg px-8 disabled:opacity-40"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-lg px-8 ml-auto"
          >
            {isLast ? "See Results" : "Next Question"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SessionQuiz;
