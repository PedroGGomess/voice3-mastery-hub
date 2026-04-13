import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface BriefingStageProps {
  title: string;
  framework: string;
  content: string;
  diagramUrl?: string;
  onComplete: () => void;
}

export const BriefingStage = ({
  title,
  framework,
  content,
  diagramUrl,
  onComplete,
}: BriefingStageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Header Card */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-[#D4AF37] font-semibold text-sm mb-4">Framework: {framework}</p>
        </motion.div>
      </Card>

      {/* Content Card */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <p className="text-slate-200 leading-relaxed">{content}</p>

          {/* Diagram Placeholder */}
          {diagramUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 rounded-lg bg-slate-900 p-8 flex items-center justify-center min-h-[300px]"
            >
              <img
                src={diagramUrl}
                alt="Concept diagram"
                className="max-w-full h-auto rounded"
              />
            </motion.div>
          )}

          {!diagramUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 rounded-lg bg-slate-900 p-8 flex items-center justify-center min-h-[200px] border-2 border-dashed border-slate-700"
            >
              <div className="text-center">
                <div className="text-slate-500 text-sm">Diagram placeholder</div>
                <div className="text-slate-600 text-xs mt-1">Optional diagram or image</div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </Card>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <Button
          onClick={onComplete}
          className="bg-[#D4AF37] hover:bg-[#E5C158] text-slate-900 font-semibold px-8 py-6 rounded-lg flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/40"
        >
          I understand, let's practice
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};
