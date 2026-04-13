import { useState } from "react";
import { MicroChapterPlayer } from "@/components/learning";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const DEMO_CHAPTER = {
  title: "Requesting Information Politely",
  briefing: {
    title: "The Art of Polite Requests",
    framework: "The Politeness Hierarchy",
    content:
      "In English, the way we request information varies greatly depending on the context and relationship with the listener. There are four main levels of politeness: direct commands, polite requests, very polite requests, and conditional requests. Understanding when to use each level is crucial for professional communication and everyday interactions. This framework will help you navigate these social contexts with confidence and clarity.",
    diagramUrl: undefined,
  },
  drill: {
    instruction:
      "Rewrite the following sentences using a more polite form. Consider the context and choose the appropriate level of politeness.",
    example:
      'Rude: "Give me that report." Better: "Could you please share the report with me when you have a moment?"',
  },
  simulation: {
    scenario:
      "You are in a business meeting where you need to ask for clarification on a complex topic. Your colleague is the expert, and you want to learn without seeming unprepared.",
    character: "Professional Colleague",
  },
  errors: [
    {
      id: "1",
      error: "Can you give me that information?",
      reason:
        "While grammatically correct, this is too direct for formal business contexts. It sounds demanding.",
      correction: "Could you possibly provide that information when you have a moment?",
    },
    {
      id: "2",
      error: "Would you mind if I ask you a question?",
      reason: "Awkward construction. Should use 'Would you mind if I asked' (conditional past) or simpler form.",
      correction: "Would you mind if I asked you a question? Or simply: May I ask you a question?",
    },
    {
      id: "3",
      error: "I was wondering if you could explaining this to me.",
      reason: "Verb form error. After 'could' use the infinitive without -ing. Also, 'to explain' not 'explaining'.",
      correction: "I was wondering if you could explain this to me.",
    },
  ],
  vault: [
    {
      id: "1",
      phrase: "Could you possibly clarify that point for me?",
      context: "When you need professional, polite clarification in meetings or emails",
      effectiveness: "Shows respect while maintaining professionalism and confidence",
    },
    {
      id: "2",
      phrase: "I'd be grateful if you could share your thoughts on this matter.",
      context: "When requesting someone's expert opinion or feedback",
      effectiveness:
        "Expresses appreciation in advance, making the listener feel valued",
    },
    {
      id: "3",
      phrase: "When you have a moment, could you look at this?",
      context: "For casual but still respectful requests to colleagues",
      effectiveness:
        "Acknowledges the other person's time and schedule, reducing pressure",
    },
    {
      id: "4",
      phrase: "Would it be possible for you to elaborate on that?",
      context: "In discussions where you need more detailed information",
      effectiveness:
        "Polite yet curious tone that encourages deeper explanation",
    },
    {
      id: "5",
      phrase: "I would appreciate it if you could advise me on this.",
      context: "When seeking guidance from someone more experienced",
      effectiveness: "Formal, respectful, and clearly shows you value their expertise",
    },
  ],
};

export default function MicroChapterDemo() {
  const [completed, setCompleted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4 md:px-0 mb-8"
      >
        <Button
          variant="ghost"
          className="text-slate-400 hover:text-white mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Micro-Chapter Learning Loop Demo</h1>
          <p className="text-slate-300">
            Experience the complete 5-stage learning journey: Briefing → Drill → Simulation → Error
            Bank → Articulation Vault
          </p>
        </div>
      </motion.div>

      {/* Player */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <MicroChapterPlayer
          chapterData={DEMO_CHAPTER}
          onComplete={() => setCompleted(true)}
        />
      </motion.div>

      {/* Completion Message */}
      {completed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto px-4 md:px-0 mt-8"
        >
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6 text-center">
            <p className="text-emerald-300 font-semibold mb-4">
              Demo completed! You can refresh to start again or navigate to another chapter.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#D4AF37] hover:bg-[#E5C158] text-slate-900 font-semibold px-6 py-2 rounded-lg"
            >
              Start Over
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
