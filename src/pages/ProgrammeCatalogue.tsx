import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout,
  MessageSquare,
  Brain,
  Zap,
  Target,
  Building2,
  Lock,
  ChevronDown,
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlatformLayout from "@/components/PlatformLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface MicroChapter {
  id: string;
  title: string;
  description: string;
  locked: boolean;
}

interface Module {
  id: string;
  title: string;
  microChapters: MicroChapter[];
}

interface CoreProgramme {
  id: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  modules: Module[];
  enrollmentStatus: "not_started" | "in_progress" | "completed";
  progress: number;
  duration: string;
}

interface IndustryTrack {
  id: string;
  name: string;
  icon: LucideIcon;
  modules: Module[];
}

const corePrograms: CoreProgramme[] = [
  {
    id: "grow",
    name: "GROW",
    tagline: "Build your executive voice from the ground up",
    icon: Sprout,
    enrollmentStatus: "in_progress",
    progress: 35,
    duration: "~4 weeks at 15 min/day",
    modules: [
      {
        id: "grow-m1",
        title: "Foundations of Executive Presence",
        microChapters: [
          {
            id: "grow-m1-c1",
            title: "The Executive Voice Framework",
            description: "Understand the 5 pillars of executive presence",
            locked: false,
          },
          {
            id: "grow-m1-c2",
            title: "Building Vocal Authority",
            description: "Master pace, pitch, and projection techniques",
            locked: false,
          },
          {
            id: "grow-m1-c3",
            title: "Authenticity & Confidence",
            description: "Develop genuine presence that resonates with audiences",
            locked: false,
          },
        ],
      },
      {
        id: "grow-m2",
        title: "Confident Decision Communication",
        microChapters: [
          {
            id: "grow-m2-c1",
            title: "Making a Strong Statement",
            description: "Deliver decisions with clarity and conviction",
            locked: true,
          },
          {
            id: "grow-m2-c2",
            title: "Managing Pushback",
            description: "Navigate objections while maintaining authority",
            locked: true,
          },
          {
            id: "grow-m2-c3",
            title: "Building Strategic Narrative",
            description: "Frame decisions within compelling context",
            locked: true,
          },
        ],
      },
      {
        id: "grow-m3",
        title: "Owning the Room",
        microChapters: [
          {
            id: "grow-m3-c1",
            title: "Command & Presence",
            description: "Physical and vocal techniques for room presence",
            locked: true,
          },
          {
            id: "grow-m3-c2",
            title: "Reading the Room",
            description: "Adapt your delivery to audience energy",
            locked: true,
          },
          {
            id: "grow-m3-c3",
            title: "Leading Through Uncertainty",
            description: "Inspire confidence when outcomes are unclear",
            locked: true,
          },
        ],
      },
    ],
  },
  {
    id: "communicate",
    name: "COMMUNICATE",
    tagline: "Master every professional conversation",
    icon: MessageSquare,
    enrollmentStatus: "in_progress",
    progress: 0,
    duration: "~4 weeks at 15 min/day",
    modules: [
      {
        id: "comm-m1",
        title: "Precision in Professional Dialogue",
        microChapters: [
          {
            id: "comm-m1-c1",
            title: "Active Listening Mastery",
            description: "Techniques to fully comprehend and engage",
            locked: false,
          },
          {
            id: "comm-m1-c2",
            title: "Strategic Questioning",
            description: "Ask questions that uncover true needs and concerns",
            locked: false,
          },
          {
            id: "comm-m1-c3",
            title: "Clarifying & Confirming",
            description: "Ensure alignment through precise communication",
            locked: false,
          },
        ],
      },
      {
        id: "comm-m2",
        title: "Navigating Difficult Conversations",
        microChapters: [
          {
            id: "comm-m2-c1",
            title: "The Difficult Conversation Framework",
            description: "Structure for handling sensitive topics",
            locked: true,
          },
          {
            id: "comm-m2-c2",
            title: "Managing Emotions",
            description: "Stay composed while addressing conflict",
            locked: true,
          },
          {
            id: "comm-m2-c3",
            title: "Finding Resolution",
            description: "Move difficult conversations toward solutions",
            locked: true,
          },
        ],
      },
      {
        id: "comm-m3",
        title: "Inspirational Communication",
        microChapters: [
          {
            id: "comm-m3-c1",
            title: "Crafting Your Message",
            description: "Build compelling narratives that inspire",
            locked: true,
          },
          {
            id: "comm-m3-c2",
            title: "Storytelling for Impact",
            description: "Use stories to create emotional connections",
            locked: true,
          },
          {
            id: "comm-m3-c3",
            title: "Motivating Through Communication",
            description: "Drive action through your words and presence",
            locked: true,
          },
        ],
      },
    ],
  },
  {
    id: "understand",
    name: "UNDERSTAND",
    tagline: "Decode complex information and respond with authority",
    icon: Brain,
    enrollmentStatus: "not_started",
    progress: 0,
    duration: "~4 weeks at 15 min/day",
    modules: [
      {
        id: "und-m1",
        title: "Active Comprehension Strategies",
        microChapters: [
          {
            id: "und-m1-c1",
            title: "Multi-Perspective Analysis",
            description: "Extract meaning from complex presentations",
            locked: false,
          },
          {
            id: "und-m1-c2",
            title: "Technical Language Fluency",
            description: "Master domain-specific terminology",
            locked: false,
          },
          {
            id: "und-m1-c3",
            title: "Rapid Information Processing",
            description: "Understand and synthesize information quickly",
            locked: false,
          },
        ],
      },
      {
        id: "und-m2",
        title: "Critical Analysis & Synthesis",
        microChapters: [
          {
            id: "und-m2-c1",
            title: "Identifying Key Insights",
            description: "Distinguish signal from noise in data",
            locked: false,
          },
          {
            id: "und-m2-c2",
            title: "Building Mental Models",
            description: "Create frameworks for understanding complex topics",
            locked: false,
          },
          {
            id: "und-m2-c3",
            title: "Connecting the Dots",
            description: "Find patterns and relationships in information",
            locked: false,
          },
        ],
      },
      {
        id: "und-m3",
        title: "Strategic Response Formulation",
        microChapters: [
          {
            id: "und-m3-c1",
            title: "Articulating Understanding",
            description: "Communicate what you've learned clearly",
            locked: false,
          },
          {
            id: "und-m3-c2",
            title: "Asking Insightful Follow-ups",
            description: "Demonstrate comprehension through smart questions",
            locked: false,
          },
          {
            id: "und-m3-c3",
            title: "Decision-Making Based on Understanding",
            description: "Move from insight to informed action",
            locked: false,
          },
        ],
      },
    ],
  },
  {
    id: "stay-sharp",
    name: "STAY SHARP",
    tagline: "Keep your English skills at peak performance",
    icon: Zap,
    enrollmentStatus: "not_started",
    progress: 0,
    duration: "~4 weeks at 15 min/day",
    modules: [
      {
        id: "sharp-m1",
        title: "Daily Executive Warm-ups",
        microChapters: [
          {
            id: "sharp-m1-c1",
            title: "Voice & Articulation Drills",
            description: "Daily exercises for vocal clarity",
            locked: false,
          },
          {
            id: "sharp-m1-c2",
            title: "Pronunciation Precision",
            description: "Master challenging word pronunciations",
            locked: false,
          },
          {
            id: "sharp-m1-c3",
            title: "Stress & Rhythm Practice",
            description: "Develop natural English speech patterns",
            locked: false,
          },
        ],
      },
      {
        id: "sharp-m2",
        title: "Advanced Vocabulary Expansion",
        microChapters: [
          {
            id: "sharp-m2-c1",
            title: "Executive Phrases & Idioms",
            description: "Sophisticated expressions for business contexts",
            locked: false,
          },
          {
            id: "sharp-m2-c2",
            title: "Industry-Specific Vocabulary",
            description: "Domain language for your sector",
            locked: false,
          },
          {
            id: "sharp-m2-c3",
            title: "Nuance & Precision",
            description: "Choose exactly the right word every time",
            locked: false,
          },
        ],
      },
      {
        id: "sharp-m3",
        title: "Situational Fluency Challenges",
        microChapters: [
          {
            id: "sharp-m3-c1",
            title: "Real-World Scenarios",
            description: "Practice in authentic business situations",
            locked: false,
          },
          {
            id: "sharp-m3-c2",
            title: "Spontaneous Speaking",
            description: "Develop fluency without preparation",
            locked: false,
          },
          {
            id: "sharp-m3-c3",
            title: "Maintaining Performance Under Pressure",
            description: "Speak clearly in high-stakes moments",
            locked: false,
          },
        ],
      },
    ],
  },
  {
    id: "prepare",
    name: "PREPARE",
    tagline: "Get ready for high-stakes moments",
    icon: Target,
    enrollmentStatus: "not_started",
    progress: 0,
    duration: "~4 weeks at 15 min/day",
    modules: [
      {
        id: "prep-m1",
        title: "Presentation Mastery",
        microChapters: [
          {
            id: "prep-m1-c1",
            title: "Structuring Your Presentation",
            description: "Build compelling narratives with impact",
            locked: false,
          },
          {
            id: "prep-m1-c2",
            title: "Delivery Techniques",
            description: "Engage audiences with vocal variety and presence",
            locked: false,
          },
          {
            id: "prep-m1-c3",
            title: "Handling Q&A with Confidence",
            description: "Respond authentically to unexpected questions",
            locked: false,
          },
        ],
      },
      {
        id: "prep-m2",
        title: "Interview & Panel Preparation",
        microChapters: [
          {
            id: "prep-m2-c1",
            title: "Interview Strategy",
            description: "Prepare for success in one-on-one settings",
            locked: false,
          },
          {
            id: "prep-m2-c2",
            title: "Panel Dynamics",
            description: "Stand out effectively in multi-interviewer scenarios",
            locked: false,
          },
          {
            id: "prep-m2-c3",
            title: "Storytelling Your Value",
            description: "Tell compelling stories about your achievements",
            locked: false,
          },
        ],
      },
      {
        id: "prep-m3",
        title: "Crisis Communication Readiness",
        microChapters: [
          {
            id: "prep-m3-c1",
            title: "Crisis Mindset",
            description: "Prepare psychologically for unexpected challenges",
            locked: false,
          },
          {
            id: "prep-m3-c2",
            title: "Message Development Under Pressure",
            description: "Craft clear messages in difficult moments",
            locked: false,
          },
          {
            id: "prep-m3-c3",
            title: "Recovery & Resilience",
            description: "Bounce back from missteps with grace",
            locked: false,
          },
        ],
      },
    ],
  },
];

