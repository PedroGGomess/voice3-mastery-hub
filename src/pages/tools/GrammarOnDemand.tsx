import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, AlertTriangle, Copy, Check, Clock } from "lucide-react";
import { toast } from "sonner";
import PlatformLayout from "@/components/PlatformLayout";
import { useAuth } from "@/contexts/AuthContext";
import { saveToolkitEntry, getToolkitHistory, awardPoints } from "@/lib/persistence";

const grammarTopics = [
  {
    id: "present-perfect",
    title: "Present Perfect for Business Updates",
    explanation:
      "Use the present perfect to connect past actions to their current relevance. In business, it signals completion without specifying when — which is ideal for updates and reports.",
    examples: [
      "We have completed the due diligence and are ready to proceed.",
      "The board has approved the new budget framework.",
      "Our team has exceeded the Q3 target by 12%.",
    ],
    mistake: "Avoid: 'We completed the report' when the result is still relevant now. Use: 'We have completed the report' to signal it's done and available.",
  },
  {
    id: "conditionals",
    title: "Conditionals for Proposals",
    explanation:
      "Conditionals allow you to propose ideas diplomatically without making definitive claims. The second conditional (if + past, would) is especially powerful for hypothetical proposals.",
    examples: [
      "If you could confirm by Friday, we would be able to proceed next week.",
      "Should you decide to invest, we would allocate the resources immediately.",
      "Were this to proceed, the timeline would need to be adjusted accordingly.",
    ],
    mistake: "Avoid the overly direct: 'Confirm by Friday.' It can sound like a demand. The conditional version sounds more executive and collaborative.",
  },
  {
    id: "passive-voice",
    title: "Passive Voice for Reports",
    explanation:
      "The passive voice removes the actor from a sentence, which is useful when the action itself is more important, or when you want to avoid assigning blame directly.",
    examples: [
      "The budget was approved by the executive committee last Thursday.",
      "The proposal has been reviewed and several amendments were suggested.",
      "Targets were missed due to supply chain disruption.",
    ],
    mistake: "Overusing passive can make you sound evasive. Use it strategically — not to hide accountability, but to shift focus to the outcome when that's what matters.",
  },
  {
    id: "modal-verbs",
    title: "Modal Verbs for Diplomacy",
    explanation:
      "Modals allow you to soften requests, make suggestions, and express possibility without being blunt. 'Could', 'would', 'might', and 'may' are your executive toolkit.",
    examples: [
      "Could you consider extending the deadline by two weeks?",
      "We might want to revisit this decision in light of the new data.",
      "Would it be possible to schedule a follow-up call this week?",
    ],
    mistake: "Avoid: 'Can you do this?' in formal executive communication — it sounds transactional. 'Could you...' signals respect and professionalism.",
  },
  {
    id: "reported-speech",
    title: "Reported Speech for Meetings",
    explanation:
      "When summarising what was said in a meeting or email, reported speech shifts the tense back and changes pronouns. This is essential for professional minutes, briefings, and updates.",
    examples: [
      "She mentioned that the figures would be ready by end of week.",
      "The CEO confirmed that the merger was still on track.",
      "He suggested that we explore a joint venture model.",
    ],
    mistake: "A common error is forgetting the tense shift: 'He said it IS ready' should become 'He said it WAS ready' in formal reported speech.",
  },
  {
    id: "articles",
    title: "Articles in Business Context",
    explanation:
      "The difference between 'the' and 'a' changes the meaning of executive communication. 'The board' refers to a specific, known board. 'A proposal' introduces something new or non-specific.",
    examples: [
      "The board met yesterday to discuss the acquisition. (specific)",
      "We need a proposal that addresses the cost concern. (non-specific)",
      "She is now the CFO of the group. (unique role, specific entity)",
    ],
    mistake: "Avoid omitting 'the' before institutional nouns: 'I spoke to board' is incorrect. Use 'I spoke to the board.'",
  },
  {
    id: "prepositions",
    title: "Prepositions in Formal Emails",
    explanation:
      "Preposition errors are among the most common mistakes in executive writing. Key phrases like 'in regard to', 'with respect to', and 'pursuant to' must be used correctly.",
    examples: [
      "In regard to your email of the 14th, I would like to clarify...",
      "With respect to the proposed timeline, we recommend a two-week extension.",
      "Further to our conversation, I am writing to confirm...",
    ],
    mistake: "Avoid 'in regards to' — the grammatically correct form is 'in regard to' (no 's'). This is a subtle but important distinction in formal communication.",
  },
  {
    id: "tense-agreement",
    title: "Tense Agreement in Presentations",
    explanation:
      "When presenting, mixing tenses incorrectly breaks the flow and reduces credibility. Use present simple for facts, past simple for completed events, and future forms for plans.",
    examples: [
      "Revenue grew by 18% last year. This year, we are targeting 25%.",
      "The pilot programme ran for three months and delivered strong results. We will now scale.",
      "As you can see from this chart, customer retention has improved significantly.",
    ],
    mistake: "Avoid switching tenses randomly mid-sentence: 'We launched the product and it performs well' should be 'We launched the product and it performed well' or 'it has performed well.'",
  },
];

