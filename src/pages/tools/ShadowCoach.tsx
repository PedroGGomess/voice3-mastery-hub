import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Upload, ChevronRight, Copy, History, CheckCircle, AlertCircle, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import PlatformLayout from "@/components/PlatformLayout";
import { useAuth } from "@/contexts/AuthContext";
import { saveToolkitEntry, getToolkitHistory, awardPoints } from "@/lib/persistence";
import type { ToolkitEntry } from "@/lib/persistence";

interface AnalysisOutput {
  clarityScore: number;
  directnessScore: number;
  authorityScore: number;
  whatWentWell: string[];
  areasToImprove: string[];
  recommendedResponse: string;
}

const HEDGING_WORDS = ["maybe", "perhaps", "i think", "kind of", "sort of", "i guess", "i feel like", "hopefully", "might be", "could potentially"];
const CONFIDENT_PHRASES = ["the data shows", "our analysis", "i recommend", "the result is", "we will", "i am confident", "clearly", "the evidence", "our position", "we have"];
const TRANSITION_WORDS = ["however", "therefore", "furthermore", "firstly", "additionally", "consequently", "moreover", "in contrast", "as a result"];

function analyzeResponse(discussed: string, objection: string, response: string): AnalysisOutput {
  const lower = response.toLowerCase();
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = response.split(/\s+/).filter(w => w.length > 0);
  const avgLen = sentences.length > 0 ? words.length / sentences.length : 0;

  // Clarity: based on sentence count and avg length
  let clarityScore = 0;
  if (sentences.length >= 3) clarityScore += 40;
  else if (sentences.length === 2) clarityScore += 25;
  else clarityScore += 10;
  if (avgLen >= 8 && avgLen <= 22) clarityScore += 40;
  else if (avgLen > 0) clarityScore += 20;
  const hasTransitions = TRANSITION_WORDS.some(t => lower.includes(t));
  if (hasTransitions) clarityScore += 20;
  clarityScore = Math.min(100, clarityScore);

  // Directness: absence of hedging words
  const hedgeCount = HEDGING_WORDS.filter(h => lower.includes(h)).length;
  let directnessScore = Math.max(0, 100 - hedgeCount * 20);

  // Authority: confident phrases
  const confidentCount = CONFIDENT_PHRASES.filter(p => lower.includes(p)).length;
  let authorityScore = Math.min(100, confidentCount * 25 + (sentences.length >= 2 ? 30 : 10));

  // What went well
  const whatWentWell: string[] = [];
  if (sentences.length >= 3) whatWentWell.push("You structured your response with multiple supporting points — this signals thoroughness to decision-makers.");
  if (avgLen >= 8 && avgLen <= 20) whatWentWell.push("Your sentence length was well-calibrated — neither too terse nor too verbose for an executive context.");
  if (hasTransitions) whatWentWell.push("Strong use of transition language that guides the listener through your logic clearly.");
  if (confidentCount >= 1) whatWentWell.push("You used confident, declarative language that projects authority rather than seeking permission.");
  if (whatWentWell.length === 0) whatWentWell.push("You engaged with the objection directly rather than deflecting — that's foundational to credibility.");

  // Areas to improve
  const areasToImprove: string[] = [];
  if (hedgeCount > 0) areasToImprove.push(`Remove hedging language: "${HEDGING_WORDS.find(h => lower.includes(h))}" weakens your authority. Replace with direct, declarative statements.`);
  if (sentences.length < 3) areasToImprove.push("Develop your response further — executive-level rebuttals typically address the concern, provide evidence, and offer a path forward.");
  if (!hasTransitions) areasToImprove.push("Add structural signposting ('firstly', 'however', 'in conclusion') to help your listener track your argument.");
  if (confidentCount === 0) areasToImprove.push("Anchor your response with data or a specific claim — 'The data shows...' or 'Our analysis confirms...' builds instant credibility.");
  if (areasToImprove.length === 0) areasToImprove.push("Practice compressing your response — aim to deliver the same substance in 20% fewer words.");

  // Recommended ARRC response
  const shortObjection = objection.split(/[.!?]/)[0].trim() || "the concern raised";
  const recommendedResponse = `**Acknowledge:** "That's a legitimate concern — ${shortObjection.toLowerCase()} is exactly the kind of friction we anticipated."

**Reframe:** "The data we've gathered suggests a different perspective: [insert your strongest evidence or counter-data point here]. This changes the risk profile materially."

**Resolve:** "Our proposed solution addresses this directly through [mechanism]. We've modeled the downside scenarios and the expected case delivers [outcome]."

**Confirm:** "Does this address the core of your concern, or would it help to walk through the risk modeling together?"`;

  return {
    clarityScore: Math.round(clarityScore),
    directnessScore: Math.round(directnessScore),
    authorityScore: Math.round(authorityScore),
    whatWentWell: whatWentWell.slice(0, 3),
    areasToImprove: areasToImprove.slice(0, 3),
    recommendedResponse,
  };
}

