import { motion } from "framer-motion";

interface AIAvatarProps {
  state: "idle" | "listening" | "thinking" | "speaking";
  isSpeaking: boolean;
}

const stateLabels: Record<string, string> = {
  idle: "Ready",
  listening: "Listening...",
  thinking: "Thinking...",
  speaking: "Speaking...",
};

const stateColors: Record<string, string> = {
  idle: "#B89A5A",
  listening: "#4ADE80",
  thinking: "#60A5FA",
  speaking: "#B89A5A",
};

export default function AIAvatar({ state, isSpeaking }: AIAvatarProps) {
  const color = stateColors[state];

  return (
    <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#0B1A2A] to-[#131B2E] border border-[#B89A5A]/10 flex flex-col items-center justify-center overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ background: `${color}30`, left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      {/* Avatar circle */}
      <div className="relative">
        {/* Outer glow ring */}
        <motion.div
          className="absolute -inset-4 rounded-full"
          style={{ border: `2px solid ${color}20` }}
          animate={isSpeaking ? { scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] } : { scale: 1, opacity: 0.2 }}
          transition={{ duration: 0.8, repeat: isSpeaking ? Infinity : 0 }}
        />
        <motion.div
          className="absolute -inset-2 rounded-full"
          style={{ border: `1px solid ${color}40` }}
          animate={isSpeaking ? { scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] } : { scale: 1, opacity: 0.3 }}
          transition={{ duration: 0.6, repeat: isSpeaking ? Infinity : 0, delay: 0.1 }}
        />

        {/* Main avatar */}
        <motion.div
          className="w-20 h-20 rounded-full flex items-center justify-center relative"
          style={{
            background: `linear-gradient(135deg, ${color}30, ${color}10)`,
            border: `2px solid ${color}50`,
            boxShadow: `0 0 30px ${color}20`,
          }}
          animate={state === "thinking" ? { rotate: [0, 5, -5, 0] } : { rotate: 0 }}
          transition={{ duration: 2, repeat: state === "thinking" ? Infinity : 0 }}
        >
          {/* Face */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Eyes */}
            <div className="flex gap-4 mb-2">
              <motion.div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: color }}
                animate={state === "listening" ? { scaleY: [1, 0.3, 1] } : { scaleY: 1 }}
                transition={{ duration: 2, repeat: state === "listening" ? Infinity : 0 }}
              />
              <motion.div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: color }}
                animate={state === "listening" ? { scaleY: [1, 0.3, 1] } : { scaleY: 1 }}
                transition={{ duration: 2, repeat: state === "listening" ? Infinity : 0, delay: 0.1 }}
              />
            </div>
            {/* Mouth */}
            <motion.div
              className="rounded-full"
              style={{ background: `${color}80` }}
              animate={
                isSpeaking
                  ? { width: [12, 16, 8, 14, 10, 16, 12], height: [4, 10, 6, 12, 4, 8, 4] }
                  : state === "thinking"
                  ? { width: 6, height: 6, borderRadius: "50%" }
                  : { width: 12, height: 3 }
              }
              transition={{
                duration: isSpeaking ? 0.6 : 0.3,
                repeat: isSpeaking ? Infinity : 0,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Audio waveform when speaking */}
      {isSpeaking && (
        <div className="flex gap-1 items-end mt-4 h-6">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full"
              style={{ background: color }}
              animate={{ height: [4, 12 + Math.random() * 12, 4] }}
              transition={{ duration: 0.4 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.08 }}
            />
          ))}
        </div>
      )}

      {/* State label */}
      <motion.p
        className="text-xs mt-3 font-medium"
        style={{ color }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {stateLabels[state]}
      </motion.p>

      {/* "VOICE³ AI" badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-[10px] text-[#8E96A3] font-medium">VOICE³ AI</span>
      </div>
    </div>
  );
}
