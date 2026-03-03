import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlatformLayout from "@/components/PlatformLayout";

const MEETING_TYPES = [
  "Board Meeting",
  "Client Presentation",
  "Negotiation",
  "Team All-Hands",
  "Investor Pitch",
  "Media Interview",
];

const DRILLS: Record<string, {
  phrases: string[];
  vocabulary: { word: string; meaning: string }[];
  opening: string;
  confidence: string;
}> = {
  "Board Meeting": {
    phrases: [
      "I'd like to draw the board's attention to...",
      "The data clearly indicates that...",
      "With respect to the concerns raised...",
      "Our recommendation is based on three pillars:",
      "I'm confident we can deliver this by...",
    ],
    vocabulary: [
      { word: "Fiduciary", meaning: "Relating to legal or ethical responsibility to act in another's best interest" },
      { word: "Quorum", meaning: "The minimum number of members needed for a meeting to be valid" },
      { word: "Governance", meaning: "The framework of rules and practices by which a board ensures accountability" },
    ],
    opening: "Good [morning/afternoon]. I want to acknowledge the gravity of what we're discussing today. The numbers are challenging — but they also represent a clear opportunity if we act decisively.",
    confidence: "You were invited to this room because your perspective matters. Stand tall, speak slowly, and remember: the board needs your clarity right now.",
  },
  "Client Presentation": {
    phrases: [
      "What this means for your business specifically is...",
      "Let me show you exactly how this works in practice.",
      "Based on what you shared with us, we've tailored...",
      "The ROI on this will show within...",
      "I'd welcome your reaction to this before we move on.",
    ],
    vocabulary: [
      { word: "Value proposition", meaning: "The unique benefit your solution delivers to the client" },
      { word: "Deliverable", meaning: "A specific output or result that must be produced as part of the project" },
      { word: "Stakeholder buy-in", meaning: "Gaining the agreement and support of key decision-makers" },
    ],
    opening: "Thank you for making time today. I want to start by confirming that everything we're presenting has been built around the specific challenges you shared with us in our last conversation.",
    confidence: "They called this meeting because they're interested. Your job is to be specific, confident, and client-focused. You've done the work — now show it.",
  },
  "Negotiation": {
    phrases: [
      "I understand your position. Let me share ours.",
      "What would need to be true for you to move on this?",
      "We're prepared to be flexible on X if you can move on Y.",
      "Can we park that point and come back to it?",
      "I think we're closer than we might appear right now.",
    ],
    vocabulary: [
      { word: "BATNA", meaning: "Best Alternative To a Negotiated Agreement — your backup option" },
      { word: "Concession", meaning: "Something you give up to reach an agreement" },
      { word: "Mutual interest", meaning: "A shared goal that both parties benefit from achieving" },
    ],
    opening: "Before we get into the specifics, I want to acknowledge that both sides have something valuable here. My aim today is to find a structure that works for everyone at this table.",
    confidence: "Negotiation is about patience, not aggression. Speak less, listen more. The person who controls their emotions controls the room.",
  },
  "Team All-Hands": {
    phrases: [
      "I want to be direct with you about where we are.",
      "Here's what the numbers mean in plain language:",
      "Your contribution to this has been significant, and I want to name it.",
      "The challenge ahead requires all of us to...",
      "I'm here to answer your questions directly.",
    ],
    vocabulary: [
      { word: "Transparency", meaning: "Being open and honest about decisions, data, and direction" },
      { word: "Alignment", meaning: "Ensuring all team members understand and are working toward the same goals" },
      { word: "Accountability", meaning: "Taking responsibility for outcomes and following through on commitments" },
    ],
    opening: "I want to thank you all for being here. Before I share the business update, I want to acknowledge that these past [weeks/months] have required a lot from everyone in this room.",
    confidence: "Your team needs to feel that you're in control and that you care. Speak from conviction, not from a script. They're watching your eyes, not your slides.",
  },
  "Investor Pitch": {
    phrases: [
      "The market opportunity we're addressing is worth...",
      "Our traction to date demonstrates...",
      "The team behind this has a proven track record of...",
      "Our differentiation comes down to three things:",
      "Here's what we're asking for and exactly how it gets deployed.",
    ],
    vocabulary: [
      { word: "Runway", meaning: "The amount of time a company can operate before needing more funding" },
      { word: "Unit economics", meaning: "The direct revenue and costs associated with a single business unit" },
      { word: "Scalability", meaning: "The ability to grow rapidly without proportional increases in cost" },
    ],
    opening: "In 90 seconds, I want to show you why this market is underserved, why we are the right team to capture it, and why now is exactly the right moment.",
    confidence: "Investors are betting on you as much as the idea. Project certainty. Speak as if this is already happening — because you believe it is.",
  },
  "Media Interview": {
    phrases: [
      "I want to be clear on the facts here:",
      "What I can confirm is...",
      "That's an important question. Let me give you a direct answer.",
      "I'm not in a position to speculate on that, but what I can say is...",
      "The message I want your audience to take away is...",
    ],
    vocabulary: [
      { word: "On the record", meaning: "Information that can be quoted and attributed to you directly" },
      { word: "Bridging", meaning: "Redirecting a question to your key message using a transition phrase" },
      { word: "Spokesperson", meaning: "The officially designated person authorised to speak for an organisation" },
    ],
    opening: "Thank you for the opportunity. Before we get into the details, I want to start with the most important thing: [state your core message]. Everything else flows from that.",
    confidence: "You control what you say — not what they ask. Use every question as a bridge to your message. Stay calm, speak in short sentences, and never fill silence with guesses.",
  },
};

