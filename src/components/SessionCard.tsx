import { motion } from "framer-motion";
import { ExternalLink, Flame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SessionCardProps {
  title: string;
  subtitle: string;
  time: string;
  status: "done" | "progress" | "todo";
  highlighted?: boolean;
  index: number;
}

const SessionCard = ({ title, subtitle, time, status, highlighted, index }: SessionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 ${
        highlighted
          ? "bg-gradient-to-b from-primary/80 to-primary/60 border border-primary/50 shadow-lg shadow-primary/20"
          : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
      }`}
    >
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
        highlighted ? "bg-white/20 text-white" : "bg-primary/20 text-primary"
      }`}>
        {title.charAt(0)}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className={`text-sm font-semibold leading-tight ${highlighted ? "text-white" : "text-white/90"}`}>
          {title}
        </h3>
        <p className={`text-xs mt-1 ${highlighted ? "text-white/70" : "text-white/50"}`}>
          {subtitle}
        </p>
      </div>

      {/* Highlighted extras */}
      {highlighted && (
        <div className="flex items-center gap-1.5 text-xs text-white/80">
          <Flame className="h-3.5 w-3.5 text-orange-300" />
          <span>Em progresso</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/10">
        <span className={`text-xs ${highlighted ? "text-white/60" : "text-white/40"}`}>{time}</span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className={`h-7 text-xs rounded-lg px-3 ${
              highlighted
                ? "bg-white text-primary hover:bg-white/90"
                : status === "done"
                ? "bg-white/10 text-white/70 hover:bg-white/20"
                : "bg-primary/20 text-primary hover:bg-primary/30"
            }`}
          >
            {status === "done" ? "Rever" : status === "progress" ? "Continuar" : "Iniciar"}
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
          <ExternalLink className={`h-3.5 w-3.5 ${highlighted ? "text-white/60" : "text-white/30"}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default SessionCard;
