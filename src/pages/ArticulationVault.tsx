import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, FileDown, Calendar } from "lucide-react";
import PlatformLayout from "@/components/PlatformLayout";

interface Phrase {
  id: string;
  phrase: string;
  context: string;
  whyItWorks: string;
  category: "Phrases" | "Vocabulary" | "Frameworks";
  date: string;
  starred: boolean;
}

const phraseData: Phrase[] = [
  {
    id: "1",
    phrase: "Let me put this into perspective for you",
    context: "Used during GROW Module 1 simulation",
    whyItWorks: "Signals you're about to provide valuable context and shows leadership",
    category: "Phrases",
    date: "2024-04-12",
    starred: true,
  },
  {
    id: "2",
    phrase: "The data clearly indicates that",
    context: "Used during presentation preparation",
    whyItWorks: "Grounds your argument in evidence and sounds authoritative",
    category: "Frameworks",
    date: "2024-04-11",
    starred: true,
  },
  {
    id: "3",
    phrase: "I'd like to propose a different approach",
    context: "Used during COMMUNICATE Module 1 simulation",
    whyItWorks: "Respectfully introduces alternative ideas without being dismissive",
    category: "Phrases",
    date: "2024-04-10",
    starred: false,
  },
  {
    id: "4",
    phrase: "From a strategic standpoint",
    context: "Used during executive briefing practice",
    whyItWorks: "Elevates your perspective and shows big-picture thinking",
    category: "Frameworks",
    date: "2024-04-09",
    starred: true,
  },
  {
    id: "5",
    phrase: "The bottom line is",
    context: "Used during summary exercises",
    whyItWorks: "Clear transition that signals conclusion and key takeaway",
    category: "Phrases",
    date: "2024-04-08",
    starred: false,
  },
  {
    id: "6",
    phrase: "What I'm hearing is",
    context: "Used during active listening practice",
    whyItWorks: "Shows engagement and clarifies understanding before responding",
    category: "Phrases",
    date: "2024-04-07",
    starred: true,
  },
  {
    id: "7",
    phrase: "That's an excellent point, and here's my perspective",
    context: "Used during debate module",
    whyItWorks: "Acknowledges others while confidently presenting your view",
    category: "Frameworks",
    date: "2024-04-06",
    starred: false,
  },
  {
    id: "8",
    phrase: "Let me be transparent about that",
    context: "Used during difficult conversation practice",
    whyItWorks: "Builds trust through honesty and demonstrates integrity",
    category: "Phrases",
    date: "2024-04-05",
    starred: true,
  },
  {
    id: "9",
    phrase: "Juxtaposition",
    context: "Used during vocabulary expansion module",
    whyItWorks: "Sophisticated word that shows depth and precise communication",
    category: "Vocabulary",
    date: "2024-04-04",
    starred: false,
  },
  {
    id: "10",
    phrase: "I appreciate your input on this",
    context: "Used during stakeholder management practice",
    whyItWorks: "Professional acknowledgment without over-committing",
    category: "Phrases",
    date: "2024-04-03",
    starred: true,
  },
  {
    id: "11",
    phrase: "Nuanced",
    context: "Used during analysis discussion",
    whyItWorks: "Demonstrates sophisticated thinking about complex issues",
    category: "Vocabulary",
    date: "2024-04-02",
    starred: false,
  },
  {
    id: "12",
    phrase: "Here's what concerns me about that approach",
    context: "Used during critical feedback practice",
    whyItWorks: "Direct and professional way to express concerns",
    category: "Phrases",
    date: "2024-04-01",
    starred: true,
  },
  {
    id: "13",
    phrase: "That warrants further investigation",
    context: "Used during problem-solving simulation",
    whyItWorks: "Shows analytical thinking and prevents premature conclusions",
    category: "Frameworks",
    date: "2024-03-31",
    starred: false,
  },
  {
    id: "14",
    phrase: "Synergy",
    context: "Used during team collaboration module",
    whyItWorks: "Conveys collaborative spirit and combined effectiveness",
    category: "Vocabulary",
    date: "2024-03-30",
    starred: true,
  },
  {
    id: "15",
    phrase: "I'm committed to finding a solution that works for everyone",
    context: "Used during negotiation module",
    whyItWorks: "Shows collaboration and demonstrates problem-solving mindset",
    category: "Frameworks",
    date: "2024-03-29",
    starred: false,
  },
  {
    id: "16",
    phrase: "Catalyst",
    context: "Used during change management discussion",
    whyItWorks: "Positions you as a driver of positive change",
    category: "Vocabulary",
    date: "2024-03-28",
    starred: true,
  },
  {
    id: "17",
    phrase: "Can you help me understand your reasoning?",
    context: "Used during questioning technique practice",
    whyItWorks: "Respectfully seeks clarification without being confrontational",
    category: "Phrases",
    date: "2024-03-27",
    starred: false,
  },
  {
    id: "18",
    phrase: "Moving forward, I suggest we",
    context: "Used during action planning practice",
    whyItWorks: "Forward-looking language that shows optimism and decisiveness",
    category: "Frameworks",
    date: "2024-03-26",
    starred: true,
  },
  {
    id: "19",
    phrase: "Dichotomy",
    context: "Used during analytical presentation",
    whyItWorks: "Precisely describes opposing ideas or tensions",
    category: "Vocabulary",
    date: "2024-03-25",
    starred: false,
  },
  {
    id: "20",
    phrase: "Here's my perspective on that",
    context: "Used during opinion-sharing practice",
    whyItWorks: "Confident way to share viewpoint while respecting others",
    category: "Phrases",
    date: "2024-03-24",
    starred: true,
  },
  {
    id: "21",
    phrase: "With all due respect",
    context: "Used during disagreement handling",
    whyItWorks: "Professional way to introduce contrasting views",
    category: "Phrases",
    date: "2024-03-23",
    starred: false,
  },
  {
    id: "22",
    phrase: "Paradigm shift",
    context: "Used during innovation discussion",
    whyItWorks: "Shows understanding of fundamental change in thinking",
    category: "Vocabulary",
    date: "2024-03-22",
    starred: true,
  },
  {
    id: "23",
    phrase: "I want to ensure we're aligned on this",
    context: "Used during alignment check practice",
    whyItWorks: "Shows commitment to clarity and prevents future misunderstandings",
    category: "Phrases",
    date: "2024-03-21",
    starred: false,
  },
  {
    id: "24",
    phrase: "Leverage",
    context: "Used during strategy discussion",
    whyItWorks: "Business-savvy word that shows tactical thinking",
    category: "Vocabulary",
    date: "2024-03-20",
    starred: true,
  },
  {
    id: "25",
    phrase: "That's not something I've considered before",
    context: "Used during openness to feedback practice",
    whyItWorks: "Shows humility and willingness to learn and grow",
    category: "Phrases",
    date: "2024-03-19",
    starred: false,
  },
  {
    id: "26",
    phrase: "Trajectory",
    context: "Used during progress discussion",
    whyItWorks: "Sophisticated way to describe direction of movement or progress",
    category: "Vocabulary",
    date: "2024-03-18",
    starred: true,
  },
  {
    id: "27",
    phrase: "I'd like to circle back on that",
    context: "Used during meeting management practice",
    whyItWorks: "Professional way to revisit topics without dismissing them",
    category: "Phrases",
    date: "2024-03-17",
    starred: false,
  },
  {
    id: "28",
    phrase: "Resilience",
    context: "Used during adversity discussion",
    whyItWorks: "Demonstrates strength and ability to overcome challenges",
    category: "Vocabulary",
    date: "2024-03-16",
    starred: true,
  },
  {
    id: "29",
    phrase: "That shows real business acumen",
    context: "Used during compliment and recognition practice",
    whyItWorks: "Specific praise that acknowledges sophisticated understanding",
    category: "Phrases",
    date: "2024-03-15",
    starred: false,
  },
  {
    id: "30",
    phrase: "Aggregate",
    context: "Used during data analysis discussion",
    whyItWorks: "Precise term for combining multiple elements",
    category: "Vocabulary",
    date: "2024-03-14",
    starred: true,
  },
  {
    id: "31",
    phrase: "Before we proceed, let me confirm",
    context: "Used during decision-making practice",
    whyItWorks: "Ensures alignment before moving to implementation",
    category: "Frameworks",
    date: "2024-03-13",
    starred: false,
  },
  {
    id: "32",
    phrase: "Contingency",
    context: "Used during risk management discussion",
    whyItWorks: "Shows forward thinking and preparedness",
    category: "Vocabulary",
    date: "2024-03-12",
    starred: true,
  },
  {
    id: "33",
    phrase: "Let's break this down into components",
    context: "Used during complexity management practice",
    whyItWorks: "Makes big problems manageable and demonstrates analytical thinking",
    category: "Phrases",
    date: "2024-03-11",
    starred: false,
  },
  {
    id: "34",
    phrase: "Unprecedented",
    context: "Used during describing unique situations",
    whyItWorks: "Captures the novelty and significance of situations",
    category: "Vocabulary",
    date: "2024-03-10",
    starred: true,
  },
  {
    id: "35",
    phrase: "What success looks like is",
    context: "Used during goal-setting conversation",
    whyItWorks: "Clarifies expectations and vision for outcomes",
    category: "Frameworks",
    date: "2024-03-09",
    starred: false,
  },
  {
    id: "36",
    phrase: "Iterate",
    context: "Used during continuous improvement discussion",
    whyItWorks: "Shows commitment to refinement and growth mindset",
    category: "Vocabulary",
    date: "2024-03-08",
    starred: true,
  },
  {
    id: "37",
    phrase: "I'm open to hearing your thoughts on this",
    context: "Used during collaborative problem-solving",
    whyItWorks: "Invites input while maintaining your presence",
    category: "Phrases",
    date: "2024-03-07",
    starred: false,
  },
  {
    id: "38",
    phrase: "Confluence",
    context: "Used during intersection of topics",
    whyItWorks: "Sophisticated way to describe convergence of ideas",
    category: "Vocabulary",
    date: "2024-03-06",
    starred: true,
  },
  {
    id: "39",
    phrase: "That opens up new possibilities",
    context: "Used during opportunity identification",
    whyItWorks: "Positive framing that shows optimism and vision",
    category: "Phrases",
    date: "2024-03-05",
    starred: false,
  },
  {
    id: "40",
    phrase: "Quintessential",
    context: "Used during describing perfect examples",
    whyItWorks: "Elevates description with sophisticated vocabulary",
    category: "Vocabulary",
    date: "2024-03-04",
    starred: true,
  },
];

