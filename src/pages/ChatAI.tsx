import PlatformLayout from "@/components/PlatformLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatWidget from "@/components/ChatWidget";

const initialMessages = [
  { role: "bot", text: "Olá! 👋 Sou o assistente Voice3. Posso ajudar-te com dúvidas sobre o teu curso, sessões ou Inglês empresarial. Como posso ajudar?" },
];

const ChatAI = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }, { role: "bot", text: "Obrigado pela tua pergunta! Esta é uma demonstração do chat AI. Numa versão completa, receberias uma resposta personalizada sobre o teu curso." }]);
    setInput("");
  };

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-[calc(100vh-8rem)]">
        <h1 className="font-serif text-2xl font-bold mb-2">Chat AI</h1>
        <p className="text-muted-foreground mb-6">Pratica, tira dúvidas e melhora o teu Inglês.</p>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "bot" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div className={`max-w-md px-4 py-3 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-secondary rounded-bl-sm"
              }`}>
                {msg.text}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escreve a tua mensagem..."
            className="flex-1 px-5 py-3 rounded-xl bg-secondary text-sm outline-none placeholder:text-muted-foreground border border-border focus:border-primary transition-colors"
          />
          <Button onClick={handleSend} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 w-12">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </PlatformLayout>
  );
};

export default ChatAI;
