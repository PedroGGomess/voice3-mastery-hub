import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import BadgeSystem, { type BadgeType } from "./BadgeSystem";

export interface LeaderboardEntry {
  position: number;
  name: string;
  initials: string;
  authorityScore: number;
  /** Weekly change as a percentage value (e.g. 12 means +12%) */
  weeklyChange: number;
  badges: BadgeType[];
  isCurrentUser?: boolean;
}

const positionColor = (position: number) => {
  if (position === 1) return "text-[#B89A5A]";
  if (position === 2) return "text-[#8E96A3]";
  if (position === 3) return "text-[#9a7f42]";
  return "text-[#8E96A3]/60";
};

const positionBorder = (position: number) => {
  if (position === 1) return "border-[#B89A5A]/40";
  if (position === 2) return "border-[#8E96A3]/30";
  if (position === 3) return "border-[#9a7f42]/30";
  return "border-white/5";
};

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  index: number;
}

const LeaderboardCard = ({ entry, index }: LeaderboardCardProps) => {
  const isFirst = entry.position === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
        entry.isCurrentUser
          ? "bg-[#243A5A]/30 border-[#B89A5A]/30"
          : "bg-[#1C1F26] border-white/5 hover:border-white/10"
      } ${isFirst ? "shadow-[0_0_20px_rgba(184,154,90,0.1)]" : ""}`}
    >
      {/* Gold pulse for #1 */}
      {isFirst && (
        <div className="absolute inset-0 rounded-xl bg-[#B89A5A]/5 animate-pulse pointer-events-none" />
      )}

      {/* Position number */}
      <div className={`w-8 shrink-0 text-center font-serif text-lg font-bold ${positionColor(entry.position)}`}>
        {entry.position}
      </div>

      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-semibold text-sm border-2 ${positionBorder(entry.position)} ${
          isFirst ? "bg-[#B89A5A]/15 text-[#B89A5A]" : "bg-[#0B1A2A] text-[#8E96A3]"
        }`}
      >
        {entry.initials}
      </div>

      {/* Name & badges */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-medium text-sm truncate ${entry.isCurrentUser ? "text-[#F4F2ED]" : "text-[#F4F2ED]/80"}`}>
            {entry.name}
            {entry.isCurrentUser && (
              <span className="ml-2 text-[10px] text-[#B89A5A] tracking-wider uppercase font-semibold">You</span>
            )}
          </span>
        </div>
        {entry.badges.length > 0 && (
          <BadgeSystem badges={entry.badges} size="sm" />
        )}
      </div>

      {/* Score & change */}
      <div className="text-right shrink-0">
        <p className={`font-serif font-bold text-base ${isFirst ? "text-[#B89A5A]" : "text-[#F4F2ED]/80"}`}>
          {entry.authorityScore.toLocaleString()}
        </p>
        <div className={`flex items-center justify-end gap-0.5 text-xs mt-0.5 ${
          entry.weeklyChange > 0
            ? "text-emerald-400"
            : entry.weeklyChange < 0
            ? "text-red-400"
            : "text-[#8E96A3]"
        }`}>
          {entry.weeklyChange > 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : entry.weeklyChange < 0 ? (
            <TrendingDown className="h-3 w-3" />
          ) : (
            <Minus className="h-3 w-3" />
          )}
          <span>
            {entry.weeklyChange > 0 ? "+" : ""}
            {entry.weeklyChange !== 0 ? `${Math.abs(entry.weeklyChange)}%` : "—"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default LeaderboardCard;
