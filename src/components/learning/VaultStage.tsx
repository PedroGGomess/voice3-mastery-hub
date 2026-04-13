import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Star, Gift } from "lucide-react";

interface Phrase {
  id: string;
  phrase: string;
  context: string;
  effectiveness: string;
}

interface VaultStageProps {
  phrases?: Phrase[];
  onComplete: () => void;
}

const DEFAULT_PHRASES: Phrase[] = [
  {
    id: "1",
    phrase: "To elaborate on that point...",
    context: "Used when providing more details after an initial statement",
    effectiveness: "Creates smooth transitions and shows sophisticated communication",
  },
  {
    id: "2",
    phrase: "I appreciate your perspective, however...",
    context: "Used to acknowledge someone's viewpoint before offering a different opinion",
    effectiveness: "Shows respect while maintaining your position, ideal for debates",
  },
  {
    id: "3",
    phrase: "This brings us to an important consideration...",
    context: "Used to introduce a critical point in discussion",
    effectiveness: "Draws attention and emphasizes key concepts without being abrupt",
  },
  {
    id: "4",
    phrase: "Building on that foundation...",
    context: "Used to connect a new idea to previously discussed concepts",
    effectiveness: "Shows logical thinking and helps maintain coherence in longer responses",
  },
  {
    id: "5",
    phrase: "The underlying principle here is...",
    context: "Used to explain the core concept behind something",
    effectiveness: "Demonstrates analytical thinking and deep understanding",
  },
];

export const VaultStage = ({ phrases = DEFAULT_PHRASES, onComplete }: VaultStageProps) => {
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(true);

  useEffect(() => {
    // Hide celebration after animation
    const timer = setTimeout(() => setShowCelebration(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleFavourite = (id: string) => {
    const newSet = new Set(favourites);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setFavourites(newSet);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            {/* Confetti-like elements */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: 0,
                  scale: 0,
                  x: (Math.random() - 0.5) * 200,
                  y: Math.random() * 200,
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                }}
                className="absolute"
              >
                <Gift
                  className="w-8 h-8 text-[#D4AF37]"
                  style={{
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-center"
            >
              <Gift className="w-16 h-16 text-[#D4AF37] mx-auto mb-4 animate-bounce" />
              <h2 className="text-3xl font-bold text-[#D4AF37] mb-2">Great Work!</h2>
              <p className="text-slate-300 text-lg">Phrases added to your vault</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-slate-800 to-slate-800/50 border-[#D4AF37]/30 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Phrases Added to Your Articulation Vault
          </h2>
          <p className="text-slate-300 text-sm">
            These are high-impact phrases you can use in future English conversations
          </p>
        </Card>
      </motion.div>

      {/* Phrase Cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {phrases.map((phrase, idx) => (
            <motion.div
              key={phrase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: idx * 0.08 + 0.3 }}
            >
              <Card className="bg-slate-800 border-slate-700 p-6 hover:border-[#D4AF37]/40 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  {/* Phrase Content */}
                  <div className="flex-1">
                    <p className="text-[#D4AF37] font-bold text-lg mb-2 italic">
                      "{phrase.phrase}"
                    </p>

                    <div className="mb-3">
                      <p className="text-xs text-slate-400 font-semibold mb-1">CONTEXT</p>
                      <p className="text-slate-300 text-sm">{phrase.context}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 font-semibold mb-1">WHY IT'S EFFECTIVE</p>
                      <p className="text-slate-300 text-sm">{phrase.effectiveness}</p>
                    </div>
                  </div>

                  {/* Favourite Button */}
                  <motion.button
                    onClick={() => toggleFavourite(phrase.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0"
                  >
                    <Star
                      className={`w-6 h-6 transition-all duration-300 ${
                        favourites.has(phrase.id)
                          ? "fill-[#D4AF37] text-[#D4AF37] drop-shadow-lg drop-shadow-[#D4AF37]/50"
                          : "text-slate-600 hover:text-[#D4AF37]"
                      }`}
                    />
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Favourite Count */}
      {favourites.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-4"
        >
          <p className="text-[#D4AF37] text-sm">
            <span className="font-bold">{favourites.size}</span> phrase{favourites.size !== 1 ? "s" : ""} added to
            your favourites
          </p>
        </motion.div>
      )}

      {/* Completion Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: phrases.length * 0.08 + 0.4 }}
        className="flex justify-end pt-4"
      >
        <Button
          onClick={onComplete}
          className="bg-[#D4AF37] hover:bg-[#E5C158] text-slate-900 font-semibold px-8 py-6 rounded-lg flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/40"
        >
          Complete Micro-Chapter
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};
