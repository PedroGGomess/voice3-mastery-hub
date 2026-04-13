import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";

interface DrillStageProps {
  instruction: string;
  example: string;
  onComplete: () => void;
}

interface EvaluationResult {
  score: number;
  breakdown: {
    grammar: number;
    vocabulary: number;
    tone: number;
    clarity: number;
  };
  strengths: string[];
  improvements: string[];
}

export const DrillStage = ({ instruction, example, onComplete }: DrillStageProps) => {
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const generateEvaluation = (): EvaluationResult => {
    // Demo evaluation with realistic data
    const baseScore = 65 + Math.random() * 30;
    return {
      score: Math.round(baseScore),
      breakdown: {
        grammar: Math.round(65 + Math.random() * 30),
        vocabulary: Math.round(60 + Math.random() * 35),
        tone: Math.round(70 + Math.random() * 25),
        clarity: Math.round(75 + Math.random() * 20),
      },
      strengths: [
        "Clear sentence structure",
        "Good use of connectors",
        "Professional tone maintained",
      ],
      improvements: [
        "Consider using more varied vocabulary",
        "Add more specific examples to support your point",
        "Watch out for minor grammar issues",
      ],
    };
  };

  const handleSubmit = () => {
    if (!response.trim()) return;
    setSubmitted(true);
    setAttempts(attempts + 1);
    setEvaluation(generateEvaluation());
  };

  const handleTryAgain = () => {
    setResponse("");
    setSubmitted(false);
    setEvaluation(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 70) return "text-yellow-400";
    if (score >= 60) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500/20 border-emerald-500/30";
    if (score >= 70) return "bg-yellow-500/20 border-yellow-500/30";
    if (score >= 60) return "bg-orange-500/20 border-orange-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Instruction Card */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-bold text-white mb-2">Your Task</h3>
          <p className="text-slate-200">{instruction}</p>
        </motion.div>
      </Card>

      <AnimatePresence mode="wait">
        {!submitted ? (
          // Input State
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Example Box */}
            <Card className="bg-slate-900 border-slate-700 p-4">
              <p className="text-xs text-slate-400 font-semibold mb-2">EXAMPLE</p>
              <p className="text-slate-300 italic text-sm">{example}</p>
            </Card>

            {/* Text Area */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <label className="block text-sm font-semibold text-white mb-3">
                Your Response
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response here..."
                className="w-full h-32 bg-slate-900 text-white placeholder-slate-500 rounded-lg p-4 border border-slate-600 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 resize-none"
              />
              <p className="text-xs text-slate-400 mt-2">{response.length} characters</p>
            </Card>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-end"
            >
              <Button
                onClick={handleSubmit}
                disabled={!response.trim()}
                className="bg-[#D4AF37] hover:bg-[#E5C158] text-slate-900 font-semibold px-8 py-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/40"
              >
                Submit for Evaluation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        ) : evaluation ? (
          // Evaluation State
          <motion.div
            key="evaluation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Score Card */}
            <Card
              className={`p-8 border-2 ${getScoreBgColor(evaluation.score)} backdrop-blur`}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-slate-300 text-sm mb-2">YOUR SCORE</p>
                  <p className={`text-5xl font-bold ${getScoreColor(evaluation.score)}`}>
                    {evaluation.score}
                  </p>
                  <p className="text-slate-400 text-xs mt-2">/ 100</p>
                </div>
                {evaluation.score >= 70 ? (
                  <CheckCircle className="w-16 h-16 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-16 h-16 text-orange-400" />
                )}
              </div>
            </Card>

            {/* Breakdown */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h4 className="font-bold text-white mb-4">Performance Breakdown</h4>
              <div className="space-y-3">
                {Object.entries(evaluation.breakdown).map(([category, score]) => (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-300 capitalize">
                        {category}
                      </span>
                      <span className="text-sm font-bold text-[#D4AF37]">{score}%</span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E5C158]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Strengths */}
            <Card className="bg-emerald-500/10 border-emerald-500/30 p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-400 mb-2">What You Did Well</h4>
                  <ul className="space-y-1">
                    {evaluation.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-emerald-300">
                        • {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Improvements */}
            <Card className="bg-amber-500/10 border-amber-500/30 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-400 mb-2">Areas to Improve</h4>
                  <ul className="space-y-1">
                    {evaluation.improvements.map((improvement, idx) => (
                      <li key={idx} className="text-sm text-amber-300">
                        • {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {attempts < 3 && (
                <Button
                  onClick={handleTryAgain}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-6 rounded-lg flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Try Again ({3 - attempts} left)
                </Button>
              )}
              <Button
                onClick={onComplete}
                className="flex-1 bg-[#D4AF37] hover:bg-[#E5C158] text-slate-900 font-semibold px-6 py-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/40"
              >
                Continue to Simulation
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};
