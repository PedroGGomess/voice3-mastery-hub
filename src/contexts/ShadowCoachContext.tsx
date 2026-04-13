import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface ChatMessage {
  id: string;
  role: "coach" | "user";
  content: string;
  timestamp: number;
}

interface ShadowCoachContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  hasUnreadSuggestion: boolean;
  setHasUnreadSuggestion: (has: boolean) => void;
}

const ShadowCoachContext = createContext<ShadowCoachContextType | undefined>(undefined);

export function ShadowCoachProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasUnreadSuggestion, setHasUnreadSuggestion] = useState(false);

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("shadowCoachMessages");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved messages", e);
      }
    }

    // Set up notification dot after 30 seconds
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasUnreadSuggestion(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  // Persist messages to localStorage
  useEffect(() => {
    localStorage.setItem("shadowCoachMessages", JSON.stringify(messages));
  }, [messages]);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
    setHasUnreadSuggestion(false);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ShadowCoachContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        addMessage,
        clearMessages,
        hasUnreadSuggestion,
        setHasUnreadSuggestion,
      }}
    >
      {children}
    </ShadowCoachContext.Provider>
  );
}

export function useShadowCoach() {
  const ctx = useContext(ShadowCoachContext);
  if (!ctx) {
    throw new Error("useShadowCoach must be used within ShadowCoachProvider");
  }
  return ctx;
}
