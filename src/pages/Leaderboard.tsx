import { motion } from "framer-motion";
import { Trophy, RotateCcw } from "lucide-react";
import PlatformLayout from "@/components/PlatformLayout";
import LeaderboardCard, { type LeaderboardEntry } from "@/components/LeaderboardCard";
import { useAuth } from "@/contexts/AuthContext";

const pointCategories = [
  { label: "Drill Accuracy", description: "Precision in structured drills", max: 300 },
  { label: "Flash Scenario Completion", description: "Scenarios completed at speed", max: 250 },
  { label: "Structural Integrity Score", description: "ARRC framework application", max: 200 },
  { label: "Speed of Response", description: "Time-to-answer performance", max: 150 },
  { label: "Power Word Usage", description: "Executive vocabulary deployment", max: 100 },
];

const mockLeaderboard: LeaderboardEntry[] = [
  {
    position: 1,
    name: "Ricardo Almeida",
    initials: "RA",
    authorityScore: 847,
    weeklyChange: 12,
    badges: ["Clarity Master", "ARRC Architect"],
  },
  {
    position: 2,
    name: "Catarina Ferreira",
    initials: "CF",
    authorityScore: 791,
    weeklyChange: 5,
    badges: ["Zero-Wobble"],
  },
  {
    position: 3,
    name: "Miguel Santos",
    initials: "MS",
    authorityScore: 734,
    weeklyChange: -3,
    badges: ["Objection Crusher"],
  },
  {
    position: 4,
    name: "Ana Rodrigues",
    initials: "AR",
    authorityScore: 712,
    weeklyChange: 8,
    badges: [],
  },
  {
    position: 5,
    name: "João Pereira",
    initials: "JP",
    authorityScore: 688,
    weeklyChange: 0,
    badges: ["Clarity Master"],
  },
  {
    position: 6,
    name: "Mariana Costa",
    initials: "MC",
    authorityScore: 651,
    weeklyChange: -1,
    badges: [],
  },
  {
    position: 7,
    name: "Tiago Oliveira",
    initials: "TO",
    authorityScore: 634,
    weeklyChange: 14,
    badges: [],
  },
  {
    position: 8,
    name: "Sofia Mendes",
    initials: "SM",
    authorityScore: 619,
    weeklyChange: 3,
    badges: ["Zero-Wobble"],
  },
  {
    position: 9,
    name: "Bruno Lopes",
    initials: "BL",
    authorityScore: 597,
    weeklyChange: -2,
    badges: [],
  },
  {
    position: 10,
    name: "Inês Carvalho",
    initials: "IC",
    authorityScore: 571,
    weeklyChange: 7,
    badges: [],
  },
];

// Next Monday reset date
function getNextMonday() {
  const now = new Date();
  const day = now.getDay();
  const daysUntilMonday = (8 - day) % 7 || 7;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilMonday);
  next.setHours(0, 0, 0, 0);
  return next.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

const Leaderboard = () => {
  const { currentUser } = useAuth();

  const entries: LeaderboardEntry[] = mockLeaderboard.map((entry) => ({
    ...entry,
    isCurrentUser: entry.name === (currentUser?.name || ""),
  }));

  const currentUserEntry = entries.find((e) => e.isCurrentUser) ?? {
    ...entries[entries.length - 1],
    isCurrentUser: true,
    name: currentUser?.name || "You",
    initials: (currentUser?.name || "U")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  };

  return (
    <PlatformLayout>
      <div className="space-y-8 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-1">
            <Trophy className="h-5 w-5 text-[#B89A5A]" />
            <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-xs font-medium">
              Weekly Ranking
            </p>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-[#F4F2ED]">
            Authority Leaderboard
          </h1>
          <p className="text-[#8E96A3] text-sm mt-1">
            Top performers ranked by Authority Score this week.
          </p>
        </motion.div>

        {/* Reset indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 text-xs text-[#8E96A3] bg-[#1C1F26] border border-white/5 rounded-lg px-4 py-2.5 w-fit"
        >
          <RotateCcw className="h-3.5 w-3.5 text-[#B89A5A]" />
          <span>Resets on <span className="text-[#F4F2ED]/80">{getNextMonday()}</span></span>
        </motion.div>

        {/* Points breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#1C1F26] border border-white/5 rounded-xl p-5"
        >
          <h2 className="text-[#F4F2ED] font-semibold text-sm mb-4 tracking-wide">
            Points System
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {pointCategories.map((cat) => (
              <div key={cat.label} className="bg-[#0B1A2A] rounded-lg p-3 border border-white/5">
                <p className="text-[#B89A5A] font-bold text-base mb-1">{cat.max}pts</p>
                <p className="text-[#F4F2ED]/80 text-xs font-medium leading-tight mb-1">{cat.label}</p>
                <p className="text-[#8E96A3] text-[11px] leading-tight">{cat.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Your position summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#243A5A]/20 border border-[#B89A5A]/20 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <p className="text-[#B89A5A] text-xs tracking-[0.15em] uppercase font-medium mb-1">Your Position</p>
            <p className="text-[#F4F2ED] font-serif text-2xl font-bold">#{currentUserEntry.position}</p>
          </div>
          <div className="text-center">
            <p className="text-[#8E96A3] text-xs mb-1">Authority Score</p>
            <p className="text-[#B89A5A] font-serif font-bold text-2xl">{currentUserEntry.authorityScore.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-[#8E96A3] text-xs mb-1">Weekly Change</p>
            <p className={`font-bold text-lg ${currentUserEntry.weeklyChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {currentUserEntry.weeklyChange >= 0 ? "+" : ""}{currentUserEntry.weeklyChange}%
            </p>
          </div>
        </motion.div>

        {/* Top 10 list */}
        <div>
          <h2 className="text-[#8E96A3] text-xs tracking-[0.2em] uppercase font-medium mb-4">
            Top 10 — This Week
          </h2>
          <div className="space-y-2">
            {entries.map((entry, i) => (
              <LeaderboardCard key={entry.position} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
};

export default Leaderboard;
