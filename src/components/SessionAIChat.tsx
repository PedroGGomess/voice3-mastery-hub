import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface ChatMessage {
  role: "ai" | "user";
  text: string;
}

interface SessionAIChatProps {
  sessionTitle: string;
  scenario: string;
  onComplete: (score: number) => void;
}

const TONE_COLORS: Record<string, string> = {
  "Diplomat": "#6EA8C8",
  "Anchor": "#B89A5A",
  "American Direct": "#E07B54",
  "Collaborator": "#6BAF8B",
};

const MAX_EXCHANGES = 4;

function generateFeedback(userText: string, exchangeIndex: number): string {
  const text = userText.trim();
  if (!text) {
    return "Please write a response so I can give you feedback. Take your time — precision matters more than speed.";
  }

  const wordCount = text.split(/\s+/).length;

  const feedbacks = [
    `Good start. Your response covers the key point. For executive English, try adding a specific metric or outcome: instead of stating what you do, quantify it — e.g., "I lead a team of 12 across three markets." Now respond to this: **How would you handle a disagreement with a senior stakeholder in a board meeting?**`,
    `Clear and direct. ${wordCount < 10 ? "Aim for slightly more detail — executives are concise but not abrupt." : "Good length."} One refinement: open with a connector phrase like "Building on that..." or "My position is..." to sound more composed. Now try: **A client asks you to justify your pricing. Respond in 2–3 sentences.**`,
    `Solid professional tone. ${text.match(/\b(however|therefore|consequently|furthermore)\b/i) ? "Good use of a transition word — that signals structured thinking." : "Consider adding a transition word (however, therefore) to connect your ideas more authoritatively."} Final scenario: **Close a negotiation — summarise the agreement and confirm next steps.**`,
    `Strong finish. You've demonstrated structured, executive-level communication across this session. Key strengths: clarity, professional register, and purposeful language. Your practice score reflects consistent performance throughout.`,
  ];

  return feedbacks[Math.min(exchangeIndex, feedbacks.length - 1)];
}

function calculateScore(messages: ChatMessage[]): number {
  const userMessages = messages.filter((m) => m.role === "user");
  if (userMessages.length === 0) return 0;
  let total = 0;
  userMessages.forEach((m) => {
    const words = m.text.trim().split(/\s+/).length;
    const hasTransition = /\b(however|therefore|consequently|furthermore|building on|my position|in my view|to summarise)\b/i.test(m.text);
    const hasMetric = /\d/.test(m.text);
    let score = Math.min(words * 4, 60);
    if (hasTransition) score += 20;
    if (hasMetric) score += 10;
    if (words > 5) score += 10;
    total += Math.min(score, 100);
  });
  return Math.round(total / userMessages.length);
}

const SessionAIChat = ({ sessionTitle, scenario, onComplete }: SessionAIChatProps) => {
  const { currentUser } = useAuth();

  const userTone = (() => {
    try {
      const userId = currentUser?.id || "guest";
      const stored = localStorage.getItem(`voice3_onboarding_${userId}`);
      if (stored) return JSON.parse(stored).tone as string | undefined;
    } catch (_e) { /* ignore */ }
    return undefined;
  })();

  const welcomeMsg = userTone
    ? `Welcome to your practice session for **${sessionTitle}**.\n\n${scenario}\n\nBased on your Executive Profile, I'll be coaching you with a focus on your **${userTone}** communication style. Respond as you would in a real professional setting. I'll provide corrections and guidance after each exchange.`
    : `Welcome to your practice session for **${sessionTitle}**.\n\n${scenario}\n\nRespond as you would in a real professional setting. I'll provide corrections and guidance after each exchange.`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", text: welcomeMsg },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim() || isTyping || finished) return;
    const userMsg: ChatMessage = { role: "user", text: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    const nextExchange = exchangeCount + 1;

    setTimeout(() => {
      const feedback = generateFeedback(userMsg.text, exchangeCount);
      const aiMsg: ChatMessage = { role: "ai", text: feedback };
      const withAI = [...newMessages, aiMsg];
      setMessages(withAI);
      setIsTyping(false);
      setExchangeCount(nextExchange);

      if (nextExchange >= MAX_EXCHANGES) {
        setFinished(true);
      }
    }, 1200);
  };

  const handleComplete = () => {
    const score = calculateScore(messages);
    onComplete(score);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatText = (text: string) => {
    return text.split("**").map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="text-[#B89A5A] font-semibold">
          {part}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="flex flex-col h-full min-h-[420px]">
      {/* Tone indicator */}
      {userTone && (
        <div className="flex items-center gap-2 mb-3 px-1">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: TONE_COLORS[userTone] || "#B89A5A" }}
          />
          <span className="text-xs text-[#8E96A3]">
            Your tone: <span className="font-semibold" style={{ color: TONE_COLORS[userTone] || "#B89A5A" }}>{userTone}</span>
          </span>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#B89A5A]/10 border border-[#B89A5A]/30 flex items-center justify-center">
            <Bot className="h-4 w-4 text-[#B89A5A]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F4F2ED]">VOICE³ Performance Coach</p>
            <p className="text-xs text-[#8E96A3]">
              {finished ? "Session complete" : `Exchange ${exchangeCount + 1} of ${MAX_EXCHANGES}`}
            </p>
          </div>
        </div>
        <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#B89A5A] to-[#d4ba6a] rounded-full"
            animate={{ width: `${(exchangeCount / MAX_EXCHANGES) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                msg.role === "ai"
                  ? "bg-[#B89A5A]/10 border border-[#B89A5A]/30"
                  : "bg-[#243A5A] border border-[#243A5A]"
              }`}
            >
              {msg.role === "ai" ? (
                <Bot className="h-3.5 w-3.5 text-[#B89A5A]" />
              ) : (
                <User className="h-3.5 w-3.5 text-[#F4F2ED]" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "ai"
                  ? "bg-[#1C1F26] border border-[#B89A5A]/10 text-[#F4F2ED]/90 rounded-tl-sm"
                  : "bg-[#243A5A] text-[#F4F2ED] rounded-tr-sm"
              }`}
            >
              {formatText(msg.text)}
            </div>
          </motion.div>
        ))}

        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className="w-7 h-7 rounded-full bg-[#B89A5A]/10 border border-[#B89A5A]/30 flex items-center justify-center shrink-0">
                <Bot className="h-3.5 w-3.5 text-[#B89A5A]" />
              </div>
              <div className="bg-[#1C1F26] border border-[#B89A5A]/10 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#B89A5A]/50"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input / Complete */}
      {finished ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 pt-4 border-t border-[#B89A5A]/10"
        >
          <p className="text-sm text-[#8E96A3] text-center">
            Practice complete. Your responses have been evaluated.
          </p>
          <Button
            onClick={handleComplete}
            className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-lg px-8"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            View Score & Continue
          </Button>
        </motion.div>
      ) : (
        <div className="flex gap-2 border-t border-[#B89A5A]/10 pt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your response in English…"
            disabled={isTyping}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#1C1F26] border border-white/10 text-sm text-[#F4F2ED] placeholder:text-[#8E96A3]/60 outline-none focus:border-[#B89A5A]/40 transition-colors disabled:opacity-50"
          />
          <Button
            onClick={sendMessage}
            disabled={isTyping || !input.trim()}
            size="icon"
            className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] rounded-xl h-10 w-10 shrink-0 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SessionAIChat;
