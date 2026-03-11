import { useState, useEffect, useCallback } from "react";

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const studentTourSteps: TourStep[] = [
  {
    target: '[data-tour="dashboard"]',
    position: "right",
    title: "Welcome to VOICE³! 🎉",
    description: "This is your Executive Hub. Everything you need to perform in English at the highest level.",
  },
  {
    target: '[data-tour="programme"]',
    position: "right",
    title: "Your Programme",
    description: "10 structured chapters, from diagnostic to mastery. Each session takes 30–45 minutes.",
  },
  {
    target: '[data-tour="toolkit"]',
    position: "right",
    title: "AI Toolkit",
    description: "Rescue Mode, Grammar Tool, Q&A Gauntlet — powerful tools available 24/7 between sessions.",
  },
  {
    target: '[data-tour="ai-coach"]',
    position: "right",
    title: "Your AI Coach",
    description: "Chat with your personal AI coach anytime. It knows your weak areas and learning history.",
  },
  {
    target: '[data-tour="progress"]',
    position: "right",
    title: "Track Your Progress",
    description: "See your scores, streaks, and improvement over time. Data-driven executive growth.",
  },
  {
    target: '[data-tour="live"]',
    position: "right",
    title: "Live Sessions with Professor",
    description: "Book your live professor sessions here. Real human feedback on your real weak areas.",
  },
];

export const useTour = () => {
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem("tour_completed");
    if (!completed) {
      const timer = setTimeout(() => setActive(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const next = useCallback(() => {
    if (step < studentTourSteps.length - 1) {
      setStep((s) => s + 1);
    } else {
      setActive(false);
      localStorage.setItem("tour_completed", "true");
    }
  }, [step]);

  const skip = useCallback(() => {
    setActive(false);
    localStorage.setItem("tour_completed", "true");
  }, []);

  return { active, step, steps: studentTourSteps, next, skip };
};
