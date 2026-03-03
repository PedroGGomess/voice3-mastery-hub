import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import PlatformLayout from "@/components/PlatformLayout";
import { layersData } from "@/lib/layersData";

const toolRoutes: Record<string, string> = {
  "rescue-mode": "/app/toolkit/rescue-mode",
  "grammar-on-demand": "/app/toolkit/grammar",
};

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

  return (
    <PlatformLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-xs text-[#B89A5A] tracking-[0.2em] uppercase font-medium mb-1">Layer A</p>
        <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] tracking-tight mb-2">
          My Toolkit
        </h1>
        <p className="text-[#8E96A3] text-sm">
          On-demand utilities to solve immediate problems
        </p>
      </motion.div>

      {/* Tool Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {toolkitLayer.tools.map((tool, i) => {
          const route = toolRoutes[tool.id];
          const isClickable = tool.status === "available" && route;

          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-xl bg-[#1C1F26] border p-5 flex flex-col transition-all duration-200 ${
                tool.status === "coming_soon"
                  ? "border-white/5 opacity-60"
                  : "border-[#B89A5A]/10 hover:border-[#B89A5A]/30"
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
                <StatusBadge status={tool.status} />
              </div>

              <h3 className="font-semibold text-sm text-[#F4F2ED] mb-1.5">{tool.name}</h3>
              <p className="text-xs text-[#8E96A3] leading-relaxed flex-1 mb-4">{tool.description}</p>

              {isClickable ? (
                <Link
                  to={route}
                  className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-[#B89A5A] hover:text-[#d4ba6a] transition-colors"
                >
                  Open Tool
                  <ArrowRight className="h-3 w-3" />
                </Link>
              ) : tool.status === "beta" ? (
                <span className="mt-auto text-xs text-[#8E96A3]">Available in beta — coming to your dashboard soon</span>
              ) : (
                <span className="mt-auto text-xs text-[#8E96A3]/50 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Coming Soon
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </PlatformLayout>
  );
};

export default Toolkit;
