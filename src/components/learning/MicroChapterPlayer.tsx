import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trophy } from "lucide-react";
import { LearningLoopProgress } from "./LearningLoopProgress";
import { BriefingStage } from "./BriefingStage";
import { DrillStage } from "./DrillStage";
import { SimulationStage } from "./SimulationStage";
import { ErrorBankStage } from "./ErrorBankStage";
import { VaultStage } from "./VaultStage";

interface BriefingData {
  title: string;
  framework: string;
  content: string;
  diagramUrl?: string;
}

interface DrillData {
  instruction: string;
  example: string;
}

interface SimulationData {
  scenario: string;
  character: string;
}

interface Error {
  id: string;
  error: string;
  reason: string;
  correction: string;
}

interface Phrase {
  id: string;
  phrase: string;
  context: string;
  effectiveness: string;
}

interface ChapterData {
  title: string;
  briefing: BriefingData;
  drill: DrillData;
  simulation: SimulationData;
  errors: Error[];
  vault: Phrase[];
}

interface MicroChapterPlayerProps {
  chapterData: ChapterData;
  onComplete?: () => void;
}

export const MicroChapterPlayer = ({
  chapterData,
  onComplete,
}: MicroChapterPlayerProps) => {
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const handleStageComplete = () => {
    // Mark current stage as completed
    if (!completedStages.includes(currentStage)) {
      setCompletedStages([...completedStages, currentStage]);
    }

    // Move to next stage
    if (currentStage < 5) {
      setCurrentStage((currentStage + 1) as 1 | 2 | 3 | 4 | 5);
    } else {
      // All stages complete
      setIsComplete(true);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-0 py-6">
      {/* Progress Bar */}
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <LearningLoopProgress currentStage={currentStage} completedStages={completedStages} />
        </motion.div>
      )}

      {/* Stage Content */}
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key={`stage-${currentStage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {currentStage === 1 && (
              <BriefingStage
                title={chapterData.briefing.title}
                framework={chapterData.briefing.framework}
                content={chapterData.briefing.content}
                diagramUrl={chapterData.briefing.diagramUrl}
                onComplete={handleStageComplete}
              />
            )}

            {currentStage === 2 && (
              <DrillStage
                instruction={chapterData.drill.instruction}
                example={chapterData.drill.example}
                onComplete={handleStageComplete}
              />
            )}

            {currentStage === 3 && (
              <SimulationStage
                scenario={chapterData.simulation.scenario}
                character={chapterData.simulation.character}
                onComplete={handleStageComplete}
              />
            )}

            {currentStage === 4 && (
              <ErrorBankStage
                errors={chapterData.errors}
                onComplete={handleStageComplete}
              />
            )}

            {currentStage === 5 && (
              <VaultStage
                phrases={chapterData.vault}
                onComplete={handleStageComplete}
              />
            )}
          </motion.div>
        ) : (
          // Completion Screen
          <motion.div
            key="completion"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Header with Progress */}
            <LearningLoopProgress currentStage={5} completedStages={[1, 2, 3, 4, 5]} />

            {/* Celebration Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border-emerald-500/40 p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="mb-4 flex justify-center"
                >
                  <Trophy className="w-16 h-16 text-emerald-400 drop-shadow-lg drop-shadow-emerald-500/50" />
                </motion.div>

                <h2 className="text-3xl font-bold text-white mb-2">Micro-Chapter Complete!</h2>
                <p className="text-slate-300 text-lg mb-6">
                  You've successfully completed all 5 stages of this learning loop.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                  {[
                    { label: "Briefing", icon: "1" },
                    { label: "Drill", icon: "2" },
                    { label: "Simulation", icon: "3" },
                    { label: "Error Bank", icon: "4" },
                    { label: "Vault", icon: "5" },
                  ].map((stage) => (
                    <motion.div
                      key={stage.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-slate-800/50 rounded-lg p-3"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-300 font-semibold">{stage.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Achievement Details */}
                <Card className="bg-slate-800/30 border-slate-700/50 p-6 mb-8 text-left">
                  <h3 className="font-bold text-white mb-4">Your Achievement Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Concepts Learned</span>
                      <span className="text-[#D4AF37] font-bold">5/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Skills Practiced</span>
                      <span className="text-[#D4AF37] font-bold">15+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Errors Reviewed</span>
                      <span className="text-[#D4AF37] font-bold">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Phrases Mastered</span>
                      <span className="text-[#D4AF37] font-bold">5</span>
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={onComplete}
                    className="bg-[#D4AF37] hover:bg-[#E5C158] text-slate-900 font-semibold px-8 py-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/40"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Next Chapter
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 font-semibold px-8 py-6 rounded-lg"
                  >
                    Review This Chapter
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="font-bold text-white mb-4">What's Next?</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 items-start">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">
                      Start the next micro-chapter to build on your skills
                    </span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">
                      Review your error bank and vault phrases for reinforcement
                    </span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">
                      Practice in real conversations and track your progress
                    </span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
