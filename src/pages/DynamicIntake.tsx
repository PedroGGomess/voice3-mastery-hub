import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IntakeAnswers {
  // Layer 1 - Essentials
  jobTitle: string;
  industry: string;
  primaryGoal: string[];
  englishConfidence: string;
  // Layer 2 - Context
  speakingFrequency: string;
  challengingSituations: string[];
  upcomingEvent: string;
  upcomingEventDate: string;
  dailyTime: string;
  // Layer 3 - Deep Dive
  biggestFear: string[];
  challengingAudience: string;
  perfectPhrase: string;
}

type Layer = "essentials" | "context" | "deepDive";

const INDUSTRIES = ["Finance", "Healthcare", "Insurance", "Pharmaceuticals", "Real Estate", "Tech", "Retail", "Other"];
const PRIMARY_GOALS = ["Lead meetings confidently", "Present to boards/investors", "Negotiate effectively", "Improve daily communication", "Prepare for a specific event", "Build executive presence"];
const CONFIDENCE_LEVELS = ["I struggle", "I manage", "I'm comfortable", "I'm confident", "I'm fluent"];
const SPEAKING_FREQUENCIES = ["Daily", "Several times a week", "Weekly", "Monthly", "Rarely"];
const CHALLENGING_SITUATIONS = ["Presentations", "Negotiations", "Small talk", "Conference calls", "Emails", "Interviews", "Crisis situations"];
const DAILY_TIME_OPTIONS = ["10min", "15min", "20min", "30+min"];
const BIGGEST_FEARS = ["Making grammar mistakes", "Not finding the right word", "Sounding unprofessional", "Being misunderstood", "Losing credibility", "Freezing under pressure"];
const CHALLENGING_AUDIENCES = ["Board of Directors", "Investors", "Clients", "My team", "Media/Press", "Regulators", "International partners"];

