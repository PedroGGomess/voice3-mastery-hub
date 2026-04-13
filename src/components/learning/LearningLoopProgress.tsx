import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface LearningLoopProgressProps {
  currentStage: 1 | 2 | 3 | 4 | 5;
  completedStages: number[];
}

const STAGES = [
  { number: 1, label: "Briefing" },
  { number: 2, label: "Drill" },
  { number: 3, label: "Simulation" },
  { number: 4, label: "Error Bank" },
  { number: 5, label: "Vault" },
];

export const LearningLoopProgress = ({ currentStage, completedStages }: LearningLoopProgressProps) => {
  return (
    <div className="w-full mb-8">
      {/* Desktop - Horizontal Layout */}
      <div className="hidden md:flex items-center justify-between gap-2">
        {STAGES.map((stage, index) => {
          const isCompleted = completedStages.includes(stage.number);
          const isCurrent = currentStage === stage.number;
          const isUpcoming = stage.number > currentStage;

          return (
            <div key={stage.number} className="flex-1 flex items-center">
              {/* Circle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : isCurrent
                    ? "bg-[#D4AF37] text-slate-900 shadow-lg shadow-[#D4AF37]/40"
                    : isUpcoming
                    ? "bg-slate-700 text-slate-400 border border-slate-600"
                    : "bg-slate-700 text-slate-400 border border-slate-600"
                }`}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: index * 0.1 + 0.1 }}
                  >
                    <Check className="w-6 h-6" />
                  </motion.div>
                ) : (
                  stage.number
                )}
              </motion.div>

              {/* Connector Line */}
              {index < STAGES.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 + 0.05, duration: 0.4 }}
                  className={`flex-1 h-1 mx-2 transition-all duration-300 origin-left ${
                    isCompleted ? "bg-emerald-500" : isCurrent ? "bg-[#D4AF37]" : "bg-slate-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile - Vertical Layout */}
      <div className="md:hidden space-y-3">
        {STAGES.map((stage, index) => {
          const isCompleted = completedStages.includes(stage.number);
          const isCurrent = currentStage === stage.number;

          return (
            <motion.div
              key={stage.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : isCurrent
                    ? "bg-[#D4AF37] text-slate-900 shadow-lg shadow-[#D4AF37]/40"
                    : "bg-slate-700 text-slate-400 border border-slate-600"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stage.number}
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-300 ${
                  isCurrent ? "text-[#D4AF37]" : isCompleted ? "text-emerald-500" : "text-slate-400"
                }`}
              >
                {stage.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
