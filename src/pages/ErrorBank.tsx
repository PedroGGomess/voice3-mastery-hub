import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import PlatformLayout from "@/components/PlatformLayout";

interface Error {
  id: string;
  error: string;
  correction: string;
  explanation: string;
  source: string;
  category: "Grammar" | "Vocabulary" | "Tone" | "Structure";
  date: string;
  status: "needs-practice" | "reviewed" | "mastered";
}

const errorData: Error[] = [
  {
    id: "1",
    error: "If I would have known",
    correction: "If I had known",
    explanation: "Would have is never used in the if clause of conditional statements",
    source: "GROW > Module 1 > Chapter 1.2",
    category: "Grammar",
    date: "2024-04-12",
    status: "mastered",
  },
  {
    id: "2",
    error: "I think maybe",
    correction: "I'm confident that",
    explanation: "Hedging language weakens your communication. Replace with confident statements",
    source: "COMMUNICATE > Module 1 > Chapter 2.1",
    category: "Vocabulary",
    date: "2024-04-11",
    status: "reviewed",
  },
  {
    id: "3",
    error: "Sorry to bother you, but",
    correction: "I'd like to discuss",
    explanation: "Apologizing unnecessarily diminishes your authority and message impact",
    source: "COMMUNICATE > Module 2 > Chapter 1.3",
    category: "Tone",
    date: "2024-04-10",
    status: "mastered",
  },
  {
    id: "4",
    error: "The thing is that basically",
    correction: "The key point is",
    explanation: "Filler phrases dilute your message clarity and appear unprepared",
    source: "GROW > Module 2 > Chapter 2.2",
    category: "Structure",
    date: "2024-04-09",
    status: "reviewed",
  },
  {
    id: "5",
    error: "Could of, would of, should of",
    correction: "Could have, would have, should have",
    explanation: "Common homophone error in English. These verbs always pair with have",
    source: "GROW > Module 1 > Chapter 1.1",
    category: "Grammar",
    date: "2024-04-08",
    status: "needs-practice",
  },
  {
    id: "6",
    error: "I'm gonna",
    correction: "I'm going to / I will",
    explanation: "Avoid contractions in formal communication contexts",
    source: "COMMUNICATE > Module 1 > Chapter 1.4",
    category: "Vocabulary",
    date: "2024-04-07",
    status: "needs-practice",
  },
  {
    id: "7",
    error: "Literally exhausted",
    correction: "Exhausted / Very tired",
    explanation: "Literally means actually happened. Use figuratively if describing metaphor",
    source: "GROW > Module 3 > Chapter 2.1",
    category: "Vocabulary",
    date: "2024-04-06",
    status: "reviewed",
  },
  {
    id: "8",
    error: "Me and him went",
    correction: "He and I went",
    explanation: "Use subject pronouns (I, he, she) for the subject of a verb",
    source: "GROW > Module 1 > Chapter 1.3",
    category: "Grammar",
    date: "2024-04-05",
    status: "needs-practice",
  },
  {
    id: "9",
    error: "Just wanted to reach out",
    correction: "I wanted to connect / I'd like to discuss",
    explanation: "More direct language shows confidence and clarity of purpose",
    source: "COMMUNICATE > Module 2 > Chapter 2.3",
    category: "Tone",
    date: "2024-04-04",
    status: "reviewed",
  },
  {
    id: "10",
    error: "It is what it is",
    correction: "That's the current situation / We'll adapt and continue",
    explanation: "Provide context and solutions rather than accepting passivity",
    source: "COMMUNICATE > Module 3 > Chapter 1.1",
    category: "Tone",
    date: "2024-04-03",
    status: "mastered",
  },
  {
    id: "11",
    error: "Run a meeting",
    correction: "Facilitate / Lead a meeting",
    explanation: "More precise vocabulary conveys intentional leadership",
    source: "GROW > Module 2 > Chapter 3.1",
    category: "Vocabulary",
    date: "2024-04-02",
    status: "reviewed",
  },
  {
    id: "12",
    error: "Umm, so like, you know",
    correction: "Clear pause and restart",
    explanation: "Filler sounds diminish credibility. Practice deliberate pauses instead",
    source: "COMMUNICATE > Module 1 > Chapter 2.2",
    category: "Structure",
    date: "2024-04-01",
    status: "needs-practice",
  },
  {
    id: "13",
    error: "Their/There/They're confusion",
    correction: "Their=possessive, There=place, They're=they are",
    explanation: "Homophone confusion. Practice using each in context",
    source: "GROW > Module 1 > Chapter 1.2",
    category: "Grammar",
    date: "2024-03-31",
    status: "reviewed",
  },
  {
    id: "14",
    error: "I'm sorry, I don't understand",
    correction: "Could you clarify that point? / I'd like to understand better",
    explanation: "Avoid apologizing for seeking clarity. It's a sign of engagement",
    source: "COMMUNICATE > Module 2 > Chapter 1.1",
    category: "Tone",
    date: "2024-03-30",
    status: "needs-practice",
  },
  {
    id: "15",
    error: "Very unique",
    correction: "Unique / Distinctive",
    explanation: "Unique is already absolute. Nothing can be more or less unique",
    source: "GROW > Module 2 > Chapter 2.3",
    category: "Vocabulary",
    date: "2024-03-29",
    status: "reviewed",
  },
  {
    id: "16",
    error: "Literally thousands of times",
    correction: "Thousands of times / Many times",
    explanation: "Hyperbole in formal speech weakens credibility",
    source: "COMMUNICATE > Module 1 > Chapter 3.2",
    category: "Vocabulary",
    date: "2024-03-28",
    status: "mastered",
  },
  {
    id: "17",
    error: "Not gonna lie",
    correction: "To be honest / I believe",
    explanation: "Removes implicit assumption of dishonesty in other statements",
    source: "COMMUNICATE > Module 1 > Chapter 1.2",
    category: "Tone",
    date: "2024-03-27",
    status: "reviewed",
  },
  {
    id: "18",
    error: "Ain't",
    correction: "Isn't / Am not / Aren't / Hasn't",
    explanation: "Non-standard English. Replace with formal contraction",
    source: "GROW > Module 1 > Chapter 1.4",
    category: "Grammar",
    date: "2024-03-26",
    status: "needs-practice",
  },
  {
    id: "19",
    error: "Impact as verb in formal context",
    correction: "Affect / Influence",
    explanation: "While impact is accepted as verb, affect is more appropriate in formal speech",
    source: "GROW > Module 2 > Chapter 1.3",
    category: "Vocabulary",
    date: "2024-03-25",
    status: "reviewed",
  },
  {
    id: "20",
    error: "Good versus Well",
    correction: "Feel well (adverb), Taste good (adjective)",
    explanation: "Well modifies actions, good modifies states/nouns",
    source: "GROW > Module 1 > Chapter 2.1",
    category: "Grammar",
    date: "2024-03-24",
    status: "mastered",
  },
  {
    id: "21",
    error: "Passive voice overuse",
    correction: "Active voice: 'I completed the project'",
    explanation: "Active voice is clearer and more persuasive in professional communication",
    source: "COMMUNICATE > Module 2 > Chapter 2.1",
    category: "Structure",
    date: "2024-03-23",
    status: "reviewed",
  },
  {
    id: "22",
    error: "Right? at end of statements",
    correction: "Complete your thought. Add punctuation",
    explanation: "Seeking approval weakens statements. Use question mark intentionally",
    source: "COMMUNICATE > Module 1 > Chapter 2.4",
    category: "Tone",
    date: "2024-03-22",
    status: "needs-practice",
  },
  {
    id: "23",
    error: "Trying to go to the store",
    correction: "I'm going to the store / I plan to go",
    explanation: "Trying implies difficulty. Use go/plan for direct statements",
    source: "COMMUNICATE > Module 3 > Chapter 1.2",
    category: "Vocabulary",
    date: "2024-03-21",
    status: "reviewed",
  },
  {
    id: "24",
    error: "Between you and I",
    correction: "Between you and me",
    explanation: "Between is a preposition taking object pronouns (me, him, her)",
    source: "GROW > Module 1 > Chapter 1.3",
    category: "Grammar",
    date: "2024-03-20",
    status: "mastered",
  },
  {
    id: "25",
    error: "Due to excessive hedging",
    correction: "State positions clearly with evidence",
    explanation: "Build confidence by stating positions directly while remaining respectful",
    source: "COMMUNICATE > Module 3 > Chapter 2.2",
    category: "Tone",
    date: "2024-03-19",
    status: "reviewed",
  },
];

