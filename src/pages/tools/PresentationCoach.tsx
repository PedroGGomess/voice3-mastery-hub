import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import PlatformLayout from "@/components/PlatformLayout";
import { useAuth } from "@/contexts/AuthContext";
import { saveToolkitEntry, awardPoints } from "@/lib/persistence";
import { useAICoach } from "@/hooks/useAICoach";
import LoadingAI from "@/components/LoadingAI";

const AUDIENCE_TYPES = [
  "Board of Directors",
  "Executive Team (C-Suite)",
  "Client / Prospect",
  "Investors",
  "All-Company Meeting",
  "External Conference",
  "Technical Team",
  "Sales Team",
];

const PresentationCoach = () => {
  const { currentUser } = useAuth();
  const { sendMessage } = useAICoach();
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [duration, setDuration] = useState("15");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim() || !audience) return;
    setLoading(true);
    setResult(null);
    try {
      const prompt = `You are an executive English communication coach.
The user needs to deliver a ${duration}-minute presentation on: "${topic}"
Audience: ${audience}

Generate a complete executive presentation structure with:
1. A powerful hook / opening statement (15-30 seconds)
2. The core message in one sentence (the "so what")
3. Three main sections with key points and supporting evidence
4. Transition phrases between sections
5. A memorable closing statement with a clear call to action
6. Three executive phrases to use throughout
7. One thing to absolutely avoid

Be direct, structured, and executive-level. Format clearly with headers.`;

      const response = await sendMessage(
        [{ role: "user", content: prompt }],
        "rescue-mode",
        { topic, audience, duration }
      );
      setResult(response);

      if (currentUser) {
        saveToolkitEntry(currentUser.id, {
          toolId: "presentation-coach",
          toolName: "Presentation Coach",
          inputs: { topic, audience, duration: `${duration} min` },
          outputs: { result: response },
        });
        awardPoints(currentUser.id, {
          source: "toolkit",
          sourceId: "presentation-coach",
          sourceName: "Presentation Coach",
          points: 25,
        });
        toast.success("+25 points earned!");
      }
    } catch (_e) {
      toast.error("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-xs text-[#C9A84C] tracking-[0.2em] uppercase font-medium mb-1">Toolkit Premium</p>
        <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] tracking-tight mb-2">
          🎤 Presentation Coach
        </h1>
        <p className="text-[#8E96A3] text-sm">
          Enter your topic and audience — get a full executive presentation structure instantly.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6"
          style={{
            background: "rgba(201,168,76,0.08)",
            border: "1px solid rgba(201,168,76,0.2)",
          }}
        >
          <h2 className="text-sm font-semibold text-[#F4F2ED] mb-5">Configure Your Presentation</h2>

          {/* Topic */}
          <div className="mb-4">
            <label className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium block mb-2">
              Presentation Topic
            </label>
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Q3 Financial Results, New Product Launch, Team Restructuring..."
              className="w-full px-4 py-3 rounded-xl text-sm text-[#F4F2ED] placeholder-[#8E96A3]/50 outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onFocus={e => (e.target.style.borderColor = "rgba(201,168,76,0.4)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Audience */}
          <div className="mb-4">
            <label className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium block mb-2">
              Audience
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AUDIENCE_TYPES.map(a => (
                <button
                  key={a}
                  onClick={() => setAudience(a)}
                  className="text-xs px-3 py-2.5 rounded-lg text-left transition-all"
                  style={{
                    background: audience === a ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.03)",
                    border: audience === a ? "1px solid rgba(201,168,76,0.4)" : "1px solid rgba(255,255,255,0.07)",
                    color: audience === a ? "#C9A84C" : "rgba(255,255,255,0.6)",
                    fontWeight: audience === a ? 600 : 400,
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6">
            <label className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium block mb-2">
              Duration: {duration} minutes
            </label>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full accent-[#C9A84C]"
            />
            <div className="flex justify-between text-[10px] text-[#8E96A3] mt-1">
              <span>5 min</span>
              <span>30 min</span>
              <span>60 min</span>
            </div>
          </div>

          <button
            onClick={generate}
            disabled={!topic.trim() || !audience || loading}
            className="w-full h-12 rounded-xl font-bold text-sm transition-all"
            style={{
              background: topic.trim() && audience ? "#C9A84C" : "rgba(201,168,76,0.2)",
              color: topic.trim() && audience ? "#060f1d" : "rgba(201,168,76,0.4)",
              cursor: topic.trim() && audience ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Generating..." : "Generate Structure →"}
          </button>
        </motion.div>

        {/* Result Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            minHeight: 300,
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full min-h-[250px]">
              <LoadingAI message="Building your presentation structure..." />
            </div>
          ) : result ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-[#F4F2ED]">Your Presentation Structure</h2>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                    toast.success("Copied to clipboard!");
                  }}
                  className="text-xs text-[#C9A84C] hover:text-[#E8C97A] transition-colors font-medium"
                >
                  Copy All
                </button>
              </div>
              <div className="text-sm text-[#F4F2ED]/85 whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center">
              <span className="text-5xl mb-4">🎤</span>
              <p className="text-sm font-semibold text-[#F4F2ED] mb-2">Ready to structure your presentation</p>
              <p className="text-xs text-[#8E96A3]">Fill in the topic and audience, then click Generate.</p>
            </div>
          )}
        </motion.div>
      </div>
    </PlatformLayout>
  );
};

export default PresentationCoach;
