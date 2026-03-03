import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Clock } from "lucide-react";
import PlatformLayout from "@/components/PlatformLayout";
import ComingSoonModal from "@/components/ComingSoonModal";
import { layersData } from "@/lib/layersData";
import { useAuth } from "@/contexts/AuthContext";
import { getPracticeHistory } from "@/lib/persistence";

const toolRoutes: Record<string, string> = {
  "hostile-qa-gauntlet": "/app/practice/hostile-qa",
  "ai-debate-club": "/app/practice/debate",
  "async-peer-debate": "/app/practice/peer-debate",
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "available") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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

const Practice = () => {
  const practiceLayer = layersData.find(l => l.id === "practice")!;
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [comingSoon, setComingSoon] = useState<{ open: boolean; name: string; id: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"tools" | "history">("tools");

  const history = currentUser ? getPracticeHistory(currentUser.id) : [];

  const handleCardClick = (tool: typeof practiceLayer.tools[0]) => {
    const route = toolRoutes[tool.id];
    if (route) {
      navigate(route);
    } else {
      setComingSoon({ open: true, name: tool.name, id: tool.id });
    }
  };

  const getAttemptCount = (toolId: string) => {
    const practiceId = toolId === "hostile-qa-gauntlet" ? "hostile-qa" :
                       toolId === "ai-debate-club" ? "ai-debate" :
                       toolId === "async-peer-debate" ? "peer-debate" : toolId;
    return history.filter(h => h.practiceId === practiceId).length;
  };

  return (
    <PlatformLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-xs text-[#B89A5A] tracking-[0.2em] uppercase font-medium mb-1">Layer C</p>
        <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] tracking-tight mb-2">
          My Practice
        </h1>
        <p className="text-[#8E96A3] text-sm">
          Simulation &amp; Social — pressure test your communication
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["tools", "history"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === tab
                ? "bg-[#B89A5A] text-[#0B1A2A]"
                : "bg-[#1C1F26] text-[#8E96A3] border border-white/10 hover:text-[#F4F2ED]"
            }`}
          >
            {tab === "tools" ? "Practice Modes" : `History (${history.length})`}
          </button>
        ))}
      </div>

      {activeTab === "tools" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {practiceLayer.tools.map((tool, i) => {
            const route = toolRoutes[tool.id];
            const attemptCount = getAttemptCount(tool.id);

            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleCardClick(tool)}
                className={`rounded-xl bg-[#1C1F26] border p-5 flex flex-col transition-all duration-200 cursor-pointer ${
                  route
                    ? "border-[#B89A5A]/10 hover:border-[#B89A5A]/30"
                    : "border-white/5 hover:border-[#B89A5A]/20"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#B89A5A]/10 flex items-center justify-center shrink-0">
                    <span className="text-2xl">{
                      tool.id === "hostile-qa-gauntlet" ? "🔥" :
                      tool.id === "ai-debate-club" ? "🎙️" :
                      tool.id === "async-peer-debate" ? "💬" :
                      "🏛️"
                    }</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {attemptCount > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#B89A5A]/20 text-[#B89A5A] border border-[#B89A5A]/20">
                        {attemptCount} attempt{attemptCount !== 1 ? "s" : ""}
                      </span>
                    )}
                    <StatusBadge status={route ? "available" : tool.status} />
                  </div>
                </div>

                <h3 className="font-semibold text-base text-[#F4F2ED] mb-2">{tool.name}</h3>
                <p className="text-sm text-[#8E96A3] leading-relaxed flex-1 mb-4">{tool.description}</p>

                {route ? (
                  <div className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-[#B89A5A]">
                    Start Practice
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                ) : (
                  <div className="mt-auto flex items-center gap-1.5 text-xs text-[#B89A5A]/70">
                    <Lock className="h-3 w-3" />
                    Click to register interest
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {activeTab === "history" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {history.length === 0 ? (
            <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-8 text-center">
              <p className="text-[#8E96A3] text-sm">No practice attempts yet.</p>
              <p className="text-xs text-[#8E96A3]/60 mt-1">Complete a practice session to see your history here.</p>
            </div>
          ) : (
            history.map(attempt => (
              <div key={attempt.id} className="rounded-xl bg-[#1C1F26] border border-white/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-[#F4F2ED]">{attempt.practiceName}</p>
                    <p className="text-xs text-[#8E96A3] flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {new Date(attempt.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#B89A5A]">{attempt.score}</p>
                    <p className="text-xs text-[#8E96A3]">score</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {comingSoon && (
        <ComingSoonModal
          open={comingSoon.open}
          onOpenChange={open => setComingSoon(prev => prev ? { ...prev, open } : null)}
          moduleName={comingSoon.name}
          moduleId={comingSoon.id}
          moduleType="practice"
        />
      )}
    </PlatformLayout>
  );
};

export default Practice;
