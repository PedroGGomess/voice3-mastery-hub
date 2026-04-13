import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Zap, HelpCircle, Heart, Send } from "lucide-react";
import { useShadowCoach } from "@/contexts/ShadowCoachContext";

const QUICK_ACTIONS = [
  {
    id: "drill",
    label: "Quick Drill",
    icon: Zap,
    response: "Let's do a quick vocabulary challenge! Rephrase this: 'I think maybe we should consider...' using more confident, executive language.",
  },
  {
    id: "phrase",
    label: "Practice a Phrase",
    icon: MessageSquare,
    response: "Pick a phrase from your Articulation Vault and use it in a sentence. I'll give you feedback!",
  },
  {
    id: "explain",
    label: "Explain This",
    icon: HelpCircle,
    response: "What concept or topic would you like me to explain? I can help with grammar, vocabulary, or communication strategies.",
  },
  {
    id: "motivate",
    label: "Motivate Me",
    icon: Heart,
    response: "",
  },
];

const MOTIVATION_MESSAGES = [
  "You're making great progress! Your clarity score has improved 15% this month.",
  "Remember: every executive was once where you are. Keep going!",
  "Your consistency is impressive. That's the #1 predictor of success.",
  "Every conversation is a chance to get better. You've got this!",
  "The fact that you're investing in yourself shows real commitment. That matters.",
];

const ShadowCoachFloat = () => {
  const { isOpen, setIsOpen, messages, addMessage, hasUnreadSuggestion, setHasUnreadSuggestion } = useShadowCoach();
  const [userInput, setUserInput] = useState("");
  const [localMessages, setLocalMessages] = useState(messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  // Initialize with welcome message
  useEffect(() => {
    if (localMessages.length === 0 && isOpen) {
      const welcomeMessage = {
        id: "welcome",
        role: "coach" as const,
        content: "Hi! I'm your Shadow Coach. How can I help you today?",
        timestamp: Date.now(),
      };
      setLocalMessages([welcomeMessage]);
      addMessage(welcomeMessage);
    }
  }, [isOpen]);

  const handleQuickAction = (actionId: string) => {
    const action = QUICK_ACTIONS.find(a => a.id === actionId);
    if (!action) return;

    let response = action.response;
    if (actionId === "motivate") {
      response = MOTIVATION_MESSAGES[Math.floor(Math.random() * MOTIVATION_MESSAGES.length)];
    }

    const coachMessage = {
      id: `coach-${Date.now()}`,
      role: "coach" as const,
      content: response,
      timestamp: Date.now(),
    };

    setLocalMessages(prev => [...prev, coachMessage]);
    addMessage(coachMessage);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: userInput,
      timestamp: Date.now(),
    };

    setLocalMessages(prev => [...prev, userMessage]);
    addMessage(userMessage);
    setUserInput("");

    // Simulate coach response
    setTimeout(() => {
      const coachMessage = {
        id: `coach-${Date.now()}`,
        role: "coach" as const,
        content: "Great question! I'm here to help. Keep pushing forward — you're doing better than you think.",
        timestamp: Date.now(),
      };
      setLocalMessages(prev => [...prev, coachMessage]);
      addMessage(coachMessage);
    }, 800);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setHasUnreadSuggestion(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={handleOpen}
        disabled={isOpen}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full transition-shadow hover:shadow-lg disabled:opacity-75"
        style={{ background: "#B89A5A" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquare size={24} style={{ color: "#0B1A2A" }} />

        {/* Notification Dot */}
        {hasUnreadSuggestion && (
          <motion.div
            className="absolute top-0 right-0 w-3 h-3 rounded-full"
            style={{ background: "#B89A5A" }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Expanded Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
            style={{ width: "384px", height: "500px", background: "#0B1A2A", border: "1px solid #2a3f5f" }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a3f5f]">
              <h3 className="text-sm font-bold text-[#F4F2ED]">Shadow Coach</h3>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-[#1C2332] rounded-lg transition-colors"
              >
                <X size={18} style={{ color: "#8E96A3" }} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {localMessages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                      msg.role === "user"
                        ? "bg-[#B89A5A] text-[#0B1A2A] rounded-br-none"
                        : "bg-[#1C2332] text-[#F4F2ED] rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions - Only show if no messages or on fresh conversation */}
            {localMessages.length <= 1 && (
              <div className="px-4 py-3 border-t border-[#2a3f5f] space-y-2">
                <p className="text-xs text-[#8E96A3] mb-2">Quick actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_ACTIONS.map(action => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleQuickAction(action.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1C2332] text-[#F4F2ED] hover:bg-[#2a3f5f] transition-colors text-xs font-medium"
                      >
                        <Icon size={14} style={{ color: "#B89A5A" }} />
                        <span className="line-clamp-1">{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="px-4 py-3 border-t border-[#2a3f5f] flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyPress={e => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 rounded-lg bg-[#1C2332] text-[#F4F2ED] placeholder-[#6B7280] border border-[#2a3f5f] focus:outline-none focus:border-[#B89A5A] text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim()}
                className="p-2 rounded-lg bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#A88A4A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShadowCoachFloat;
