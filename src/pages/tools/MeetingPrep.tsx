import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Copy, History, ChevronRight, Users, AlertTriangle, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";
import PlatformLayout from "@/components/PlatformLayout";
import { useAuth } from "@/contexts/AuthContext";
import { saveToolkitEntry, getToolkitHistory, awardPoints } from "@/lib/persistence";
import type { ToolkitEntry } from "@/lib/persistence";

interface MeetingOutput {
  questions: string[];
  objections: string[];
  responses: string[];
}

function generateMeetingOutput(agenda: string, stakeholders: string, riskArea: string): MeetingOutput {
  const agendaItems = agenda.split(/[\n,;]+/).map(s => s.trim()).filter(s => s.length > 0);
  const stakeholderList = stakeholders.split(/[\n,;]+/).map(s => s.trim()).filter(s => s.length > 0);

  const questions: string[] = [];
  for (let i = 0; i < Math.min(agendaItems.length, 3); i++) {
    const item = agendaItems[i];
    const stakeholder = stakeholderList[i % stakeholderList.length] || "each stakeholder";
    questions.push(`In relation to "${item}", what is ${stakeholder}'s current position and what outcome are they expecting from this meeting?`);
  }
  if (questions.length < 3) {
    const extra = [
      `What does success look like from ${stakeholderList[0] || "the stakeholder"}'s perspective at the end of this meeting?`,
      `Are there any undisclosed constraints or priorities that could affect the decisions we need to make today?`,
      `What information or data would make ${stakeholderList[0] || "key stakeholders"} most confident in the proposed direction?`,
    ];
    while (questions.length < 3) questions.push(extra[questions.length - (agendaItems.length > 0 ? agendaItems.length : 0)]);
  }
  if (questions.length < 5) {
    questions.push(`What prior commitments or decisions might conflict with the agenda items we're addressing today?`);
    questions.push(`How does ${stakeholderList[0] || "the group"} want to handle open items or decisions that require further analysis?`);
  }

  const risk = riskArea || "implementation";
  const objections: string[] = [
    `"The ${risk} risk hasn't been fully quantified. We're not comfortable approving this without a clearer impact assessment."`,
    `"We've seen ${risk} challenges derail similar initiatives. What makes you confident this time will be different?"`,
    `"The timeline doesn't account for ${risk} complexities. We'll need a buffer or a phased approach before we commit."`,
  ];

  const responses: string[] = [
    `**Acknowledge:** "You're right to flag the ${risk} exposure—it's the critical variable here." **Reframe:** "We've modeled three scenarios specifically around ${risk} impact." **Resolve:** "Based on our analysis, the expected case is manageable, and we have a mitigation plan ready." **Confirm:** "Does walking through the scenario analysis address your concern, or would you prefer an external review first?"`,
    `**Acknowledge:** "That's a fair challenge—past ${risk} failures are exactly why we approached this differently." **Reframe:** "The key distinction is that we've built in decision gates at 30/60/90 days specifically to catch ${risk} deviations early." **Resolve:** "We can share the lessons-learned documentation from previous initiatives." **Confirm:** "Would that additional context give you the confidence to proceed?"`,
    `**Acknowledge:** "A phased approach is a legitimate risk management tool for ${risk}." **Reframe:** "The reason we proposed the full timeline is that a phased approach would reduce the cost synergies by approximately 35%." **Resolve:** "We can table a modified Gantt with a conditional Phase 2 gate if that's the board's preference." **Confirm:** "Shall we model both options before the next session?"`,
  ];

  return { questions, objections, responses };
}

