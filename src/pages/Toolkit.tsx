import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, ChevronDown, ChevronUp } from "lucide-react";
import PlatformLayout from "@/components/PlatformLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getToolkitHistory } from "@/lib/persistence";

interface ToolCard {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  colorBg: string;
  colorBorder: string;
  badge: string;
  path: string;
}

const tools: ToolCard[] = [
  {
    id: "rescue-mode",
    icon: "🚨",
    title: "Rescue Mode",
    subtitle: "Emergency Meeting Prep",
    description: "Got a high-stakes meeting in 60 minutes? Generate an instant drill for any meeting type.",
    color: "#ef4444",
    colorBg: "rgba(239,68,68,0.08)",
    colorBorder: "rgba(239,68,68,0.2)",
    badge: "INSTANT",
    path: "/app/toolkit/rescue-mode",
  },
  {
    id: "grammar",
    icon: "📝",
    title: "Grammar Tool",
    subtitle: "Executive Writing Corrector",
    description: "Paste any text. Get instant executive-level grammar correction with explanation.",
    color: "#3b82f6",
    colorBg: "rgba(59,130,246,0.08)",
    colorBorder: "rgba(59,130,246,0.2)",
    badge: "AI-POWERED",
    path: "/app/toolkit/grammar",
  },
  {
    id: "qa-gauntlet",
    icon: "⚔️",
    title: "Q&A Gauntlet",
    subtitle: "5-Round Pressure Testing",
    description: "Face 5 rounds of aggressive executive questions. Hold your position under pressure.",
    color: "#f59e0b",
    colorBg: "rgba(245,158,11,0.08)",
    colorBorder: "rgba(245,158,11,0.2)",
    badge: "5 ROUNDS",
    path: "/app/practice/hostile-qa",
  },
  {
    id: "email-tone",
    icon: "✉️",
    title: "Email Tone",
    subtitle: "Professional Email Rewriter",
    description: "Paste your email. Get 3 versions: formal, assertive, and diplomatic — instantly.",
    color: "#8b5cf6",
    colorBg: "rgba(139,92,246,0.08)",
    colorBorder: "rgba(139,92,246,0.2)",
    badge: "3 VERSIONS",
    path: "/app/toolkit/email-tone",
  },
  {
    id: "debate",
    icon: "💬",
    title: "AI Debate Club",
    subtitle: "Defend Your Position",
    description: "Your AI opponent argues the opposite side. Sharpen your executive argumentation.",
    color: "#10b981",
    colorBg: "rgba(16,185,129,0.08)",
    colorBorder: "rgba(16,185,129,0.2)",
    badge: "ADVERSARIAL",
    path: "/app/practice/debate",
  },
  {
    id: "presentation",
    icon: "🎤",
    title: "Presentation Coach",
    subtitle: "Structure Any Presentation",
    description: "Enter topic and audience. Get a full executive presentation structure instantly.",
    color: "#C9A84C",
    colorBg: "rgba(201,168,76,0.08)",
    colorBorder: "rgba(201,168,76,0.2)",
    badge: "NEW",
    path: "/app/toolkit/presentation",
  },
];

const Toolkit = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"tools" | "history">("tools");
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const history = currentUser ? getToolkitHistory(currentUser.id) : [];

  return (
    <PlatformLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-xs text-[#C9A84C] tracking-[0.2em] uppercase font-medium mb-1">Premium Toolkit</p>
        <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] tracking-tight mb-2">
          My Toolkit
        </h1>
        <p className="text-[#8E96A3] text-sm">
          On-demand utilities to solve immediate executive communication challenges
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
                ? "bg-[#C9A84C] text-[#0a1628]"
                : "bg-[#1C1F26] text-[#8E96A3] border border-white/10 hover:text-[#F4F2ED]"
            }`}
          >
            {tab === "tools" ? "All Tools" : `History (${history.length})`}
          </button>
        ))}
      </div>

      {activeTab === "tools" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onMouseEnter={() => setHoveredCard(tool.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: tool.colorBg,
                border: `1px solid ${hoveredCard === tool.id ? tool.color : tool.colorBorder}`,
                borderRadius: 20,
                padding: 28,
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s",
                transform: hoveredCard === tool.id ? "translateY(-6px)" : "translateY(0)",
                boxShadow: hoveredCard === tool.id ? "0 20px 50px rgba(0,0,0,0.4)" : "none",
              }}
            >
              {/* Badge top-right */}
              <span style={{
                position: "absolute", top: 16, right: 16,
                fontSize: 9, letterSpacing: "0.12em", fontWeight: 800,
                padding: "4px 10px", borderRadius: 100,
                background: tool.colorBg, border: `1px solid ${tool.colorBorder}`, color: tool.color,
              }}>
                {tool.badge}
              </span>

              {/* Icon */}
              <div style={{ fontSize: 44, marginBottom: 16, lineHeight: 1 }}>{tool.icon}</div>

              {/* Title */}
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: "#F4F2ED" }}>{tool.title}</h3>
              <p style={{ fontSize: 12, color: tool.color, fontWeight: 600, marginBottom: 12, letterSpacing: "0.04em" }}>
                {tool.subtitle}
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, marginBottom: 20 }}>
                {tool.description}
              </p>

              <button
                onClick={() => navigate(tool.path)}
                style={{
                  height: 38, padding: "0 20px",
                  background: tool.color, color: "#060f1d",
                  fontWeight: 700, fontSize: 13, borderRadius: 8, border: "none", cursor: "pointer",
                }}
              >
                Open Tool →
              </button>

              {/* Decorative bg icon */}
              <span style={{
                position: "absolute", bottom: -10, right: -10,
                fontSize: 100, fontWeight: 900,
                opacity: 0.04, color: tool.color,
                fontFamily: "serif", lineHeight: 1, userSelect: "none",
                pointerEvents: "none",
              }}>
                {tool.icon}
              </span>
            </motion.div>
          ))}
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
                className="inline-flex items-center gap-1.5 text-xs text-[#C9A84C] hover:text-[#d4ba6a] transition-colors font-semibold"
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
                        <span className="text-xs font-bold text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/20 px-2 py-0.5 rounded">
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
                      className="shrink-0 flex items-center gap-1 text-xs text-[#C9A84C] hover:text-[#d4ba6a] transition-colors font-semibold"
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
    </PlatformLayout>
  );
};

export default Toolkit;
