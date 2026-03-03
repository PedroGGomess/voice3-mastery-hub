import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, CheckCircle2, Lock, Play, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PlatformLayout from "@/components/PlatformLayout";
import ComingSoonModal from "@/components/ComingSoonModal";
import { segmentsData } from "@/lib/segmentsData";
import { useAuth } from "@/contexts/AuthContext";
import { startProgramme, getProgrammeProgress } from "@/lib/persistence";

const LevelBadge = ({ level }: { level: string }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#B89A5A]/10 text-[#B89A5A] border border-[#B89A5A]/20 tracking-wider">
    {level}
  </span>
);

const ProgrammeDetail = () => {
  const { programmeId } = useParams<{ programmeId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  // Find programme across all segments
  let programme = null;
  let segmentName = "";
  for (const segment of segmentsData) {
    const found = segment.programmes.find(p => p.id === programmeId);
    if (found) {
      programme = found;
      segmentName = segment.name;
      break;
    }
  }

  if (!programme) {
    return (
      <PlatformLayout>
        <div className="text-center py-20">
          <p className="text-[#8E96A3]">Programme not found.</p>
          <button onClick={() => navigate("/app/catalogue")} className="mt-4 text-[#B89A5A] text-sm hover:underline">
            ← Back to Catalogue
          </button>
        </div>
      </PlatformLayout>
    );
  }

  const progress = currentUser ? getProgrammeProgress(currentUser.id, programme.id) : null;
  const completedCount = progress
    ? Object.values(progress.sessionsProgress).filter(s => s.completed).length
    : 0;
  const progressPercent = progress ? Math.round((completedCount / programme.sessions) * 100) : 0;

  const handleStart = () => {
    if (!currentUser) return;
    startProgramme(currentUser.id, programme!.id, programme!.sessions);
    toast.success("Programme started!", {
      description: `"${programme!.title}" has been added to your dashboard.`,
    });
    navigate("/app/sessoes");
  };

  return (
    <PlatformLayout>
      {/* Back nav */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/app/catalogue")}
        className="flex items-center gap-2 text-sm text-[#8E96A3] hover:text-[#F4F2ED] mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Catalogue
      </motion.button>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-[#1C1F26] border border-[#B89A5A]/20 p-6 mb-6"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs text-[#B89A5A] tracking-[0.15em] uppercase font-medium mb-2">
              {segmentName}
            </p>
            <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] tracking-tight mb-3">
              {programme.title}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <LevelBadge level={programme.level} />
              <span className="flex items-center gap-1 text-xs text-[#8E96A3]">
                <BookOpen className="h-3 w-3" />
                {programme.sessions} sessions
              </span>
              <span className="flex items-center gap-1 text-xs text-[#8E96A3]">
                <Clock className="h-3 w-3" />
                {programme.duration}
              </span>
            </div>
          </div>
          {programme.isFlagship && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-[#B89A5A] text-[#0B1A2A] tracking-wider uppercase shrink-0">
              ★ Flagship
            </span>
          )}
        </div>

        <p className="text-[#8E96A3] text-sm leading-relaxed mb-5">{programme.description}</p>

        {/* Progress bar if active */}
        {progress && (
          <div className="mb-5">
            <div className="flex justify-between text-xs text-[#8E96A3] mb-1.5">
              <span>Progress</span>
              <span>{completedCount}/{programme.sessions} sessions — {progressPercent}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-[#B89A5A] rounded-full"
              />
            </div>
          </div>
        )}

        {/* CTA */}
        {programme.status === "available" ? (
          progress ? (
            <Button
              onClick={handleStart}
              className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold h-10 px-6"
            >
              <Play className="h-4 w-4 mr-2" />
              Continue Programme
            </Button>
          ) : (
            <Button
              onClick={handleStart}
              className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold h-10 px-6"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Programme
            </Button>
          )
        ) : (
          <Button
            onClick={() => setComingSoonOpen(true)}
            variant="outline"
            className="border-[#B89A5A]/30 text-[#B89A5A] hover:bg-[#B89A5A]/10 h-10 px-6"
          >
            <Lock className="h-4 w-4 mr-2" />
            Notify Me When Available
          </Button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Outcomes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-[#1C1F26] border border-white/5 p-6"
        >
          <h2 className="font-semibold text-sm text-[#F4F2ED] mb-4 uppercase tracking-wider">
            What You Will Learn
          </h2>
          <ul className="space-y-2.5">
            {programme.outcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#B89A5A] shrink-0 mt-0.5" />
                <span className="text-sm text-[#8E96A3] leading-snug">{outcome}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Programme Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl bg-[#1C1F26] border border-white/5 p-6"
        >
          <h2 className="font-semibold text-sm text-[#F4F2ED] mb-4 uppercase tracking-wider">
            Programme Structure
          </h2>
          <div className="space-y-2">
            {programme.modules.map((module, i) => {
              const isCompleted = progress?.sessionsProgress[i]?.completed;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    isCompleted ? "bg-emerald-500/5" : "bg-white/[0.02]"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-xs font-bold ${
                    isCompleted
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-white/5 border-white/10 text-[#8E96A3]"
                  }`}>
                    {isCompleted ? "✓" : i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#F4F2ED] leading-snug">{module.title}</p>
                    <p className="text-xs text-[#8E96A3] mt-0.5">{module.description}</p>
                  </div>
                  {progress?.currentSessionIndex === i && !isCompleted && (
                    <ChevronRight className="h-4 w-4 text-[#B89A5A] shrink-0 ml-auto" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <ComingSoonModal
        open={comingSoonOpen}
        onOpenChange={setComingSoonOpen}
        moduleName={programme.title}
        moduleId={programme.id}
        moduleType="programme"
      />
    </PlatformLayout>
  );
};

export default ProgrammeDetail;
