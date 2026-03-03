import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, MessageSquare, Send, Globe, Lock, ChevronLeft, Star } from "lucide-react";
import { toast } from "sonner";
import PlatformLayout from "@/components/PlatformLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getAllPeerDebates, postPeerDebate, respondToPeerDebate, savePracticeAttempt, awardPoints } from "@/lib/persistence";
import type { PeerDebatePost } from "@/lib/persistence";

const MAX_POSITION_PREVIEW_LENGTH = 200;

function scoreText(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const avgLen = sentences.length > 0 ? words.length / sentences.length : 0;

  let clarity = 0;
  if (avgLen >= 10 && avgLen <= 25) clarity = 25;
  else if (avgLen < 10) clarity = Math.round((avgLen / 10) * 25);
  else clarity = Math.max(0, Math.round(25 - ((avgLen - 25) / 25) * 25));

  const lower = text.toLowerCase();
  const transitionWords = ["however", "therefore", "furthermore", "in conclusion", "firstly", "additionally", "consequently", "moreover"];
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

  return clarity + structure + authority + fillerPenalty;
}

const PeerDebate = () => {
  const { currentUser } = useAuth();
  const [view, setView] = useState<"feed" | "post">("feed");
  const [debates, setDebates] = useState<PeerDebatePost[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [submittingResponse, setSubmittingResponse] = useState(false);

  useEffect(() => {
    setDebates(getAllPeerDebates());
  }, []);

  function handlePost() {
    if (!currentUser) { toast.error("Please log in to post."); return; }
    if (!newTopic.trim()) { toast.error("Please enter a topic."); return; }
    if (newPosition.trim().length < 50) { toast.error("Position must be at least 50 characters."); return; }
    setSubmitting(true);
    setTimeout(() => {
      postPeerDebate(currentUser.id, currentUser.name, newTopic.trim(), newPosition.trim(), isPublic);
      awardPoints(currentUser.id, { source: "peer-debate", sourceId: "peer-debate-post", sourceName: "Peer Debate Post", points: 50 });
      setDebates(getAllPeerDebates());
      setNewTopic("");
      setNewPosition("");
      setSubmitting(false);
      setView("feed");
      toast.success("Debate posted! +50 pts");
    }, 500);
  }

  function handleRespond(postId: string) {
    if (!currentUser) { toast.error("Please log in to respond."); return; }
    if (responseText.trim().length < 20) { toast.error("Response must be at least 20 characters."); return; }
    setSubmittingResponse(true);
    setTimeout(() => {
      const score = scoreText(responseText);
      respondToPeerDebate(postId, currentUser.id, currentUser.name, responseText.trim(), score);
      savePracticeAttempt(currentUser.id, {
        practiceId: "peer-debate-response",
        practiceName: "Peer Debate Response",
        score,
        details: { postId, responseScore: score },
      });
      awardPoints(currentUser.id, { source: "peer-debate", sourceId: `response-${postId}`, sourceName: "Peer Debate Response", points: 30 });
      setDebates(getAllPeerDebates());
      setRespondingTo(null);
      setResponseText("");
      setSubmittingResponse(false);
      toast.success(`Response submitted! Score: ${score}/100 • +30 pts`);
    }, 600);
  }

  function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 1) return "just now";
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <PlatformLayout>
      <div className="min-h-screen p-6 md:p-10" style={{ background: "#0B1A2A", color: "#F4F2ED" }}>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Users size={28} style={{ color: "#B89A5A" }} />
              <div>
                <h1 className="text-2xl font-bold">Peer Debate</h1>
                <p style={{ color: "#8E96A3" }} className="text-sm">Challenge and be challenged by peers</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView("feed")}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: view === "feed" ? "#B89A5A" : "#1C1F26", color: view === "feed" ? "#0B1A2A" : "#F4F2ED" }}
              >
                Feed
              </button>
              <button
                onClick={() => setView("post")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: view === "post" ? "#B89A5A" : "#1C1F26", color: view === "post" ? "#0B1A2A" : "#F4F2ED" }}
              >
                <Plus size={16} /> Post
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {view === "post" ? (
              <motion.div key="post" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <button onClick={() => setView("feed")} className="flex items-center gap-2 text-sm mb-6" style={{ color: "#8E96A3" }}>
                  <ChevronLeft size={16} /> Back to feed
                </button>
                <div className="p-6 rounded-xl" style={{ background: "#1C1F26" }}>
                  <h2 className="text-lg font-semibold mb-6">Post a Debate</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2" style={{ color: "#8E96A3" }}>Topic</label>
                      <input
                        value={newTopic}
                        onChange={e => setNewTopic(e.target.value)}
                        placeholder="Enter your debate topic..."
                        className="w-full rounded-lg p-3 text-sm outline-none"
                        style={{ background: "#0B1A2A", color: "#F4F2ED", border: "1px solid #2a2f3a" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2" style={{ color: "#8E96A3" }}>Your Position <span className="text-xs">(min 50 chars)</span></label>
                      <textarea
                        value={newPosition}
                        onChange={e => setNewPosition(e.target.value)}
                        placeholder="State your position clearly and confidently..."
                        rows={6}
                        className="w-full rounded-lg p-3 text-sm outline-none resize-none"
                        style={{ background: "#0B1A2A", color: "#F4F2ED", border: "1px solid #2a2f3a" }}
                      />
                      <p className="text-xs mt-1" style={{ color: newPosition.length < 50 ? "#ef4444" : "#B89A5A" }}>
                        {newPosition.length}/50+ characters
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: "#0B1A2A" }}>
                      <div className="flex items-center gap-2">
                        {isPublic ? <Globe size={16} style={{ color: "#B89A5A" }} /> : <Lock size={16} style={{ color: "#8E96A3" }} />}
                        <span className="text-sm">{isPublic ? "Public post" : "Private post"}</span>
                      </div>
                      <button
                        onClick={() => setIsPublic(!isPublic)}
                        className="w-12 h-6 rounded-full relative transition-all"
                        style={{ background: isPublic ? "#B89A5A" : "#2a2f3a" }}
                      >
                        <span className="absolute top-1 w-4 h-4 rounded-full transition-all" style={{ background: "#F4F2ED", left: isPublic ? "calc(100% - 20px)" : "4px" }} />
                      </button>
                    </div>
                    <button
                      onClick={handlePost}
                      disabled={submitting}
                      className="w-full py-3 rounded-xl font-bold"
                      style={{ background: "#B89A5A", color: "#0B1A2A", opacity: submitting ? 0.7 : 1 }}
                    >
                      {submitting ? "Posting..." : "Post Debate (+50 pts)"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="feed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {debates.length === 0 ? (
                  <div className="text-center py-16" style={{ color: "#8E96A3" }}>
                    <Users size={48} className="mx-auto mb-4 opacity-30" />
                    <p>No debates yet. Be the first to post!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {debates.map((debate, i) => (
                      <motion.div key={debate.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl overflow-hidden" style={{ background: "#1C1F26" }}>
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#B89A5A", color: "#0B1A2A" }}>
                                  {debate.authorName.charAt(0)}
                                </span>
                                <span className="font-medium text-sm">{debate.authorName}</span>
                                <span className="text-xs" style={{ color: "#8E96A3" }}>{timeAgo(debate.createdAt)}</span>
                              </div>
                              <p className="font-semibold">{debate.topic}</p>
                            </div>
                            {debate.responses.length > 0 && (
                              <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ background: "#0B1A2A", color: "#B89A5A" }}>
                                <MessageSquare size={12} />
                                <span>{debate.responses.length}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed mb-4" style={{ color: "#8E96A3" }}>
                            {debate.position.length > MAX_POSITION_PREVIEW_LENGTH ? debate.position.slice(0, MAX_POSITION_PREVIEW_LENGTH) + "..." : debate.position}
                          </p>

                          {/* Responses */}
                          {debate.responses.length > 0 && (
                            <div className="space-y-2 mb-4">
                              {debate.responses.map(r => (
                                <div key={r.id} className="p-3 rounded-lg" style={{ background: "#0B1A2A" }}>
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#2a2f3a", color: "#B89A5A" }}>
                                        {r.authorName.charAt(0)}
                                      </span>
                                      <span className="text-xs font-medium">{r.authorName}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs" style={{ color: "#B89A5A" }}>
                                      <Star size={10} fill="#B89A5A" />
                                      <span>{r.score}/100</span>
                                    </div>
                                  </div>
                                  <p className="text-xs" style={{ color: "#8E96A3" }}>{r.content}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {respondingTo === debate.id ? (
                            <div>
                              <textarea
                                value={responseText}
                                onChange={e => setResponseText(e.target.value)}
                                placeholder="Write your counter-argument..."
                                rows={4}
                                className="w-full rounded-lg p-3 text-sm outline-none resize-none mb-3"
                                style={{ background: "#0B1A2A", color: "#F4F2ED", border: "1px solid #2a2f3a" }}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleRespond(debate.id)}
                                  disabled={submittingResponse}
                                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
                                  style={{ background: "#B89A5A", color: "#0B1A2A", opacity: submittingResponse ? 0.7 : 1 }}
                                >
                                  <Send size={14} /> {submittingResponse ? "Sending..." : "Submit (+30 pts)"}
                                </button>
                                <button
                                  onClick={() => { setRespondingTo(null); setResponseText(""); }}
                                  className="px-4 py-2 rounded-lg text-sm"
                                  style={{ background: "#0B1A2A", color: "#8E96A3" }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setRespondingTo(debate.id); setResponseText(""); }}
                              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all"
                              style={{ background: "#0B1A2A", color: "#B89A5A", border: "1px solid #B89A5A" }}
                            >
                              <MessageSquare size={14} /> Respond
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PlatformLayout>
  );
};

export default PeerDebate;
