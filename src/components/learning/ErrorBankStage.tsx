import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle, AlertCircle, BookOpen } from "lucide-react";

interface Error {
  id: string;
  error: string;
  reason: string;
  correction: string;
}

interface ErrorBankStageProps {
  errors?: Error[];
  onComplete: () => void;
}

const DEFAULT_ERRORS: Error[] = [
  {
    id: "1",
    error: "I am going to the store tomorrow for buying groceries.",
    reason: "Incorrect gerund usage. Use infinitive 'to buy' after 'for'.",
    correction: "I am going to the store tomorrow to buy groceries.",
  },
  {
    id: "2",
    error: "He explained me the situation.",
    reason: "'Explained' is a ditransitive verb that doesn't take a direct object + indirect object in this order.",
    correction: "He explained the situation to me.",
  },
  {
    id: "3",
    error: "Despite of the rain, we continued.",
    reason: "'Despite' is a preposition and doesn't take 'of'. Use 'spite' or remove 'of'.",
    correction: "Despite the rain, we continued.",
  },
];

export const ErrorBankStage = ({
  errors = DEFAULT_ERRORS,
  onComplete,
}: ErrorBankStageProps) => {
  const [reviewedErrors, setReviewedErrors] = useState<Set<string>>(new Set());
  const [needsPractice, setNeedsPractice] = useState<Set<string>>(new Set());

  const toggleReviewed = (id: string) => {
    const newSet = new Set(reviewedErrors);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setReviewedErrors(newSet);
  };

  const toggleNeedsPractice = (id: string) => {
    const newSet = new Set(needsPractice);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setNeedsPractice(newSet);
  };

  const reviewedCount = reviewedErrors.size;
  const practiceCount = needsPractice.size;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Errors Captured from Your Simulation</h2>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-400 text-xs font-semibold mb-1">TOTAL ERRORS</p>
              <p className="text-[#D4AF37] text-2xl font-bold">{errors.length}</p>
            </div>
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-400 text-xs font-semibold mb-1">REVIEWED</p>
              <p className="text-emerald-400 text-2xl font-bold">{reviewedCount}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Error Cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {errors.map((error, idx) => (
            <motion.div
              key={error.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: idx * 0.1 + 0.15 }}
            >
              <Card className="bg-slate-800 border-slate-700 p-6 hover:border-slate-600 transition-all duration-300">
                {/* Error Text */}
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 font-semibold text-sm italic">"{error.error}"</p>
                </div>

                {/* Reason */}
                <div className="mb-4">
                  <p className="text-slate-400 text-xs font-semibold mb-1">WHY IT'S WRONG</p>
                  <p className="text-slate-300 text-sm">{error.reason}</p>
                </div>

                {/* Correction */}
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <p className="text-emerald-300 text-xs font-semibold mb-1">CORRECTION</p>
                  <p className="text-emerald-300 font-semibold text-sm">"{error.correction}"</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => toggleReviewed(error.id)}
                    size="sm"
                    className={`text-xs font-semibold transition-all ${
                      reviewedErrors.has(error.id)
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    {reviewedErrors.has(error.id) ? "Reviewed" : "Mark Reviewed"}
                  </Button>
                  <Button
                    onClick={() => toggleNeedsPractice(error.id)}
                    size="sm"
                    className={`text-xs font-semibold transition-all ${
                      needsPractice.has(error.id)
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 mr-1" />
                    {needsPractice.has(error.id) ? "Marked" : "Practice This"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Practice Summary */}
      {practiceCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4"
        >
          <p className="text-amber-300 text-sm">
            <span className="font-bold">{practiceCount}</span> error{practiceCount !== 1 ? "s" : ""} marked for practice
          </p>
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: errors.length * 0.1 + 0.2 }}
        className="flex justify-end pt-4"
      >
        <Button
          onClick={onComplete}
          className="bg-[#D4AF37] hover:bg-[#E5C158] text-slate-900 font-semibold px-8 py-6 rounded-lg flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/40"
        >
          Continue to Vault
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};
