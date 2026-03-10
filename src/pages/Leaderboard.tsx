import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState<'thisWeek' | 'allTime'>('thisWeek');
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

        {/* This Week / All Time tab toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="flex gap-1 bg-[#1C1F26] border border-white/5 rounded-lg p-1 w-fit"
        >
          {(['thisWeek', 'allTime'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[#B89A5A]/20 text-[#B89A5A] border border-[#B89A5A]/30'
                  : 'text-[#8E96A3] hover:text-[#F4F2ED]'
              }`}
            >
              {tab === 'thisWeek' ? 'This Week' : 'All Time'}
            </button>
          ))}
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

        {/* Podium — top 3 */}
        {entries.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1C1F26] border border-white/5 rounded-xl p-6"
          >
            <p className="text-[#8E96A3] text-xs tracking-[0.2em] uppercase font-medium mb-6 text-center">Top Performers</p>
            <div className="flex items-end justify-center gap-4">
              {/* 2nd place */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#9CA3AF]/20 border-2 border-[#9CA3AF]/60 flex items-center justify-center">
                  <span className="text-base font-bold text-[#9CA3AF]">{entries[1].initials}</span>
                </div>
                <div className="w-16 h-14 bg-[#9CA3AF]/10 border border-[#9CA3AF]/20 rounded-t-lg flex flex-col items-center justify-center gap-0.5">
                  <span className="text-[#9CA3AF] font-bold text-lg">#2</span>
                </div>
                <p className="text-xs text-[#F4F2ED]/80 font-medium text-center">{entries[1].name.split(' ')[0]}</p>
                <p className="text-[10px] text-[#8E96A3]">{entries[1].authorityScore} pts</p>
              </div>
              {/* 1st place — taller */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-[#B89A5A]/20 border-2 border-[#B89A5A] flex items-center justify-center">
                    <span className="text-lg font-bold text-[#B89A5A]">{entries[0].initials}</span>
                  </div>
                  <span className="absolute -top-2 -right-1 text-base">👑</span>
                </div>
                <div className="w-16 h-20 bg-[#B89A5A]/10 border border-[#B89A5A]/30 rounded-t-lg flex items-center justify-center">
                  <span className="text-[#B89A5A] font-bold text-xl">#1</span>
                </div>
                <p className="text-xs text-[#F4F2ED] font-semibold text-center">{entries[0].name.split(' ')[0]}</p>
                <p className="text-[10px] text-[#B89A5A] font-semibold">{entries[0].authorityScore} pts</p>
              </div>
              {/* 3rd place */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-amber-700/20 border-2 border-amber-600/60 flex items-center justify-center">
                  <span className="text-base font-bold text-amber-600">{entries[2].initials}</span>
                </div>
                <div className="w-16 h-10 bg-amber-700/10 border border-amber-600/20 rounded-t-lg flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-lg">#3</span>
                </div>
                <p className="text-xs text-[#F4F2ED]/80 font-medium text-center">{entries[2].name.split(' ')[0]}</p>
                <p className="text-[10px] text-[#8E96A3]">{entries[2].authorityScore} pts</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top 10 list */}
        <div>
          <h2 className="text-[#8E96A3] text-xs tracking-[0.2em] uppercase font-medium mb-4">
            Top 10 — {activeTab === 'thisWeek' ? 'This Week' : 'All Time'}
          </h2>
          <div className="space-y-2">
            {entries.map((entry, i) => (
              <LeaderboardCard key={entry.position} entry={entry} index={i} />
            ))}
          </div>
        </div>

        {/* Your Ranking — pinned bottom card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#0F2235] border border-[#B89A5A]/30 rounded-xl p-5 shadow-[0_0_30px_rgba(184,154,90,0.08)]"
        >
          <p className="text-[#B89A5A] text-xs tracking-[0.15em] uppercase font-medium mb-4 flex items-center gap-2">
            <Trophy className="h-3.5 w-3.5" /> Your Ranking
          </p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#B89A5A]/15 border border-[#B89A5A]/30 flex items-center justify-center shrink-0">
                <span className="text-[#B89A5A] font-bold text-lg">#{myPosition}</span>
              </div>
              <div>
                <p className="text-[#F4F2ED] font-semibold text-sm">{currentUser?.name || 'You'}</p>
                <p className="text-[#8E96A3] text-xs">{myPoints.toLocaleString()} pts</p>
              </div>
            </div>
            {(() => {
              const nextRanker = leaderboardData.find(e => e.rank === myPosition - 1);
              const pointsBehind = nextRanker ? nextRanker.points - myPoints : 0;
              return pointsBehind > 0 ? (
                <div className="text-right">
                  <p className="text-[#B89A5A] font-semibold text-sm">{pointsBehind} pts</p>
                  <p className="text-[#8E96A3] text-xs">behind next rank</p>
                </div>
              ) : (
                <p className="text-sm text-[#B89A5A] font-semibold">🏆 Top position!</p>
              );
            })()}
          </div>
        </motion.div>

        {/* Weekly Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <h2 className="text-[#8E96A3] text-xs tracking-[0.2em] uppercase font-medium mb-4 flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-[#B89A5A]" /> Weekly Challenges
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { emoji: '📚', title: 'Complete 2 sessions this week', reward: '+50 pts', progress: 0, total: 2 },
              { emoji: '🎯', title: 'Score 100% on a vocabulary quiz', reward: '+30 pts', progress: 0, total: 1 },
              { emoji: '🔧', title: 'Use a toolkit tool 3 times', reward: '+20 pts', progress: 0, total: 3 },
            ].map((challenge, i) => (
              <div key={i} className="bg-[#1C1F26] border border-white/5 hover:border-[#B89A5A]/20 hover:shadow-[0_0_20px_rgba(184,154,90,0.08)] rounded-xl p-4 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{challenge.emoji}</span>
                  <span className="text-xs font-bold text-[#B89A5A] bg-[#B89A5A]/10 border border-[#B89A5A]/20 px-2 py-0.5 rounded-full">{challenge.reward}</span>
                </div>
                <p className="text-xs font-medium text-[#F4F2ED] mb-3 leading-relaxed">{challenge.title}</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-[#8E96A3]">
                    <span>{challenge.progress}/{challenge.total}</span>
                    <span>{Math.round((challenge.progress / challenge.total) * 100)}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#B89A5A] to-[#d4ba6a] rounded-full"
                      style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PlatformLayout>
  );
};

export default Leaderboard;
