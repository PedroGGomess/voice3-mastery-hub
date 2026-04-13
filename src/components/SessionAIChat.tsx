import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, RefreshCw, Mic, MicOff, Volume2, VolumeX, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAICoach } from "@/hooks/useAICoach";
import { useElevenLabsTTS } from "@/hooks/useElevenLabsTTS";
import AIAvatar from "@/components/AIAvatar";

interface ChatMessage {
  role: "ai" | "user";
  text: string;
}

interface SessionAIChatProps {
  sessionTitle: string;
  scenario: string;
  onComplete: (score: number) => void;
}

const MAX_EXCHANGES = 6;

// Speech Recognition types
interface SpeechRecognitionResult {
  readonly [index: number]: { transcript: string; confidence: number };
  readonly isFinal: boolean;
  readonly length: number;
}
interface SpeechRecognitionResultList {
  readonly [index: number]: SpeechRecognitionResult;
  readonly length: number;
}
interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: Event) => void) | null;
}

const SessionAIChat = ({ sessionTitle, scenario, onComplete }: SessionAIChatProps) => {
  const { currentUser } = useAuth();
  const { sendMessage: sendAIMessage } = useAICoach();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [videoMode, setVideoMode] = useState(false);
  const [aiState, setAiState] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // ElevenLabs TTS hook — uses preferred voice from localStorage
  const { speak: elevenLabsSpeak, stop: elevenLabsStop, isSpeaking, isLoading: ttsLoading } = useElevenLabsTTS();

  const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const supportsSpeech = !!SpeechRecognitionConstructor;

  const welcomeMsg = `Welcome to your practice session: **${sessionTitle}**.\n\n${scenario}\n\nYou can type or use the microphone 🎙️ to speak. I'll coach you through ${MAX_EXCHANGES} exchanges. Let's begin!`;

  useEffect(() => {
    setMessages([{ role: "ai", text: welcomeMsg }]);
    if (ttsEnabled) {
      speakText(welcomeMsg);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const speakText = useCallback((text: string) => {
    if (!ttsEnabled) return;
    const cleanText = text.replace(/[#*_`]/g, "").replace(/\n+/g, " ");
    setAiState("speaking");
    elevenLabsSpeak(cleanText);
  }, [ttsEnabled, elevenLabsSpeak]);

  // Sync aiState with ElevenLabs speaking state
  useEffect(() => {
    if (!isSpeaking && aiState === "speaking") {
      setAiState("idle");
    }
  }, [isSpeaking, aiState]);

  const stopSpeaking = useCallback(() => {
    elevenLabsStop();
    setAiState("idle");
  }, [elevenLabsStop]);

  const toggleRecording = useCallback(() => {
    if (!supportsSpeech) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setAiState("idle");
      return;
    }

    stopSpeaking();
    const recognition: SpeechRecognitionInstance = new SpeechRecognitionConstructor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-GB";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onend = () => {
      setIsRecording(false);
      setAiState("idle");
    };
    recognition.onerror = () => {
      setIsRecording(false);
      setAiState("idle");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setAiState("listening");
  }, [isRecording, supportsSpeech, stopSpeaking]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping || finished) return;
    const userMsg: ChatMessage = { role: "user", text: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);
    setAiState("thinking");

    const nextExchange = exchangeCount + 1;

    try {
      const history = newMessages.map(m => ({
        role: (m.role === "ai" ? "assistant" : "user") as "user" | "assistant",
        content: m.text,
      }));

      const reply = await sendAIMessage(history, "simulation", {
        sessionTitle,
        scenario,
        exchangeNumber: nextExchange,
        maxExchanges: MAX_EXCHANGES,
      });

      const aiMsg: ChatMessage = { role: "ai", text: reply };
      const withAI = [...newMessages, aiMsg];
      setMessages(withAI);
      setExchangeCount(nextExchange);

      if (ttsEnabled) {
        speakText(reply);
      } else {
        setAiState("idle");
      }

      if (nextExchange >= MAX_EXCHANGES) {
        setFinished(true);
        // Generate report
        generateReport(withAI);
      }
    } catch (err) {
      console.error("AI error:", err);
      const aiMsg: ChatMessage = {
        role: "ai",
        text: "I'm having trouble connecting right now. Please try again in a moment.",
      };
      setMessages([...newMessages, aiMsg]);
      setAiState("idle");
    } finally {
      setIsTyping(false);
    }
  };

  const generateReport = async (allMessages: ChatMessage[]) => {
    try {
      const conversation = allMessages.map(m => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }));
      await sendAIMessage(
        [{ role: "user", content: "Generate the session evaluation report." }],
        "generate-report",
        { sessionTitle, conversation, sessionType: "ai_practice" }
      );
    } catch (err) {
      console.error("Failed to generate report:", err);
    }
  };

  const handleComplete = () => {
    const userMsgs = messages.filter(m => m.role === "user");
    let total = 0;
    userMsgs.forEach(m => {
      const words = m.text.trim().split(/\s+/).length;
      const hasTransition = /\b(however|therefore|consequently|furthermore|building on|my position|in my view|to summarise)\b/i.test(m.text);
      let score = Math.min(words * 4, 60);
      if (hasTransition) score += 20;
      if (words > 5) score += 10;
      if (/\d/.test(m.text)) score += 10;
      total += Math.min(score, 100);
    });
    onComplete(userMsgs.length > 0 ? Math.round(total / userMsgs.length) : 0);
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
        <strong key={i} className="text-[#B89A5A] font-semibold">{part}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="flex flex-col h-full min-h-[420px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#B89A5A]/10 border border-[#B89A5A]/30 flex items-center justify-center">
            <Bot className="h-4 w-4 text-[#B89A5A]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F4F2ED]">Shadow Coach</p>
            <p className="text-xs text-[#8E96A3]">
              {finished ? "Session complete" : `Exchange ${exchangeCount + 1} of ${MAX_EXCHANGES}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* TTS toggle */}
          <button
            onClick={() => { setTtsEnabled(!ttsEnabled); if (isSpeaking) stopSpeaking(); }}
            className={`p-1.5 rounded-lg transition-colors ${ttsEnabled ? "bg-[#B89A5A]/20 text-[#B89A5A]" : "bg-white/5 text-[#8E96A3]"}`}
            title={ttsEnabled ? "Mute AI voice" : "Enable AI voice"}
          >
            {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          {/* Video mode toggle */}
          <button
            onClick={() => setVideoMode(!videoMode)}
            className={`p-1.5 rounded-lg transition-colors ${videoMode ? "bg-[#B89A5A]/20 text-[#B89A5A]" : "bg-white/5 text-[#8E96A3]"}`}
            title={videoMode ? "Hide avatar" : "Show avatar"}
          >
            <Video className="h-4 w-4" />
          </button>
          {/* Progress bar */}
          <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#B89A5A] to-[#d4ba6a] rounded-full"
              animate={{ width: `${(exchangeCount / MAX_EXCHANGES) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Avatar */}
      <AnimatePresence>
        {videoMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 200, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4 overflow-hidden"
          >
            <AIAvatar state={aiState} isSpeaking={isSpeaking} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              msg.role === "ai" ? "bg-[#B89A5A]/10 border border-[#B89A5A]/30" : "bg-[#243A5A] border border-[#243A5A]"
            }`}>
              {msg.role === "ai" ? <Bot className="h-3.5 w-3.5 text-[#B89A5A]" /> : <User className="h-3.5 w-3.5 text-[#F4F2ED]" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "ai"
                ? "bg-[#1C1F26] border border-[#B89A5A]/10 text-[#F4F2ED]/90 rounded-tl-sm"
                : "bg-[#243A5A] text-[#F4F2ED] rounded-tr-sm"
            }`}>
              {formatText(msg.text)}
            </div>
          </motion.div>
        ))}

        <AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#B89A5A]/10 border border-[#B89A5A]/30 flex items-center justify-center shrink-0">
                <Bot className="h-3.5 w-3.5 text-[#B89A5A]" />
              </div>
              <div className="bg-[#1C1F26] border border-[#B89A5A]/10 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[#B89A5A]/50"
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

      {/* Input */}
      {finished ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 pt-4 border-t border-[#B89A5A]/10">
          <p className="text-sm text-[#8E96A3] text-center">
            Session complete. Your performance report has been generated and sent to your professor.
          </p>
          <Button onClick={handleComplete} className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-lg px-8">
            <RefreshCw className="mr-2 h-4 w-4" /> View Score & Continue
          </Button>
        </motion.div>
      ) : (
        <div className="flex gap-2 border-t border-[#B89A5A]/10 pt-4">
          {/* Mic button */}
          {supportsSpeech && (
            <Button
              onClick={toggleRecording}
              size="icon"
              className={`rounded-xl h-10 w-10 shrink-0 transition-all ${
                isRecording
                  ? "bg-red-500/80 text-white animate-pulse hover:bg-red-600"
                  : "bg-white/5 text-[#8E96A3] hover:text-[#B89A5A] hover:bg-[#B89A5A]/10"
              }`}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "Listening..." : "Type or speak your response…"}
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