const DynamicIntake = () => {
  const navigate = useNavigate();
  const [currentLayer, setCurrentLayer] = useState<Layer>("essentials");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<IntakeAnswers>({
    jobTitle: "",
    industry: "",
    primaryGoal: [],
    englishConfidence: "",
    speakingFrequency: "",
    challengingSituations: [],
    upcomingEvent: "",
    upcomingEventDate: "",
    dailyTime: "",
    biggestFear: [],
    challengingAudience: "",
    perfectPhrase: "",
  });
  const [hasUpcomingEvent, setHasUpcomingEvent] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("intakeAnswers", JSON.stringify(answers));
  }, [answers]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("intakeAnswers");
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved answers", e);
      }
    }
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentQuestionIndex, currentLayer]);

  const getQuestions = (layer: Layer) => {
    switch (layer) {
      case "essentials":
        return [
          { id: "q1", text: "What is your current job title?" },
          { id: "q2", text: "Which industry do you work in?" },
          { id: "q3", text: "What is your primary goal with VOICE3?" },
          { id: "q4", text: "How would you rate your current English confidence in professional settings?" },
        ];
      case "context":
        return [
          { id: "q5", text: "How often do you speak English at work?" },
          { id: "q6", text: "Which situations challenge you the most?" },
          { id: "q7", text: "Do you have a specific event coming up?" },
          { id: "q8", text: "How much time can you dedicate daily?" },
        ];
      case "deepDive":
        return [
          { id: "q9", text: "What's your biggest fear when speaking English professionally?" },
          { id: "q10", text: "Who is your most challenging audience?" },
          { id: "q11", text: "One thing you'd like to say perfectly in English? (optional)" },
        ];
    }
  };

  const questions = getQuestions(currentLayer);
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handlePillSelect = (value: string, field: keyof IntakeAnswers) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMultiSelect = (value: string, field: keyof IntakeAnswers) => {
    setAnswers(prev => {
      const current = prev[field] as string[];
      const isSelected = current.includes(value);
      return {
        ...prev,
        [field]: isSelected ? current.filter(v => v !== value) : [...current, value],
      };
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      if (currentLayer === "essentials") {
        setCurrentLayer("context");
        setCurrentQuestionIndex(0);
      } else if (currentLayer === "context") {
        setCurrentLayer("deepDive");
        setCurrentQuestionIndex(0);
      } else {
        // Completion - navigate to app
        completeIntake();
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentLayer === "context") {
      setCurrentLayer("essentials");
      setCurrentQuestionIndex(3);
    } else if (currentLayer === "deepDive") {
      setCurrentLayer("context");
      setCurrentQuestionIndex(3);
    }
  };

  const handleSkip = () => {
    if (currentLayer === "deepDive") {
      completeIntake();
    }
  };

  const completeIntake = () => {
    localStorage.setItem("intakeCompleted", "true");
    localStorage.setItem("intakeAnswers", JSON.stringify(answers));

    // Determine recommended program based on answers
    let recommendedProgram = "GROW";
    if (answers.englishConfidence === "I'm confident" || answers.englishConfidence === "I'm fluent") {
      recommendedProgram = "ELEVATE";
    } else if (answers.upcomingEvent) {
      recommendedProgram = "PREPARE";
    } else if (answers.primaryGoal.includes("Build executive presence")) {
      recommendedProgram = "EXECUTIVE";
    }

    localStorage.setItem("recommendedProgram", recommendedProgram);
    navigate("/app");
  };

  const renderQuestion = () => {
    const q = currentQuestion.id;

    switch (q) {
      case "q1":
        return (
          <div className="w-full space-y-4">
            <input
              type="text"
              value={answers.jobTitle}
              onChange={e => handlePillSelect(e.target.value, "jobTitle")}
              placeholder="e.g., Senior Manager, Product Lead, CFO..."
              className="w-full px-4 py-3 rounded-lg bg-[#1C2332] text-[#F4F2ED] placeholder-[#6B7280] border border-[#2a3f5f] focus:outline-none focus:border-[#B89A5A]"
            />
          </div>
        );

      case "q2":
        return (
          <div className="w-full grid grid-cols-2 gap-2">
            {INDUSTRIES.map(industry => (
              <button
                key={industry}
                onClick={() => handlePillSelect(industry, "industry")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  answers.industry === industry
                    ? "bg-[#B89A5A] text-[#0B1A2A]"
                    : "bg-[#1C2332] text-[#F4F2ED] border border-[#2a3f5f] hover:border-[#B89A5A]"
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        );

      case "q3":
        return (
          <div className="w-full space-y-2">
            {PRIMARY_GOALS.map(goal => (
              <button
                key={goal}
                onClick={() => handleMultiSelect(goal, "primaryGoal")}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium text-left transition-all ${
                  answers.primaryGoal.includes(goal)
                    ? "bg-[#B89A5A] text-[#0B1A2A]"
                    : "bg-[#1C2332] text-[#F4F2ED] border border-[#2a3f5f] hover:border-[#B89A5A]"
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        );

      case "q4":
        return (
          <div className="w-full flex gap-2 flex-wrap">
            {CONFIDENCE_LEVELS.map(level => (
              <button
                key={level}
                onClick={() => handlePillSelect(level, "englishConfidence")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  answers.englishConfidence === level
                    ? "bg-[#B89A5A] text-[#0B1A2A]"
                    : "bg-[#1C2332] text-[#F4F2ED] border border-[#2a3f5f] hover:border-[#B89A5A]"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        );

      case "q5":
        return (
          <div className="w-full grid grid-cols-2 gap-2">
            {SPEAKING_FREQUENCIES.map(freq => (
              <button
                key={freq}
                onClick={() => handlePillSelect(freq, "speakingFrequency")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  answers.speakingFrequency === freq
                    ? "bg-[#B89A5A] text-[#0B1A2A]"
                    : "bg-[#1C2332] text-[#F4F2ED] border border-[#2a3f5f] hover:border-[#B89A5A]"
                }`}
              >
                {freq}
              </button>
            ))}
          </div>
        );

      case "q6":
        return (
          <div className="w-full space-y-2">
            {CHALLENGING_SITUATIONS.map(situation => (
              <button
                key={situation}
                onClick={() => handleMultiSelect(situation, "challengingSituations")}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium text-left transition-all ${
                  answers.challengingSituations.includes(situation)
                    ? "bg-[#B89A5A] text-[#0B1A2A]"
                    : "bg-[#1C2332] text-[#F4F2ED] border border-[#2a3f5f] hover:border-[#B89A5A]"
                }`}
              >
                {situation}
              </button>
            ))}
          </div>
        );

      case "q7":
        return (
          <div className="w-full space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setHasUpcomingEvent(false)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !hasUpcomingEvent
                    ? "bg-[#B89A5A] text-[#0B1A2A]"
                    : "bg-[#1C2332] text-[#F4F2ED] border border-[#2a3f5f] hover:border-[#B89A5A]"
                }`}
              >
                No
              </button>
              <button
                onClick={() => setHasUpcomingEvent(true)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  hasUpcomingEvent
                    ? "bg-[#B89A5A] text-[#0B1A2A]"
                    : "bg-[#1C2332] text-[#F4F2ED] border border-[#2a3f5f] hover:border-[#B89A5A]"
                }`}
              >
                Yes
              </button>
            </div>
            {hasUpcomingEvent && (
              <div className="space-y-3 animate-in fade-in">
                <input
                  type="text"
                  value={answers.upcomingEvent}
                  onChange={e => handlePillSelect(e.target.value, "upcomingEvent")}
                  placeholder="What's the event?"
                  className="w-full px-4 py-3 rounded-lg bg-[#1C2332] text-[#F4F2ED] placeholder-[#6B7280] border border-[#2a3f5f] focus:outline-none focus:border-[#B89A5A]"
                />
                <input
                  type="date"
                  value={answers.upcomingEventDate}
                  onChange={e => handlePillSelect(e.target.value, "upcomingEventDate")}
                  className="w-full px-4 py-3 rounded-lg bg-[#1C2332] text-[#F4F2ED] border border-[#2a3f5f] focus:outline-none focus:border-[#B89A5A]"
                />
              </div>
            )}
          </div>
        );

      case "q8":
        return (
          <div className="w-full grid grid-cols-2 gap-2">
            {DAILY_TIME_OPTIONS.map(time => (
              <button
                key={time}
                onClick={() => handlePillSelect(time, "dailyTime")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  answers.dailyTime === time
                    ? "bg-[#B89A5A] text-[#0B1A2A]"
                    : "bg-[#1C2332] text-[#F4F2ED] border border-[#2a3f5f] hover:border-[#B89A5A]"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        );

      case "q9":
        return (
          <div className="w-full space-y-2">
            {BIGGEST_FEARS.map(fear => (
              <button
                key={fear}
                onClick={() => handleMultiSelect(fear, "biggestFear")}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium text-left transition-all ${
                  answers.biggestFear.includes(fear)
                    ? "bg-[#B89A5A] text-[#0B1A2A]"
                    : "bg-[#1C2332] text-[#F4F2ED] border border-[#2a3f5f] hover:border-[#B89A5A]"
                }`}
              >
                {fear}
              </button>
            ))}
          </div>
        );

      case "q10":
        return (
          <div className="w-full grid grid-cols-2 gap-2">
            {CHALLENGING_AUDIENCES.map(audience => (
              <button
                key={audience}
                onClick={() => handlePillSelect(audience, "challengingAudience")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all line-clamp-2 ${
                  answers.challengingAudience === audience
                    ? "bg-[#B89A5A] text-[#0B1A2A]"
                    : "bg-[#1C2332] text-[#F4F2ED] border border-[#2a3f5f] hover:border-[#B89A5A]"
                }`}
              >
                {audience}
              </button>
            ))}
          </div>
        );

      case "q11":
        return (
          <div className="w-full space-y-4">
            <textarea
              value={answers.perfectPhrase}
              onChange={e => handlePillSelect(e.target.value, "perfectPhrase")}
              placeholder="e.g., 'Defend a recommendation in a board meeting' or 'Negotiate a salary increase'..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-[#1C2332] text-[#F4F2ED] placeholder-[#6B7280] border border-[#2a3f5f] focus:outline-none focus:border-[#B89A5A] resize-none"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getProgressPercentage = () => {
    const layerProgress = { essentials: 0, context: 33, deepDive: 66 };
    const layerBase = layerProgress[currentLayer];
    const layerQuestionProgress = (currentQuestionIndex / totalQuestions) * 33;
    return Math.round(layerBase + layerQuestionProgress);
  };

  const getLayerLabel = () => {
    if (currentLayer === "essentials") return "Essentials";
    if (currentLayer === "context") return "Context";
    return "Deep Dive";
  };

  const getTransitionMessage = () => {
    if (currentLayer === "essentials" && currentQuestionIndex === 3) {
      return "Great start! Let's learn a bit more about your needs.";
    }
    if (currentLayer === "context" && currentQuestionIndex === 3) {
      return "Almost there! Just a few more to personalise your experience.";
    }
    return null;
  };

  const canProceed = () => {
    switch (currentQuestion.id) {
      case "q1":
        return answers.jobTitle.trim().length > 0;
      case "q2":
        return answers.industry.length > 0;
      case "q3":
        return answers.primaryGoal.length > 0;
      case "q4":
        return answers.englishConfidence.length > 0;
      case "q5":
        return answers.speakingFrequency.length > 0;
      case "q6":
        return answers.challengingSituations.length > 0;
      case "q7":
        return hasUpcomingEvent ? answers.upcomingEvent.trim().length > 0 && answers.upcomingEventDate.length > 0 : true;
      case "q8":
        return answers.dailyTime.length > 0;
      case "q9":
        return answers.biggestFear.length > 0;
      case "q10":
        return answers.challengingAudience.length > 0;
      case "q11":
        return true; // Optional
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#0B1A2A", color: "#F4F2ED" }}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 border-b border-[#2a3f5f]">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex gap-2 mb-3">
            {["Essentials", "Context", "Deep Dive"].map((label, i) => (
              <div key={label} className="flex items-center">
                <span className="text-xs font-semibold text-[#8E96A3]">{label}</span>
                {i < 2 && <span className="mx-2 text-[#8E96A3]">→</span>}
              </div>
            ))}
          </div>
          <div className="h-1 bg-[#1C2332] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#B89A5A" }}
              initial={{ width: "0%" }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="pt-32 pb-32 px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Platform Messages */}
          <AnimatePresence mode="wait">
            <motion.div key={`${currentLayer}-${currentQuestionIndex}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex justify-start">
                <div className="max-w-xs px-4 py-3 rounded-2xl" style={{ background: "#1C2332" }}>
                  <p className="text-sm">{currentQuestion.text}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* User Response Area */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex justify-end mb-6">
              <div className="max-w-xs" />
            </div>
            <div className="flex justify-center">{renderQuestion()}</div>
          </motion.div>

          {/* Transition Messages */}
          {getTransitionMessage() && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="max-w-xs px-4 py-3 rounded-2xl" style={{ background: "#1C2332", borderLeft: "3px solid #B89A5A" }}>
                <p className="text-sm italic">{getTransitionMessage()}</p>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Bottom Controls - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#2a3f5f]" style={{ background: "#0B1A2A" }}>
        <div className="max-w-2xl mx-auto px-6 py-4 flex gap-3 justify-between">
          <button
            onClick={handleBack}
            disabled={currentLayer === "essentials" && currentQuestionIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1C2332] transition-colors"
          >
            <ChevronLeft size={16} /> Back
          </button>

          {currentLayer === "deepDive" && isLastQuestion && (
            <button
              onClick={handleSkip}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#8E96A3] hover:text-[#F4F2ED] transition-colors"
            >
              <SkipForward size={16} /> Skip
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            style={{
              background: canProceed() ? "#B89A5A" : "#6B7280",
              color: canProceed() ? "#0B1A2A" : "#F4F2ED",
            }}
          >
            {isLastQuestion && currentLayer === "deepDive" ? "Let's Begin!" : "Next"} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicIntake;
