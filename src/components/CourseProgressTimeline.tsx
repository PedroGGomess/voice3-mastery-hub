import { motion } from "framer-motion";
import { CheckCircle2, Circle, Play } from "lucide-react";

interface TimelineNode {
  id: number;
  label: string;
  date: string;
  status: "done" | "progress" | "todo";
  initials: string;
}

const nodes: TimelineNode[] = [
  { id: 1, label: "Introdução", date: "Jan 27", status: "done", initials: "IN" },
  { id: 2, label: "Email Pro", date: "Fev 8", status: "done", initials: "EP" },
  { id: 3, label: "Reuniões", date: "Mar 10", status: "progress", initials: "RE" },
  { id: 4, label: "Apresentação", date: "Abr 15", status: "todo", initials: "AP" },
  { id: 5, label: "Negociação", date: "Mai 14", status: "todo", initials: "NG" },
];

const CourseProgressTimeline = () => {
  return (
    <div className="relative flex items-center justify-between px-4 py-6">
      {/* Connecting line */}
      <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-white/10" />
      {/* Progress fill */}
      <motion.div
        className="absolute left-8 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-primary to-primary/60"
        initial={{ width: 0 }}
        animate={{ width: "38%" }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      />

      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative flex flex-col items-center gap-2 z-10"
        >
          {/* Avatar circle */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
              node.status === "done"
                ? "bg-primary border-primary text-white"
                : node.status === "progress"
                ? "bg-primary/20 border-primary text-primary shadow-lg shadow-primary/30"
                : "bg-white/5 border-white/20 text-white/40"
            }`}
          >
            {node.status === "done" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : node.status === "progress" ? (
              <Play className="h-4 w-4" />
            ) : (
              <span className="text-xs">{node.initials}</span>
            )}
          </div>
          {/* Label */}
          <span className={`text-xs font-medium whitespace-nowrap ${
            node.status === "todo" ? "text-white/30" : "text-white/80"
          }`}>
            {node.label}
          </span>
          <span className="text-[10px] text-white/40">{node.date}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default CourseProgressTimeline;