const industryTracks: IndustryTrack[] = [
  {
    id: "finance",
    name: "Finance",
    icon: Building2,
    modules: [
      {
        id: "fin-m1",
        title: "Financial Market Essentials",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `fin-m1-c${i + 1}`,
          title: `Finance Micro-Chapter ${i + 1}`,
          description: "Essential finance vocabulary and concepts",
          locked: i > 0,
        })),
      },
      {
        id: "fin-m2",
        title: "Investment Communication",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `fin-m2-c${i + 1}`,
          title: `Investment Micro-Chapter ${i + 1}`,
          description: "Communicating investment strategies effectively",
          locked: i > 0,
        })),
      },
      {
        id: "fin-m3",
        title: "Regulatory & Compliance Language",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `fin-m3-c${i + 1}`,
          title: `Compliance Micro-Chapter ${i + 1}`,
          description: "Navigate regulatory communication requirements",
          locked: i > 0,
        })),
      },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: Building2,
    modules: [
      {
        id: "hc-m1",
        title: "Medical Terminology & Communication",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `hc-m1-c${i + 1}`,
          title: `Healthcare Micro-Chapter ${i + 1}`,
          description: "Master medical terminology and clear communication",
          locked: i > 0,
        })),
      },
      {
        id: "hc-m2",
        title: "Patient & Stakeholder Engagement",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `hc-m2-c${i + 1}`,
          title: `Engagement Micro-Chapter ${i + 1}`,
          description: "Communicate with empathy and clarity",
          locked: i > 0,
        })),
      },
      {
        id: "hc-m3",
        title: "Clinical Leadership Communication",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `hc-m3-c${i + 1}`,
          title: `Leadership Micro-Chapter ${i + 1}`,
          description: "Lead teams with clinical credibility",
          locked: i > 0,
        })),
      },
    ],
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: Building2,
    modules: [
      {
        id: "ins-m1",
        title: "Insurance Fundamentals",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `ins-m1-c${i + 1}`,
          title: `Insurance Micro-Chapter ${i + 1}`,
          description: "Core insurance concepts and terminology",
          locked: i > 0,
        })),
      },
      {
        id: "ins-m2",
        title: "Risk Communication",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `ins-m2-c${i + 1}`,
          title: `Risk Micro-Chapter ${i + 1}`,
          description: "Articulate risk clearly and confidently",
          locked: i > 0,
        })),
      },
      {
        id: "ins-m3",
        title: "Client Relations & Claims",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `ins-m3-c${i + 1}`,
          title: `Claims Micro-Chapter ${i + 1}`,
          description: "Navigate complex claims conversations",
          locked: i > 0,
        })),
      },
    ],
  },
  {
    id: "pharmaceuticals",
    name: "Pharmaceuticals",
    icon: Building2,
    modules: [
      {
        id: "pharma-m1",
        title: "Pharmaceutical Industry Language",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `pharma-m1-c${i + 1}`,
          title: `Pharma Micro-Chapter ${i + 1}`,
          description: "Specialized pharmaceutical terminology",
          locked: i > 0,
        })),
      },
      {
        id: "pharma-m2",
        title: "Regulatory & Clinical Communication",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `pharma-m2-c${i + 1}`,
          title: `Regulatory Micro-Chapter ${i + 1}`,
          description: "Communicate within regulatory frameworks",
          locked: i > 0,
        })),
      },
      {
        id: "pharma-m3",
        title: "Sales & Medical Affairs",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `pharma-m3-c${i + 1}`,
          title: `Sales Micro-Chapter ${i + 1}`,
          description: "Effective sales and medical communications",
          locked: i > 0,
        })),
      },
    ],
  },
  {
    id: "realestate",
    name: "Real Estate",
    icon: Building2,
    modules: [
      {
        id: "re-m1",
        title: "Real Estate Market Dynamics",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `re-m1-c${i + 1}`,
          title: `Real Estate Micro-Chapter ${i + 1}`,
          description: "Market terminology and trends",
          locked: i > 0,
        })),
      },
      {
        id: "re-m2",
        title: "Client Negotiations",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `re-m2-c${i + 1}`,
          title: `Negotiation Micro-Chapter ${i + 1}`,
          description: "Master negotiation conversations",
          locked: i > 0,
        })),
      },
      {
        id: "re-m3",
        title: "Property & Investment Presentations",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `re-m3-c${i + 1}`,
          title: `Presentation Micro-Chapter ${i + 1}`,
          description: "Present properties and investments effectively",
          locked: i > 0,
        })),
      },
    ],
  },
  {
    id: "tech",
    name: "Tech",
    icon: Building2,
    modules: [
      {
        id: "tech-m1",
        title: "Tech Terminology & Culture",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `tech-m1-c${i + 1}`,
          title: `Tech Micro-Chapter ${i + 1}`,
          description: "Speak the language of technology",
          locked: i > 0,
        })),
      },
      {
        id: "tech-m2",
        title: "Product & Innovation Communication",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `tech-m2-c${i + 1}`,
          title: `Product Micro-Chapter ${i + 1}`,
          description: "Communicate product vision and features",
          locked: i > 0,
        })),
      },
      {
        id: "tech-m3",
        title: "Investor & Stakeholder Pitches",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `tech-m3-c${i + 1}`,
          title: `Pitch Micro-Chapter ${i + 1}`,
          description: "Pitch effectively to tech audiences",
          locked: i > 0,
        })),
      },
    ],
  },
  {
    id: "retail",
    name: "Retail",
    icon: Building2,
    modules: [
      {
        id: "retail-m1",
        title: "Retail Industry Essentials",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `retail-m1-c${i + 1}`,
          title: `Retail Micro-Chapter ${i + 1}`,
          description: "Core retail terminology and concepts",
          locked: i > 0,
        })),
      },
      {
        id: "retail-m2",
        title: "Customer & Team Communication",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `retail-m2-c${i + 1}`,
          title: `Communication Micro-Chapter ${i + 1}`,
          description: "Engage customers and lead teams",
          locked: i > 0,
        })),
      },
      {
        id: "retail-m3",
        title: "Store & Regional Leadership",
        microChapters: Array.from({ length: 3 }, (_, i) => ({
          id: `retail-m3-c${i + 1}`,
          title: `Leadership Micro-Chapter ${i + 1}`,
          description: "Lead across multiple locations effectively",
          locked: i > 0,
        })),
      },
    ],
  },
];

