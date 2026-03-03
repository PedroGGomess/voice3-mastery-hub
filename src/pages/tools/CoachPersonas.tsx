import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserCircle, CheckCircle, Briefcase, TrendingUp, DollarSign, Heart } from "lucide-react";
import { toast } from "sonner";
import PlatformLayout from "@/components/PlatformLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getSelectedPersona, setSelectedPersona } from "@/lib/persistence";

interface Persona {
  id: string;
  name: string;
  role: string;
  description: string;
  style: string;
  phrases: string[];
  icon: React.ReactNode;
  color: string;
}

const PERSONAS: Persona[] = [
  {
    id: "board-chair",
    name: "Board Chair",
    role: "Corporate Governance",
    description: "Formal, strategic, expects brevity and data. Will cut you off if you ramble.",
    style: "Expects precision. No pleasantries. Wants the headline, the data, and the ask.",
    phrases: ["Get to the point.", "What does the data say?", "I need a one-sentence answer.", "Skip the context — bottom line?", "Is this a decision or an update?"],
    icon: <Briefcase size={24} />,
    color: "#4F6EF7",
  },
  {
    id: "investor",
    name: "Investor",
    role: "Venture / Private Equity",
    description: "Numbers-focused, skeptical, wants ROI. Challenges every assumption.",
    style: "Wants to see the math. Distrusts narrative without metrics. Has seen every pitch.",
    phrases: ["Prove it with numbers.", "What's your exit strategy?", "I've seen this pitch before.", "What does the unit economics look like?", "Why now? Why you?"],
    icon: <TrendingUp size={24} />,
    color: "#10B981",
  },
  {
    id: "hostile-cfo",
    name: "Hostile CFO",
    role: "Chief Financial Officer",
    description: "Aggressive, challenges every number, tests your knowledge under pressure.",
    style: "Assumes your numbers are wrong until proven otherwise. Tests your depth relentlessly.",
    phrases: ["That budget is unrealistic.", "You haven't accounted for X.", "Run me through the unit economics.", "What's your variance to forecast?", "Who approved this model?"],
    icon: <DollarSign size={24} />,
    color: "#EF4444",
  },
  {
    id: "mentor",
    name: "Supportive Mentor",
    role: "Executive Coach",
    description: "Encouraging, asks guiding questions, builds confidence.",
    style: "Uses questions to unlock thinking. Focuses on growth and learning, not judgment.",
    phrases: ["What would you do differently?", "I think you're onto something here.", "Tell me more about your reasoning.", "What's the risk you're not saying out loud?", "How would you handle it next time?"],
    icon: <Heart size={24} />,
    color: "#B89A5A",
  },
];

const CoachPersonas = () => {
  const { currentUser } = useAuth();
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      const saved = getSelectedPersona(currentUser.id);
      if (saved) setActivePersonaId(saved);
    }
  }, [currentUser]);

  function handleSelect(personaId: string) {
    if (!currentUser) { toast.error("Please log in to select a persona."); return; }
    setSelectedPersona(currentUser.id, personaId);
    setActivePersonaId(personaId);
    const persona = PERSONAS.find(p => p.id === personaId);
    toast.success(`${persona?.name} is now your active coach persona.`);
  }

  return (
    <PlatformLayout>
      <div className="min-h-screen p-6 md:p-10" style={{ background: "#0B1A2A", color: "#F4F2ED" }}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <UserCircle size={28} style={{ color: "#B89A5A" }} />
            <div>
              <h1 className="text-2xl font-bold">Coach Personas</h1>
              <p style={{ color: "#8E96A3" }} className="text-sm">Choose who challenges you</p>
            </div>
          </div>

          {activePersonaId && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 rounded-xl flex items-center gap-3"
              style={{ background: "#1C1F26", border: "1px solid #B89A5A" }}
            >
              <CheckCircle size={18} style={{ color: "#B89A5A" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "#B89A5A" }}>
                  Active Persona: {PERSONAS.find(p => p.id === activePersonaId)?.name}
                </p>
                <p className="text-xs" style={{ color: "#8E96A3" }}>
                  This persona is active across all practice sessions
                </p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PERSONAS.map((persona, i) => {
              const isActive = activePersonaId === persona.id;
              const isHovered = hoveredId === persona.id;

              return (
                <motion.div
                  key={persona.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onMouseEnter={() => setHoveredId(persona.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="rounded-xl overflow-hidden cursor-pointer transition-all"
                  style={{
                    background: "#1C1F26",
                    border: isActive ? `2px solid #B89A5A` : isHovered ? `2px solid ${persona.color}44` : "2px solid #2a2f3a",
                    boxShadow: isActive ? "0 0 20px rgba(184, 154, 90, 0.15)" : "none",
                  }}
                  onClick={() => handleSelect(persona.id)}
                >
                  <div className="p-6">
                    {/* Top: Icon + Name + Active badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${persona.color}22`, color: persona.color }}>
                          {persona.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{persona.name}</h3>
                          <p className="text-xs" style={{ color: "#8E96A3" }}>{persona.role}</p>
                        </div>
                      </div>
                      {isActive && (
                        <span className="px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1" style={{ background: "#B89A5A", color: "#0B1A2A" }}>
                          <CheckCircle size={10} /> ACTIVE
                        </span>
                      )}
                    </div>

                    <p className="text-sm mb-3 leading-relaxed">{persona.description}</p>
                    <p className="text-xs mb-4 leading-relaxed" style={{ color: "#8E96A3" }}>{persona.style}</p>

                    {/* Sample phrases */}
                    <div className="space-y-2 mb-5">
                      <p className="text-xs font-semibold" style={{ color: "#8E96A3" }}>SAMPLE PHRASES</p>
                      {persona.phrases.slice(0, 3).map((phrase, pi) => (
                        <div key={pi} className="flex items-start gap-2">
                          <span className="text-xs mt-0.5" style={{ color: persona.color }}>"</span>
                          <p className="text-xs italic" style={{ color: "#F4F2ED" }}>{phrase}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={e => { e.stopPropagation(); handleSelect(persona.id); }}
                      className="w-full py-2.5 rounded-lg text-sm font-bold transition-all"
                      style={{
                        background: isActive ? "#B89A5A" : `${persona.color}22`,
                        color: isActive ? "#0B1A2A" : persona.color,
                        border: isActive ? "none" : `1px solid ${persona.color}44`,
                      }}
                    >
                      {isActive ? "✓ Currently Active" : "Select Persona"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 rounded-xl text-center"
            style={{ background: "#1C1F26" }}
          >
            <p className="text-sm" style={{ color: "#8E96A3" }}>
              Your selected persona influences the tone and style of challenges in practice sessions.
              Switch anytime to develop different dimensions of your executive presence.
            </p>
          </motion.div>
        </div>
      </div>
    </PlatformLayout>
  );
};

export default CoachPersonas;