const MeetingPrep = () => {
  const { currentUser } = useAuth();
  const [agenda, setAgenda] = useState("");
  const [stakeholders, setStakeholders] = useState("");
  const [riskArea, setRiskArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<MeetingOutput | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const history: ToolkitEntry[] = currentUser ? getToolkitHistory(currentUser.id, "meeting-prep") : [];

  function handlePrepare() {
    if (!agenda.trim()) { toast.error("Please enter at least one agenda point."); return; }
    setLoading(true);
    setOutput(null);
    setTimeout(() => {
      const result = generateMeetingOutput(agenda, stakeholders, riskArea);
      setOutput(result);
      setLoading(false);

      if (currentUser) {
        saveToolkitEntry(currentUser.id, {
          toolId: "meeting-prep",
          toolName: "Meeting Prep",
          inputs: { agenda, stakeholders, riskArea },
          outputs: result as unknown as Record<string, unknown>,
        });
        awardPoints(currentUser.id, {
          source: "meeting-prep",
          sourceId: `prep-${Date.now()}`,
          sourceName: "Meeting Prep",
          points: 20,
        });
        toast.success("Meeting prep ready! +20 pts");
      }
    }, 1500);
  }

  function copyText(text: string | string[]) {
    const content = Array.isArray(text) ? text.join("\n\n") : text;
    navigator.clipboard.writeText(content).then(() => toast.success("Copied!")).catch(() => toast.error("Copy failed"));
  }

  return (
    <PlatformLayout>
      <div className="min-h-screen p-6 md:p-10" style={{ background: "#0B1A2A", color: "#F4F2ED" }}>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Calendar size={28} style={{ color: "#B89A5A" }} />
              <div>
                <h1 className="text-2xl font-bold">Meeting Prep</h1>
                <p style={{ color: "#8E96A3" }} className="text-sm">Walk in prepared, not just present</p>
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
                  <h2 className="text-lg font-semibold">Past Prep Sessions</h2>
                </div>
                {history.length === 0 ? (
                  <p style={{ color: "#8E96A3" }}>No sessions yet.</p>
                ) : (
                  <div className="space-y-3">
                    {history.map(entry => (
                      <div key={entry.id} className="p-4 rounded-xl" style={{ background: "#1C1F26" }}>
                        <p className="text-xs mb-2" style={{ color: "#8E96A3" }}>{new Date(entry.createdAt).toLocaleString()}</p>
                        <p className="text-sm font-medium mb-1">Agenda</p>
                        <p className="text-sm" style={{ color: "#8E96A3" }}>
                          {typeof entry.inputs.agenda === "string" ? entry.inputs.agenda.slice(0, 100) + "..." : ""}
                        </p>
                        {typeof entry.inputs.stakeholders === "string" && entry.inputs.stakeholders && (
                          <>
                            <p className="text-sm font-medium mt-2 mb-1">Stakeholders</p>
                            <p className="text-sm" style={{ color: "#8E96A3" }}>{entry.inputs.stakeholders}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="prep" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {/* Input form */}
                <div className="p-6 rounded-xl mb-6" style={{ background: "#1C1F26" }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2" style={{ color: "#8E96A3" }}>Agenda Points</label>
                      <textarea
                        value={agenda}
                        onChange={e => setAgenda(e.target.value)}
                        placeholder="e.g. Q3 budget review, New vendor contract, Headcount planning..."
                        rows={4}
                        className="w-full rounded-lg p-3 text-sm outline-none resize-none"
                        style={{ background: "#0B1A2A", color: "#F4F2ED", border: "1px solid #2a2f3a" }}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm mb-2" style={{ color: "#8E96A3" }}>
                        <Users size={14} /> Key Stakeholders
                      </label>
                      <input
                        value={stakeholders}
                        onChange={e => setStakeholders(e.target.value)}
                        placeholder="e.g. CFO, Head of Product, Board Chair..."
                        className="w-full rounded-lg p-3 text-sm outline-none"
                        style={{ background: "#0B1A2A", color: "#F4F2ED", border: "1px solid #2a2f3a" }}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm mb-2" style={{ color: "#8E96A3" }}>
                        <AlertTriangle size={14} /> Risk Area
                      </label>
                      <input
                        value={riskArea}
                        onChange={e => setRiskArea(e.target.value)}
                        placeholder="e.g. budget overrun, timeline, regulatory compliance..."
                        className="w-full rounded-lg p-3 text-sm outline-none"
                        style={{ background: "#0B1A2A", color: "#F4F2ED", border: "1px solid #2a2f3a" }}
                      />
                    </div>
                    <button
                      onClick={handlePrepare}
                      disabled={loading}
                      className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                      style={{ background: "#B89A5A", color: "#0B1A2A", opacity: loading ? 0.8 : 1 }}
                    >
                      {loading ? (
                        <>
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                            <Calendar size={18} />
                          </motion.div>
                          Preparing...
                        </>
                      ) : (
                        <>
                          <ChevronRight size={18} /> Prepare Meeting (+20 pts)
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {output && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    {/* Questions */}
                    <div className="p-5 rounded-xl" style={{ background: "#1C1F26" }}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare size={18} style={{ color: "#B89A5A" }} />
                          <h3 className="font-semibold">Questions to Ask</h3>
                        </div>
                        <button onClick={() => copyText(output.questions)} className="p-2 rounded-lg" style={{ background: "#0B1A2A", color: "#B89A5A" }}>
                          <Copy size={14} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {output.questions.map((q, i) => (
                          <div key={i} className="flex gap-3">
                            <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: "#B89A5A", color: "#0B1A2A" }}>{i + 1}</span>
                            <p className="text-sm leading-relaxed">{q}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Objections */}
                    <div className="p-5 rounded-xl" style={{ background: "#1C1F26" }}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={18} style={{ color: "#B89A5A" }} />
                          <h3 className="font-semibold">Objections to Anticipate</h3>
                        </div>
                        <button onClick={() => copyText(output.objections)} className="p-2 rounded-lg" style={{ background: "#0B1A2A", color: "#B89A5A" }}>
                          <Copy size={14} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {output.objections.map((o, i) => (
                          <div key={i} className="flex gap-3">
                            <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: "#2a2f3a", color: "#ef4444" }}>{i + 1}</span>
                            <p className="text-sm leading-relaxed italic" style={{ color: "#8E96A3" }}>{o}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ARRC Responses */}
                    <div className="p-5 rounded-xl" style={{ background: "#1C1F26" }}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <ChevronRight size={18} style={{ color: "#B89A5A" }} />
                          <h3 className="font-semibold">ARRC Response Templates</h3>
                        </div>
                        <button onClick={() => copyText(output.responses)} className="p-2 rounded-lg" style={{ background: "#0B1A2A", color: "#B89A5A" }}>
                          <Copy size={14} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {output.responses.map((r, i) => (
                          <div key={i} className="p-4 rounded-lg" style={{ background: "#0B1A2A" }}>
                            <p className="text-xs font-bold mb-2" style={{ color: "#B89A5A" }}>Response to Objection {i + 1}</p>
                            <p className="text-sm leading-relaxed" style={{ color: "#F4F2ED" }}>{r}</p>
                          </div>
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

export default MeetingPrep;
