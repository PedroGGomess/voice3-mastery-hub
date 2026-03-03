import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Star, Clock, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PlatformLayout from "@/components/PlatformLayout";
import ComingSoonModal from "@/components/ComingSoonModal";
import { segmentsData } from "@/lib/segmentsData";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProgrammes } from "@/lib/persistence";

const LevelBadge = ({ level }: { level: string }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#B89A5A]/10 text-[#B89A5A] border border-[#B89A5A]/20 tracking-wider">
    {level}
  </span>
);

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "available") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        Available
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-[#8E96A3] border border-white/10">
      <Lock className="h-2.5 w-2.5" />
      Coming Soon
    </span>
  );
};

const Catalogue = () => {
  const [activeSegmentId, setActiveSegmentId] = useState(segmentsData[0].id);
  const [comingSoon, setComingSoon] = useState<{ open: boolean; name: string; id: string } | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const userProgrammes = currentUser ? getUserProgrammes(currentUser.id) : [];
  const activeSegment = segmentsData.find(s => s.id === activeSegmentId) || segmentsData[0];

  const handleCardClick = (programme: typeof activeSegment.programmes[0]) => {
    if (programme.status === "coming_soon") {
      setComingSoon({ open: true, name: programme.title, id: programme.id });
    } else {
      navigate(`/app/catalogue/${programme.id}`);
    }
  };

  return (
    <PlatformLayout>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-xs text-[#B89A5A] tracking-[0.2em] uppercase font-medium mb-1">VOICE³ Platform</p>
        <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] tracking-tight mb-2">
          Programme Catalogue
        </h1>
        <p className="text-[#8E96A3] text-sm">
          7 Segments. 35+ Programmes. One executive transformation.
        </p>
      </motion.div>

      {/* Segment Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6 overflow-x-auto pb-2"
      >
        <div className="flex gap-2 min-w-max">
          {segmentsData.map((segment) => (
            <button
              key={segment.id}
              onClick={() => setActiveSegmentId(segment.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 ${
                activeSegmentId === segment.id
                  ? "bg-[#B89A5A] text-[#0B1A2A]"
                  : "bg-[#1C1F26] text-[#8E96A3] border border-white/10 hover:border-[#B89A5A]/30 hover:text-[#F4F2ED]"
              }`}
            >
              <span className="opacity-60 text-[10px]">{segment.number}</span>
              {segment.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Active Segment */}
      <motion.div
        key={activeSegmentId}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Segment Header */}
        <div className="mb-6 p-5 rounded-xl bg-[#1C1F26] border border-[#B89A5A]/10">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-[#B89A5A]/10 border border-[#B89A5A]/20 shrink-0">
              <span className="text-[10px] text-[#B89A5A]/60 font-bold uppercase tracking-wider">SEG</span>
              <span className="text-lg font-bold text-[#B89A5A] leading-none">{activeSegment.number}</span>
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-[#F4F2ED] tracking-tight">
                {activeSegment.name}
                <span className="ml-2 text-[#8E96A3] font-normal text-base">— {activeSegment.tagline}</span>
              </h2>
              <p className="text-[#8E96A3] text-sm mt-1">{activeSegment.description}</p>
            </div>
          </div>
        </div>

        {/* Programme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeSegment.programmes.map((programme, i) => {
            const userProg = userProgrammes.find(p => p.programmeId === programme.id);
            const isInProgress = userProg && userProg.status === "active";

            return (
              <motion.div
                key={programme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleCardClick(programme)}
                className={`relative rounded-xl bg-[#1C1F26] border transition-all duration-200 p-5 flex flex-col cursor-pointer ${
                  programme.isFlagship
                    ? "border-[#B89A5A]/40 hover:border-[#B89A5A]/60"
                    : programme.status === "available"
                    ? "border-[#B89A5A]/20 hover:border-[#B89A5A]/40"
                    : "border-white/5 hover:border-[#B89A5A]/30"
                }`}
              >
                {/* Flagship badge */}
                {programme.isFlagship && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#B89A5A] text-[#0B1A2A] tracking-wider uppercase">
                      <Star className="h-2.5 w-2.5" />
                      Flagship
                    </span>
                  </div>
                )}
                {/* New badge */}
                {programme.isNew && !programme.isFlagship && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#B89A5A]/20 text-[#B89A5A] border border-[#B89A5A]/30 tracking-wider uppercase">
                      NEW
                    </span>
                  </div>
                )}
                {/* In Progress badge */}
                {isInProgress && !programme.isFlagship && !programme.isNew && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 tracking-wider uppercase">
                      IN PROGRESS
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <LevelBadge level={programme.level} />
                    <StatusBadge status={programme.status} />
                    {isInProgress && (programme.isFlagship || programme.isNew) && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 tracking-wider uppercase">
                        IN PROGRESS
                      </span>
                    )}
                  </div>
                  <h3 className={`font-semibold text-sm mb-2 mt-2 leading-snug ${programme.status === "coming_soon" ? "text-[#F4F2ED]/60" : "text-[#F4F2ED]"}`}>
                    {programme.title}
                  </h3>
                  <p className={`text-xs leading-relaxed mb-4 ${programme.status === "coming_soon" ? "text-[#8E96A3]/60" : "text-[#8E96A3]"}`}>
                    {programme.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-[#8E96A3]">
                      <BookOpen className="h-3 w-3" />
                      {programme.sessions} sessions
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#8E96A3]">
                      <Clock className="h-3 w-3" />
                      {programme.duration}
                    </span>
                  </div>

                  {programme.status === "available" ? (
                    <Button
                      size="sm"
                      className="h-7 px-3 text-xs bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-lg"
                      onClick={e => { e.stopPropagation(); handleCardClick(programme); }}
                    >
                      {isInProgress ? "Continue" : "Start Programme"}
                      <ArrowRight className="ml-1.5 h-3 w-3" />
                    </Button>
                  ) : (
                    <span className="text-xs text-[#8E96A3]/60 flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Coming Soon
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {comingSoon && (
        <ComingSoonModal
          open={comingSoon.open}
          onOpenChange={open => setComingSoon(prev => prev ? { ...prev, open } : null)}
          moduleName={comingSoon.name}
          moduleId={comingSoon.id}
          moduleType="programme"
        />
      )}
    </PlatformLayout>
  );
};

export default Catalogue;
