import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Zap, Copy, History, FlaskConical, Clock } from "lucide-react";
import { toast } from "sonner";
import PlatformLayout from "@/components/PlatformLayout";
import { useAuth } from "@/contexts/AuthContext";
import { saveToolkitEntry, getToolkitHistory, awardPoints } from "@/lib/persistence";
import type { ToolkitEntry } from "@/lib/persistence";

const MAX_WORDS_PER_SENTENCE = 20;

function translateDirect(text: string): string {
  let result = text;
  result = result.replace(/just /gi, "");
  result = result.replace(/I was wondering[,]?\s*/gi, "");
  result = result.replace(/sorry to bother[,]?\s*/gi, "");
  result = result.replace(/I think maybe\s*/gi, "");
  result = result.replace(/I hope this email finds you well\.?\s*/gi, "");

  const sentences = result.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  const shortened = sentences.map(s => {
    const words = s.split(" ");
    if (words.length > MAX_WORDS_PER_SENTENCE) return words.slice(0, MAX_WORDS_PER_SENTENCE).join(" ") + ".";
    return s;
  });
  const base = shortened.join(" ").trim();
  const deadlineMatch = text.match(/\b(monday|tuesday|wednesday|thursday|friday|by \w+|end of \w+)\b/i);
  const deadline = deadlineMatch ? deadlineMatch[0] : "end of week";
  return base + (base.endsWith(".") ? " " : ". ") + `Please confirm by ${deadline}.`;
}

function translateDiplomatic(text: string): string {
  let result = "I hope this message finds you well. " + text.trim();
  result = result.replace(/\bneed\b/g, "would appreciate");
  result = result.replace(/\bmust\b/g, "would kindly request");
  if (!result.endsWith(".")) result += ".";
  result += " Please don't hesitate to reach out if you have any questions.";
  return result;
}

function translateAssertive(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  let result = text.trim();

  if (sentences.length >= 1) {
    result = "I must emphasize the importance of " + sentences[0].charAt(0).toLowerCase() + sentences[0].slice(1);
    if (sentences.length >= 2) {
      result += " " + sentences[1] + " This is a time-sensitive matter.";
      if (sentences.length > 2) {
        result += " " + sentences.slice(2).join(" ");
      }
    }
  }

  const dateMatch = text.match(/\b(\d{1,2}[\/\-]\d{1,2}[\/\-]?\d{0,4}|monday|tuesday|wednesday|thursday|friday|next \w+)\b/i);
  const date = dateMatch ? dateMatch[0] : "Friday";
  if (!result.endsWith(".")) result += ".";
  result += ` I expect a response by ${date}.`;
  return result;
}

const TONE_TABS = ["Direct Executive", "Diplomatic Executive", "Assertive Pushback"] as const;
type ToneTab = typeof TONE_TABS[number];

const EmailToneTranslator = () => {
  const { currentUser } = useAuth();
  const [emailDraft, setEmailDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<ToneTab, string> | null>(null);
  const [activeTab, setActiveTab] = useState<ToneTab>("Direct Executive");
  const [showHistory, setShowHistory] = useState(false);
  const history: ToolkitEntry[] = currentUser ? getToolkitHistory(currentUser.id, "email-tone") : [];

  function handleTranslate() {
    if (emailDraft.trim().length < 20) {
      toast.error("Please enter at least a few sentences to translate.");
      return;
    }
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      const translated: Record<ToneTab, string> = {
        "Direct Executive": translateDirect(emailDraft),
        "Diplomatic Executive": translateDiplomatic(emailDraft),
        "Assertive Pushback": translateAssertive(emailDraft),
      };
      setResults(translated);
      setLoading(false);

      if (currentUser) {
        saveToolkitEntry(currentUser.id, {
          toolId: "email-tone",
          toolName: "Email Tone Translator",
          inputs: { draft: emailDraft },
          outputs: translated,
        });
        awardPoints(currentUser.id, {
          source: "email-tone",
          sourceId: `email-${Date.now()}`,
          sourceName: "Email Tone Translator",
          points: 15,
        });
        toast.success("Translation complete! +15 pts");
      }
    }, 1000);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied to clipboard!")).catch(() => toast.error("Copy failed."));
  }

  return (
    <PlatformLayout>
      <div className="min-h-screen p-6 md:p-10" style={{ background: "#0B1A2A", color: "#F4F2ED" }}>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Mail size={28} style={{ color: "#B89A5A" }} />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">Email Tone Translator</h1>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1" style={{ background: "#2a2f3a", color: "#B89A5A", border: "1px solid #B89A5A" }}>
                    <FlaskConical size={10} /> BETA
                  </span>
                </div>
                <p style={{ color: "#8E96A3" }} className="text-sm">Reframe your emails for executive impact</p>
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
                  <h2 className="text-lg font-semibold">Translation History</h2>
                </div>
                {history.length === 0 ? (
                  <p style={{ color: "#8E96A3" }}>No translations yet.</p>
                ) : (
                  <div className="space-y-3">
                    {history.map(entry => (
                      <div key={entry.id} className="p-4 rounded-xl" style={{ background: "#1C1F26" }}>
                        <p className="text-xs mb-2" style={{ color: "#8E96A3" }}>{new Date(entry.createdAt).toLocaleString()}</p>
                        <p className="text-sm font-medium mb-1">Original:</p>
                        <p className="text-sm" style={{ color: "#8E96A3" }}>
                          {typeof entry.inputs.draft === "string" ? entry.inputs.draft.slice(0, 120) + "..." : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="translator" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="mb-6">
                  <label className="block text-sm mb-2" style={{ color: "#8E96A3" }}>Your email draft</label>
                  <textarea
                    value={emailDraft}
                    onChange={e => setEmailDraft(e.target.value)}
                    placeholder="Paste your email draft here... Even a rough, unpolished version works best."
                    rows={8}
                    className="w-full rounded-xl p-4 text-sm resize-none outline-none"
                    style={{ background: "#1C1F26", color: "#F4F2ED", border: "1px solid #2a2f3a" }}
                  />
                </div>

                <button
                  onClick={handleTranslate}
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 mb-8 transition-all"
                  style={{ background: "#B89A5A", color: "#0B1A2A", opacity: loading ? 0.8 : 1 }}
                >
                  {loading ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                        <Zap size={18} />
                      </motion.div>
                      Translating...
                    </>
                  ) : (
                    <>
                      <Zap size={18} /> Translate Tone
                    </>
                  )}
                </button>

                {results && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "#1C1F26" }}>
                      {TONE_TABS.map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className="flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all"
                          style={{
                            background: activeTab === tab ? "#B89A5A" : "transparent",
                            color: activeTab === tab ? "#0B1A2A" : "#8E96A3",
                          }}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                        <div className="p-5 rounded-xl relative" style={{ background: "#1C1F26", border: "1px solid #2a2f3a" }}>
                          <button
                            onClick={() => copyToClipboard(results[activeTab])}
                            className="absolute top-4 right-4 p-2 rounded-lg transition-all hover:opacity-80"
                            style={{ background: "#0B1A2A", color: "#B89A5A" }}
                          >
                            <Copy size={14} />
                          </button>
                          <p className="text-sm leading-relaxed pr-10" style={{ color: "#F4F2ED" }}>
                            {results[activeTab]}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
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

export default EmailToneTranslator;
