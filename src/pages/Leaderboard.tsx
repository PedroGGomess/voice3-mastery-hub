import { motion } from "framer-motion";
import { Trophy, RotateCcw, Zap } from "lucide-react";
import PlatformLayout from "@/components/PlatformLayout";
import LeaderboardCard, { type LeaderboardEntry } from "@/components/LeaderboardCard";
import { useAuth } from "@/contexts/AuthContext";
import { getLeaderboard, getUserPoints } from "@/lib/persistence";

const pointCategories = [
  { label: "Drill Accuracy", description: "Precision in structured drills", max: 300 },
  { label: "Flash Scenario Completion", description: "Scenarios completed at speed", max: 250 },
  { label: "Structural Integrity Score", description: "ARRC framework application", max: 200 },
  { label: "Speed of Response", description: "Time-to-answer performance", max: 150 },
  { label: "Power Word Usage", description: "Executive vocabulary deployment", max: 100 },
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
  const leaderboardData = getLeaderboard();
  const { total: myPoints, breakdown } = currentUser ? getUserPoints(currentUser.id) : { total: 0, breakdown: [] };

  // Build point totals by source
  const sessionPts = breakdown.filter(e => e.source === "session").reduce((s, e) => s + e.points, 0);
  const practicePts = breakdown.filter(e => e.source === "practice").reduce((s, e) => s + e.points, 0);
  const toolkitPts = breakdown.filter(e => e.source === "toolkit").reduce((s, e) => s + e.points, 0);

  // Convert leaderboard data to LeaderboardEntry format
  const entries: LeaderboardEntry[] = leaderboardData.slice(0, 10).map((item) => ({
    position: item.rank,
    name: item.name,
    initials: item.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
    authorityScore: item.points,
    weeklyChange: 0,
    badges: [],
    isCurrentUser: item.userId === currentUser?.id,
  }));

  // Find current user position
  const myRank = leaderboardData.find(e => e.userId === currentUser?.id);
  const myPosition = myRank?.rank ?? leaderboardData.length + 1;

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
          className="bg-[#243A5A]/20 border border-[#B89A5A]/20 rounded-xl p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-[#B89A5A] text-xs tracking-[0.15em] uppercase font-medium mb-1">Your Position</p>
              <p className="text-[#F4F2ED] font-serif text-2xl font-bold">#{myPosition}</p>
            </div>
            <div className="text-center">
              <p className="text-[#8E96A3] text-xs mb-1">Total Points</p>
              <p className="text-[#B89A5A] font-serif font-bold text-2xl">{myPoints.toLocaleString()}</p>
            </div>
          </div>
          {/* Points breakdown */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5">
            {[
              { label: "Sessions", pts: sessionPts, icon: <Zap className="h-3.5 w-3.5" /> },
              { label: "Practice", pts: practicePts, icon: <Trophy className="h-3.5 w-3.5" /> },
              { label: "Toolkit", pts: toolkitPts, icon: <RotateCcw className="h-3.5 w-3.5" /> },
            ].map(({ label, pts, icon }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center gap-1 text-[#8E96A3] mb-1">
                  {icon}
                  <span className="text-xs">{label}</span>
                </div>
                <p className="text-sm font-semibold text-[#F4F2ED]">{pts}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top 10 list */}
        <div>
          <h2 className="text-[#8E96A3] text-xs tracking-[0.2em] uppercase font-medium mb-4">
            Top 10 — All Time
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
