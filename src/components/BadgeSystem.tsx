import { Shield, Target, Zap, BarChart2 } from "lucide-react";

export type BadgeType = "Clarity Master" | "Objection Crusher" | "Zero-Wobble" | "ARRC Architect";

const badgeConfig: Record<BadgeType, { icon: React.ElementType; description: string }> = {
  "Clarity Master": {
    icon: Target,
    description: "Precision in every statement",
  },
  "Objection Crusher": {
    icon: Shield,
    description: "Handles pushback with authority",
  },
  "Zero-Wobble": {
    icon: Zap,
    description: "Unwavering under pressure",
  },
  "ARRC Architect": {
    icon: BarChart2,
    description: "Master of structured argumentation",
  },
};

interface BadgeProps {
  type: BadgeType;
  earned?: boolean;
  size?: "sm" | "md";
}

export const Badge = ({ type, earned = true, size = "sm" }: BadgeProps) => {
  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <div
      title={config.description}
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all ${
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
      } ${
        earned
          ? "border-[#B89A5A]/40 bg-[#B89A5A]/10 text-[#B89A5A]"
          : "border-white/10 bg-white/5 text-[#8E96A3] opacity-50"
      }`}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      <span className="font-medium tracking-wide">{type}</span>
    </div>
  );
};

interface BadgeSystemProps {
  badges: BadgeType[];
  allBadges?: boolean;
  size?: "sm" | "md";
}

const BadgeSystem = ({ badges, allBadges = false, size = "sm" }: BadgeSystemProps) => {
  const allTypes = Object.keys(badgeConfig) as BadgeType[];
  const items = allBadges ? allTypes : badges;

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((type) => (
        <Badge
          key={type}
          type={type}
          earned={badges.includes(type)}
          size={size}
        />
      ))}
    </div>
  );
};

export default BadgeSystem;
