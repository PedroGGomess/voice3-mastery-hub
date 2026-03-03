import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ChevronRight, Trophy, RotateCcw, History, Swords } from "lucide-react";
import { toast } from "sonner";
import PlatformLayout from "@/components/PlatformLayout";
import { useAuth } from "@/contexts/AuthContext";
import { savePracticeAttempt, getPracticeHistory, awardPoints } from "@/lib/persistence";

type Stage = "topic_selection" | "opening_statement" | "ai_counter" | "rebuttal" | "ai_final" | "scoring";
type Side = "For" | "Against";

interface Topic {
  text: string;
  countersFor: string[];
  countersAgainst: string[];
  finalFor: string[];
  finalAgainst: string[];
}

const ALL_TOPICS: Topic[] = [
  {
    text: "Remote work is more productive than office work",
    countersFor: [
      "While autonomy has merit, studies show collaboration suffers significantly in remote environments. Spontaneous innovation—the hallmark of in-person teams—drops by 25% when teams go fully remote.",
      "Home environments introduce distractions that office infrastructure is specifically designed to eliminate. The blurred boundary between work and personal life also leads to burnout, not productivity.",
    ],
    countersAgainst: [
      "The data actually contradicts your position. Multiple Fortune 500 studies have found remote workers log more hours and report higher output quality than their in-office counterparts.",
      "Office commutes consume an average of 2 hours daily—time that remote workers reinvest directly into focused work. That alone represents a 25% efficiency gain.",
    ],
    finalFor: [
      "Even conceding your points about distractions, the net outcome data is clear: companies like GitLab and Automattic, fully remote from day one, consistently outperform traditional office-based competitors. Productivity is about structure, not location.",
    ],
    finalAgainst: [
      "The pandemic was an uncontrolled experiment, not a benchmark. Workers reported higher output partly due to fear of layoffs and lack of boundaries. True sustainable productivity requires the social infrastructure of a shared workspace.",
    ],
  },
  {
    text: "AI will replace most executive roles within 10 years",
    countersFor: [
      "You're overestimating AI's current capabilities. Executive decisions require contextual judgment, ethical reasoning, and stakeholder relationships—none of which AI can replicate with the nuance required at C-suite level.",
      "Boards and shareholders demand accountability. An AI cannot be held legally or morally responsible for a failed acquisition or a culture crisis. Human executives remain irreplaceable for that accountability alone.",
    ],
    countersAgainst: [
      "AI is already outperforming junior analysts in strategy synthesis, financial modeling, and risk assessment. The trajectory points clearly to AI handling the analytical core of executive work within a decade.",
      "The argument that relationships matter ignores how rapidly AI social capabilities are advancing. AI advisors are already participating in boardroom-level discussions at leading firms.",
    ],
    finalFor: [
      "The question isn't whether AI will replace executives—it's when. Every function once thought uniquely human has been automated. Executive roles are simply next on that curve.",
    ],
    finalAgainst: [
      "Augmentation, not replacement, is the real story. AI will make executives dramatically more effective, but the uniquely human elements of leadership—vision, inspiration, accountability—cannot be coded.",
    ],
  },
  {
    text: "Companies should prioritize profit over sustainability",
    countersFor: [
      "Short-term profit maximization at the expense of sustainability creates long-term liability. Climate-related regulatory risks alone are projected to cost global businesses $2.5 trillion by 2030.",
      "Consumer sentiment has shifted irreversibly. Brands that prioritize profit over planet face growing boycotts, talent rejection, and investor pressure—ultimately destroying the very profits they sought to protect.",
    ],
    countersAgainst: [
      "Without profitability, companies cannot fund the very sustainability initiatives you champion. A bankrupt company has zero environmental impact capacity. Profit is the prerequisite for responsible action.",
      "Forcing sustainability ahead of viability destroys shareholder value and jobs. The free market, not mandates, should determine when sustainability investments make financial sense.",
    ],
    finalFor: [
      "The dichotomy you present is false. Companies like Patagonia and Unilever prove that sustainability IS profit. The question is whether your business model is sophisticated enough to see the connection.",
    ],
    finalAgainst: [
      "Sustainability mandates without profit discipline lead to greenwashing, not genuine change. Companies must be financially secure before they can credibly invest in long-term environmental outcomes.",
    ],
  },
  {
    text: "MBA degrees are no longer worth the investment",
    countersFor: [
      "The MBA network remains one of the most powerful career accelerators in existence. Alumni networks from top programs open doors that no online course can match. You're undervaluing the intangible returns.",
      "Structured curriculum forces breadth across finance, strategy, operations, and leadership—creating well-rounded executives. Self-directed learning creates gaps that surface at the worst possible moments.",
    ],
    countersAgainst: [
      "The average MBA costs $150,000 and takes two years out of your career. With that same time and capital, you could launch a startup, build a consulting practice, or take 50 executive courses—with measurable outcomes.",
      "Top executives at the fastest-growing companies increasingly lack MBAs. The credential signals conformity, not innovation—precisely the opposite of what modern business demands.",
    ],
    finalFor: [
      "The MBA is not just education—it's a signal. Rightly or wrongly, institutional credibility still opens doors. Until that changes, the ROI case for a top MBA remains solid for the right candidate.",
    ],
    finalAgainst: [
      "The disruption is already happening. Business schools are losing enrollment. The market has spoken: outcomes matter more than credentials, and the MBA's monopoly on business credibility is over.",
    ],
  },
  {
    text: "Flat organizational structures outperform hierarchical ones",
    countersFor: [
      "Flat structures break down at scale. The chaos at companies like Zappos post-Holacracy adoption shows that removing hierarchy doesn't eliminate politics—it just makes them informal and more toxic.",
      "Without clear accountability chains, decisions stall. Hierarchies exist precisely because someone must have final authority. Flat structures create decision paralysis masked as collaboration.",
    ],
    countersAgainst: [
      "Hierarchy creates bureaucracy that slows execution. In fast-moving markets, the ability to make decisions at the point of information is a competitive advantage that flat structures enable.",
      "Employee engagement data consistently shows that autonomy and reduced hierarchy correlate with higher retention and performance. The best talent self-selects into flat environments.",
    ],
    finalFor: [
      "The best performers want clarity on impact, not just autonomy. Thoughtful hierarchy—clear roles, distributed authority—outperforms both rigid pyramids and chaotic flatness. Structure enables freedom.",
    ],
    finalAgainst: [
      "Every successful flat organization proves the model works when culture is strong. The failures you cite are failures of culture, not structure. With the right people, hierarchy is simply unnecessary overhead.",
    ],
  },
  {
    text: "Performance bonuses create more harm than good",
    countersFor: [
      "Bonuses drive exactly the behaviors companies need: focus, accountability, and results orientation. Without financial stakes, performance becomes abstract. Money is the clearest signal of what truly matters.",
      "The research you're citing about intrinsic motivation applies to creative work. For execution-heavy roles, extrinsic incentives demonstrably improve output. Context matters.",
    ],
    countersAgainst: [
      "Daniel Pink's research definitively shows that performance bonuses undermine intrinsic motivation for complex tasks. You end up with employees gaming metrics rather than pursuing genuine value creation.",
      "Bonus structures create toxic competition within teams. The collaboration required for today's complex business challenges is systematically destroyed when colleagues are competing for a finite bonus pool.",
    ],
    finalFor: [
      "Incentive design, not incentives themselves, is the variable. Well-designed team-based bonuses tied to lagging indicators of genuine value creation avoid all the pitfalls you describe.",
    ],
    finalAgainst: [
      "The evidence is clear: bonuses narrow focus, increase short-termism, and corrupt culture. The companies with the highest engagement and retention—Costco, Southwest, Patagonia—rely on culture and base compensation, not bonus manipulation.",
    ],
  },
  {
    text: "4-day work weeks should be standard",
    countersFor: [
      "Global markets don't stop at your preferred schedule. Client-facing industries, healthcare, and logistics require coverage that a 4-day structure cannot provide without significant complexity and cost.",
      "The productivity gains cited in 4-day week trials were short-term novelty effects. Long-term data remains sparse, and extrapolating from a handful of experiments to a universal standard is premature.",
    ],
    countersAgainst: [
      "The Iceland and Microsoft Japan trials showed productivity equal to or exceeding 5-day benchmarks. We are past the point of debating whether it works—the evidence is in.",
      "Overwork is a public health crisis. Burnout costs global economies $322 billion annually. The 4-day week is not a perk—it's a structural solution to a systemic problem.",
    ],
    finalFor: [
      "Sustainable productivity requires sustainable humans. The 4-day week forces prioritization, eliminates low-value meetings, and returns focus to outcomes over presence. It's an upgrade, not a reduction.",
    ],
    finalAgainst: [
      "Mandating a 4-day standard ignores industry diversity. What works for a software firm is catastrophic for a hospital. Flexibility should be available, not universal mandated policy.",
    ],
  },
  {
    text: "Startups should always prioritize growth over profitability",
    countersFor: [
      "The graveyard of growth-at-all-costs startups is vast. WeWork, Theranos, and countless others prove that blitzscaling without a path to profitability destroys billions in capital and thousands of jobs.",
      "Investor appetite for unprofitable growth has structurally shifted post-2022. The market has reset. Today's startups that ignore profitability will find no lifeline when their runway ends.",
    ],
    countersAgainst: [
      "Amazon ran at a loss for nearly a decade to capture market share. That decision created the most valuable company in history. Early profitability would have capped its ambition permanently.",
      "In winner-takes-all markets, the cost of being second is being irrelevant. Startups that prioritize profitability cede market share to competitors willing to invest in growth.",
    ],
    finalFor: [
      "The key word is 'always.' Context-dependent growth investment is rational. But 'always prioritize growth' is a doctrine that has destroyed more value than it has created. Unit economics must be understood, even if not yet optimized.",
    ],
    finalAgainst: [
      "Growth creates the optionality that profitability cannot. A profitable small company is just that—small. Growth-stage companies are buying future monopoly positions. The math justifies the investment.",
    ],
  },
  {
    text: "English should be the mandatory business language globally",
    countersFor: [
      "Language policy that excludes native speakers from full participation isn't inclusion—it's structural discrimination. The best ideas don't come in English. They come in the language the thinker thinks in.",
      "English hegemony erases cognitive diversity. Research shows bilingual teams generate more creative solutions. Mandating English as the only language impoverishes the intellectual environment.",
    ],
    countersAgainst: [
      "A shared lingua franca eliminates communication friction that costs global businesses billions annually. English has organically become that standard. Formalizing it reduces ambiguity and increases execution speed.",
      "Global teams without a shared language default to lowest-common-denominator communication. English proficiency is a professional baseline that enables meritocracy across geographies.",
    ],
    finalFor: [
      "Common language standards have historically unified diverse groups into high-performing teams. This is not about English as culture—it's about English as protocol. Like TCP/IP for the internet, it's a shared layer that enables everything above it.",
    ],
    finalAgainst: [
      "The push for English mandates reflects cultural imperialism dressed as efficiency. True global business capability means meeting clients and partners in their context—not forcing them into yours.",
    ],
  },
  {
    text: "Outsourcing is detrimental to company culture",
    countersFor: [
      "The best outsourcing relationships involve deep integration, shared values, and long-term partnerships. Culture is defined by how you behave with all stakeholders—including external partners.",
      "Outsourcing non-core functions actually protects culture by allowing internal teams to focus on the work that defines the company's identity. Diluting focus is the real cultural threat.",
    ],
    countersAgainst: [
      "Culture is transmitted through proximity, shared experience, and common struggle. Outsourced teams—regardless of integration efforts—exist outside that transmission mechanism. Cultural dilution is inevitable.",
      "When the people responsible for key customer touchpoints don't share your values or have no stake in your mission, culture becomes a marketing document rather than a lived reality.",
    ],
    finalFor: [
      "Blanket opposition to outsourcing ignores its strategic role in company building. Strategic outsourcing, done with cultural intentionality, enables growth that otherwise wouldn't be possible for resource-constrained organizations.",
    ],
    finalAgainst: [
      "Culture eats strategy—and outsourcing. The companies with the most celebrated cultures—Apple, Pixar, Berkshire—are defined by what they refuse to outsource. The boundary between inside and outside is not arbitrary.",
    ],
  },
];