// Transformation rules
const RULES: Array<{ pattern: RegExp; direct: string; diplomatic: string; formal: string }> = [
  {
    pattern: /I want to\b/gi,
    direct: "I require",
    diplomatic: "I would appreciate if we could",
    formal: "It is requested that",
  },
  {
    pattern: /can you\b/gi,
    direct: "Please ensure",
    diplomatic: "Would you be so kind as to",
    formal: "It would be appreciated if you could",
  },
  {
    pattern: /I think\b/gi,
    direct: "It is clear that",
    diplomatic: "I would suggest that",
    formal: "It is my assessment that",
  },
  {
    pattern: /I need\b/gi,
    direct: "I require",
    diplomatic: "I would appreciate",
    formal: "It is necessary that",
  },
  {
    pattern: /please\b/gi,
    direct: "Ensure",
    diplomatic: "I would kindly ask you to",
    formal: "You are requested to",
  },
  {
    pattern: /sorry\b/gi,
    direct: "I note that",
    diplomatic: "I apologise for",
    formal: "I regret to inform you",
  },
  {
    pattern: /asap|as soon as possible/gi,
    direct: "immediately",
    diplomatic: "at your earliest convenience",
    formal: "at the earliest opportunity",
  },
  {
    pattern: /get back to me\b/gi,
    direct: "respond by",
    diplomatic: "kindly revert by",
    formal: "please provide your response by",
  },
  {
    pattern: /let me know\b/gi,
    direct: "confirm",
    diplomatic: "please do let me know",
    formal: "kindly advise",
  },
  {
    pattern: /maybe\b/gi,
    direct: "potentially",
    diplomatic: "it may be worth considering",
    formal: "it is possible that",
  },
  {
    pattern: /I was wondering\b/gi,
    direct: "I would like to",
    diplomatic: "I wanted to check",
    formal: "I wish to enquire whether",
  },
  {
    pattern: /just wanted to\b/gi,
    direct: "I am writing to",
    diplomatic: "I wanted to take a moment to",
    formal: "The purpose of this communication is to",
  },
  {
    pattern: /thanks\b/gi,
    direct: "Thank you",
    diplomatic: "Thank you very much",
    formal: "I am grateful for your",
  },
  {
    pattern: /problem\b/gi,
    direct: "issue",
    diplomatic: "challenge",
    formal: "matter requiring attention",
  },
  {
    pattern: /fix\b/gi,
    direct: "resolve",
    diplomatic: "address",
    formal: "rectify",
  },
];

