import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Clock, ChevronDown, ChevronUp } from "lucide-react";
import PlatformLayout from "@/components/PlatformLayout";
import ComingSoonModal from "@/components/ComingSoonModal";
import { layersData } from "@/lib/layersData";
import { useAuth } from "@/contexts/AuthContext";
import { getToolkitHistory } from "@/lib/persistence";

const toolRoutes: Record<string, string> = {
  "rescue-mode": "/app/toolkit/rescue-mode",
  "grammar-on-demand": "/app/toolkit/grammar",
  "email-tone-translator": "/app/toolkit/email-tone",
  "vocabulary-accelerator": "/app/toolkit/vocabulary",
  "meeting-prep-tool": "/app/toolkit/meeting-prep",
  "ai-coach-persona": "/app/toolkit/coach-personas",
  "shadow-coach": "/app/toolkit/shadow-coach",
};

const comingSoonTools = ["presentation-rehearsal-studio"];

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "available") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        Available
      </span>
    );
  }
  if (status === "beta") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#B89A5A]/20 text-[#B89A5A] border border-[#B89A5A]/30 tracking-wider uppercase">
        BETA
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

const Toolkit = () => {
  const toolkitLayer = layersData.find(l => l.id === "toolkit")!;
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [comingSoon, setComingSoon] = useState<{ open: boolean; name: string; id: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"tools" | "history">("tools");
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const history = currentUser ? getToolkitHistory(currentUser.id) : [];

  const handleCardClick = (tool: typeof toolkitLayer.tools[0]) => {
    const route = toolRoutes[tool.id];
    if (route) {
      navigate(route);
    } else {
      setComingSoon({ open: true, name: tool.name, id: tool.id });
    }
  };

  const getUsageCount = (toolId: string) => {
    return history.filter(h => h.toolId === toolId).length;
  };

  return (
    <PlatformLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-xs text-[#B89A5A] tracking-[0.2em] uppercase font-medium mb-1">Layer A</p>
        <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] tracking-tight mb-2">
          My Toolkit
        </h1>
        <p className="text-[#8E96A3] text-sm">
          On-demand utilities to solve immediate problems
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
            {tab === "tools" ? "All Tools" : `History (${history.length})`}
          </button>
        ))}
      </div>

      {activeTab === "tools" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {toolkitLayer.tools.map((tool, i) => {
            const route = toolRoutes[tool.id];
            const usageCount = getUsageCount(tool.id);

            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleCardClick(tool)}
                className={`rounded-xl bg-[#1C1F26] border p-5 flex flex-col transition-all duration-200 cursor-pointer ${
                  route
                    ? "border-[#B89A5A]/10 hover:border-[#B89A5A]/30"
                    : "border-white/5 hover:border-[#B89A5A]/20"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center shrink-0">
                    <span className="text-lg">{
                      tool.id === "rescue-mode" ? "🚨" :
                      tool.id === "grammar-on-demand" ? "📚" :
                      tool.id === "email-tone-translator" ? "✉️" :
                      tool.id === "vocabulary-accelerator" ? "⚡" :
                      tool.id === "meeting-prep-tool" ? "📅" :
                      tool.id === "ai-coach-persona" ? "🤖" :
                      tool.id === "shadow-coach" ? "🪞" :
                      "🛠️"
                    }</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {usageCount > 0 && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#B89A5A]/20 text-[#B89A5A] border border-[#B89A5A]/20">
                        {usageCount}×
                      </span>
                    )}
                    <StatusBadge status={route ? (tool.status === "beta" ? "beta" : "available") : tool.status} />
                  </div>
                </div>

                <h3 className="font-semibold text-sm text-[#F4F2ED] mb-1.5">{tool.name}</h3>
                <p className="text-xs text-[#8E96A3] leading-relaxed flex-1 mb-4">{tool.description}</p>

                {route ? (
                  <div className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-[#B89A5A]">
                    Open Tool
                    <ArrowRight className="h-3 w-3" />
                  </div>
                ) : (
                  <div className="mt-auto flex items-center gap-1 text-xs text-[#B89A5A]/60">
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
            <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-10 text-center">
              <div className="text-4xl mb-4">🛠️</div>
              <p className="text-sm font-semibold text-[#F4F2ED] mb-1">No history yet</p>
              <p className="text-xs text-[#8E96A3] mb-4">Use a tool to see your results here.</p>
              <button
                onClick={() => setActiveTab("tools")}
                className="inline-flex items-center gap-1.5 text-xs text-[#B89A5A] hover:text-[#d4ba6a] transition-colors font-semibold"
              >
                Open a Tool <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ) : (
            history.map(entry => {
              const isExpanded = expandedEntry === entry.id;
              const resultText = typeof entry.outputs?.result === "string"
                ? entry.outputs.result
                : JSON.stringify(entry.outputs, null, 2);
              const preview = resultText.slice(0, 100) + (resultText.length > 100 ? "…" : "");

              return (
                <div key={entry.id} className="rounded-xl bg-[#1C1F26] border border-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#B89A5A] bg-[#B89A5A]/10 border border-[#B89A5A]/20 px-2 py-0.5 rounded">
                          {entry.toolName}
                        </span>
                        <span className="text-xs text-[#8E96A3] flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(entry.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                          {" · "}
                          {new Date(entry.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-[#8E96A3] line-clamp-2">{isExpanded ? resultText : preview}</p>
                    </div>
                    <button
                      onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                      className="shrink-0 flex items-center gap-1 text-xs text-[#B89A5A] hover:text-[#d4ba6a] transition-colors font-semibold"
                    >
                      {isExpanded ? (
                        <><ChevronUp className="h-3.5 w-3.5" /> Hide</>
                      ) : (
                        <><ChevronDown className="h-3.5 w-3.5" /> View</>
                      )}
                    </button>
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-white/5">
                          {entry.inputs?.input && (
                            <div className="mb-2">
                              <p className="text-[10px] text-[#8E96A3] uppercase tracking-wider mb-1">Input</p>
                              <p className="text-xs text-[#F4F2ED]/70 bg-white/[0.03] rounded px-3 py-2">{entry.inputs.input}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-[10px] text-[#8E96A3] uppercase tracking-wider mb-1">Result</p>
                            <p className="text-xs text-[#F4F2ED]/80 whitespace-pre-line bg-white/[0.03] rounded px-3 py-2">{resultText}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </motion.div>
      )}

      {comingSoon && (
        <ComingSoonModal
          open={comingSoon.open}
          onOpenChange={open => setComingSoon(prev => prev ? { ...prev, open } : null)}
          moduleName={comingSoon.name}
          moduleId={comingSoon.id}
          moduleType="toolkit"
        />
      )}
    </PlatformLayout>
  );
};

export default Toolkit;