const ArticulationVault = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProgramme, setSelectedProgramme] = useState<string>("all");
  const [starredList, setStarredList] = useState<string[]>(
    phraseData.filter((p) => p.starred).map((p) => p.id)
  );

  const filteredPhrases = useMemo(() => {
    return phraseData.filter((phrase) => {
      const categoryMatch = selectedCategory === "all" || phrase.category === selectedCategory;
      return categoryMatch;
    });
  }, [selectedCategory]);

  const stats = {
    total: phraseData.length,
    starred: starredList.length,
    thisWeek: phraseData.filter((p) => {
      const phraseDate = new Date(p.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return phraseDate > weekAgo;
    }).length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const toggleStar = (id: string) => {
    setStarredList((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleExportPDF = () => {
    // Placeholder - shows toast
    alert("PDF export coming soon!");
  };

  return (
    <PlatformLayout>
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Articulation Vault
            </h1>
            <p style={{ color: "var(--text-muted)" }}>
              Your collection of powerful phrases and vocabulary
            </p>
          </div>
          <button
            onClick={handleExportPDF}
            className="px-6 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 w-fit"
            style={{
              backgroundColor: "#D4AF37",
              color: "#0f1419",
              border: "2px solid #D4AF37",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#D4AF37";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#D4AF37";
              e.currentTarget.style.color = "#0f1419";
            }}
          >
            <FileDown className="w-4 h-4" />
            Export to PDF
          </button>
        </motion.div>

        {/* Header Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Phrases", value: stats.total, color: "#D4AF37" },
            { label: "Starred", value: stats.starred, color: "#F59E0B" },
            { label: "This Week", value: stats.thisWeek, color: "#3B82F6" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="rounded-lg p-4 border text-center"
              style={{
                backgroundColor: "#16213e",
                borderColor: "rgba(212, 175, 55, 0.2)",
              }}
            >
              <p style={{ color: "var(--text-muted)" }} className="text-xs uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-3xl font-bold mt-2" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl p-4 border space-y-4"
          style={{
            backgroundColor: "#16213e",
            borderColor: "rgba(212, 175, 55, 0.2)",
          }}
        >
          <div className="space-y-3">
            {/* Category Filter */}
            <div>
              <p style={{ color: "var(--text-muted)" }} className="text-xs uppercase tracking-wide mb-2">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                {["all", "Phrases", "Vocabulary", "Frameworks"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{
                      backgroundColor:
                        selectedCategory === cat
                          ? "#D4AF37"
                          : "rgba(212, 175, 55, 0.1)",
                      color:
                        selectedCategory === cat
                          ? "#0f1419"
                          : "var(--text-secondary)",
                      border: `1px solid ${
                        selectedCategory === cat
                          ? "#D4AF37"
                          : "rgba(212, 175, 55, 0.2)"
                      }`,
                    }}
                  >
                    {cat === "all" ? "All Categories" : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Phrase Cards */}
        <motion.div className="space-y-3">
          {filteredPhrases.length > 0 ? (
            filteredPhrases.map((phrase) => (
              <motion.div
                key={phrase.id}
                variants={itemVariants}
                className="rounded-xl p-5 border"
                style={{
                  backgroundColor: "#16213e",
                  borderColor: "rgba(212, 175, 55, 0.2)",
                  borderLeft: `4px solid #D4AF37`,
                }}
              >
                {/* Phrase & Star */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <p className="text-lg font-semibold" style={{ color: "#D4AF37" }}>
                    "{phrase.phrase}"
                  </p>
                  <button
                    onClick={() => toggleStar(phrase.id)}
                    className="mt-1 transition-transform hover:scale-110"
                  >
                    {starredList.includes(phrase.id) ? (
                      <Star
                        className="w-5 h-5 fill-current"
                        style={{ color: "#D4AF37" }}
                      />
                    ) : (
                      <Star className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                    )}
                  </button>
                </div>

                {/* Context */}
                <p style={{ color: "var(--text-secondary)" }} className="text-sm mb-3">
                  {phrase.context}
                </p>

                {/* Why It Works */}
                <div className="mb-3 pb-3 border-t border-t-[rgba(212,175,55,0.1)]">
                  <p style={{ color: "var(--text-muted)" }} className="text-xs uppercase tracking-wide mb-1">
                    Why it works
                  </p>
                  <p style={{ color: "var(--text-secondary)" }} className="text-sm">
                    {phrase.whyItWorks}
                  </p>
                </div>

                {/* Category & Date */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span
                      className="inline-block px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: "rgba(212, 175, 55, 0.2)",
                        color: "#D4AF37",
                      }}
                    >
                      {phrase.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">{phrase.date}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div
              className="rounded-xl p-12 border text-center"
              style={{
                backgroundColor: "#16213e",
                borderColor: "rgba(212, 175, 55, 0.2)",
              }}
            >
              <p style={{ color: "var(--text-muted)" }}>
                No phrases match your filters
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </PlatformLayout>
  );
};

export default ArticulationVault;