function transformText(input: string): { direct: string; diplomatic: string; formal: string } {
  let direct = input;
  let diplomatic = input;
  let formal = input;

  for (const rule of RULES) {
    direct = direct.replace(rule.pattern, rule.direct);
    diplomatic = diplomatic.replace(rule.pattern, rule.diplomatic);
    formal = formal.replace(rule.pattern, rule.formal);
  }

  // Add framing if no rules matched much
  if (direct === input) {
    direct = `I want to be direct: ${input}`;
    diplomatic = `I would like to bring to your attention: ${input}`;
    formal = `For your consideration: ${input}`;
  }

  // Capitalise first letter
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return { direct: cap(direct.trim()), diplomatic: cap(diplomatic.trim()), formal: cap(formal.trim()) };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1.5 rounded hover:bg-white/10 text-[#8E96A3] hover:text-[#F4F2ED] transition-colors">
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

const GrammarOnDemand = () => {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"transform" | "reference" | "history">("transform");
  const [inputText, setInputText] = useState("");
  const [transformed, setTransformed] = useState<{ direct: string; diplomatic: string; formal: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const history = currentUser ? getToolkitHistory(currentUser.id, "grammar-on-demand") : [];

  const handleTransform = () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setTransformed(null);
    setTimeout(() => {
      const result = transformText(inputText);
      setTransformed(result);
      setLoading(false);

      if (currentUser) {
        saveToolkitEntry(currentUser.id, {
          toolId: "grammar-on-demand",
          toolName: "Grammar On Demand",
          inputs: { text: inputText },
          outputs: { direct: result.direct, diplomatic: result.diplomatic, formal: result.formal },
        });
        awardPoints(currentUser.id, {
          source: "toolkit",
          sourceId: "grammar-on-demand",
          sourceName: "Grammar On Demand",
          points: 10,
        });
        toast.success("+10 points earned!", { description: "Text transformed successfully." });
      }
    }, 800);
  };

  const filtered = grammarTopics.filter(
    t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.explanation.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-xs text-[#B89A5A] tracking-[0.2em] uppercase font-medium mb-1">My Toolkit</p>
        <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] tracking-tight mb-1">
          📚 Grammar On Demand
        </h1>
        <p className="text-[#8E96A3] text-sm">Executive Grammar Library</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["transform", "reference", "history"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === tab
                ? "bg-[#B89A5A] text-[#0B1A2A]"
                : "bg-[#1C1F26] text-[#8E96A3] border border-white/10 hover:text-[#F4F2ED]"
            }`}
          >
            {tab === "transform" ? "Transform Text" : tab === "reference" ? "Grammar Reference" : `History (${history.length})`}
          </button>
        ))}
      </div>

      {activeTab === "transform" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl bg-[#1C1F26] border border-[#B89A5A]/10 p-5">
            <label className="block text-xs font-semibold text-[#8E96A3] uppercase tracking-wider mb-2">
              What do you want to say?
            </label>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="e.g. I want to get back to you about the report asap"
              rows={3}
              className="w-full bg-[#0B1A2A] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#F4F2ED] placeholder-[#8E96A3]/50 focus:outline-none focus:border-[#B89A5A]/50 transition-colors resize-none"
            />
            <button
              onClick={handleTransform}
              disabled={!inputText.trim() || loading}
              className="mt-3 px-5 py-2.5 rounded-lg bg-[#B89A5A] text-[#0B1A2A] font-semibold text-sm hover:bg-[#d4ba6a] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Transforming..." : "✨ Transform"}
            </button>
          </div>

          <AnimatePresence>
            {transformed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {[
                  { label: "Direct Executive", key: "direct" as const, desc: "Short, commanding, no hedging" },
                  { label: "Diplomatic Executive", key: "diplomatic" as const, desc: "Softer, relationship-focused" },
                  { label: "Formal Report", key: "formal" as const, desc: "Passive voice, institutional tone" },
                ].map(({ label, key, desc }) => (
                  <div key={key} className="rounded-xl bg-[#1C1F26] border border-white/5 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs font-bold text-[#B89A5A] uppercase tracking-wider">{label}</p>
                        <p className="text-xs text-[#8E96A3]">{desc}</p>
                      </div>
                      <CopyButton text={transformed[key]} />
                    </div>
                    <p className="text-sm text-[#F4F2ED] leading-relaxed">{transformed[key]}</p>
                  </div>
                ))}
                <div className="rounded-lg bg-[#B89A5A]/5 border border-[#B89A5A]/10 p-3">
                  <p className="text-xs font-bold text-[#B89A5A] mb-1">Grammar Note</p>
                  <p className="text-xs text-[#8E96A3]">
                    These versions demonstrate how register (formal level) transforms meaning. Direct uses imperatives for authority. Diplomatic uses modals to soften. Formal uses passive voice and nominalisations to create institutional distance.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {activeTab === "reference" && (
        <>
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mb-6"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E96A3]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search grammar topics..."
              className="w-full bg-[#1C1F26] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-[#F4F2ED] placeholder-[#8E96A3]/50 focus:outline-none focus:border-[#B89A5A]/50 transition-colors"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="space-y-2"
          >
            {filtered.length === 0 && (
              <div className="text-center py-10 text-[#8E96A3] text-sm">No topics match your search.</div>
            )}
            {filtered.map((topic, i) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl bg-[#1C1F26] border border-white/5 overflow-hidden"
              >
                <button
                  onClick={() => toggle(topic.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-semibold text-sm text-[#F4F2ED]">{topic.title}</span>
                  {openId === topic.id ? (
                    <ChevronUp className="h-4 w-4 text-[#B89A5A] shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#8E96A3] shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {openId === topic.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                        <p className="text-sm text-[#8E96A3] leading-relaxed">{topic.explanation}</p>
                        <div>
                          <p className="text-xs font-bold text-[#B89A5A] uppercase tracking-wider mb-2">Examples</p>
                          <ul className="space-y-1.5">
                            {topic.examples.map((ex, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <span className="text-[#B89A5A] text-xs mt-0.5 shrink-0">→</span>
                                <span className="text-sm text-[#F4F2ED] italic">"{ex}"</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Common Mistake</p>
                            <p className="text-xs text-[#8E96A3] leading-relaxed">{topic.mistake}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}

      {activeTab === "history" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {history.length === 0 ? (
            <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-8 text-center">
              <p className="text-[#8E96A3] text-sm">No transformations yet.</p>
            </div>
          ) : (
            history.map(entry => (
              <div key={entry.id} className="rounded-xl bg-[#1C1F26] border border-white/5 p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-[#F4F2ED] flex-1 mr-4">"{entry.inputs.text}"</p>
                  <p className="text-xs text-[#8E96A3] flex items-center gap-1 shrink-0">
                    <Clock className="h-3 w-3" />
                    {new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}
    </PlatformLayout>
  );
};

export default GrammarOnDemand;