const ProgressDots = ({ completed, total }: { completed: number; total: number }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: i < completed ? "var(--gold)" : "rgba(201, 168, 76, 0.2)",
          }}
        />
      ))}
    </div>
  );
};

interface ExpandableCardProps {
  programme: CoreProgramme;
  isExpanded: boolean;
  onToggle: () => void;
  onStart: () => void;
}

const ProgrammeCard = ({
  programme,
  isExpanded,
  onToggle,
  onStart,
}: ExpandableCardProps) => {
  const Icon = programme.icon;
  const moduleCount = programme.modules.length;
  const microChapterCount = programme.modules.reduce(
    (sum, m) => sum + m.microChapters.length,
    0
  );

  const isStarted = programme.enrollmentStatus === "in_progress";
  const progressPercent = programme.progress;

  return (
    <motion.div
      layout
      className="rounded-xl border transition-all duration-300"
      style={{
        backgroundColor: "#16213e",
        borderColor: progressPercent > 0 ? "rgba(201, 168, 76, 0.3)" : "rgba(201, 168, 76, 0.15)",
      }}
    >
      <motion.div
        onClick={onToggle}
        className="p-6 cursor-pointer"
        whileHover={{ scale: 1.01 }}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "rgba(201, 168, 76, 0.1)" }}
          >
            <Icon className="w-7 h-7" style={{ color: "var(--gold)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-bold mb-1 tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {programme.name}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {programme.tagline}
            </p>
          </div>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
            <ChevronDown
              className="w-5 h-5 shrink-0"
              style={{ color: "var(--gold)" }}
            />
          </motion.div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <span style={{ color: "var(--text-muted)" }}>
            {moduleCount} Modules · {microChapterCount} Micro-Chapters
          </span>
          <span style={{ color: "var(--text-muted)" }}>
            <Clock className="w-4 h-4 inline mr-1" />
            {programme.duration}
          </span>
        </div>

        {/* Progress bar */}
        {isStarted && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Progress
              </span>
              <span className="text-xs font-semibold" style={{ color: "var(--gold)" }}>
                {progressPercent}%
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: "rgba(201, 168, 76, 0.1)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: "var(--gold)" }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        )}

        {/* Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onStart();
          }}
          className="w-full rounded-lg font-semibold text-sm h-9"
          style={{
            backgroundColor: "var(--gold)",
            color: "#16213e",
          }}
        >
          {isStarted ? "Continue Programme" : "Start Programme"}
        </Button>
      </motion.div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t"
            style={{ borderColor: "rgba(201, 168, 76, 0.1)" }}
          >
            <div className="p-6 space-y-4">
              {programme.modules.map((module) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <BookOpen
                      className="w-4 h-4 shrink-0 mt-1"
                      style={{ color: "var(--gold)" }}
                    />
                    <div className="flex-1">
                      <h4
                        className="font-semibold text-sm mb-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {module.title}
                      </h4>
                      <div className="space-y-2 ml-2">
                        {module.microChapters.map((chapter, idx) => (
                          <motion.div
                            key={chapter.id}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-start gap-3 p-2 rounded"
                            style={{ backgroundColor: "rgba(201, 168, 76, 0.05)" }}
                          >
                            <div className="mt-1">
                              {chapter.locked ? (
                                <Lock
                                  className="w-3.5 h-3.5"
                                  style={{ color: "var(--text-muted)" }}
                                />
                              ) : (
                                <CheckCircle2
                                  className="w-3.5 h-3.5"
                                  style={{ color: "var(--gold)" }}
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-xs font-medium"
                                style={{
                                  color: chapter.locked
                                    ? "var(--text-muted)"
                                    : "var(--text-primary)",
                                }}
                              >
                                {chapter.title}
                              </p>
                              <p
                                className="text-xs mt-0.5"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {chapter.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface IndustrySelectState {
  active: boolean;
  selectedIndustry: string | null;
}

const ProgrammeCatalogue = () => {
  const [expandedId, setExpandedId] = useState<string | null>("grow");
  const [industrySelect, setIndustrySelect] = useState<IndustrySelectState>({
    active: false,
    selectedIndustry: null,
  });
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleStartProgramme = (programmeId: string) => {
    // Would navigate to programme detail or start flow
    console.log("Starting programme:", programmeId);
  };

  return (
    <PlatformLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <p
          className="text-xs tracking-widest font-semibold mb-2 uppercase"
          style={{ color: "var(--gold)" }}
        >
          VOICE³ Platform
        </p>
        <h1
          className="text-3xl font-bold tracking-tight mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Programme Catalogue
        </h1>
        <p
          className="text-base"
          style={{ color: "var(--text-muted)" }}
        >
          Choose your path to executive English mastery
        </p>
      </motion.div>

      {/* Core Programmes Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-16"
      >
        <h2
          className="text-xl font-bold mb-6 tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Core Programmes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {corePrograms.map((programme, i) => (
            <motion.div
              key={programme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <ProgrammeCard
                programme={programme}
                isExpanded={expandedId === programme.id}
                onToggle={() =>
                  setExpandedId(expandedId === programme.id ? null : programme.id)
                }
                onStart={() => handleStartProgramme(programme.id)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* MY MARKET Programme Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Building2
            className="w-6 h-6"
            style={{ color: "var(--gold)" }}
          />
          <h2
            className="text-xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            MY MARKET
          </h2>
        </div>
        <p
          className="text-sm mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          Speak the language of your industry
        </p>

        {!industrySelect.active ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {industryTracks.map((industry, i) => (
              <motion.button
                key={industry.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                onClick={() =>
                  setIndustrySelect({ active: true, selectedIndustry: industry.id })
                }
                className="p-6 rounded-xl border transition-all duration-200 text-left group hover:border-opacity-100"
                style={{
                  backgroundColor: "#16213e",
                  borderColor: "rgba(201, 168, 76, 0.2)",
                }}
                whileHover={{
                  borderColor: "rgba(201, 168, 76, 0.5)",
                  scale: 1.02,
                }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: "rgba(201, 168, 76, 0.1)" }}
                >
                  <Building2
                    className="w-5 h-5"
                    style={{ color: "var(--gold)" }}
                  />
                </div>
                <h3
                  className="font-semibold text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {industry.name}
                </h3>
                <p
                  className="text-xs mt-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  3 Modules · 9 Micro-Chapters
                </p>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() =>
                setIndustrySelect({ active: false, selectedIndustry: null })
              }
              className="mb-6 flex items-center gap-2 text-sm transition-colors"
              style={{ color: "var(--gold)" }}
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
              Back to Industries
            </button>

            {industrySelect.selectedIndustry && (
              <div className="space-y-6">
                {industryTracks
                  .find(i => i.id === industrySelect.selectedIndustry)
                  ?.modules.map((module, i) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 rounded-xl border"
                      style={{
                        backgroundColor: "#16213e",
                        borderColor: "rgba(201, 168, 76, 0.2)",
                      }}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <BookOpen
                          className="w-5 h-5 shrink-0"
                          style={{ color: "var(--gold)" }}
                        />
                        <div className="flex-1">
                          <h4
                            className="font-semibold text-base"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {module.title}
                          </h4>
                        </div>
                      </div>

                      <div className="space-y-2 ml-8">
                        {module.microChapters.map((chapter) => (
                          <div
                            key={chapter.id}
                            className="flex items-start gap-3 p-3 rounded-lg"
                            style={{ backgroundColor: "rgba(201, 168, 76, 0.05)" }}
                          >
                            <div className="mt-0.5">
                              <Circle
                                className="w-3 h-3"
                                style={{ color: "var(--gold)" }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-sm font-medium"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {chapter.title}
                              </p>
                              <p
                                className="text-xs mt-1"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {chapter.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                <Button
                  onClick={() =>
                    handleStartProgramme(
                      `my-market-${industrySelect.selectedIndustry}`
                    )
                  }
                  className="w-full rounded-lg font-semibold h-10"
                  style={{
                    backgroundColor: "var(--gold)",
                    color: "#16213e",
                  }}
                >
                  Start MY MARKET - {industryTracks.find(i => i.id === industrySelect.selectedIndustry)?.name}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </PlatformLayout>
  );
};

export default ProgrammeCatalogue;