function getRandomTopics(count: number): Topic[] {
  const shuffled = [...ALL_TOPICS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function scoreText(text: string): { clarity: number; structure: number; authority: number; fillerPenalty: number; total: number } {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const avgLen = sentences.length > 0 ? words.length / sentences.length : 0;

  let clarity = 0;
  if (avgLen >= 10 && avgLen <= 25) clarity = 25;
  else if (avgLen < 10) clarity = Math.round((avgLen / 10) * 25);
  else clarity = Math.max(0, Math.round(25 - ((avgLen - 25) / 25) * 25));

  const transitionWords = ["however", "therefore", "furthermore", "in conclusion", "firstly", "additionally", "consequently", "moreover"];
  const lower = text.toLowerCase();
  let structure = 0;
  for (const tw of transitionWords) {
    if (lower.includes(tw)) structure = Math.min(25, structure + 5);
  }

  const hedgingWords = ["maybe", "perhaps", "i think", "kind of", "sort of", "i guess", "i feel like"];
  let authority = 25;
  for (const hw of hedgingWords) {
    if (lower.includes(hw)) authority = Math.max(0, authority - 5);
  }

  const fillers = ["um", "uh", "like,", "you know", "basically", "actually"];
  let fillerPenalty = 25;
  for (const f of fillers) {
    if (lower.includes(f)) fillerPenalty = Math.max(0, fillerPenalty - 5);
  }

  const total = clarity + structure + authority + fillerPenalty;
  return { clarity, structure, authority, fillerPenalty, total };
}

const AIDebateClub = () => {
  const { currentUser } = useAuth();
  const [stage, setStage] = useState<Stage>("topic_selection");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [side, setSide] = useState<Side>("For");
  const [openingText, setOpeningText] = useState("");
  const [rebuttalText, setRebuttalText] = useState("");
  const [aiCounterDisplay, setAiCounterDisplay] = useState("");
  const [aiFinalDisplay, setAiFinalDisplay] = useState("");
  const [scores, setScores] = useState<ReturnType<typeof scoreText> | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [activeInterval, setActiveInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const history = currentUser ? getPracticeHistory(currentUser.id, "ai-debate") : [];

  useEffect(() => {
    setTopics(getRandomTopics(3));
  }, []);

  function typeText(text: string, setter: (s: string) => void, onDone?: () => void) {
    let i = 0;
    setter("");
    const interval = setInterval(() => {
      setter(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        onDone?.();
      }
    }, 20);
    return interval;
  }

  function handleTopicSelect(topic: Topic) {
    setSelectedTopic(topic);
    setStage("opening_statement");
  }

  function handleOpeningSubmit() {
    if (openingText.trim().length < 30) {
      toast.error("Please write at least a few sentences for your opening statement.");
      return;
    }
    setStage("ai_counter");
    const counters = side === "For" ? selectedTopic!.countersAgainst : selectedTopic!.countersFor;
    const counter = counters[Math.floor(Math.random() * counters.length)];
    if (activeInterval) clearInterval(activeInterval);
    const id = typeText(counter, setAiCounterDisplay, () => setStage("rebuttal"));
    setActiveInterval(id);
  }

  function handleRebuttalSubmit() {
    if (rebuttalText.trim().length < 20) {
      toast.error("Please provide a rebuttal.");
      return;
    }
    setStage("ai_final");
    const finals = side === "For" ? selectedTopic!.finalAgainst : selectedTopic!.finalFor;
    const final = finals[0];
    if (activeInterval) clearInterval(activeInterval);
    const id = typeText(final, setAiFinalDisplay, () => {
      const openingScore = scoreText(openingText);
      const rebuttalScore = scoreText(rebuttalText);
      const combined = {
        clarity: Math.round((openingScore.clarity + rebuttalScore.clarity) / 2),
        structure: Math.round((openingScore.structure + rebuttalScore.structure) / 2),
        authority: Math.round((openingScore.authority + rebuttalScore.authority) / 2),
        fillerPenalty: Math.round((openingScore.fillerPenalty + rebuttalScore.fillerPenalty) / 2),
        total: 0,
      };
      combined.total = combined.clarity + combined.structure + combined.authority + combined.fillerPenalty;
      setScores(combined);
      setStage("scoring");

      if (currentUser) {
        savePracticeAttempt(currentUser.id, {
          practiceId: "ai-debate",
          practiceName: "AI Debate Club",
          score: combined.total,
          details: { topic: selectedTopic!.text, side, ...combined },
        });
        awardPoints(currentUser.id, {
          source: "ai-debate",
          sourceId: "ai-debate",
          sourceName: "AI Debate Club",
          points: Math.round(75 + combined.total * 0.5),
        });
        toast.success(`Debate complete! +${Math.round(75 + combined.total * 0.5)} pts`);
      }
    });
    setActiveInterval(id);
  }

  function resetDebate() {
    setStage("topic_selection");
    setTopics(getRandomTopics(3));
    setSelectedTopic(null);
    setOpeningText("");
    setRebuttalText("");
    setAiCounterDisplay("");
    setAiFinalDisplay("");
    setScores(null);
  }

  const scoreColor = (s: number) => s >= 20 ? "#B89A5A" : s >= 12 ? "#8E96A3" : "#ef4444";

  return (
    <PlatformLayout>
      <div className="min-h-screen p-6 md:p-10" style={{ background: "#0B1A2A", color: "#F4F2ED" }}>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Swords size={28} style={{ color: "#B89A5A" }} />
              <div>
                <h1 className="text-2xl font-bold">AI Debate Club</h1>
                <p style={{ color: "#8E96A3" }} className="text-sm">Challenge your executive argumentation</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                style={{ background: "#1C1F26", color: "#8E96A3" }}
              >
                <History size={16} /> History
              </button>
              {stage !== "topic_selection" && (
                <button onClick={resetDebate} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: "#1C1F26", color: "#8E96A3" }}>
                  <RotateCcw size={16} /> New
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {showHistory ? (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-lg font-semibold mb-4">Past Attempts</h2>
                {history.length === 0 ? (
                  <p style={{ color: "#8E96A3" }}>No attempts yet.</p>
                ) : (
                  <div className="space-y-3">
                    {history.map(h => (
                      <div key={h.id} className="p-4 rounded-xl" style={{ background: "#1C1F26" }}>
                        <div className="flex justify-between">
                          <span className="font-medium">{(h.details as Record<string, string>).topic}</span>
                          <span style={{ color: "#B89A5A" }} className="font-bold">{h.score}/100</span>
                        </div>
                        <div className="flex gap-3 mt-1 text-xs" style={{ color: "#8E96A3" }}>
                          <span>Side: {(h.details as Record<string, string>).side}</span>
                          <span>{new Date(h.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <>
                {stage === "topic_selection" && (
                  <motion.div key="topic" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <h2 className="text-lg font-semibold mb-2">Choose your debate topic</h2>
                    <p style={{ color: "#8E96A3" }} className="text-sm mb-6">Select a topic and your position to begin.</p>
                    <div className="space-y-4">
                      {topics.map((t, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="p-5 rounded-xl border" style={{ background: "#1C1F26", borderColor: "#2a2f3a" }}>
                          <p className="font-medium mb-4">"{t.text}"</p>
                          <div className="flex gap-3">
                            <button onClick={() => { setSide("For"); handleTopicSelect(t); }} className="flex-1 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-90" style={{ background: "#B89A5A", color: "#0B1A2A" }}>
                              Argue FOR
                            </button>
                            <button onClick={() => { setSide("Against"); handleTopicSelect(t); }} className="flex-1 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-90" style={{ background: "#1C1F26", color: "#F4F2ED", border: "1px solid #B89A5A" }}>
                              Argue AGAINST
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {stage === "opening_statement" && selectedTopic && (
                  <motion.div key="opening" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div className="p-4 rounded-xl mb-6" style={{ background: "#1C1F26" }}>
                      <p className="text-xs mb-1" style={{ color: "#8E96A3" }}>Topic</p>
                      <p className="font-medium">"{selectedTopic.text}"</p>
                      <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold" style={{ background: "#B89A5A", color: "#0B1A2A" }}>
                        Arguing {side}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold mb-2">Opening Statement</h2>
                    <p style={{ color: "#8E96A3" }} className="text-sm mb-4">Make your strongest case. Be clear, structured, and authoritative.</p>
                    <textarea
                      value={openingText}
                      onChange={e => setOpeningText(e.target.value)}
                      placeholder="Write your opening argument here..."
                      rows={8}
                      className="w-full rounded-xl p-4 text-sm resize-none outline-none"
                      style={{ background: "#1C1F26", color: "#F4F2ED", border: "1px solid #2a2f3a" }}
                    />
                    <button onClick={handleOpeningSubmit} className="mt-4 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2" style={{ background: "#B89A5A", color: "#0B1A2A" }}>
                      Submit Opening <ChevronRight size={18} />
                    </button>
                  </motion.div>
                )}

                {stage === "ai_counter" && (
                  <motion.div key="counter" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare size={20} style={{ color: "#B89A5A" }} />
                      <h2 className="text-lg font-semibold">AI Counter-Argument</h2>
                    </div>
                    <div className="p-5 rounded-xl" style={{ background: "#1C1F26", border: "1px solid #B89A5A" }}>
                      <p className="text-sm leading-relaxed" style={{ color: "#F4F2ED" }}>
                        {aiCounterDisplay}
                        <span className="animate-pulse">|</span>
                      </p>
                    </div>
                    <p style={{ color: "#8E96A3" }} className="text-sm mt-3 text-center">Preparing your rebuttal opportunity...</p>
                  </motion.div>
                )}

                {stage === "rebuttal" && (
                  <motion.div key="rebuttal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div className="p-4 rounded-xl mb-6" style={{ background: "#1C1F26", border: "1px solid #B89A5A", opacity: 0.8 }}>
                      <p className="text-xs mb-1" style={{ color: "#B89A5A" }}>AI Counter-Argument</p>
                      <p className="text-sm leading-relaxed">{aiCounterDisplay}</p>
                    </div>
                    <h2 className="text-lg font-semibold mb-2">Your Rebuttal</h2>
                    <p style={{ color: "#8E96A3" }} className="text-sm mb-4">Address the AI's counter-points directly and reinforce your position.</p>
                    <textarea
                      value={rebuttalText}
                      onChange={e => setRebuttalText(e.target.value)}
                      placeholder="Write your rebuttal here..."
                      rows={7}
                      className="w-full rounded-xl p-4 text-sm resize-none outline-none"
                      style={{ background: "#1C1F26", color: "#F4F2ED", border: "1px solid #2a2f3a" }}
                    />
                    <button onClick={handleRebuttalSubmit} className="mt-4 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2" style={{ background: "#B89A5A", color: "#0B1A2A" }}>
                      Submit Rebuttal <ChevronRight size={18} />
                    </button>
                  </motion.div>
                )}

                {stage === "ai_final" && (
                  <motion.div key="aifinal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare size={20} style={{ color: "#B89A5A" }} />
                      <h2 className="text-lg font-semibold">AI Closing Argument</h2>
                    </div>
                    <div className="p-5 rounded-xl" style={{ background: "#1C1F26", border: "1px solid #B89A5A" }}>
                      <p className="text-sm leading-relaxed">
                        {aiFinalDisplay}
                        <span className="animate-pulse">|</span>
                      </p>
                    </div>
                    <p style={{ color: "#8E96A3" }} className="text-sm mt-3 text-center">Calculating your score...</p>
                  </motion.div>
                )}

                {stage === "scoring" && scores && (
                  <motion.div key="scoring" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div className="flex items-center gap-3 mb-6">
                      <Trophy size={28} style={{ color: "#B89A5A" }} />
                      <h2 className="text-2xl font-bold">Debate Complete</h2>
                    </div>
                    <div className="p-6 rounded-xl mb-6 text-center" style={{ background: "#1C1F26" }}>
                      <p style={{ color: "#8E96A3" }} className="text-sm mb-1">Overall Score</p>
                      <p className="text-5xl font-bold" style={{ color: "#B89A5A" }}>{scores.total}<span className="text-2xl">/100</span></p>
                      <p style={{ color: "#8E96A3" }} className="text-sm mt-2">+{Math.round(75 + scores.total * 0.5)} points awarded</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {[
                        { label: "Clarity", value: scores.clarity },
                        { label: "Structure", value: scores.structure },
                        { label: "Authority", value: scores.authority },
                        { label: "Delivery", value: scores.fillerPenalty },
                      ].map(({ label, value }) => (
                        <div key={label} className="p-4 rounded-xl" style={{ background: "#1C1F26" }}>
                          <p style={{ color: "#8E96A3" }} className="text-xs mb-1">{label}</p>
                          <p className="text-2xl font-bold" style={{ color: scoreColor(value) }}>{value}<span className="text-sm">/25</span></p>
                        </div>
                      ))}
                    </div>
                    <button onClick={resetDebate} className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2" style={{ background: "#B89A5A", color: "#0B1A2A" }}>
                      <RotateCcw size={18} /> New Debate
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PlatformLayout>
  );
};

export default AIDebateClub;