const RescueMode = () => {
  const [meetingType, setMeetingType] = useState("");
  const [minutes, setMinutes] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [drill, setDrill] = useState<typeof DRILLS[string] | null>(null);

  const handleGenerate = () => {
    if (!meetingType) return;
    setLoading(true);
    setDrill(null);
    setTimeout(() => {
      setDrill(DRILLS[meetingType] || DRILLS["Board Meeting"]);
      setLoading(false);
    }, 2000);
  };

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-xs text-[#B89A5A] tracking-[0.2em] uppercase font-medium mb-1">My Toolkit</p>
        <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] tracking-tight mb-1">
          🚨 Rescue Mode
        </h1>
        <p className="text-[#8E96A3] text-sm">Emergency Meeting Prep</p>
      </motion.div>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl bg-[#1C1F26] border border-[#B89A5A]/10 p-6 mb-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-[#8E96A3] uppercase tracking-wider mb-2">
              Meeting Type
            </label>
            <select
              value={meetingType}
              onChange={e => setMeetingType(e.target.value)}
              className="w-full bg-[#0B1A2A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#F4F2ED] focus:outline-none focus:border-[#B89A5A]/50 transition-colors"
            >
              <option value="">Select type...</option>
              {MEETING_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8E96A3] uppercase tracking-wider mb-2">
              Minutes Until Meeting
            </label>
            <input
              type="number"
              value={minutes}
              onChange={e => setMinutes(e.target.value)}
              placeholder="e.g. 10"
              min={1}
              className="w-full bg-[#0B1A2A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#F4F2ED] placeholder-[#8E96A3]/50 focus:outline-none focus:border-[#B89A5A]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8E96A3] uppercase tracking-wider mb-2">
              Main Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Q3 budget review"
              className="w-full bg-[#0B1A2A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#F4F2ED] placeholder-[#8E96A3]/50 focus:outline-none focus:border-[#B89A5A]/50 transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!meetingType || loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B89A5A] text-[#0B1A2A] font-semibold text-sm hover:bg-[#d4ba6a] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <span className="animate-spin text-base">⏳</span>
              Generating your drill...
            </>
          ) : (
            <>🚨 Generate Drill</>
          )}
        </button>
      </motion.div>

      {/* Drill Output */}
      <AnimatePresence>
        {drill && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Opening Script */}
            <div className="rounded-xl bg-[#1C1F26] border border-[#B89A5A]/20 p-5">
              <h3 className="text-xs font-bold text-[#B89A5A] uppercase tracking-wider mb-3">
                🎯 2-Sentence Opening Script
              </h3>
              <p className="text-sm text-[#F4F2ED] leading-relaxed italic">
                "{drill.opening}"
              </p>
            </div>

            {/* Key Phrases */}
            <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-5">
              <h3 className="text-xs font-bold text-[#8E96A3] uppercase tracking-wider mb-3">
                💬 5 Key Phrases
              </h3>
              <ul className="space-y-2">
                {drill.phrases.map((phrase, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#B89A5A] font-bold text-xs mt-0.5 shrink-0">{i + 1}.</span>
                    <span className="text-sm text-[#F4F2ED]">"{phrase}"</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vocabulary */}
            <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-5">
              <h3 className="text-xs font-bold text-[#8E96A3] uppercase tracking-wider mb-3">
                📖 3 Power Vocabulary Items
              </h3>
              <div className="space-y-3">
                {drill.vocabulary.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-sm font-bold text-[#B89A5A] shrink-0">{item.word}</span>
                    <span className="text-xs text-[#8E96A3] leading-relaxed">— {item.meaning}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence Reminder */}
            <div className="rounded-xl bg-[#B89A5A]/5 border border-[#B89A5A]/20 p-5">
              <h3 className="text-xs font-bold text-[#B89A5A] uppercase tracking-wider mb-2">
                💪 Confidence Reminder
              </h3>
              <p className="text-sm text-[#F4F2ED]/80 leading-relaxed">{drill.confidence}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PlatformLayout>
  );
};

export default RescueMode;