const ErrorBank = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProgramme, setSelectedProgramme] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredErrors = useMemo(() => {
    return errorData.filter((error) => {
      const categoryMatch = selectedCategory === "all" || error.category === selectedCategory;
      const statusMatch = selectedStatus === "all" || error.status === selectedStatus;
      return categoryMatch && statusMatch;
    });
  }, [selectedCategory, selectedStatus]);

  const stats = {
    total: errorData.length,
    reviewed: errorData.filter((e) => e.status !== "needs-practice").length,
    mastered: errorData.filter((e) => e.status === "mastered").length,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "needs-practice":
        return { bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.3)", text: "#EF4444" };
      case "reviewed":
        return { bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.3)", text: "#3B82F6" };
      case "mastered":
        return { bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.3)", text: "#10B981" };
      default:
        return { bg: "rgba(212, 175, 55, 0.1)", border: "rgba(212, 175, 55, 0.3)", text: "#D4AF37" };
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "mastered") return <CheckCircle2 className="w-4 h-4" />;
    if (status === "reviewed") return <Check className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getStatusLabel = (status: string) => {
    return status === "needs-practice"
      ? "Needs Practice"
      : status === "reviewed"
        ? "Reviewed"
        : "Mastered";
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
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Error Bank
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Track and master all your captured errors from your modules
          </p>
        </motion.div>

        {/* Header Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Errors", value: stats.total, color: "#D4AF37" },
            { label: "Reviewed", value: stats.reviewed, color: "#3B82F6" },
            { label: "Mastered", value: stats.mastered, color: "#10B981" },
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
                Error Type
              </p>
              <div className="flex flex-wrap gap-2">
                {["all", "Grammar", "Vocabulary", "Tone", "Structure"].map((cat) => (
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
                    {cat === "all" ? "All Types" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <p style={{ color: "var(--text-muted)" }} className="text-xs uppercase tracking-wide mb-2">
                Status
              </p>
              <div className="flex flex-wrap gap-2">
                {["all", "needs-practice", "reviewed", "mastered"].map((stat) => (
                  <button
                    key={stat}
                    onClick={() => setSelectedStatus(stat)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{
                      backgroundColor:
                        selectedStatus === stat
                          ? "#D4AF37"
                          : "rgba(212, 175, 55, 0.1)",
                      color:
                        selectedStatus === stat
                          ? "#0f1419"
                          : "var(--text-secondary)",
                      border: `1px solid ${
                        selectedStatus === stat
                          ? "#D4AF37"
                          : "rgba(212, 175, 55, 0.2)"
                      }`,
                    }}
                  >
                    {stat === "all"
                      ? "All Statuses"
                      : stat === "needs-practice"
                        ? "Needs Practice"
                        : stat === "reviewed"
                          ? "Reviewed"
                          : "Mastered"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Cards */}
        <motion.div className="space-y-3">
          {filteredErrors.length > 0 ? (
            filteredErrors.map((error, idx) => {
              const statusStyle = getStatusColor(error.status);
              return (
                <motion.div
                  key={error.id}
                  variants={itemVariants}
                  className="rounded-xl p-5 border"
                  style={{
                    backgroundColor: "#16213e",
                    borderColor: "rgba(212, 175, 55, 0.2)",
                    borderLeft: `4px solid #EF4444`,
                  }}
                >
                  {/* Error & Correction */}
                  <div className="mb-3">
                    <p className="text-red-500 font-medium mb-1">
                      ❌ {error.error}
                    </p>
                    <p className="text-green-500 font-medium mb-2">
                      ✓ {error.correction}
                    </p>
                  </div>

                  {/* Explanation */}
                  <p style={{ color: "var(--text-secondary)" }} className="text-sm mb-3">
                    {error.explanation}
                  </p>

                  {/* Source & Metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 pb-3 border-t border-t-[rgba(212,175,55,0.1)]">
                    <div className="flex flex-col gap-1">
                      <p style={{ color: "var(--text-muted)" }} className="text-xs uppercase tracking-wide">
                        {error.source}
                      </p>
                      <div className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs">{error.date}</span>
                      </div>
                    </div>
                    <div
                      className="rounded-full px-3 py-1 flex items-center gap-2 text-xs font-medium w-fit"
                      style={{
                        backgroundColor: statusStyle.bg,
                        border: `1px solid ${statusStyle.border}`,
                        color: statusStyle.text,
                      }}
                    >
                      {getStatusIcon(error.status)}
                      {getStatusLabel(error.status)}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    className="px-4 py-2 rounded-lg font-medium text-sm transition-all w-full"
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
                    Practice This
                  </button>
                </motion.div>
              );
            })
          ) : (
            <div
              className="rounded-xl p-12 border text-center"
              style={{
                backgroundColor: "#16213e",
                borderColor: "rgba(212, 175, 55, 0.2)",
              }}
            >
              <p style={{ color: "var(--text-muted)" }}>
                No errors match your filters
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </PlatformLayout>
  );
};

export default ErrorBank;