const ShadowCoach = () => {
  const { currentUser } = useAuth();
  const [discussed, setDiscussed] = useState("");
  const [objection, setObjection] = useState("");
  const [response, setResponse] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<AnalysisOutput | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const history: ToolkitEntry[] = currentUser ? getToolkitHistory(currentUser.id, "shadow-coach") : [];

  function handleAnalyze() {
    if (!discussed.trim() || !objection.trim() || !response.trim()) {
      toast.error("Please fill in all three fields to get your analysis.");
      return;
    }
    setLoading(true);
    setOutput(null);
    setTimeout(() => {
      const result = analyzeResponse(discussed, objection, response);
      setOutput(result);
      setLoading(false);

      if (currentUser) {
        saveToolkitEntry(currentUser.id, {
          toolId: "shadow-coach",
          toolName: "Shadow Coach",
          inputs: { discussed, objection, response },
          outputs: result as unknown as Record<string, unknown>,
        });
        awardPoints(currentUser.id, {
          source: "shadow-coach",
          sourceId: `shadow-${Date.now()}`,
          sourceName: "Shadow Coach Analysis",
          points: 25,
        });
        toast.success("Analysis complete! +25 pts");
      }
    }, 1500);
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied!")).catch(() => toast.error("Copy failed"));
  }

  function scoreColor(score: number) {
    if (score >= 75) return "#B89A5A";
    if (score >= 50) return "#8E96A3";
    return "#ef4444";
  }

  return (
    <PlatformLayout>
      <div className="min-h-screen p-6 md:p-10" style={{ background: "#0B1A2A", color: "#F4F2ED" }}>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Sparkles size={28} style={{ color: "#B89A5A" }} />
              <div>
                <h1 className="text-2xl font-bold">Shadow Coach</h1>
                <p style={{ color: "#8E96A3" }} className="text-sm">Debrief your real conversations</p>
              </div>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{ background: "#1C1F26", color: "#8E96A3" }}
            >
              <History size={16} /> History
            </button>
          </div>

          <AnimatePresence mode="wait">
            {showHistory ? (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={18} style={{ color: "#B89A5A" }} />
                  <h2 className="text-lg font-semibold">Past Analyses</h2>
                </div>
                {history.length === 0 ? (
                  <p style={{ color: "#8E96A3" }}>No analyses yet.</p>
                ) : (
                  <div className="space-y-3">
                    {history.map(entry => (
                      <div key={entry.id} className="p-4 rounded-xl" style={{ background: "#1C1F26" }}>
                        <p className="text-xs mb-2" style={{ color: "#8E96A3" }}>{new Date(entry.createdAt).toLocaleString()}</p>
                        <p className="text-sm font-medium mb-1">Objection handled:</p>
                        <p className="text-sm" style={{ color: "#8E96A3" }}>
                          {typeof entry.inputs.objection === "string" ? entry.inputs.objection.slice(0, 120) + "..." : ""}
                        </p>
                        {entry.outputs && typeof (entry.outputs as Record<string, unknown>).clarityScore === "number" && (
                          <div className="flex gap-4 mt-2 text-xs">
                            <span style={{ color: "#B89A5A" }}>Clarity: {(entry.outputs as Record<string, unknown>).clarityScore as number}%</span>
                            <span style={{ color: "#8E96A3" }}>Directness: {(entry.outputs as Record<string, unknown>).directnessScore as number}%</span>
                            <span style={{ color: "#8E96A3" }}>Authority: {(entry.outputs as Record<string, unknown>).authorityScore as number}%</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="coach" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {/* Input form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: "#8E96A3" }}>What was discussed?</label>
                    <textarea
                      value={discussed}
                      onChange={e => setDiscussed(e.target.value)}
                      placeholder="Briefly describe the context — the meeting topic, who was present, what was on the table..."
                      rows={3}
                      className="w-full rounded-xl p-4 text-sm resize-none outline-none"
                      style={{ background: "#1C1F26", color: "#F4F2ED", border: "1px solid #2a2f3a" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: "#8E96A3" }}>What was the main objection?</label>
                    <textarea
                      value={objection}
                      onChange={e => setObjection(e.target.value)}
                      placeholder="State the objection exactly as it was raised, or as close as you can recall..."
                      rows={3}
                      className="w-full rounded-xl p-4 text-sm resize-none outline-none"
                      style={{ background: "#1C1F26", color: "#F4F2ED", border: "1px solid #2a2f3a" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: "#8E96A3" }}>What did you say?</label>
                    <textarea
                      value={response}
                      onChange={e => setResponse(e.target.value)}
                      placeholder="Write your response as accurately as you can remember it..."
                      rows={4}
                      className="w-full rounded-xl p-4 text-sm resize-none outline-none"
                      style={{ background: "#1C1F26", color: "#F4F2ED", border: "1px solid #2a2f3a" }}
                    />
                  </div>

                  {/* Audio upload */}
                  <div
                    className="p-4 rounded-xl border-dashed flex items-center gap-4 cursor-pointer"
                    style={{ background: "#1C1F26", border: "1px dashed #2a2f3a" }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#0B1A2A", color: "#8E96A3" }}>
                      {audioFile ? <Mic size={20} style={{ color: "#B89A5A" }} /> : <Upload size={20} />}
                    </div>
                    <div>
                      {audioFile ? (
                        <>
                          <p className="text-sm font-medium">{audioFile.name}</p>
                          <p className="text-xs" style={{ color: "#8E96A3" }}>Audio analysis coming soon</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium">Upload audio recording (optional)</p>
                          <p className="text-xs" style={{ color: "#8E96A3" }}>Audio analysis coming soon • MP3, WAV, M4A</p>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={e => {
                        if (e.target.files?.[0]) setAudioFile(e.target.files[0]);
                      }}
                    />
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                    style={{ background: "#B89A5A", color: "#0B1A2A", opacity: loading ? 0.8 : 1 }}
                  >
                    {loading ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                          <Sparkles size={18} />
                        </motion.div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <ChevronRight size={18} /> Analyze My Response (+25 pts)
                      </>
                    )}
                  </button>
                </div>

                {output && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    {/* Scores */}
                    <div className="p-5 rounded-xl" style={{ background: "#1C1F26" }}>
                      <h3 className="font-semibold mb-4">Your Response Assessment</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: "Clarity", value: output.clarityScore },
                          { label: "Directness", value: output.directnessScore },
                          { label: "Authority", value: output.authorityScore },
                        ].map(({ label, value }) => (
                          <div key={label} className="text-center p-3 rounded-lg" style={{ background: "#0B1A2A" }}>
                            <p className="text-2xl font-bold" style={{ color: scoreColor(value) }}>{value}%</p>
                            <p className="text-xs mt-1" style={{ color: "#8E96A3" }}>{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* What went well */}
                    <div className="p-5 rounded-xl" style={{ background: "#1C1F26" }}>
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle size={18} style={{ color: "#B89A5A" }} />
                        <h3 className="font-semibold">What Went Well</h3>
                      </div>
                      <div className="space-y-3">
                        {output.whatWentWell.map((point, i) => (
                          <div key={i} className="flex gap-3">
                            <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: "#B89A5A22", color: "#B89A5A" }}>✓</span>
                            <p className="text-sm leading-relaxed" style={{ color: "#F4F2ED" }}>{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Areas to improve */}
                    <div className="p-5 rounded-xl" style={{ background: "#1C1F26" }}>
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle size={18} style={{ color: "#ef4444" }} />
                        <h3 className="font-semibold">Areas to Improve</h3>
                      </div>
                      <div className="space-y-3">
                        {output.areasToImprove.map((point, i) => (
                          <div key={i} className="flex gap-3">
                            <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: "#ef444422", color: "#ef4444" }}>!</span>
                            <p className="text-sm leading-relaxed" style={{ color: "#F4F2ED" }}>{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommended response */}
                    <div className="p-5 rounded-xl" style={{ background: "#1C1F26" }}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Sparkles size={18} style={{ color: "#B89A5A" }} />
                          <h3 className="font-semibold">Recommended Response (ARRC)</h3>
                        </div>
                        <button onClick={() => copyText(output.recommendedResponse)} className="p-2 rounded-lg" style={{ background: "#0B1A2A", color: "#B89A5A" }}>
                          <Copy size={14} />
                        </button>
                      </div>
                      <div className="p-4 rounded-lg" style={{ background: "#0B1A2A" }}>
                        {output.recommendedResponse.split("\n\n").map((block, i) => (
                          <p key={i} className="text-sm leading-relaxed mb-3 last:mb-0" style={{ color: "#F4F2ED" }}>{block}</p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PlatformLayout>
  );
};

export default ShadowCoach;
