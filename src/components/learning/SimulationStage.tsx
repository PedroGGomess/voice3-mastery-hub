import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Mic, Send, CheckCircle } from "lucide-react";

interface SimulationStageProps {
  scenario: string;
  character: string;
  onComplete: () => void;
}

interface Message {
  id: string;
  role: "student" | "coach";
  content: string;
}

const COACH_RESPONSES = [
  "That's a good observation. Can you elaborate more on your reasoning?",
  "I appreciate that perspective. How would you handle this differently in a business context?",
  "Interesting approach! What do you think the implications might be?",
  "You're on the right track. Can you provide a specific example?",
  "Well said! Let's dig deeper into this point.",
  "Good thinking! How would you adjust your approach if the situation changed?",
];

export const SimulationStage = ({ scenario, character, onComplete }: SimulationStageProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "coach",
      content: `Hello! I'm your ${character}. ${scenario}. How would you like to proceed?`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [simulationEnded, setSimulationEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add student message
    const studentMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "student",
      content: inputValue,
    };
    setMessages((prev) => [...prev, studentMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate coach response delay
    setTimeout(() => {
      const coachMessage: Message = {
        id: `coach-${Date.now()}`,
        role: "coach",
        content: COACH_RESPONSES[Math.floor(Math.random() * COACH_RESPONSES.length)],
      };
      setMessages((prev) => [...prev, coachMessage]);
      setIsLoading(false);

      // Check if we should end simulation (after 4-6 exchanges)
      const exchangeCount = Math.floor((messages.length + 1) / 2);
      if (exchangeCount >= 4 && Math.random() > 0.4) {
        setTimeout(() => setSimulationEnded(true), 500);
      }
    }, 800);
  };

  const handleEndSimulation = () => {
    setSimulationEnded(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 flex flex-col h-full"
    >
      {/* Character Context */}
      {!simulationEnded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#D4AF37] font-bold text-lg">
                  {character.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">{character}</h3>
                <p className="text-slate-300 text-sm">{scenario}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Chat Area */}
      <Card className="bg-slate-800 border-slate-700 p-6 flex-1 flex flex-col min-h-96">
        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto mb-4 pr-2">
          <AnimatePresence>
            {messages.map((message, idx) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex ${message.role === "student" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-sm px-4 py-3 rounded-lg ${
                    message.role === "student"
                      ? "bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-slate-100"
                      : "bg-slate-900 border border-slate-700 text-slate-200"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2"
            >
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200" />
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        {!simulationEnded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3 border-t border-slate-700 pt-4"
          >
            <div className="flex gap-3">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your response..."
                disabled={isLoading}
                className="flex-1 bg-slate-900 text-white placeholder-slate-500 rounded-lg p-3 border border-slate-600 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 resize-none text-sm"
                rows={2}
              />
              <div className="flex flex-col gap-2">
                <Button
                  size="icon"
                  className="bg-slate-700 hover:bg-slate-600 text-white h-10 w-10 rounded-lg"
                  disabled
                  title="Voice input coming soon"
                >
                  <Mic className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-[#D4AF37] hover:bg-[#E5C158] text-slate-900 h-10 w-10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {messages.length > 2 && !isLoading && (
              <Button
                onClick={handleEndSimulation}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                End Simulation
              </Button>
            )}
          </motion.div>
        )}
      </Card>

      {/* Post-Simulation Feedback */}
      <AnimatePresence>
        {simulationEnded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card className="bg-emerald-500/10 border-emerald-500/30 p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-emerald-400 mb-3">Simulation Complete</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-300">Exchanges</span>
                      <span className="text-emerald-400 font-semibold">
                        {Math.floor(messages.length / 2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-300">Communication Quality</span>
                      <span className="text-emerald-400 font-semibold">Good</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-300">Errors Captured</span>
                      <span className="text-emerald-400 font-semibold">3</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={onComplete}
                className="bg-[#D4AF37] hover:bg-[#E5C158] text-slate-900 font-semibold px-8 py-6 rounded-lg flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/40"
              >
                Continue to Error Bank
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
